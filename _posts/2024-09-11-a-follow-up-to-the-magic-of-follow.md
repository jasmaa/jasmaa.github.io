---
layout: post
title: "A Follow-Up to the Magic of --follow"
subtitle: "What’s new? Spill the tee!"
date: "2024-09-11"
categories: Programming
tags: shell
---

Nearly half a year ago, I wrote a [mini blog
post](/blog/2024-03-13-the-magic-of-follow) detailing my exploits working with
large outputs. I was trying to find a way to see both the output logs of a test
and to get a copy of the outputs in a file to share around which eventually led
me to a solution using `tail -f`. Then a few weeks ago, while my friends and I
were searching each other up on the Internet, that very blog post was dug up
again. This in turn spawned a conversation that went something like this:

“Jason, have you ever heard of tee?”

“You mean for
[assembly](https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/Variables/Local_tee),
yeah?”

“No for shell.”

“Oh. Um. No.”

“What does it do in assembly?”

“It stores a value and loads it at the same time…I think.”

“Imagine that for files.”

Apparently I had been doing things the hard way. Linux comes with a command
called [`tee`](https://man7.org/linux/man-pages/man1/tee.1.html) that does
exactly what I was trying to do with `tail -f`: it displays to stdout while also
writing to a file at the same time.

Funny enough, it was at this time that I found myself also having to go back and
work with some tests again. I tried out my newfound knowledge this time:

```
./run-tests.sh | tee ~/test-results.txt
```

…And to no one’s surprise it worked like a charm! Now I could see both the
output and save a copy of it to a file with only one command!

Perhaps, `tail -f` was a bad solution and the blog post from before is just junk
now. However, an optimist would probably say that this in fact shows growth and
that there are many approaches to solving a problem while a pragmatist would
probably wonder why I spent so many words explaining what could have simply been
an amendment to the original blog post. Then the super duper shell guru would
show up and tell us all that there’s an even better way to do this.

Anyways, until next time!
