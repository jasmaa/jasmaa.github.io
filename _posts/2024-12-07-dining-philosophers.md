---
layout: post
title: "Dining Philosophers"
subtitle: "YUM!"
date: "2024-12-07"
categories: Programming
tags: concurrency
---

I started watching *Pantheon* a few days ago. In the show, near the end of the first episode, we see a scene with one of the characters, a teenage loner named Caspian, at the dinner table with his parents. Caspian’s father begins to chide his son for learning differential calculus, an impractical subject he claims. He then poses the following problem to Caspian:

Suppose n geniuses are sitting at a table with n plates and n chopsticks. Each genius has a plate in front of them and a chopstick to their left and right. There is an infinite supply of stir-fry that is constantly being shoveled onto everyone’s plates.

![6 plates in a circle labeled A to F clockwise with a chopstick in between each one](/images/dining-philosophers/dining_philosophers_00.png)

To eat the stir-fry, a genius needs to be able to pick up the two chopsticks to their left and right. However, because there are not enough chopsticks, not every genius can eat at the same time. In the worst case scenario, you end up with deadlock where every genius attempts to pick up the chopstick to their left first and waits forever for the genius on their right to put down their chopstick.

![6 plates in a circle labeled A to F clockwise with a chopstick in between each one. There is a red line from each plate to the chopstick on its left. Plate C has a blue arrow pointing to the chopstick on its right with the text "WAITING..."](/images/dining-philosophers/dining_philosophers_01_0.png)

Find a way for these geniuses to eat their stir-fry while avoiding deadlock.

This problem is a spin of a popular problem in concurrent programming known as the Dining Philosophers problem. Like any good problem, it has multiple solutions.

Caspian’s father proposes the following one.

## Solution 1: Resource hierarchy

Get the geniuses to agree on some ground rules:
  1. All chopsticks will be ordered and given a number.
  1. When picking up a chopstick, a genius must always pick up the lower numbered chopstick first, then the higher ordered one.

![6 plates in a circle labeled A to F clockwise with a chopstick in between each one. The chopsticks are labelled 1 to 6 clockwise with chopstick 1 to the left of plate A.](/images/dining-philosophers/dining_philosophers_02_0.png)

Assuming the geniuses follow these rules, in the worst case scenario, all geniuses first pick up their lowest number chopstick at the same time.

![6 plates in a circle labeled A to F clockwise with a chopstick in between each one. The chopsticks are labelled 1 to 6 clockwise with chopstick 1 to the left of plate A. Every plate has a red line to the chopstick on its right except for plates A and B. A has a red line to chopstick 1 on its left. B has a blue line to chopstick 1 on its right with the text "WAITING..."](/images/dining-philosophers/dining_philosophers_02_1.png)

This leaves only the highest-numbered chopstick left on the table. One of the geniuses adjacent to that chopstick will then pick it up, eat, and put down both of their chopsticks.

![6 plates in a circle labeled A to F clockwise with a chopstick in between each one. The chopsticks are labelled 1 to 6 clockwise with chopstick 1 to the left of plate A. A has green lines to chopsticks 1 and 6 with the text "YUM!". B has a blue line to chopstick 1 with the text "WAITING...". All other plates have a red line to the chopstick on their right and a blue line to the chopstick on their left with the text "...".](/images/dining-philosophers/dining_philosophers_02_2.png)

After this, the other geniuses who are waiting on the first genius’s chopsticks can pick them up and eat their stir-fry. Deadlock won’t happen because if the worst-case scenario ever comes up, there will always be a way to break out of it thanks to the ground rules.

![6 plates in a circle labeled A to F clockwise with a chopstick in between each one. The chopsticks are labelled 1 to 6 clockwise with chopstick 1 to the left of plate A. A has a blue line to chopstick 1 on its left with the text "...". F has green lines to chopsticks 6 and 5 on its left and right with the text "YUM!". All other plates have a red line to the chopstick on their right and a blue line to the chopstick on their left with the text "...".](/images/dining-philosophers/dining_philosophers_02_3.png)

As Caspian’s father explains this, Caspian suddenly cuts him off, saying that the resource hierarchy solution is impractical (a retort echoing to the way their conversation first started).

In particular, it doesn’t scale well as more resources (i.e. chopsticks) get added. Suppose instead of 2 chopsticks, a genius needs to pick up m chopsticks in order to eat, and instead of only sharing one chopstick on either side, the geniuses share a pool of chopsticks. A given genius would spend a small eternity slowly picking up chopsticks until they get the m they need.

Caspian then proposes a second, more “practical” solution.

## Solution 2: Third-party arbitrator

Introduce a third party, like a waiter, who controls the geniuses.

![6 plates in a circle labeled A to F clockwise with a chopstick in between each one. There is a waiter in the middle.](/images/dining-philosophers/dining_philosophers_03_0.png)

Any given genius must have the waiter’s permission to pick up their chopsticks. When a genius wants to eat, they signal to the waiter. If no one is currently eating, the waiter gives the genius permission to pick up their chopsticks and becomes closed to any new requests from other geniuses to eat.

![6 plates in a circle labeled A to F clockwise with a chopstick in between each one. There is a waiter in the middle. There is a blue line from A to the waiter with the text "PLS?" and a green line from the waiter to A with the text "OK".](/images/dining-philosophers/dining_philosophers_03_1.png)

![6 plates in a circle labeled A to F clockwise with a chopstick in between each one. There is a waiter in the middle. A has green lines to the chopsticks on its left and right with the text "YUM". There is a blue line from C to the waiter with the text "PLS?" and a blue line from the waiter to C with the text "...".](/images/dining-philosophers/dining_philosophers_03_2.png)

