---
layout: post
title:  "Misaka Net"
subtitle: "...said Misaka with a posed look."
date: "2020-11-16"
categories: Programming
tags: go grpc assembly
---

Since my personal site went through a recent re-haul (I can't believe we're on v4 now...), I figured
now would be a good a time as any to, hopefully, start up writing this blog again.

As you can all tell from the title, today's topic will be: the Misaka Network!
Or rather, the strange and haphazard distributed computing project I made named after it.

## Background

#### Side A: The Misaka Network

When the COVID-19 pandemic hit, I suddenly found myself with a lot more extra time which I wisely
invested, as any young adult would, into games and video entertainment. Specifically, I recently
dived into the fantasy sci-fi world of *A Certain Magical Index* (broadly known as the Toaru franchise) and
have now unfortunately found myself neck-deep in the fandom.

Of the more interesting characters in the series are the Sisters, a group of 10,000 some genetic clones copied from a certain high-level
electromaster, Misaka Mikoto. The Sisters' main power is that, being electric-based espers, they are capable of linking their brainwaves
through EM waves, allowing them to form a massive distributed computational network known as the Misaka Network.

When I first heard about this concept, it intrigued me. I was only tangentially familiar with the concept of distributed
systems, so as the series continued to develop on the idea of the Misaka Network further, introducing details such as
a central controller for the entire network and having plot points centered around the network being compromised, it
got me into thinking about how the Misaka Network would work in real life.

![Sisters](/images/misaka_net/sisters.jpeg)

#### Side B: TIS-100

Now, let's jump a bit back in time:

I had gotten my first taste of assembly when I started writing 6502 for small NES homebrew projects
around 2018. During that time, I was also recommended the game, TIS-100, an assembly puzzle game created by Zachtronics. The
game is based around a fictional distributed assembly architecture made up of several low-memory nodes. While one can only
write very small assembly programs on each node, the main gimmick is that the nodes can communicate with each other, forcing
the player to have to split the logic of their programs into a network of code snippets. As you play further into the game, juggling
nodes and their limited program memory becomes more challenging, especially as the problems get more difficult and 
stack nodes get introduced.

While I have yet to finish TIS-100 since it feels *just* a little bit too much like school work, the idea of a distributed
assembly system piqued my interest back then.

![Tis-100 gameplay](/images/misaka_net/tis100.png)

#### sideA.join(); sideB.join();

So exactly where do these two unrelated areas lead to? Well, I suppose I was feeling a little more excitable this year because
I woke up one morning thinking to myself:

***What if we could use the concepts behind the Misaka Network to build a TIS-100 distributed system in real life
...and then deploy it all with Docker! ahahaha-!***

Now a few months later, I live to tell the tale of what happened next.

## Laying Plans: Can It Actually Be Done?

