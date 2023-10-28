---
layout: post
title:  "The Microsoft OAuth2 SPA Experience"
subtitle: ""
date: "2023-10-28"
categories: Programming
tags: web oauth2 microsoft react
---

Boo! It’s October, so I’ve decided to rise from the dead with a new post. I’ve
recently had the pleasure of messing around with the Microsoft Identity platform
and would like to recount my experience here.

The Microsoft Identity platform is a service that Microsoft uses to handle
authorization into several of its web APIs, most notably the [Graph
API](https://learn.microsoft.com/en-us/graph/use-the-api) which gives developers
programmatic access to various Microsoft cloud services, such as Outlook, Teams,
OneDrive, etc. Of course, the platform uses everyone’s favorite authorization
standard, OAuth2. Microsoft supports a rarer application of OAuth2 for entirely
client-side applications which makes this a bit more interesting to write about.


## Creating an OAuth2 application

The first thing that needs to be done for any integration into an
OAuth2-authorized API is to create an OAuth2 app on the resource vendor’s site.
For Microsoft, this setup [happens to live on
Azure](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app).
I made an Azure account and after wandering through a forest of UI panels and
widgets, I finally found myself on the Applications page.

When creating an OAuth2 app, you are given several options for which type of app
to create. Since I was working on a React app in Vite, I chose SPA. I also
provided a redirect URI for Microsoft to send users to at the end of the OAuth2
handshake.

![Applications page on Azure with SPA OAuth2
application](/images/the-microsoft-oauth2-spa-experience/azure.png)

Typically most OAuth2 apps also come with a client secret. This is usually used
by the client app to prove to the resource server that the client is legitimate
when it redeems an access token. However, we don’t need one for the SPA route
(since I guess the web UI a user is using can just be thought of as an extension
of that user), so this was skipped. That being said, Microsoft’s client secret
generation is a bit different from most OAuth2 apps I’ve seen before in that it
allows devs to (1) have multiple secrets on one OAuth2 app (yay?) and (2) it
also forces those secrets to expire which means that they must be manually
rotated every so often (aww...).


## Authorization in a SPA

With my shiny new OAuth2 app, it was time to get building. The SPA workflow on
Microsoft is slightly different from 3-legged OAuth2 which most vendors
implement. The general flow is still:

1. Authorize the user and get a code
1. Redeem that code for an access token

However, since this all takes place in a web browser, there are only really two
agents involved in this flow, the resource server and the user, rather than the
3 involved in 3-legged OAuth2 which would also include a server from the 3rd
party client that owns the OAuth2 app. This simplifies some things (no need for
a client secret since no client service), but it also makes things more
complicated (so how do you prove that the redemption request is legitimate
without a client secret then?). This leads us to one of the more unique (and
infuriating) parts of this experience, PKCE.

![Comic constrasting the behavior of normal web developers and web developers
working on authorization. The 1st panel is a screencap of a developer saying
"...so once you hit submit the data is magically sent to our backend service!"
while demoing the app to applause. The 2nd panel is of a deranged web developer
in a polo saying, "...so before we talk about OAuth, first we need to talk about
RFC 7636 Proof Key for Code Exchange by OAuth Public
Clients".](/images/the-microsoft-oauth2-spa-experience/path_01.png)

PKCE, or [RFC 7636](https://datatracker.ietf.org/doc/html/rfc7636), is a way to
prevent malicious clients from using stolen OAuth2 codes. Consider this
scenario: Eve, an attacker, is able to see all incoming HTTP requests for Alice,
a normal user, (either through malware installed on the Alice’s device or by
sniffing network requests). Alice decides she wants to use a legitimate client
application and authorizes against a resource server through that client’s
OAuth2 app. The authorization is successful, and the resource server responds to
Alice with a code. However, since Eve is watching all HTTP responses for Alice,
Eve sniffs the code from the query params of the URL for that response. Eve then
attempts to redeem the stolen code through her own OAuth2 app. The resource
server receives the redemption request from Eve’s malicious app, and since the
resource server thinks it’s a legitimate request, it responds to Eve with an
access token. Now Eve can use this token to access all of Alice’s data! 😭

![Diagram of Eve intercepting and redeeming OAuth2 code in scheme without
PKCE](/images/the-microsoft-oauth2-spa-experience/no_pkce.png)

This is very bad. The problem is that we need some way to allow the resource
server to prove that the agent who originally generated the request for the code
is also the same person who ends up redeeming it for an access token. To do
this, PKCE asks the user to first generate a high-entropy secret (read-as:
unguessable UUID). This secret is hashed and encoded before being sent as part
of the authorization request to the resource server who keeps it on file. When a
client later tries to redeem the code for an access token, the client needs to
provide the original secret in the redemption request. The resource server
receives the redemption request, and does the same hashing procedure on the
secret. If the hash from the redemption request matches the original hash from
the authorization request, then the user has successfully proven themselves as
the original requester and an access token is sent back to them. If the hash is
mismatched or not provided at all, an error is sent back instead.

![Diagram of Eve intercepting and failing to redeem OAuth2 code in scheme with
PKCE](/images/the-microsoft-oauth2-spa-experience/yes_pkce.png)

Once I digested all of this, it was time to put my new-found knowledge to
practice. The code challenge scheme used by PKCE is SHA-256, so I found a way to
generate a cryptographically-secure UUID, hash it using SHA-256, and encode it
in base64:

```js
const codeVerifier = crypto.randomUUID();
const encoder = new TextEncoder();
const hash = await crypto.subtle.digest("SHA-256", encoder.encode(codeVerifier));
const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(hash)));
```

However, sending this to the authorization server resulted in an error:

```
AADSTS501491: Invalid size of Code_Challenge parameter.
```

Thanks, Microsoft. A quick search and [I found a few others who ran into the
same issue
before](https://github.com/MicrosoftDocs/azure-docs/issues/42906#issuecomment-649937512).
Apparently, base64 pads encodings to multiples of 4, so a SHA-256 hash would end
up with a 44 character-long encoding. However, Microsoft doesn’t expect the
challenge to be padded and only accepts encodings with character length 43. This
meant that I needed to manually trim off the extra padding in the base64 output.
I also found out that base64 encoding as-is is not URL-safe, so I needed to
replace some symbols as well. This is the final code I ended up with:

```js
const codeVerifier = crypto.randomUUID();
const encoder = new TextEncoder();
const hash = await crypto.subtle.digest("SHA-256", encoder.encode(codeVerifier));
// Remove trailing ='s and make b64 url safe
const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(hash)))
  .replace(/=/g, "")
  .replace(/\+/g, "-")
  .replace(/\//g, "_");
```

Whew! After all that, I finally got my app to start redirecting with the code.
Now pausing for some questions.

Yeah, you kid in the back.

Uh-huh.

Ok so the question is: "Why do this stuff with redeeming codes if the resource
server could theoretically just give you an access token instead of a code at
the authorization step?"

This is actually [one of the options for authorization from a SPA on
Microsoft](https://learn.microsoft.com/en-us/entra/identity-platform/scenario-spa-overview)
and is known as an implicit grant. Essentially, instead of the resource server
sending the user to the redirect URI with a code, they just send the user to the
redirect URI with the access token straight up after authorization. While this
is a simpler method for authorizing in SPAs, implicit grants are considered
insecure since the token is available in the response URL (which leads to risk
of getting sniffed as we saw before in the PKCE section), and implicit grants
also don't vend out refresh tokens. The OAuth2 spec also [puts the access token
for implicit grants in a URL fragment
identifier](https://datatracker.ietf.org/doc/html/rfc6749#section-4.2.2) for
some reason which kinda scared me.


## Fun with CORS

So far, I felt I was doing pretty well on authorization after PKCE. Then I tried
to redeem the codes in the SPA and got this:

```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://login.microsoftonline.com/common/oauth2/v2.0/token. (Reason: CORS header 'Access-Control-Allow-Origin' missing
```

Okay...I had seen this type of error before. It’s a CORS error that usually
happens to prevent the web browser from calling out to any arbitrary server. But
Microsoft had advertised this method as working for SPAs which run in web
browsers, so we really shouldn’t be getting these, right? What’s the deal?

Unfulfilled, I set off on a long journey of discovery (read-as: I started
searching the error up on the Internet) and found that many users had also run
into the same issue. However, none of their solutions worked for me. As a sanity
check, I even tried redeeming the code outside of a browser by sending the
redemption request in curl and watched it drop an access token in my lap.
Something else was up.

Throughout this journey, I had also come to learn of the [Microsoft
Authentication Library for
Javascript](https://github.com/AzureAD/microsoft-authentication-library-for-js),
or MSAL.js. Apparently, this is an SDK developed by Microsoft for devs
integrating with their identity platform. It streamlines a bunch of
complications with orchestrating the OAuth2 handshake (like opening up login
popups and constructing URLs). I had initially ignored it, refusing to build on
top of another layer of abstraction, but another hour passed, and I caved,
integrating my app with MSAL just to see what their secret sauce was.

I walked myself through the login popup, the authorization, the code, and
then...the access token?!

What? It worked?! How was MSAL doing it?

I opened the network tab in my browser, and sure enough, the token redemption
request was going through and it was using...a form data body? Wait.
[Microsoft’s documentation had this POST request written with a URL-encoded
form](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow#request-an-access-token-with-a-client_secret)
which is what I had been using as well. I switched my form construction code
over and then there it was:

The access token.

Oh god. The service is conditionally setting an allow origin header depending on
the format of the POST body [^1]. I screamed and then moved on.

At this point, I had a working integration with Microsoft Identity in a SPA. I
could do anything now.


## And so...

I chose to stop. I had initially envisioned making a one-stop shop for calling
into a bunch of different SaaS APIs (which would’ve solved a pain point from my
day job), but then I discovered the [Graph
Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer), a website
miles beyond whatever I had finally managed to scrap together over those past
few days, and realized I had a long road ahead of me. I was already tired from
debugging OAuth2 and wanted to do something else, so I set this one down.

Thus the story stops here for now. Maybe one day I’ll pick this project back up
again, but I wanted to rest at this point. Perhaps I just needed a spa day (a
real one, not one of those cursed ones where you lock up 5 devs in a room with
food and water, shake the room for 3 days, and hope a functioning SPA pops out
at the end).


[^1]: It looks like this has been fixed since then so now both form data and
    URL-encoded forms can be used for token redemption from a SPA. Either that
    or I had a fever dream hallucination sometime in early October.
