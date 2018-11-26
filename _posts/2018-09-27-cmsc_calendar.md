---
layout: post
title:  "Calendar from Undergrad"
date:   2018-09-27
categories: umd cmsc undergrad calendar
---

Going into college, one of my primary goals was to get
my act together. I've always been awful at managing events, so
recently I've started trying to actively use Google Calendar.
Integrating it into my livelihood was very straight-forward:

  - Add calendars for bulk events
  - Manually add smaller, one-off events

Then I happened upon the behemoth that is the CMSC Undergrad calendar. Not only
could I not find a Google Calendar mirror, but calendars
for subsequent months seemed to be getting pulled via some ajax magic.
I wanted to just scrape the entire thing but the whole site was so arcane
to navigate that it was much more trouble than it was worth.

I was about to give up and just manually add all 50+ some events when
the words of an old friend came back to me:


#### *"Webscraping? Pfft that's easy."*


In a sense, he was right because while trying to hack together a script and figuring
out what parameters to shove into a POST request takes a lot of time
(at least for me anyways...), there are smarter ways to do
webscraping.

The solution I turned to was Selenium, mostly because this project gave me
an excuse to start messing around with it.
<br>
<br>

## Process
One of the first things I did was figure out how to get around with Selenium.
Once I could successfully navigate through the calendars via button click and
pull the source, the project became mostly a parsing game. I threw all the
HTML into BeautifulSoup and looked for event hyperlinks which essentially
just got me a list of all the files under "event" directory. I then went through every
event page and did the same thing, this time trying to pull out the event title,
location, and date if I could and processing it into a reasonable form.

Now I had all the event data I needed but still no way to put it into my Google
Calendar. Thankfully, Google provides a nice API to their service plus some base
example code which I copied and modified. Running my little script, I now had
a handy way of mirroring the undergrad calendar over to Google except for one
small problem. For some reason, the times were off by an hour starting from
November. How curious! I thought I had messed up some timezone issue, but then
I remembered: Daylight saving time. Ugh. Google Calendar was automatically accounting
for DST for some reason. To be honest, I just monkey-patched the
code to change the time offset based on whether DST was in place or not.
<br>
<br>

## After Thoughts
This project was not that complicated, and I'm sure there were better ways to do
what I had set out to accomplish. For all I know, I may have just entirely missed
an "Add to Google Calendar" button on the undergrad site which would have saved
me a lot of trouble.

One of the end goals was to put this script onto a server and run it every month
to update the list of events, but I had some trouble getting Google to authenticate
me on my EC2 instance and decided that this was enough since I could run the
script monthly myself anyways.

As for its use, many big events in the computer science department get hyped up
days before they happen anyways, making this thing largely useless. That being said,
the calendar still has some use for reminding me of smaller events and if anything,
I learned how to prototype webscrapers faster with it through the Selenium experience.

The calendar itself can be accessed [here](https://calendar.google.com/calendar/embed?src=a08cd3h5pl26olnsts54pn8kvs%40group.calendar.google.com&ctz=America%2FNew_York)
 although it is likely not up-to-date.
