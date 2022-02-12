---
layout: post
title:  "VS Code Bolt"
subtitle: "That One Coding Project That Isn't Actually a Coding Project"
date: "2020-03-29"
categories: Programming
tags: vscode bolt firebase
---

Recently, I had started experimenting with Firebase's Realtime Database.
Then one thing led to another, and I eventually found myself working on a
language extension for a rules language, but I'm getting ahead of myself.

## Background

Taking a step back and providing some much-needed background:
the Firebase Realtime Database is a JSON-based,
key-value store which makes it easy to start with but also quick to trip up in since
data doesn't have a well-defined structure. Moreover,
while a traditional database would be interfaced by a backend acting as a middleman
to authenticate users and limit the scope of possible queries, Firebase seems to be
intended to directly interact with the client. This means that security becomes
a major problem as it has to be enforced directly on the database's end.

Firebase's solution to both of these problems is a rule system. Database rules are written
into another JSON file and allow one to specify the conditions for data read, write, and validation.
The rule system solves everything except it also introduces a new problem: giant, unreadable JSON files.
It seems that the people at Google got tired of writing these rules and made a compiler
for a new rules language called Bolt which compiles down to the JSON rules.

When my nose led me to Bolt, I latched onto it immediately, having also tired of writing a
growing, unmanageable set of rules. Jumping into Bolt, my first instinct was to find an
extension for syntax highlighting, but, unfortunately, none of the available ones on
the marketplace met my expectations. I made like any sane and normal person and dived
into making my own!

## Making Language Extensions

While I develop a lot IN VS Code, I had no actual experience developing
FOR VS Code. Surprisingly, getting started was quite simple: I was able to bootstrap a new project
with the Yeoman VS Code extension generator and all a language extension needed after that was a
TextMate file (`.tmLanguage.json`) where all the parsing rules for the grammar would be written.

So how to write the parsing rules?

The generator thankfully provided a dummy grammar to provide some ground, and I had also
just taken a programming languages course at university so writing grammars wasn't uncharted
territory. However, figuring out how to write these rules and finding a place to start was
still a daunting task. Looking at the grammars defined by both my Bolt extension predecessors as well as the
JS grammar file for VS Code itself, I began to get a grasp of how to write grammars in TextMate.

TextMate works by matching constructs using regular expressions.
Constructs can be either matched using a single regex or by trying to match regexes
for the beginning and end of a construct. The latter kind of match is
especially useful for constructs that enclose things such as strings.

As an example, this regex was used to match the beginning of function declarations:

```
(function\\s)?\\s*([a-zA-Z_$]\\w*)\\s*(\\()((?:[a-zA-Z_$]\\w*)(?:,\\s*(?:[a-zA-Z_$]\\w*))*)?(\\))\\s*{
```

...which looks like a complete mess at first until it gets broken down:

![Function declaration regex](/images/vscode_bolt/function_declaration.png)

The regex above uses a lot of captures groups since TextMate uses those to assign scopes to
parts of a construct which determines how text gets highlighted. In addition, capture groups
can also be used to nest patterns for more constructs as seen in capture group 4 below
which tries to find and match argument names in the function header.

```
"beginCaptures": {
	"1": {
		"name": "storage.type.function.bolt"
	},
	"2": {
		"name": "entity.name.function.bolt"
	},
	"3": {
		"name": "punctuation.definition.parameters.begin.bolt"
	},
	"4": {
		"patterns": [{
			"name": "variable.parameter.function.bolt",
			"match": "\\b(?:[a-zA-Z_$]\\w*)"
		}]
	},
	"5": {
		"name": "punctuation.definition.parameters.end.bolt"
	}
},
```

References to defined constructs can also be included inside other
constructs which makes it really easy to design a grammar top-down.
The patterns shown below match the in-between text of a function
declaration block, saying that the inside of a block can either include
another `function-declaration` or an expression (`expr`).

