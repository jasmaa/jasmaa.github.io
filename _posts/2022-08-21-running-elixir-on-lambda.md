---
layout: post
title:  "Running Elixir on Lambda"
subtitle: ""
date: "2022-08-21"
categories: Programming
tags: aws elixir lambda
---

A while back, I discovered that Johns Hopkins publishes [daily COVID case and
death counts for all 50 US states](https://coronavirus.jhu.edu/region). The
graphs reminded me a lot of metric graphs for monitoring services, and I began
to imagine a system of mirroring the data into CloudWatch and paging myself
whenever they breached a certain threshold.

![Johns Hopkins COVID case and death count time series graph for
Maryland](/images/running-elixir-on-lambda/jhu-covid.png)

This idea ended up evolving into
[CovidPager](https://github.com/jasmaa/covid-pager), and while I never did get
as far as paging myself (PagerDuty kinda expects me to be a company), I do want
to talk about the most interesting part of the project: the fact that it ended
up as an Elixir application running on Lambda!


## Run Whatever You Want

The beginning of this journey starts with Lambda and its custom runtime.
Although your typical Lambda function would use an officially supported runtime,
ever since 2018, Lambda has also begun providing custom runtimes. This is our
ticket into running an Elixir Lambda handler.

A handler running in a custom runtime interfaces with Lambda by interacting with
the [Lambda Runtime
API](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-api.html). The
runtime API is available as an HTTP service and is quite simple. It's made up of
four operations: get the next invocation, respond to an invocation, report a
service initialization error, and report an invocation error.

![Lambda runtime API
architecture](/images/running-elixir-on-lambda/logs-api-concept-diagram.png)

In order for Elixir to run on Lambda, at minimum, we would need to write an
Elixir application with an HTTP client that is able to poll requests from the
next invocation endpoint, process the requests, and send responses to the
response endpoint. This is a lot of boilerplate work. Thankfully, someone else
has done it for us already in the form of the [AWS Lambda Elixir
Runtime](https://github.com/aws-samples/aws-lambda-elixir-runtime/tree/master/elixir_runtime)!
Building on top of the runtime implementation is as simple as adding
`:aws_lambda_elixir_runtime` as a dependency in our Mix project, writing the
Lambda handler, and deploying a custom runtime Lambda function that targets the
handler using its identifier.


## Run In Wherever You Like

If you are like me and followed the AWS Lambda Elixir Runtime guide by deploying
the release artifacts directly to Lambda, there is a high chance you ran into an
error related to a dependency for `beam.smp`. The reason behind this is that
Elixir itself depends on the BEAM virtual machine which was compiled for your
machine’s environment as part of the prerequisite Erlang installation for
Elixir. Your machine is most likely not configured exactly the same as Amazon
Linux 2 (AL2), the environment that the custom runtime Lambda function runs in,
which will result in incompatibilities. In my case, BEAM needed glibc version
2.29 while [Amazon Linux 2 has version
2.26](https://docs.aws.amazon.com/AL2/latest/relnotes/relnotes-20220802.html) at
the time of writing. The only real solution for this would be to spin up an EC2
instance running AL2, re-download and re-compile Erlang and Elixir on it, and
then rebuild my application. I took one look at my wallet, one look at the time,
and decided nah.

Normally, this would be where the experiment ends, but back in 2020, Lambda
released support for container images. What this means is that our function’s
environment does not have to be tied to Amazon Linux anymore. We can just
~~steal~~ acquire a pre-existing Docker image for Elixir and build our
application on top of that! Lambda will run our container and any dependency
issues between our machine and Amazon Linux disappears since we can just model
our environment via Docker instead! For CovidPager, I ended up using an Elixir
Alpine image and set up Docker to build and run the application binary.

```dockerfile
# Dockerfile

FROM elixir:1.13-alpine

WORKDIR /app

RUN mix do local.hex --force, local.rebar --force

ENV MIX_ENV=prod

COPY mix.exs mix.lock ./
COPY config config
RUN mix deps.get

COPY lib lib
RUN mix release

ADD aws-lambda-rie-x86_64 /usr/local/bin/aws-lambda-rie
COPY ./entry_script.sh /entry_script.sh

ENTRYPOINT [ "/entry_script.sh" ]
CMD [ "Elixir.CovidPager:handler" ]
```

You may have noticed that the `Dockerfile` also contains an `ENTRYPOINT` that
points to a shell file called `entry_script.sh`. This is to support [locally
testing the container image
function](https://docs.aws.amazon.com/lambda/latest/dg/images-test.html). To do
this, AWS provides a Runtime Interface Emulate (RIE) which is a stand-in for the
real Lambda Runtime Interface web server. We can include the RIE binary in our
image and then configure the entrypoint of the image to a program (in this case,
`entry_script.sh`) which will conditionally run the service using RIE or the
actual binary depending on whether the Lambda runtime is present. If deployed
locally, RIE allows the Lambda function to be triggerable via HTTP POST to the
local Docker endpoint.

```bash
# entry_script.sh

#!/bin/sh
if [ -z "${AWS_LAMBDA_RUNTIME_API}" ]; then
  exec /usr/local/bin/aws-lambda-rie _build/prod/rel/covid_pager/bin/covid_pager start $@
else
  exec _build/prod/rel/covid_pager/bin/covid_pager start $@
fi
```

Having the ability to do this kind of local testing is powerful since it means
that we can test our service as if it were truly deployed instead of only being
able to test through unit tests. Unit tests can’t test entire integrations since
they usually mock out key dependencies, such as external services, so being able
to see a service’s real behavior during local development helps to uncover any
sort of integration failure cases as early as possible.

Once I was able to test locally, it was time to deploy for real. I uploaded the
image to ECR and spun up a Lambda container image function that would consume
the uploaded image. The infrastructure specification ended up being just a
single function in CDK.

```js
// deployment-stack.ts

const fn = new lambda.DockerImageFunction(this, 'ECRFunction', {
  functionName: 'CovidPager',
  code: lambda.DockerImageCode.fromImageAsset('/PATH/TO/PROJECT/ROOT'),
  timeout: cdk.Duration.seconds(30),
});
```

## But...Why Run Like This At All?

Question time. Yes, you in the back.

...

Ok um, so the question was: why in the world would anyone want to do this?
That’s a great question. I’m not really sure.

One of Elixir’s major selling points is its ability to deal with faults. An
Elixir application does this with
[supervisors](https://hexdocs.pm/elixir/1.12/Supervisor.html) that watch child
processes. If a child fails, supervisors can take further action based on a
supervisor’s strategy. For example, a one-for-one strategy will restart just the
failing child if a child fails while a one-for-all strategy will restart all
children under the supervisor if a child fails. A more complex application may
have a supervisor tree with higher-level supervisors that watch lower-level
supervisors that themselves watch the actual worker processes.

![Example supervision
tree](/images/running-elixir-on-lambda/supervision-tree-example.png)

The supervisor design works best for long-running applications since it allows
for a service to recover from faults by only restarting parts of the application
as opposed to the whole in order to keep the overall service up and running.
However, this isn’t really a great fit for Lambda which is meant for only
short-lived tasks (currently, [a Lambda function’s max execution time is 15
minutes](https://aws.amazon.com/about-aws/whats-new/2018/10/aws-lambda-supports-functions-that-can-run-up-to-15-minutes/)).

Moreover, with serverless design, it feels that fault tolerance is intended to
be taken care of by the infrastructure rather than by the actual service.
Because of this, AWS services end up doing most of the heavy lifting to recover
from or avoid faults (ex. ensuring a service is healthy in ECS by automatically
restarting unhealthy containers or ensuring requests are processed by a service
by fronting them with an SQS queue). All in all, this seems to make Elixir’s
fault-tolerant design feel redundant when paired with Lambda.

In my opinion, the greatest benefit of running Elixir on Lambda may simply be
access to the Elixir language itself. Choosing Lambda for infrastructure does
not mean that Elixir is off the table as a choice for language and vice versa.
Moreover, as a functional language, Elixir generally feels like a good fit for
writing Lambda functions since both are designed for stateless execution.


## Closing Thoughts

The upshot is that running Elixir in Lambda is not only theoretically possible,
but actually quite accessible through the AWS Lambda Elixir Runtime and Lambda’s
support for containers. While Elixir’s fault-tolerance benefits are lost within
a Lambda function, it’s still neat that Lambda can run Elixir, and it opens up
the door for Elixir development on Lambda from anyone who wants to try.

That being said, running Elixir in Lambda still poses a risk since it is not
officially supported by Lambda. Even though some well-known companies are
already using Elixir (Heroku and Discord to name names), the language itself is
not mainstream like Python or Java. If Elixir and functional programming as a
whole really do reach widespread popularity in the coming years, it would be
interesting to see its effect on how developers design services in the future as
well as how cloud providers will react to those shifting design paradigms.
