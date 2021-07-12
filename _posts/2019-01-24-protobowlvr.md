---
layout: post
title:  "Protobowl VR"
subtitle: "You buzz in the game, you buzz in real life"
date: "2019-01-24"
tags: quizbowl oculus websocket unity3d
---

Late last year, after a session of my school's XR club, I had, on a whim, proposed to a friend my grand idea of putting quizbowl in VR. As per usual, my absurd scheme was
quickly shot down, and we moved to other points of discussion. Later at the outset of winter break with nothing better to do, I told myself: Why not? and got to work.

## Design

The goal of this project was to emulate quizbowl to the best of my ability in VR which evolved into building a VR client for Protobowl (PB). At its base, the program was
going to be have the user with a realistic buzzer and several other avatars representing the other players in an immaculate room. The program would properly translate
the events that took place in the web client PB room into actions in the 3D scene. As for the platform, I chose to target Oculus Rift and write the project in Unity.

## Rewriting and Porting the Protobowl Client

To start off, I had to implement a Protobowl client in C#. I had already written an incomplete Python client a few years ago, so I ended up porting that code and subsituting
dependencies with C# libraries and scripts from online. One major problem was working with the JSON responses which were dictionaries in the Python version. While Python's dynamic typing makes
its dictionaries very flexible, it also makes them near impossible to translate directly as dictionaries in a statically typed language. After trying to write a data structure for each type of object in
the JSON responses, I ended up just giving up and copying the code for SimpleJSON off the Unity wiki which handled all the JSON parsing. Walking through my old PB client code was a bit hectic
but eventually I got it to at least have the question text scrolling in sync with the web client and buzz from inside the Unity app.

![PB client in Unity](/images/protobowlvr/quizbowlvr_01.gif)

## Moving to Oculus

On the VR side, I started by getting Unity's Oculus Integration and putting together a simple scene with an avatar that could pick up objects through Frankenstein-ing prefabs
from the provided demo scenes. Then I populated the scene with a table and a buzzer prefab I had modeled earlier to get a sense of how the environment felt. This buzzer in particular
was a hassle as I had wanted to give it a cord that reacted to physics. Following some online tutorials and copying code gave varied but ultimately insuficient results. On the verge of
giving up, I came across a Unity Answers post where the asker had designed a rope with a line renderer and a chain of character joints. I ended up copying the design by chaining a string
of empty gameobjects connected with character joints and then making a line renderer draw lines connecting their positions. Lo and behold it worked. I was afraid that putting it into
VR would suddenly break it but it worked better than expected.

![PB client in Unity](/images/protobowlvr/quizbowlvr_02.gif)

## The Long Haul of Making UI

Now came the Herculean task of writing UI in VR. The first thing to came to mind was making something similar to the menus in Sword Art Online. In SAO, the menu has
a main body of options that can expand outwards. The player can bring up this menu by pointing and swiping down which materializes the menu from top to bottom.

I chose to simplify swipe detection, assuming the user would always summon the menu standing up. Detecting a swipe was done by checking if the user was making a pointing gesture
using the touch controllers and then checking if the vector representing the change in position of their hand was both directionally "close enough" to down by dotting
the direction unit vector with the down unit vector as well as large enough in magnitude to register as an intentional swipe. If summoned, the menu was spawned in and would
follow a recorded animation, allowing it to appear to materialize before the user.

![Kirito opening the menu in SAO](/images/protobowlvr/kirito.gif)

![Menu demo](/images/protobowlvr/quizbowlvr_03.gif)

User input was also going to be a hurdle. I was hoping to use a canned VR keyboard prefab, but the Oculus Integration didn't have one. The only other options were buying one
off the asset store for $15 or making my own. I opted for the latter and hacked together a very simple QWERTY keyboard made out of buttons. Additionally, in order to actually use
the keyboard, I took a gaze pointer from one of the demo scenes and modified it to work with the player's right hand. While it was pretty crude and didn't support input from both hands
at the same time, for the most part, the keyboard served its purpose effectively.

I had also naively hoped that the Unity UI elements would all transfer flawlessly into VR, but that was not the case. Chiefly, I needed a scrolling option menu and while Unity's default UI
prefabs has one, the scroll bar was too hard to work with in VR. I ended up having to write my own scroll wheel script which simply implemented several drag handler interfaces that allowed a panel
of options to be dragged vertically. The whole panel would then snap to a selected option upon the end of a drag.

## Adding Voice Recognition

I had considered adding a voice recognition input option early on, but it readily became apparent that this was going to be the primary method of input as typing in an answer through the VR
keyboard was too slow for the allocated answer time that Protobowl gives you. I had planned on using an online service such as voice recognition from Google Cloud or IBM's Watson Speech to Text
but ended up deciding it was too much trouble given that Unity provides access to Window's voice recognition directly. After putting a simple script together and hooking up the proper settings,
voice recognition turned out to work surprisingly smoothly albeit with a few hiccups that persisted into the finished product. 

One major problem is that voice recognition would often stop becoming responsive and shutting down the game in Unity afterwards would result in a noticable freeze before stopping. I had
suspected this was a problem with starting and stopping the dictation recognizer from the warnings to the console, and while fixing that did resolve most of the hiccups, the voice recognizer
is still one of the more finicky parts of the app.

## Fixing What's Broke

While connecting the PB client to the actual VR game, I also had to expand upon the client itself as the Python client was incomplete. Among the many things added were:
  - Detection of who claimed a buzz
  - Keeping a list of users for a room
  - Implementing a countdown bar for various timed events
  - Keeping an answer and event log
  - Allowing the local client to let the player keep a buzz after a question goes overtime
  - Handling prompts
  - Tracking pause and prompt states