Once the genius is done eating and puts down their chopsticks, they tell the waiter they are done, and the waiter becomes open to granting permission for new requests from any genius again.

![6 plates in a circle labeled A to F clockwise with a chopstick in between each one. There is a waiter in the middle. There is a blue line from A to the waiter with the text "DONE". There is a blue line from C to the waiter with the text "PLS?" and a green line from the waiter to C with the text "OK".](/images/dining-philosophers/dining_philosophers_03_3.png)

![6 plates in a circle labeled A to F clockwise with a chopstick in between each one. There is a waiter in the middle. C has green lines to the chopsticks on its left and right with the text "YUM"](/images/dining-philosophers/dining_philosophers_03_4.png)

The introduction of the waiter effectively serializes the geniuses who were acting in parallel before. What was previously a chaotic mess of geniuses fighting over chopsticks now becomes an orderly sequence turn-taking moderated by the waiter.

In concurrent programming, this third-party is known as a lock or **mutex**. A mutex acts similarly to the waiter from the Dining Philosophers: it represents some sort of permission that a concurrent program must obtain before executing parts of its logic. If a program hits a chunk of its logic that requires the mutex, but the program hasn’t acquired it, it won’t be able to continue until it can acquire that mutex. Naturally, mutexes are useful when you have logic that shouldn’t run in parallel, like file writes or mutating actions in a database.

## Conclusion

After Caspian finishes, Caspian’s father, clearly pissed, reprimands his wife, calling stir-fry a sorry excuse for a home-cooked meal and storms out of the house. For Caspian, this is just another regular occurrence in his dysfunctional home. However, the viewers get to follow Caspian’s father out to the garage where we find out that that whole abusive husband persona was in fact just an act and that his father and mother are colluding on *something* under their son's nose! It turns out that there’s more than meets the eye with Caspian’s family.

Just like how his family's outward appearance is a facade to Caspian, the Dining Philosophers problem is also, in a sense, a facade to us. It is a theoretical problem, a toy example hiding the oft uglier and grungy programs written to solve real-world problems. These are programs that must juggle different processes all trying to write to memory at once; programs that must handle access to a database for multiple clients; and all while squeezing out as much efficiency from the machine without crashing, a far cry from our philosophers having their quaint little dinner. After all, multi-threading *is* feared by many for good reason.

---

## Appendix A: Thoughts on *Pantheon*

*Pantheon* has been a very interesting ride so far and perhaps deserves its own separate blog post one day. In short, it’s an animated sci-fi show centered around and exploring the implications of digitizing and emulating the human brain as a software program.

I think what has especially resonated with me about it is the show’s technical subject (a software developer loves a show about software who would’ve guessed) and the clear inspirations it takes from late 90s and early 2000s anime (think *Serial Experiments Lain*, *Neon Genesis Evangelion*, *Paranoia Agent*, *Ghost in the Shell*). The anime influences are especially telling from its liberal references to these sources of inspiration. One only needs to look at Maddie's laptop stickers to see parodies of the NERV logo from *NGE* and Maromi from *Paranoia Agent*.

![Maddie Kim sitting with her laptop. The laptop has parody stickers of the NERV logo and Maromi.](/images/dining-philosophers/laptop.png)

One character even blatantly re-enacts the famous cyborg typing scene from *Ghost in the Shell* later on in season 1! (so cool!)

Despite this, I don’t think *Pantheon* lets its predecessors completely define it either. The execution and story feel like a fresh take on the ideas and atmosphere pioneered by its forecomers, remixing them rather than just creating a weak rehash. The only criticisms I have is that I felt the show kinda did a genre swap from a psychological horror to a more general thriller. It also gets a bit difficult to manage near the end of season 1 with the viewer having to juggle several, often changing, character motivations. The voice acting can also feel a bit wooden at times, especially in earlier episodes. Of course, these are minor nits. I still love this show.

*Pantheon* itself is also based off of a series of short stories. I really want to read them, especially after I found out that they were authored by Ken Liu, the English translator for my favorite sci-fi novel of all time, *Death’s End*. However, at least one person online has said the original stories are quite dry and may not be as interesting as the show. This I can believe after attempting to drag myself through more "sciencey" sci-fi, such as *Permutation City* or *Red Mars*, and finding myself losing focus.

One thing I do wish is that I had gotten into the show earlier. I had never heard of it until this month despite it being nearly 2 years old at the time of writing. I think one of the main contributing factors to this is its distribution. It was apparently locked behind AMC+ and HIDIVE, only making it to Netflix this year, so no one I knew was talking about it. Season 2 is also still only available in Australia and New Zealand which is both extremely odd and kind of a shame. I think the show is amazing and doesn’t deserve to die in obscurity. Hopefully the Netflix release will prevent that.

## Appendix B: Thoughts on Ken Liu and others

Ken Liu is an interesting person. He started his career as a Microsoft engineer. Then he became a lawyer. Then he became a writer, and quite an accomplished one at that, having written for *Star Wars* and *Love Death + Robots* (and of course translating Cixin Liu’s *Death’s End*, the final work of his *Three Body Problem* trilogy).

Ken Liu as someone who made it in both the tech and literature is not unique either, which is even more surprising. Andy Weir of *Martian* fame is another programmer who later became a sci-fi writer. I also recently learned of another person in the tech space writing sci-fi, Ted Chiang, whose *Tower of Babylon* I’ve been wanting to read.

The upshot is not really to fanboy about random famous people but more so to say that it never ceases to amaze me knowing how many people out there not only *have* multifaceted, cross-discipline talents but are also *actively applying them* to accomplish their dreams.
