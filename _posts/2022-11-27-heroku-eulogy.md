---
layout: post
title:  "A Eulogy for Heroku Free Tier"
subtitle: ""
date: "2022-11-27"
categories: Programming
tags: heroku
---

We are at the end of November and with it, the final hour of all of my Heroku
free dynos. When I first heard that Heroku was [slashing their free tier back in
August](https://blog.heroku.com/next-chapter), I remember feeling a bit of a
bittersweet nostalgia. Like many other folks in software, Heroku had been my
gateway into doing more web development.

I first found out about Heroku in high school. I was a junior stuck in an
elective course called computer graphics which covered just about everything
except its namesake. One of the class’s modules was on web development and
briefly mentioned something called Ruby on Rails, a funny name that piqued my
interest at the time. One thing led to another, and I soon found myself working
through a Rails hello world tutorial after school. At the very end, the
instructions described deploying the site to this thing called Heroku.

“What in tarnation is a Heroku?”

I went to the website, made an account, and cautiously followed each step from
the tutorial. Suddenly, the terminal spat out a bunch of colorful logs, and I
was told that the site was deployed on something or another dot herokuapp dot
com. I pointed Firefox to the enigmatic URL, waited a bit, and then there it
was: my shifty beginner project, on the Internet. My eyes glimmered and the
gears in my head started turning. I remember immediately adapting the tutorial
project into PhamBash, a clone of [Bash](http://www.bash.org/) but with a
uniquely inane focus on memorializing quotes from my high school’s eccentric
chemistry teacher. Right as it deployed, I tweeted the link at him from an
anonymous account. The next day in class, he had the site displayed on the
projector, shown up at the front of the room for all to see. He surveyed the 15
students present in the room before stopping to look at me, the kid seated at
the middle table, grinning sheepishly.

“You make this?”

“Yeah.”

Awkward silence. Then a smile.

“Okay guy let’s start class.”

---

After playing around in Rails, I quickly found out about Django and soon became
inspired to make more apps. During this time, Heroku would become my testing
ground for all things web.

I remember my next project which was a Facebook Messenger bot that responded to
messages by babbling using a Markov chain generated from text written by yours
truly. I had foolishly chosen to use Django to build the bot, overkill for a
server that was basically just responding to webhook requests. Eventually, I did
manage to get it all working locally (with ngrok tunneling so FB could hit my
server).

Then I came to the part where I had to deploy it. I remember having some trouble
getting the build to work on Heroku and being generally mystified by the [Heroku
Django guide](https://devcenter.heroku.com/articles/django-app-configuration)
introducing yet another server, gunicorn (which was also a blackbox for me since
it does not run on Windows). I did figure it all out eventually though: I had
been using the wrong buildpack (whoops).

Later, when I started learning about Docker, Heroku was where I went to
experiment with it. My first Docker-based dyno was a small site to commemorate
birthdays for anime characters by letting users submit doodles on their
birthdays. While the site itself had a short life and was nothing terribly grand
(especially given the amount of phallic creations my friends submitted to it),
building it got me more used to working with Docker. I learned a lot of new
things, like multi-stage Docker builds and the pain of watching [Docker get into
fistfights with VMWare before WSL2
existed](https://superuser.com/questions/1520079/vmware-and-docker-on-same-windows-10-pc).

---

Of course, Heroku's free tier was not without many grievances. Cold start always
annoyed me to no end, and many a time I would find myself on the dashboard with
my trigger finger on the delete button, mulling over which one of my 5 dynos to
sack so I could deploy my next project.

Despite these limitations, free users still always find their way around. For
example, one trick for cold start was to just never let the app fall asleep. I
remember I had trained [a ResNet-18 classifier to tell the difference between
pictures of Shamiko and Momo from Machikado
Mazoku](https://github.com/jasmaa/shami-momo-identifier). I built a web
application around it and wanted to show off the app to others but knew no one
would be patient enough to sit and wait through the cold start. To combat this,
I subscribed the endpoint to
[Kaffeine](https://github.com/romainbutteaud/Kaffeine), a service that
periodically pings Heroku endpoints to keep them awake. After that, my app never
fell asleep, and the only hassle I got was getting a monthly email from Heroku,
telling me that my free dyno hours were running out at the end of the month.

---

As I write this, I remember the free dynos I still have running in my account.
One of them is [Stapler-kun](https://github.com/jasmaa/stapler-kun), my faithful
Discord bot, born out of fatigue from a friend who would always declare social
plans in our Discord server before following up with the message “someone pin
that”. I used to pin them for him. Now the bot does it for me.

I had hosted Stapler-kun as a worker on Heroku with a free Postgres database to
persist which messages had been pinned. I remember getting giddy when I first
got it working. A personal little robot to do my bidding. Built by me. All
hosted for free.

Now Stapler has a new home. Or perhaps, I should say, a new body. I ended up
building out Stapler-kun v2, switching it from a discord.py bot to a Discord
Interactions app running on a free Cloudflare worker. I had a lot of fun with
the port and even got the motivation to add more functionality to the bot while
rebuilding it, yet I still feel uneasy. From one free tier to another. What
happens when this all too, ceases to be?

Gripes aside though, I had a lot of fun with Heroku’s free tier throughout these
years. It gave me a risk-free chance to practice web dev, and it fuelled many of
my good, bad, and plain crazy ideas. Now that the hour is nigh, I suppose it is
time to put a close to reminiscing and for the Heroku free tier to depart once
and for all. To all the things I learned with you and all the adolescent fun you
provided: Thank you and goodbye, Heroku free tier.