Late into development, I ran into a problem where the client worked perfectly in a personal game room but would randomly desync when testing in the main hsquizbowl room by going
into a pausing state which was especially strange since it is impossible to pause in that room. I couldn't find what was triggering the pause state and ended up monkey patching the
code to only register pauses in a room where pause was enabled.

However, while the pause desync was fixed, playing in hsquizbowl still had a problem where upon buzzing, the local client didn't claim the buzz. I initially thought this was a problem with
data being lost because processing during a websocket receive took too long and would get interrupted by the next receive. A high traffic room like this one would have a barrage of server
responses, so I thought my theory was certainly plausible and tried to fix this by only adding JSON response strings from the server to a queue during a websocket receive and moving response
processing to a separate thread. However, the problem persisted. Strangely enough, when trying to simulate a high traffic room with a bunch of bots in my test room, the client performed
flawlessly; somehow there was a phantom problem in the hsquizbowl room...

Frustrated, I eventually gave up to play a little bit in hsquizbowl when something caught my attention: 400+ logged users in the sidebar... Trying to get into the game, I immediately realized
my problem: hsquizbowl was lagging beyond belief! A quick check in the traffic monitor told me that the problem was not that there were too many responses but that the server was sending
them too slowly, evidently because it was overburdened by keeping track of all of its idle users. In order to detect who claims a buzz, my program needs to wait for the server to send back
a response. I had hardcoded the timing for this which had worked in normal rooms but was failing now due to the lag. A messy rewrite of the process with a boolean to keep track of when
the client was awaiting a response for who had the buzz fixed the problem. To my surprise, after the fix, my VR client actually ran smoother than Protobowl's web client in the overburdened
room (humble brag lol..).
  
## Avatars, Polish, and Shenanigans

While it would have been possible to play quizbowl with just an event log, the point of doing it in VR would be to have quasi-realistic quizbowl experience. Because of this, I wanted to
have the other players in the room represented as avatars. As I'm not very good at art, especially in 3D, simple was going to be better. The avatars are made up of disconnected geometry,
similar to Miis. Faces were done by simply swapping textures out, making them expressive while simple to design. Certain animations, such as buzzing, were activated by events in game, but
other than that, the avatars just randomly activate sets of recorded animations. The avatars were originally supposed to just be opponents, but I ended up populating rooms with
them as background characters to make the spaces feel less lonely.

![Avatars walking in the main hub](/images/protobowlvr/quizbowlvr_07.gif)

This project was originally going to be graphically bare, but for some reason, the idea of making a grand main hub wormed its way into my head. My modeling skills are still very amateurish,
so I thought this would also be a good opportunity to practice. To design the main hub, I pulled up some pictures of Grand Central Station and started going at it. I also ended up
doing the same with the game rooms, turning what were originally empty rooms into outdoor rooftop pavilions at night. This was also a particularly good chance to make some prettier 3D scenes.
I ended up lighting most of the scenes with baked lighting from emissive materials which looked quite good. The hub also has a reflection probe which gave the tiled floor a nice, freshly-waxed look.

Going into the endgame, all that was left was doing some polishing. Among the additions were:
  - Plants were put into the game room to give the space more life
  - A clock was put on an empty wall in the main hub
  - Sound effects added for buzzing and typing
  - A grabbable clipboard to check the answer log in the game room
  - UI was made to be more round

At this point, it also seemed like playing quizbowl was the least appealing thing to do in this app. Notably, with the answer log clipboard, it is possible to place
an object at the end of the board and send it launching with a flick of the wrist at no cost the user as the torque exhibited by the object in-game is obviously not felt in real life. Sending
the buzzer launching was particularly amusing as it would mess with the character joints, causing the cord to spaz out.
  
## TL;DR Demo Video

<iframe src="https://www.youtube.com/embed/7s_zPBXLv94" width="100%" height="720rem"></iframe>

## After Thoughts

All in all, this was a very satisfying project and also my first large project with VR. It is still not a perfect product, but I feel it is one of the more polished
things I've managed to push out in Unity. Practically speaking, Protobowl VR is sort of useless as it's easier to get a bunch of mates together, pull up a packet, and play quizbowl
in real life. VR lends itself to be particularly useful for hard to emulate scenarios like gunning down robots on a battlefield or flying around the Earth, but, nevertheless, I am happy
that I somehow managed to implement some crazy idea I spat out one day.

Additionally, I may be biased in this regard since I wrote it, but there is now a functional Unity PB client in C# floating around on Github. Perhaps now is the time to bring back Protobowl mobile, but I digress.
I imagine there is a reason why the old mobile client for iOS at least has disappeared from the app store. However, with Unity, the platform indpendence doesn't really end. If someone
were crazy enough, we could even get Protobowl for 3DS or something!

That being said, I also think I've done way too many quizbowl and websocket related projects. I may come back to websockets in the future as async is very useful for games, but as someone
whose "quizbowl career" peaked (and that's a low peak mind you!) in high school and has never even gone back to play since then in real life, perhaps I am hanging on to the past with these programs. My hope is to
move on to a new area and stop doing quizbowl stuff for a while at least.

---

Check out the code [here](https://github.com/jasmaa/protobowl-vr) or if you have an Oculus, download the build from Itch [here](https://pbvrdev.itch.io/protobowl-vr).

![PBVR Logo](/images/protobowlvr/pbvr_logo.png)