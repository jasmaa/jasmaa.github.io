---
layout: post
title: "Ruining a Layton Puzzle with Linear Algebra"
subtitle: "Once you Gaussian eliminate the non-pivot elements whatever remains, however improbable, must be the truth!"
date: "2024-11-07"
categories: Misc
tags: linear-algebra puzzles games
---

Capcom recently re-released most of the Ace Attorney series on Switch which made
me want to play those games again. I ended up digging up my copy of *Professor
Layton vs Phoenix Wright: Ace Attorney* and brought it along for a plane ride a
few weeks ago where I encountered a particular puzzle that could be solved using
mathemagics.

The puzzle in question was [Puzzle #36: Decipher the
Door](https://layton.fandom.com/wiki/Puzzle:Decipher_the_Door) and appears in
the game as a challenge that Layton and Luke must solve before they can proceed
to meeting with the Storyteller of Labyinthia.

The puzzle itself involves opening a door by solving a combo lock. The number
slots range from 1 to 6 and can only be changed via buttons that modify multiple
slots at once.

![Puzzle with
instructions](/images/ruining-a-professor-layton-puzzle-with-linear-algebra/IMG_0246.jpg)

![Puzzle with combination
inputs](/images/ruining-a-professor-layton-puzzle-with-linear-algebra/IMG_0247.jpg)

Ah ha, a classic linear algebra problem.

Converting both the combination lock and the buttons into vectors, the problem
reduces down to needing to find the right linear combination that will produce
the vector representing the target state for the combination lock.

In other words, finding $$\vec{x}$$ where:

$$
\begin{bmatrix}
0 \\
1 \\
1 \\
0 \\
\end{bmatrix} x_1 +
\begin{bmatrix}
 1 \\
-1 \\
 1 \\
-1 \\
\end{bmatrix} x_2 +
\begin{bmatrix}
-2 \\
 0 \\
 0 \\
 2 \\
\end{bmatrix} x_3 +
\begin{bmatrix}
0 \\
0 \\
1 \\
3 \\
\end{bmatrix} x_4 +
\begin{bmatrix}
-4 \\
-3 \\
-2 \\
-1 \\
\end{bmatrix} x_5 +
\begin{bmatrix}
1 \\
2 \\
3 \\
4 \\
\end{bmatrix} =
\begin{bmatrix}
3 \\
3 \\
3 \\
3 \\
\end{bmatrix}
$$

Doing some algebra and converting everything to a matrix, this becomes:

$$
\begin{bmatrix}
0 &  1 & -2 & 0 & -4 \\
1 & -1 &  0 & 0 & -3 \\
1 &  1 &  0 & 1 & -2 \\
0 & -1 &  2 & 3 & -1 \\
\end{bmatrix}
\vec{x}
=
\begin{bmatrix}
 2 \\
 1 \\
 0 \\
-1 \\
\end{bmatrix}
$$

Which means the matrix we need to row-reduce is:

$$
\begin{bmatrix}
0 &  1 & -2 & 0 & -4 &  2 \\
1 & -1 &  0 & 0 & -3 &  1 \\
1 &  1 &  0 & 1 & -2 &  0 \\
0 & -1 &  2 & 3 & -1 & -1 \\
\end{bmatrix}
$$

I ended up doing the row-reduction in Python which yielded this:

```python
import numpy as np
import sympy

m = np.array([
	[ 0,  1, -2,  0, -4,  2],
	[ 1, -1,  0,  0, -3,  1],
	[ 1,  1,  0,  1, -2,  0],
	[ 0, -1,  2,  3, -1, -1],
])

print(sympy.Matrix(m).rref())

# (Matrix([
# [1, 0, 0, 0, -5/3,  1/3],
# [0, 1, 0, 0,  4/3, -2/3],
# [0, 0, 1, 0,  8/3, -4/3],
# [0, 0, 0, 1, -5/3,  1/3]]), (0, 1, 2, 3))
```

Or in other words:

$$
\begin{bmatrix}
1 & 0 & 0 & 0 & -5/3 \\
0 & 1 & 0 & 0 &  4/3 \\
0 & 0 & 1 & 0 &  8/3 \\
0 & 0 & 0 & 1 & -5/3 \\
\end{bmatrix}
\vec{x}
=
\begin{bmatrix}
1/3 \\
-2/3 \\
-4/3 \\
1/3 \\
\end{bmatrix}
$$

Cool. Now we have a problem: this matrix is not square.

What this means is that we have a free variable, $$x_5$$. We need to make a
guess for it. Obviously we can’t hit a button a fraction of a time so we also
need to adjust $$x_5$$ such that all the elements of $$\vec{x}$$ are whole
numbers. Thankfully, $$x_5 = 1$$ happens to just work out.

This gives us:

$$
\begin{align}
& x_1 =  2 \\
& x_2 = -2 \\
& x_3 = -4 \\
& x_4 =  2 \\
& x_5 =  1 \\
\end{align}
$$

This is where we encounter our second problem: we also can’t hit a button a
negative number of times.

In the puzzle, the combo lock numbers range from 1 to 6. Once a number goes beyond
6, it loops back to 1. What this means is that we’re actually working in base 6.
We’ll have to convert the negative numbers to base 6 which can be done by just
adding 6 to them until they’re in the range [^1].

This gives us a final answer of:

$$
\begin{align}
& x_1 =  2 \\
& x_2 = -2 + 6 = 4 \\
& x_3 = -4 + 6 = 2 \\
& x_4 =  2 \\
& x_5 =  1 \\
\end{align}
$$

With vector in tow, I tapped the buttons one by one accordingly and voila,
puzzle solved!

![Solved combination lock with 3 3 3
3](/images/ruining-a-professor-layton-puzzle-with-linear-algebra/IMG_0248.jpg)

Overkill? Definitely. Fun? Debatable. Efficient? Not really (the best solution
is apparently: `[0, 2, 1, 0, 1]`).

Long story short, I did not, in fact, perform Gaussian elimination by hand
40,000 feet in the sky next to a crying baby. I actually just ended up pressing
buttons randomly until the right combination lined up :P


[^1]: Why does this work? Don’t ask me to prove it, but intuitively, it’s
    similar to moving the hands on an analog clock. The hours of a clock are in
    base 12. If the hour hand is at 12, moving it clockwise by 3 hours puts it
    at 3. The same thing can be achieved by moving it counter-clockwise by 9
    hours. So 3 is the same as -9 in base 12. What we’re doing in the puzzle is
    similar to this[^2] except the clock only has 6 hours and we’re moving the
    hour hands of multiple clocks all at once.

[^2]: This is a lie. We’re actually applying this clock intuition on the number
    of times we do an action, not the actual number in the slot. However, this
    is still okay since our entire equation is linear which means mod can be
    applied early since $$(a(x \mod m)+b) \mod m = (ax+b) \mod m$$. Don’t ask me
    to prove this one either.