The first thing I needed to do was figure out whether this was even possible or not which naturally involved learning
a little about distributed systems and how they work. Cursory research brought me to this
[blog post](https://medium.com/digitalwing/development-of-a-distributed-computing-system-based-on-mapreduce-and-kubernetes-837fc7f112f9)
from Digital Wing describing how to build a distributed MapReduce. Scanning through, it was evident that the system would be made up of different
types of nodes, mostly worker nodes that respond to a central master node. The example was also both written in Go and used HTTP for
communication between nodes, and as I wanted more experience with Go and was relatively comfortable debugging HTTP requests,
both seemed like good choices to start out with in my own project. While the DigitalWing example was deployed on Kubernetes
which I really wanted to try, I figured that I may have had too much on my plate already and opted to see if I could use
something simple like Docker Compose instead. After all, the distributed system was only going to be half the project.
I would need to figure out how to handle TIS-100 assembly as well.

## Adventures in Parsing ASM

The second thing I needed to do was figure out how to interpret TIS-100 assembly. Thankfully, yours truly happened to take
*Introduction to Compilers* instead of *Operating Systems* this semester, so he has some idea of how to lex and parse code.
Since TIS-100 is assembly to begin with anyways, there was actually not much work to be done to parse it.
The two biggest challenges I faced with processing the assembly ended up being figuring out how to deal with jumps
and how to store each instruction.

The former was not too hard but certainly different from what I was used to. With
languages where whitespace doesn't matter, such as C or Java, code being on a certain line
doesn't really play a role in code execution, but with assembly, I
needed to keep track of the line an instruction was on in order to implement jumping.
This meant that while usually a program written in a higher-level language gets parsed
into an abstract syntax tree, my assembly instructions ended up just being stored in an array
where each instruction's line number was tied to its position in the array.
Moreover, in TIS-100, one can also specify labels to tag a line to jump to, so
when I parsed the assembly, I also needed to create a lookup table, mapping
labels to indices in the instruction array which could be used during interpretation to figure out
where to jump to for a specific label.

The latter challenge was a bit confusing at first. Of the two languages I
had used to write parsers in before for school, OCaml had algebraic data types (ADTs) which offered
wide flexibility with nesting and Racket was
dynamically typed so I wasn't constrained with the type of structure I could store in other structures.
With Go, however, I was stuck in a statically typed world without inheritance to even try to cheese ADTs!
In the beginning, I thought maybe I could represent each instruction type as a different structure
and parse them into an array of `interface{}`, but I quickly realized that would end up as a giant casting mess. After sitting
dumbfounded for a while, it dawned on me that I had overcomplicated the situation. Each assembly instruction is quite simple: it
has an instruction type followed by a fixed number of arguments based on the instruction type. If that was the case, why not just store
everything as an array of `string` where the 1st element was the instruction type and the rest were the instruction's
arguments, each in string form. So TIS-100 assembly that was originally:

```
ADD ACC
JMP START
```

...would end up looking like:

```go
[
  ["ADD", "ACC"],
  ["JMP", "START"],
]
```

When interpreting, it was simply a matter of switching on the instruction type which was guaranteed to always exist,
and when the right instruction was found, process the following arguments. In a sense, I was actually just lexing the assembly
into lines of tokens, so perhaps to say I was parsing anything at the end of the day is just slightly overselling the work I did.

## Building the Network

Once I was able to deal with TIS-100 assembly, I could move on to taking down the Goliath of this project: creating the actual
network. The basis of Misaka Net is a collection of independently functioning nodes, each presumably with its own IP and hostname,
where each node can talk to any other node on the network. A node can be one of three different types: program, stack, or master.
The master node controls all the nodes on the network, broadcasting commands, loading programs onto nodes, and acting as the center
for the network's input/output. Meanwhile,
the stack and program nodes act as workers, with the program nodes executing assembly instructions and the stack nodes
acting as stack storage.

![Network diagram](/images/misaka_net/diagram.png)

While implementing the nodes boiled down to copying the functionality of TIS-100, I still needed
to make some modifications in design to get my network working.

#### Architecture Changes

One difference in architecture between my design and the original TIS-100 deals with how nodes are connected together. A TIS-100 program node
has registers in up to four directions that connect it to other nodes. Misaka Net, on the other hand, doesn't have any concept
of this restraint since as long as a node has another node's hostname, it can communicate with it. This meant that
the `MOV` instruction for node-to-node communication needed to be adjusted.
I opted to keep the idea of having four registers, but now these registers
were more like one-way mailboxes rather than shared memory. When a node wanted to send a value to another one, it
would do so now with a `MOV`, specifying a value to move and the target location and register to send it to. On the
other side, the target node would also use `MOV` to retrieve the value, specifying the
targetted register as the input source.

For example, something in TIS-100 like:

```
+--------------+     +---------------+
| MOV 3, RIGHT | ==> | MOV LEFT, ACC |
|              | <== |               |
+--------------+     +---------------+
```

...would now look like this in Misaka Net:

```
+-misaka1-----------+     +-misaka2-----+
| MOV 3, misaka2:R1 | ==> | MOV R1, ACC |
|                   | <== |             |
+-------------------+     +-------------+
```

New instructions were also added throughout the process to reconcile design choices made in Misaka Net
with the TIS-100 architecture. Notably, `PUSH` and `POP` as well as `IN` and `OUT` needed to be added
to deal with communicating with stack and master nodes respectively since program nodes
did not have information about the other nodes on the network.

Architecture changes were not the only challenges. Program nodes also had to
deal with interpreting assembly while simultaneously running an HTTP server to respond to requests. This meant that
designing the network was beginning to head into an uncharted territory for myself: concurrency.

#### Juggling Concurrency and Getting Blocked

While I didn't expect this project to have been my first practical project writing concurrent code, I ended up
having to learn a lot about it. Thankfully, Go having concurrency as a first-class citizen of the language made it
much easier to reason about many of these concurrent processes throughout the course of the project. That being said,
I still ran into a lot of issues involving concurrency and blocking, from needing a thread-safe stack data structure
to finding strategic ways to get Goroutines to sleep and avoid eating up CPU usage.

One of the major areas where concurrency came into play was running a program node's interpreter alongside
an HTTP server. Designing this essentially boiled down to sticking an infinite loop inside a Goroutine that would get called
before starting the server. The loop emulated the node's CPU clock, which would interpret TIS-100 instructions line-by-line and update the
program counter as long as the program node was in a running state.
While this worked fine for the most part, it broke when the node was commanded to reset its assembly execution.
I had made the program nodes block execution when sending values to other nodes. However, this meant that they
could also never be interrupted while in the middle of trying to send
a value, leaving them stuck in limbo, even when commanded to stop execution.

I was in dire need of something that could somehow cancel
the HTTP send requests when the program node received certain commands. While I had initially tried setting up
more Goroutines to handle cancellations inside my program loop, it was starting to get very messy and cumbersome. I probably
should have sat down and considered the name of what I was trying to do since that happened to lead to the exact thing that
I was looking for: context cancellation. I ended up learning about contexts and the fact that I could generate a context and cancel
function pair, `ctx, cancel`, which I could carry into the program node struct.
Anytime I did a blocking operation, I would pass in `ctx` into the operation, and then whenever I
received a command to stop program node execution,
all I needed to do was call `cancel` which would cause any operation using `ctx` get cancelled, freeing up the program node!
While this meant that the blocking functions I wrote would need some adjustment in the form of a `select` statement to jump
out on cancellation, this was 100 times easier and cleaner than having to juggle more Goroutines.

With the the program node's biggest problem out of the way, I was moving ever closer to the
final goal of Misaka Net: linking multiple nodes together into a network.

## Deploying the Network

At this point, I had mostly been testing nodes as single machines and querying them manually through Postman,
but the big question now was whether or not they would work together.
I imagine in "ye olden days" this would be where the project would have ended, and I would just have had to hope that
my code worked or somehow bought and hooked up a bunch of servers to test on bare metal.
However, today we have container virtualization and container orchestration tools all within the
grasp of the average layperson, and so the show went on.

Docker Compose was chosen for orchestration as it would be the fastest way to setup everything and see it in action.
One of the nice things Compose does is set up hostnames for the services defined which meant that referring to any
node was as simple as calling to it using the name of the service. Once I had specified all the nodes in my network
as services with a few minor hiccups, I started up all the containers. No errors, that was a surprise. I sent a run command
to the master node...and surprise number 2, it actually worked! The network I set up was just something simple to ping-pong
values back and forth and it had somehow worked without any problems.

At the time of the first test, all I had implemented were the program nodes and parts of the master node, so there was
still a lot more work that had to be done. From there, I ended up finishing implementation for all the
node types and added a way to interface with the client to do input/output as well. Running the finished network and seeing it actually
compute something made me overjoyed. Somehow, my originally half-baked idea was now running for real.

## Bonus Rounds

Once I had finished implementing the rest of the network and could actually compute values with it, it was
time to add some extra features.

#### Switch! It's gRPC time!

The first order of business was converting all intranet communication from HTTP to gRPC. While HTTP allowed
for easy debugging early on, gRPC uses protocol buffers which would allow for smaller message payloads and faster
communication, both huge benefits for Misaka Net which relies on constant communication between nodes.
Also I simply wanted to get some more experience making gRPC applications.

Integrating gRPC into Go was as simple as following the [quickstart guide](https://grpc.io/docs/languages/go/quickstart/).
From there, I needed to create a `proto` with all my service definitions. I had haphazardly prototyped the routes for
when writing the HTTP server, so explicitly laying out the services actually gave me the chance to re-organize
the code for my endpoints and figure out exactly what endpoints every node offered along with the data going in and out.
This ended up working out very cleanly since each node type just ended up with its own RPC service.

Once I had my `proto` definitions, I needed to auto-generate the Go code to interface with gRPC and replace
each node's HTTP server with its correspoding gRPC service server. This is where I ended up running into a minor issue
with the master node. Since HTTP only cares about the names of endpoints, I didn't have to worry about the type of worker node
the master node was broadcasting to originally. This was not the case with gRPC. I needed a different client to communicate with
a program node versus a stack node which meant that the master node ended up needing to know not just the names of all the nodes
on the network but their node types as well. From there, it was a small tweak to the broadcast function, allowing for the correct client
to be used when sending a command to a node.

#### Locking Down on Security

While Misaka Net would probably be on a walled-off internal network if was hypothetically used in production, God forbid,
I still wanted to add some form of security to it. Following the gRPC [authentication guide](https://grpc.io/docs/guides/auth/),
I settled on securing connections using SSL. With the help of
Nicolas Leiva's [guide](https://itnext.io/practical-guide-to-securing-grpc-connections-with-go-and-tls-part-1-f63058e9d6d1)
on generating certificates and server keys for gRPC, I managed to get myself shiny, new, very untrustworthy,
self-signed certificate, with some extra fun in added of course.

![SSL Certificate](/images/misaka_net/cert.png)

However, after setting up gRPC to use SSL and plugging in the certificate and private key, the net was now
stalling when I tried to run it. Strange. Fiddling around, I found out that I had attached `grpc.WithBlock()` as a
dial option which was the culprit of the stalling. Removing it led me to the real problem: the client connections
were getting refused because my certificate was not valid for any names. Turns out I had not added all the hostnames
in Compose to the certificate's `alt_names` (whoops). Giving it a second whirl, the net was up and running again as before
but now with encryption.

While this ended up working, it felt a little wrong to have a single certificate being used for multiple services.
Perhaps it may have been better to generate an SSL certificate for each node registered on the network, and choose
the right certificate to attach when communicating with a certain node, but I was ready to put the project down
at this point.

## Thoughts and Conclusion

At the end of the day, Misaka Net was another weird project and learning experience rolled into one.
The design of the network is unfortunately stuck with a few issues, from potential data races with multiple pop
requests on a stack node to a low tolerance for node failure to difficulties with scaling when adding new nodes.
For some of these problems, simple solutions may be engineerable but others, such as properly dealing with node failure,
are not something that I want to tackle anytime soon.

In a sense, Misaka Net ended up being similar to its namesake: both were, at their core, experiments. Although
my network wasn't anything close to a work of mad science, it did teach me a lot about working with concurrency
in Go and was my first taste of what a distributed system (albeit a very naive one) may look like.

***

## Appendix A: Fun with Spriting

I happened upon a T-shirt design of some pixel art of the Sisters and Last Order while working on
Misaka Net. The sprites were simple enough to re-create, and I thought it would be neat to work
them into the repo README in a similar fashion to how a lot of popular projects make liberal use of emojis
in their headings.

![Sisters and Last Order original size sprites](/images/misaka_net/sprites.png)

![Sisters and Last Order medium size sprites](/images/misaka_net/sprites_med.png)

## Appendix B: Thoughts on Toaru and Sci-Fi

One of the things I think a lot of fans find compelling about the Toaru series is its dedication
towards trying to back fictional phenomenon with real-world principles. The series actually gets
viewers asking, "How would this thing work in real life?"
or, "What are the supporting principles behind this ability?" instead of just letting us shrug it off as a
fantastical construct.

For example, in the light novel, the esper ability, teleportation, is mentioned to involve 11D calculations
because it's based off of [11D spacetime](https://en.wikipedia.org/wiki/11th_dimension) and creates an ability where,
presumably, teleporters are able to move objects through 11D spacetime.
Later on, we are later introduced to the most powerful esper in Academy City, Accelerator, who can control vectors
which allows him to reflect any attack. But what about teleportation-based attacks? The light novel explains that, well,
since teleportation involves an 11D vector, Accelerator still has control over that.

While this kind of world-building is very fun and thought-provoking, it's not perfect and
does lead to a lot head-scratching when holes appear and is, of course, harder to keep coherent
because of the extra work needed to find a believable basis for your fiction. That being said, I like fiction like this that
tries to explain itself since it goes a long way to preserve one's suspension of disbelief. Perhaps this
is also why something like Jules Verne's science-backed sci-fi caught on and is so fun to read because the fictional world you peer
into feels like it could really exist.