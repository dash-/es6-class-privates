# ES6 Class Privates

Provides a method of converting underscored pseudo-private class members into
truly private class members via `WeakMap`.


## Status

Developer preview / proof of concept / idea phase.

Not production tested, yet.  Interface could change drastically, and I plan on
adding an admittedly hacked way of doing protected methods as well.


## Install

```sh
npm install --save es6-class-privates
```

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
