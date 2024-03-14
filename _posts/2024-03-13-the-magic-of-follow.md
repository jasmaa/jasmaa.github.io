---
layout: post
title: "The Magic of --follow"
subtitle: "Follow? Follow!"
date: "2024-03-13"
categories: Programming
tags: shell
---
I recently discovered the joy of using the `--follow` flag. Let me tell you a
little bit more about what I mean.

One of the tools at my work involves running a test script that both (1) takes a
long time to run and (2) generates a *lot* of output.

When I first started working with it, I naively ran the script as-is:

```
./run-tests.sh
```

I came back 1 hour later to find that it had printed a huge mess of a test
report to stdout. The report had so many lines to the point that the oldest ones
had already been truncated by my terminal. This was not very useful to me nor my
senior who was asking me where the hell the test results were.

On my second try, I tried a slightly smarter approach. I redirected the script’s
output to a file instead of stdout this time:

```
./run-tests.sh > ~/test-results.txt
```

Now the script would write the test results to a file for safe-keeping. I re-ran
it and left for another hour. When I came back, it was a simple matter of
grepping the TXT file for any failed test cases and transferring the file off of
my remote desktop to send to my team:

```
grep -i fail ~/test-results.txt
```

```
scp me@host.example.com:/path/to/test-results.txt ~/test-results.txt
```

This worked out, but now I had a new problem: Unlike in the naive approach, I
couldn’t see the script output in real-time anymore. This made it difficult to
figure out what was actually happening over the course of that 1 hour. To get
the output, I could repeatedly `tail` the results file but that gets kind of
annoying after a while. That’s when I discovered the magic of `--follow`. Here’s
what I did:

I re-ran the original command in my terminal:

```
./run-tests.sh > ~/test-results.txt
```

And in another terminal, I ran:

```
tail -f ~/test-results.txt
```

The `-f` flag is short-hand for `--follow` which continuously updates the output
with the latest lines at the end of a file. Now I had the best of both worlds: I
could monitor the progress of the test script in real-time and have those
results saved to a file that I could analyze in post.

Perhaps something this simple doesn’t merit a full-blown blog post, but I still
feel proud of my little discovery, no matter how much it pales in comparison to
the arcane commands of the shell gurus. Also, I haven’t written a post in over
half a year, so now is as good a time as any to start again. Until next time!
