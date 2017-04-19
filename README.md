# ES6 Class Privates

Provides a method of converting underscored pseudo-private class members into
truly private class members via `WeakMap`.


## Status

Developer preview / proof of concept / idea phase.

Not production tested, yet.  Interface could change drastically, and I plan on
adding an admittedly hacked way of doing protected methods as well.


## Requirements and Install

Currently requires node.js >= 6.0.0

```sh
npm install --save es6-class-privates
```

## Why?

In many Javascript projects, so-called private/protected methods are actually
public methods prefixed with an underscore. This may tempt even good-intending
developers into violating encapsulation for the short-term gains despite the
long-term fragility it creates. In fact, a central tenet of object-oriented
programming is that private/protected class internals should be able to change
without breaking anything other than that class itself (and for protected class
members, child-classes as well).

When a private or protected class member is accessed directly outside of the
class (which violates encapsulation), the dependent code will break when the
private/protected class internals are removed, renamed, or otherwise change
behavior. This practice therefore leads to fragility, and should be discouraged.

*Eric Elliott*: "Underscores are a bad idea. Newbies don't know what they mean,
and advanced users think they don't apply to them. Changes break things."
[(1)](https://twitter.com/_ericelliott/status/854532899239886848)

*Joe Lencioni from Airbnb* (on why underscored pseudo-privates are bad): "They
give people a false sense of 'private'ness that could lead to bugs."
[(2)](https://github.com/airbnb/javascript/issues/1024)

*Jordan Harband from Airbnb* (same discussion): "Private means inaccessible. Your
intent to privacy is irrelevant if the value is reachable, ie public. For
example, *npm broke node once by removing an underscore-prefixed variable*."
[(2)](https://github.com/airbnb/javascript/issues/1024)

Unfortunately, once you've got a codebase filled with underscored pseudo-privates,
it can be difficult to find a workable path back to true private class members.

Moving private methods into module scope and calling with a modified context
(via `call`, `apply`, or the new bind operator `::`) is a great approach, but
some people feel it leaves these methods disconnected from the class.

Typescript has `private` and `protected` keywords, and they work great, but
switching from Javascript to Typescript is a major undertaking and buy-in can be
difficult to gain from stakeholders.

Symbols work well, but can feel kludgy.  WeakMaps work well for private state,
but are very awkward for private methods.  And all of these solutions require a
ton of work to implement.

This package is intended to be an _easy_ and _pragmatic_ solution to this
all-too-common problem.


## General use

```
const my = require('es6-class-privates').makeMine();

class HelloWorld {
  constructor() {
    my.bindAllTo(this);
    my(this).privateProperty = 'Hello world';
    my(this).privateMethod();
  }

  _privateMethod() {
    console.log(my(this).privateProperty);
  }
}

module.exports = my.restrict(HelloWorld);
```


## API

### `makeMine()`

Produces a WeakMap-based method that returns a map for the Object given.

*Example:* See "General Use" section, above.

### `configure(config : Object)

Allows global reconfiguration of this package's behavior.  All configuration
options are optional, and excluded properties will not modify the configuration.
All prefixes must be non-zero-length strings or `undefined`.  Prefixes cannot
match.


#### Configuration options

* `protectedPrefix` : `String`
The characters at the beginning of a class member name indicating that it
is `protected`.  Default value is `'$'`.

* `privatePrefix` : `String`
The characters at the beginning of a class member name indicating that it
is `private`.  Default value is `'_'`.

* `dropPrefix` : `Boolean`
Whether to include the class member name prefix when restricting the class.
Default value is `true`.


#### Example
```
require('es6-class-privates').configure({
  protectedPrefix: '_',
  privatePrefix: '__',
  dropPrefix: false,
});
```


## Run tests

``
git clone git@github.com:dash-/es6-class-privates.git
cd es6-class-privates
npm test
```
