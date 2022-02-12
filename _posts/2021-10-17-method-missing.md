---
layout: post
title:  "Method Missing"
subtitle: "Your method is in another class."
date: "2021-10-17"
categories: Programming
tags: ruby metaprogramming
---

Let's try a shorter-form blog post today. Suppose you are bored and want to learn more about a Ruby
library. You do the sensible thing: read the source, starting from a class the library's clients
would consume. You expect to find a plethora of method definitions or at least some mixins or class
inheritance that might point you in the right direction. Instead you get the following:

```ruby
class Foo
  @bar = ...
  def method_missing(method, *args)
    @bar.send(method, *args)
  end
end
```

If you are like me, then the first question you may have is, "Author. Where. Are. My. **METHODS**?"

Then the old wise-sounding voice in your head would probably echo something vague in response like:

```
Seek not what lies before your eyes.
```

And you would thus be enlightened.


## Method Missing

The secret to this mystery lies, of course, in Ruby's
[`method_missing`](https://apidock.com/ruby/BasicObject/method_missing) method. Normally, when a
method call is made to an object that does not define that method, `NoMethodError` is thrown.
However, by implementing `method_missing`, one is able to essentially catch calls before they fall
by specifying behavior that gets executed dynamically at runtime. For instance, in our toy example,
`method_missing` catches method calls in `Foo`, gets the method's id, and uses
[`send`](https://apidock.com/ruby/Object/send) to redirect the method call to `@bar` instead.

A major use of `method_missing` seems to be in providing concise implementations of
[delegation](https://en.wikipedia.org/wiki/Delegation_(object-oriented_programming)) (our
snippet above is actually an example of this). Delegation usually is more verbose. For instance,
in Java, one would have to manually redefine every method being delegated in the parent's class to
achieve the same functionality. Ruby's `method_missing` seems to make the whole affair shorter to
write and easier to maintain.

Another interesting application of `method_missing` is in creating
[domain-specific languages](https://en.wikipedia.org/wiki/Domain-specific_language) (DSLs)
by parsing method names. As an example, Kim Bekkelund has a very concise
[XML DSL implementation](https://gist.github.com/kimjoar/2773597) using `method_missing`.

`method_missing` is also more generally a case of
[metaprogramming](https://en.wikipedia.org/wiki/Metaprogramming), a feature of some languages that
allows code to be treated as data. While metaprogramming is not limited to Ruby, Ruby seems to be
particularly (in)famous for it.


## A Hypothetical Pitfall

Like all things `method_missing` can be overused and abused. For one, `method_missing` has very high
reach since it can respond to any undefined method. Sometimes, this can lead to unexpected behavior.

Let's contrive an example. Suppose we are making a dictionary API. We love `method_missing`
for some reason and decide to use it to write our dictionary:

```ruby
class DictionaryAPI
  def method_missing(method, *args)
    method_name = method.to_s
    if method_name.match(/^define_/)
      term = method_name.sub('define_', '')
      return {
        :term => term,
        :definition => @external_source.retrieve_definition(term),
      }
    else
      raise NoMethodError
    end
  end
end
```

Our dictionary parses terms from method calls of the form `define_{TERM}` and then retrieves
the definitions from an external source before returning a response.

This works fine for most common words:

```ruby
d = Dictionary.new
puts d.define_dog

# { :term => "dog", :definition => ... }
```

But what if someone decides they want to find the definition for the term "singleton_method"?:

```ruby
puts d.define_singleton_method

# dictionary.rb:18:in `define_singleton_method': wrong number of arguments (given 0, expected 1..2) (ArgumentError)
#        from dictionary.rb:18:in `<main>'
```

Oops, [`define_singleton_method`](https://apidock.com/ruby/Object/define_singleton_method)
is a method that already exists for all objects. Back to the drawing board...

This example is admittedly contrived. In this case, Ruby has also stopped us
very quickly because the function arity differs, so little harm was done.
However, what if this API existed at a larger scale? Perhaps `DictionaryAPI` inherits
from a long line of ancestors, and we had a method name that silently collided with a
name from one of the ancestors. Perhaps there is no collision now, but there will be one in the
future due to a change in an ancestor.

Furthermore, it would be hard to catch this collision in testing since most people would just test
common words like "dog" and see expected functionality. And what happens once someone does
eventually discover the collision? The whole API needs to change. What if we end up colliding again
with something else after the changes?

The main issue is that although name collision itself is not specific to `method_missing`, by using
`method_missing`, we open up the potential to collide with an infinite number of function
names rather than just one we manually defined.

Because of this, I feel that `method_missing` and metaprogramming overall are double-edged swords.
Metaprogramming opens a lot of doors. On one hand, it allows for a crazy amount of functionality
to be implemented with very little code. On the other hand, using metaprogramming haphazardly can
lead to a lot of unforeseen issues, such as the method name collision scenario. This means that
much more care and attention needs to be taken when using it, and these mental acrobatics may
not be worth the benefits of metaprogramming at the end of the day.