'use strict';

const classPrivates = require('..');

const testClass = function (my) {
  class Test {
    constructor() {
      my.bindTo(this);
    }
    /* eslint-disable class-methods-use-this */
    _privateMethod() { }
    $protectedMethod() { }
    publicMethod() { }
    /* eslint-enable class-methods-use-this */
  }
  my.restrict(Test);

  return Test;
};

describe('Privates', () => {
  it('should make underscored functions private', (done) => {
    const my = classPrivates.makeMine();
    const Test = testClass(my);

    const test = new Test();
    expect(test._privateMethod).toBeUndefined(); // eslint-disable-line no-undef

    done();
  });

  it('should make underscored functions accessible via `my`', (done) => {
    const my = classPrivates.makeMine();
    const Test = testClass(my);

    expect(my(Test).privateMethod).toBeInstanceOf(Function); // eslint-disable-line no-undef

    done();
  });

  it('should allow restricted access to private variables', (done) => {
    const my = classPrivates.makeMine();
    class Test {
      constructor() {
        my.bindTo(this);
        my(this).privateVariable = 'test';
      }
      _privateMethod() {
        return my(this).privateVariable;
      }
      publicMethod() {
        return my(this).privateMethod();
      }
    }
    my.restrict(Test);

    const test = new Test();

    expect(test.publicMethod()).toBe('test'); // eslint-disable-line no-undef

    done();
  });
});
