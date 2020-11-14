---
layout: post
title: "Kuiperbowl"
subtitle: "Like Protobowl but significantly worse"
date: "2018-11-26"
categories: quizbowl python django js websocket
---

As of the time of writing, Kuiperbowl is live [here](https://kuiperbowl.com)!

---

Another old idea that had been swimming in my head for a few years was creating a Protobowl clone. Since I owe the more
impressive parts of my largely unimpressive trivia knowledge base to rote practice on Protobowl, it has always been
a small dream of mine to make something similar in functionality (and bot the site lol).

## Design

Roughly, Kuiperbowl is made up of a Javascript client with a websocket that pings a main game server to stay in sync as well
as requesting information and commands. The information stored is comprised of four models:

  - Question: Toss-up quizbowl question
  - Room: Describes a room. Made of players, messages, a running question and keeps track of actions taken in the room.
  - Player: Describes a player. Keeps track of points and buzzes.
  - Message: Timestamped messages with a purpose and content.

The bulk of the project server-side is actually just a giant if-else that responds with the proper requests.
Surprisingly, I feel the client's design took more thought as aside from coordinating UI elements, the client
also had to be kept in sync with the server.
 
## Process

I knew I wanted to make the site in Django using Channels to handle websockets since I had built a real-time chatroom
following tutorials doing the same thing. The first problem I ran into was when I tried to re-serve the old chatroom
project, however, I suddenly ran into errors. Turns out I had updated my version of Django which was not compatible
with Channels anymore. Switching gears, I scoured the internet and finally found a setup that worked, re-configured
the chatroom project, and got everything back up and running smoothly as before.

Now that I had an async setup that actually worked and some database models, it was time to start writing crappy
Javascript! The client itself has a looping timed update that locally keeps track of the room state. It also pings
the server every 5 seconds to keep in sync. For actions that require immediate synchronization, the client
sends a websocket command to the server which then sends out a group update at that instant instead of relying
on the 5 second sync to update the other clients.

One of the biggest challenges was figuring out how buzzing in for an answer would work. The first implementation would
designate a buzzed player who would be contending the question and lock out the room for everyone else until the contender
answered the question. However, this did not account for the fact that time would still pass while the buzz was taking place;
the problem remained of how to coordinate buzzing among all the clients. I ended up drawing a little diagram and came up with
what I affectionately call the "King Crimson" approach, drawing inspiration from JoJo's Bizzare Adventure:

![Time flow diagram](/images/kuiperbowl/kuiperbowl_helpme.png)

Essentially, upon a buzz, a buzzing start time is recorded. The contesting player spends some amount of time
on the buzz and when the buzz is done, the duration of the buzz is calculated and both the start and end times
are moved by forward by that duration. This effectively erases any time the buzz took up from the question reading
time, hence the name, King Crimson approach (Additionally, this also serves as a nice explanation as to how King
Crimson works I feel...).

![Dojyaaan](/images/kuiperbowl/kuiperbowl_kingcrimson.jpg)

Afterwards, it was a matter of sprucing the client up so that the local and client game states stayed in sync. One
issue in particular was that while buzzing near the end of a question, the question would prematurely end, interrupting
the buzz. At first, I thought it was a flaw in the King Crimson solution itself, but it turned out to be another
coordination issue. As the time erasure doesn't occur server-side until the contesting player finishes buzzing, it's
possible for other clients to declare the question done before the player finishes answering. Thankfully, I had another
bug where I was checking for the end of the question even while the player was in a contesting mode, making the first bug easy
to find. The solution, of course, was to fix both the game flow of the client by preventing premature question ending as
well as write in constraints for the server that would prevent ending the question while in contested mode.
For the server, pings would also trigger room updates, making sure that in addition with syncing the clients, the rooms were also all up-to-date.

Figuring out the King Crimson approach remained the most challenging design aspect of the project. Most of the rest of the work
was adding small features like theming and messages as well as cleaning up client-side bugs, such as one that didn't unlock player buzzes after going to the next question. A good deal of
the project was, unfortunately, front-end design which boiled down to a small eternity of learning how to style and align HTML elements
until things looked nice...

While the project could have ended with the implementation, I figured since I had some AWS credits, I would go the full mile and
move the project into production. This was honestly a small hell in itself. Part of the problem was figuring out production in
async Django as using the default server is poor practice. After some time, I managed to get the project running with Daphne, but without
the default server, I could not serve any static files which is where all my client code was. The patchwork jank solution was to open up an
S3 bucket and pull files from there but updating the bucket slowly became a real pain. So through some trial and error and after accidently deleting
a bunch of files for Apache, I came to fathom how to use Nginx. Nginx was configured to serve static files
as usual but used a reverse proxy to Daphne for HTTP requests. The last stretch was linking up a domain name and SSL certificate.
The domain name linking went smoothly as I had used Route 53 before, but the SSL certificate was a hassle. Eventually I figured out I could
generate certificates for multiple domain names and then just had Nginx redirect HTTP to HTTPS.

## After Thoughts

Once again, like most of my projects. The implementation is not the cleanest it could have been. The most glaring monstrosities in
this project are the huge if-else that comprises the server and the spaghetti code that coordinates game states for the client. Nevertheless,
functionally, it works, and I'm quite happy that I managed to make something this close to Protobowl. This was another project that I had started
a while back but never finished because I couldn't figure out how to design it. I had gone as far as dumping a bunch of quizbowl questions and making
a question reading client back then but coordinating multiplayer was something I could not figure out. I had wanted a server-centric system that would
have the server keeping time and updating the clients continuously which was frankly not possible. Looking back again, this time, I came up with a much more client-centric
approach where a lot of the updates take place locally and the server is only talked to as necessary for consensus which I feel is a better design as a lot more work is off-loaded to
the client.

While an extension of this project is to move it into other mediums, possibly making mobile clients or maybe even some sort of quizbowl VR app,
I do want to step away from this project for a while. I felt like I got a lot of experience doing some web work for this project (mostly the production configurations...).
This also is still an inferior clone of Protobowl so I had also thought of including some additional features like global rankings with automated tournaments. One colleague
even suggested some sort of card game-trivia bowl hybrid.
I believe Protobowl also operates in a similar manner to my design so perhaps this might also be setup for writing a mobile app to finally interface with Protobowl
once again...

![Kuiperbowl comet](/images/kuiperbowl/comet_big.png)

...but that's for another time!

Thank you for reading and hopefully I remember to update the SSL certificate for Kuiperbowl next month...