```
"patterns": [
	{
		"include": "#function-declaration"
	},
	{
		"include": "#expr"
	}
]
```

The rest of the project boiled down to writing regex rules to match key constructs
and placing them properly into my hierarchy.

![Parsing hierarchy](/images/vscode_bolt/tree.png)

The one difference with TextMate grammar rules and the ones I had written for
school was that I had to parse entire constructs in one go. The parsers I was
used to had much more flexibility, using lookaheads to determine nested constructs.
The best I could do in TextMate was to mimic this by specifying the patterns in the
in-between of an enclosed construct.

Debugging the extension throughout was also a nightmare. Writing the regexes was already
bad enough since they had to be written using escapes, but TextMate's limitations meant
that more work for parsing fell on the regexes, leading to very long and complicated expressions.
Trudging through, I eventually got the extension to a place where most of the
language constructs were written into the TextMate grammar.

## Opening Up Shop

At this point I was ready to release it to the marketplace. Packaging up the extension for
release was simple with `vsce` but my experience with other markplaces told
me that publishing my extension was likely going to be a hassle.

Turns out I was wrong.

It was surprisingly easy to publish to the VS Code Marketplace: all I had
to do was get an Azure personal access token and publish the package. From there,
it was a matter of doing some aesthetic clean up and adding
some badges and my Bolt language extension was ready for anyone to use!

![Marketplace page](/images/vscode_bolt/marketplace.png)

## Improvements and Conclusion

While the syntax highlighter works quite nicely overall, more could still be done with
it. One issue is that I did not name scopes for all language structures so
while highlighting may look acceptable with the default theme, other themes might render
syntax differently.

It also appears that a lot of JavaScript functionality is supported in Bolt
which was not encoded in my grammar. While I had initially tested what JS I could write by
compiling arbitrary statements and seeing if they worked, definitively solving this problem
would require a deep dive into the Bolt compiler's source which I am not going to do as of now.
However, for the most part, the highlighter covers the kind of Bolt that most people will probably
be writing (or so I hope).

In the end, I am surprisingly proud of this project despite not having written any code for it.
I didn't expect to ever use any of the parsing stuff I learned when I took programming
languages, having written it off as too low-level and faraway from the world of
app development, but here I am today, a wiser man. I also find it ironic that in an effort
to not have to write large, unreadable JSON files, I ended up making this project
which is, at its core, a large, complicated, and very unreadable JSON file.

Life is full of many mysteries and contradictions.

## Appendix A: Fun with FOSS

At the start, I had originally just intended to make a pull request to one of the other Bolt extensions,
but when I peeked at their repositories, I found that
[both](https://github.com/smkamranqadri/vscode-bolt-language)
[projects](https://github.com/ThadeuLuz/vsce-firebase-bolt)
had actually done a straight one-to-one adaption of a set of rules originating from a
[package written years ago for Sublime](https://github.com/davideast/bolt-sublime)
by a Googler who, in turn, had lifted parts of his grammar off of someone else's
[personal JS Sublime language package](https://github.com/btford/sublime-text-javascript)!

This long chain of forking was the primary reason why I had hesitated to make
a pull request to begin with. The grammars appeared to have been machine converted from
the original XML into JSON which made them somewhat of a nightmare to read
and modify. I was also not sure what both creators treated as the ground truth
for their grammars and decided it was just easier to make my own grammar from scratch.

On the other hand, it's amazing to see code(?) work its way up to the present. Some rules from the
original JS language package date as far back to 2012 and have haphazardly made their way
across different projects for different editors, residing in different forms, to end up
being used by thousands today and scrutinized by a flakey college student 8 years later. I think it's
one thing when talking about old code in a long-running project but it's another to see code move across
different projects and contexts over time.

**UPDATE 05/25/20**: Grammar examples moved to Gist, minor changes to text

**UPDATE 01/17/21**: Grammar examples moved back as code