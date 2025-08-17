---
layout: post
title: "Setting up a Self-Hosted Single User Mastodon Instance"
subtitle: "Masto Sweet Masto"
date: "2025-06-08"
categories: Misc
tags: mastodon hardware self-hosting
---

I've been self-hosting a single-user Mastodon instance for some time now. I figured it's probably time to write up my experience setting it up so I can share my experiences with the rest of the world (and so I can also have it documented somewhere once I inevitably forget how I did do it).

## Dude, Where’s My Pi?

Most stories start from the beginning so that’s where we shall start too.

It was early 2023. News of Silicon Valley Bank’s collapse was all the talk, COVID still existed (depending on who you asked), and I still could not get my hands on a Raspberry Pi. You could thank the global chip shortage for that. What I did manage to find, however, was an alternative product from Libre Computer called [Le Potato](https://en.wikipedia.org/wiki/Libre_Computer_Project#AML-S905X-CC_(Le_Potato)).

Being the trigger happy guy I am, I purchased one instantly without thinking and soon found myself with a SBC and nothing more. Turns out that I needed a little bit more than just the board. Namely, I was still down a microSD card for storage, a microUSB cable for power, and an ethernet cable for internet. One more virtual grocery run later and I had a bunch more stuff with still absolutely no idea what to do with it. The Potato is pretty bare bones; it does not come with an instruction manual, so it was off to the Internet again, this time to figure out how in the world to get Linux on the thing.

Luckily, I stand on the shoulders of giants. Many others out there have already experimented with Le Potato, and the Libre Computer forums even offer a [getting started guide](https://hub.libre.computer/t/libre-computer-start-here-guide/2422) which links to more resources for setting up various flavors of Linux. In terms of setup, I found both [this video tutorial by Shotoku Tech](https://www.youtube.com/watch?v=dpsQmXYhC4o) and [this one by Vincent Stevenson](https://www.youtube.com/watch?v=-d2zoc-UAuA) to be extremely helpful. After much trial and error, I ended up just following Shotoku Tech’s guide nearly step for step, flashing Armbian Jammy using balenaEtcher. I plugged everything in and turned on the monitor again but no luck. Just as I was about to go through another Sisyphean cycle of re-flash and reboot, suddenly, the monitor lit up, showing Linux booting up briefly, before turning off again.

*What the fu-*

A few more tries later with varying levels of success, and I discovered that the Potato’s LED blinking pattern was different the times when I was able to get Linux to boot. Before, only the Potato’s red and green LEDs were on. However, when Linux booted, the blue LED would also begin flashing. Some part of my setup was causing the Potato to be unable to boot. Searching the Libre Computer forums, I eventually found out that most deviations from the LED blinking pattern were usually due to a bad power supply. The Potato expects 5V of power. I looked at my Potato’s setup and there, connecting wall power to the micro USB cord charging the Potato lay the culprit, the power adapter of a shitty USB charger I had gotten for free at a math competition many moons ago (see appendix).

After swapping out the power adapter, the Potato seemed to boot reliably. I hooked up ethernet and my USB keyboard to the Potato, set up root and a personal user, and after a few more steps, a beautiful login screen greeted me. The login screen also displayed the Potato’s local IP which meant I was now able to SSH into it from my personal computer (yay!).

Throughout 2023, I ended up running a [personal Discord music bot](https://github.com/jasmaa/guizhong) off of my Potato. During this time, I would also purchase two siblings for it, scaling up my Potato cluster to a grand total of 3.

![Photo of the Potatoes. There are 3 SBCs on a mini rack next to a Netgear router.](/images/single-user-mastodon/IMG_1261.jpg)

Aside from attempting to self-host a Komga and Jenkins server via Tailscale Funnel though, not much else happened with these Potatoes. However, flash-forward to 2025 and things began to change. This is because I would start getting the urge to self-host a single-user Mastodon instance.

## A Mastodon of My Own

Self-hosting meant that I needed to turn one of my Potatoes into a Mastodon server. Currently, I have three Potatoes named serval, gepard, and lynx (see appendix B). serval was already running a bunch of cron jobs and gepard already had too much stuff on it which meant the only candidate left for my instance was lynx. I cleaned up lynx a bit and got started.

My entire setup pretty much followed the [Mastodon setup guide](https://docs.joinmastodon.org/admin/install/) line-for-line. I did run into a bit of trouble with installing yarn, but it turned out this was due to lynx having an older version of Node. APT kept installing the older Node version even after I uninstalled Node and set the package source to Node 20. Eventually, I was able to get it to work by fiddling around and uninstalling enough dependencies so that APT wouldn’t keep installing the older Node.

The rest of the guide went mostly without a hitch, except that I did have to settle on a domain name. Once I got one, the next step was to get an SSL certificate for my server. This meant it was finally time to figure out how I was going to expose lynx to the Internet. I was originally planning to use Tailscale Funnel but soon found out that Funnel [only allows DNS names that are a subdomain of the tailnet’s domain](https://tailscale.com/kb/1223/funnel#requirements-and-limitations). I had already bought my own domain, and I also didn’t really want to call my Mastodon server something like foo.ts.net so that was a no-go.

After some more quick research, I ended up going with an alternative and setting up with Cloudflare Tunnel. Following the [tunnel setup guide](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/get-started/create-remote-tunnel/), I was able to register a domain name with Cloudflare and set up the tunnel. The entire process was very similar to using Tailscale Funnel and simply involved running the cloudflared daemon on lynx. However, trouble started brewing once I started configuring the routing.

I had initially set up my domain to route to http://localhost. When I tried to visit the domain, however, the browser ended up looping repeatedly. Digging a bit more, I found out that the cause was due to the nginx rules for Mastodon always attempting to upgrade HTTP to HTTPS. This meant that I had to point the tunnel routing to HTTPS instead. However, when I tried this, I ended up with a 502 Bad Gateway error. Searching around the Internet again, it turns out a [few folks had fixed this by enabling the No TLS Verify option](https://community.cloudflare.com/t/one-of-my-cloudflare-tunnels-is-returning-a-bad-gateway-error/483145/3) (see appendix C). I turned it on and, lo and behold, it worked!

I quickly created a new account on my server and the rest is history.

## To See the Future

As of this writing, my Mastodon server has been online for 18 consecutive days. This is longer than what I had initially expected, especially since I know full well I am cheaping out on many parts of this setup. However, the instance seems to be running fine so far, barring some occasional lag. My only complaint is that it is a bit lonely with just myself, but I’m still managing for now.

![Photo of htop running on an external monitor. There is a line reading "Uptime: 18 days".](/images/single-user-mastodon/IMG_1260.jpg)

Looking forward, probably the most notable risk I’ve taken going the self-hosting route is that it’s now also my job to manage the server’s infrastructure and content. This means it’s up to me that it doesn’t go down and doesn’t end up ingesting any undesirable content. As they say, “With great power comes great responsibility.” However, I honestly see this as more of an opportunity than a burden. I’ve had few chances to actually run and maintain a long-running service on an actual Linux box (Kuiperbowl being the only other), so I feel that this will be something I can use as a learning experience. Even if something catastrophic does happen, I won’t let anyone else down. This is a single user instance with just me after all.

There’s still a lot more I have to do as part of this. Most of this involves figuring out how to monitor both Mastodon and my Linux host, how to perform and manage Postgres and media backups, how to keep Mastodon up-to-date, and so on. I also need to get more familiar with Mastodon’s admin tools and do some work finding more ways to bring content I like to my instance.

Anyways, assuming all goes well, and the instance doesn’t disappear because I get lazy, bankrupted, ill, or arrested, then perhaps there will also be more posts about my Potatoes and the Mastodon in the future. But only time will tell. Until the next one!

***

## Appendix A: My Love is a Phone Charger

Let’s step backwards in time. The year was 2017, and the world was quite different. Donald Trump had recently become president of the United States, COVID-19 had not yet rocked the world, and I was a bright-eyed kid in high school taking a trip up to CMU with a few friends to participate in the annual CMIMC math competition. Unlike my friends, I was (and still am) not very good at math. I was mainly there for the bagels and free swag.

A few companies were also there, I assumed not to do math but to scout for talent instead. To lure youngsters by and convince them of a promising future of corporate servitude, these companies had booths chock full of freebies. Like everyone else, we completely fell for these. Our group ended up making off with a bunch of pens, hoodies, pajamas.

For me, the most important thing I walked off with was one of these 12-foot long chargers that Two Sigma was handing out. It was love at first sight, because the charging cord was long which meant I could power my phone and still roll around all day in bed while facetiming my then-girlfriend. However, my friends and I soon found out that these chargers were, to put it bluntly, not very thermally efficient (and also probably very flammable). Most of us ditched them soon after, but I kept using mine.

Winter blossomed into Spring and my beloved 12-foot cord would stop working soon after that, leaving only the power adapter as the sole survivor. Although the adapter always generated a ridiculous amount of heat, I would keep using it as part of my primary phone charger setup, taking it with me into college and the years beyond.

Fast-forward to around Fall of 2023, during a trip to San Francisco with those very same friends, I would pull out my charger, and one of my friends would casually point it out and pose to me the following question:

“Jason. How the fuck are you still using that piece of shit?”

![Photo of a teal hexagonal USB to wall power adapter. On the top reads "TWO SIGMA".](/images/single-user-mastodon/IMG_1262.jpg)

## Appendix B: Machine Names

My Potatoes were originally nameless which was not great since just like children, without names, it is very hard to tell them apart. Since I was (and still am) into Honkai: Star Rail, I ended up naming them serval, gepard, and lynx after the Landau siblings.

The process to change the names was quite straightforward. I just SSH’d into each one and ran hostnamectl to change the name:

```
hostnamectl set-hostname lynx
```

Of course, this naming scheme will become problematic if I ever get a 4th Potato. I hope before this happens, Hoyo will introduce an estranged 4th Landau sibling who was lost in a snowstorm as a child and raised by a pack of wolves.

## Appendix C: Fun with TLS

I’m still not entirely sure what the no TLS verify does and why it worked.

My best guess at what’s happening is that there is some sort of SSL certificate mismatch. Cloudflare Tunnels presents its own certificate for the website. However, since the Mastodon setup guide assumes nginx will be directly exposed to the Internet and not through a proxy, it guides you to generate a certificate from Let’s Encrypt to use with nginx. When the tunnel talks to nginx, nginx uses the Let’s Encrypt certificate which is not the same as the certificate on the Cloudflare side, causing the error seen in the original setup. However, with the TLS verification disabled, this mismatch doesn’t matter anymore because the tunnel won’t check that the certificate from nginx is mismatched with the Cloudflare certificate.

![Drawing of network communication between lynx, Cloudflare, and a user. There is a computer named "lynx", a cloud named "Cloudflare", and a person named "user". Lynx has a certificate above it reading "Let's Encrypt". Cloudflare has a certificate above it reading "Cloudflare". There is a double-ended arrow between lynx and Cloudflare with an "x" below it. There is a double-ended arrow between Cloudflare and the user.](/images/single-user-mastodon/tlsfun.jpg)

Most likely what I should’ve done is [used Cloudflare’s origin server certificate with nginx instead of the Let’s Encrypt one like this person did to resolve the mismatch](https://community.cloudflare.com/t/what-could-be-the-reason-that-tls-verify-doesnt-work-for-my-tunnel/662998). However, whatever I have is working, so I’m just going to leave it alone for now. I believe the only risk I’m running is that I could get MITM’d somewhere in-between Cloudflare and lynx. Perhaps properly fixing this (or attempting to do so) will be its own mini project for some future weekend.
