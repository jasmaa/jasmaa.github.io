---
layout: post
title:  "Speed Trig"
subtitle: "TRIG-ger Happy Havoc"
date: "2019-12-14"
categories: Programming
tags: trig react-native js mobile
---

**At the time of writing, the app is available for Android on Google Play
[here](https://play.google.com/store/apps/details?id=com.speedtrig)!**

**UPDATE (12/29/2019): Now available on iOS as well [here](https://apps.apple.com/us/app/speed-trig/id1493062069)**

***

One of my fondest memories from high school were a set of re-takeable quizzes
from pre-calculus collectively called "Speed Trig". The idea was
that you had to solve a battery of rote trig problems under time pressure and
graded on an all or nothing basis.

While Speed Trig ranks among one of the more stress-inducing experiences from
my public education, I do appreciate it for drilling trig skills into me.
My problem throughout Speed Trig, however, was that I had no organized way to
practice for it. Since the quizzes were re-administered repeatedly, I ended up
using the actual quizzes to benchmark my progress. This was not ideal and looking
back, I would have appreciated an app for practicing problems. Come years later,
while brainstorming project ideas to explore mobile development, I ended up
digging up my past and making a simple Speed Trig app.

## Background

Foremost, this idea is not original: our high school had a Smartphone Programming Club (SPC)
which developed [a Speed Trig app](https://github.com/MBHS-SPC/speed-trig-android) years earlier
(apparently at the whim of their math teacher club sponser).

Compared to the app developed by SPC, mine was going to be a functionally simpler app. From the
outset, I wanted this app to be much more "game" than anything else. Because of this, I chose
to make it a multiple choice, timed quiz which would be more appealing to the player than inputting
answers directly. I also went in with a heavier focus on trying to get the aesthetics and feel of
the game down.

## Mobile and Trying to Render Math

Starting development, the first roadblock hit with was rendering the math formulas needed for displaying
questions and answer choices. Working in React Native, there
were nearly no reliable libraries for rendering formulas, and I was not about to go in and try to write
a custom formula renderer. My only solution at this point was to render the formula in an HTML page with MathJax
and display that in a WebView, and while it worked, I could not manage to get the WebView to center as I wanted and
MathJax rendering also had a very noticable lag. All of this made the app look clunky, so I ended up scrapping the
entire thing and just pulling math symbols from Unicode. Although this was a setback, the math I needed
to display was not too complicated, so the app did not suffer much. That being said, a fast formula renderer
for React Native might be an interesting project for someone to tackle in the future.

## Designing for Looks

Coding up the app, the logic ended up being quite simple. All the app does is repeatedly select a trig problem and display it with
4 possible answer choices. A point is rewarded for a correct answer and a heart is lost for a
wrong answer. The user tries to answer as many questions as possible, and when either time is up or the user
loses all hearts, the final score is displayed.

![Speed Trig game screen](/images/speedtrig/screenshot_02.png)

I was able to write all of this in about a day's time which meant that most of the work for this project actually went towards
making it look nicer. I opted to go for a geometrical, vector art look, mostly because that's the only type of art I
can make reasonably fast. I also wanted animated feedback for answering questions but wasn't ready to step into the
world of React Native animations. Looking for a quicker solution, I eventually found Joel Arvidsson's wonderful
[react-native-animatable](https://github.com/oblador/react-native-animatable) library. Animations were easy to
work in after that, and in no time, I had a very basic Speed Trig app.

Making this Speed Trig app was also a chance for me to try a new thing: adding ads to my apps. An entrepreneuring
friend of mine had suggested the idea in the past and this seemed to be a good place to test it out. Using Invertase's
[react-native-firebase](https://github.com/invertase/react-native-firebase) library to interface with Google AdMob, I was
able to quickly add two banner ads. Being the first time using AdMob, I did run into a little bit of trouble displaying
ad units, but this was easily solved by just verifying my account. Initially, I had some concern that the banner ads would end up being
a major eyesore, but playing around with the app, I found that they only ended up being a minor annoyance. The react-native-firebase
library also provides access to other Firebase features like analytics and Firestore which are worth looking into in the
future.

## Problems and Improvements

Speed Trig was meant to be a fast and simple project, so it does leave a lot to be desired.
One of the biggest problems with Speed Trig is the way it stores its questions. The entire question
set is a JSON file storing a list of functions which each contains a list of input-output pairs. Although this results
in a very inflexible question system as each possible input has to be manually entered, it keeps the question selection
implementation relatively clean. However, should I choose to change the game down the road and add arbitrary inputs,
for instance, this entire system will have to be ripped out.

In the future, I would also like to add more features like
competitive play, rankings, adjustable settings, and perhaps even alternative game modes ~~like kart racing~~,
but these are all considerations for another day. Adding some of these features also has the additional
overhead of jumping through a lot of app store bureaucratic hoops and red tape which I'm not keen on going through.

## Conclusion

Ultimately, I am quite happy with this project. Granted, while it was mostly all design work with minimal coding,
I am still proud of the end product. Making a Speed Trig app was always my joke suggestion when brainstorming
for ideas at hackathons, so it's a little weird now that I've actually made it. Either way, I got a good
amount of React Native and mobile app deployment experience from this project and managed to ship
a decent app at the end of the day.

![Speed Trig game screen](/images/speedtrig/appLogo.png)