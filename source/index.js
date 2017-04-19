'use strict';

const config = {
  privatePrefix: '_',
  protectedPrefix: '$',
};

const restrictTo = accessor => (
  (constructor) => {
    const propNames = Object.getOwnPropertyNames(constructor.prototype);

    propNames.forEach((name) => {
      const prop = constructor.prototype[name];

      // Skip non-methods and constructor
      if (!(prop instanceof Function) || prop === constructor) return;

      // Handle private methods
      if (name.substr(0, 1) === config.privatePrefix) {
        accessor(constructor)[name.substr(1)] = prop;
        delete constructor.prototype[name];
      }
    });
  }
);

const bindTo = accessor => (
  (instance) => {
    const constructor = Object.getPrototypeOf(instance).constructor;
    const propMap = accessor(constructor);

    Object.keys(propMap).forEach((name) => {
      const prop = propMap[name];

      // Skip non-methods
      if (!(prop instanceof Function)) return;

      accessor(instance)[name] = prop.bind(instance);
    });
  }
);

const makeMine = () => {
  const map = new WeakMap();

  const accessor = function (object) {
    if (!map.has(object)) map.set(object, {});
    return map.get(object);
  };

  accessor.restrict = restrictTo(accessor);
  accessor.bindTo = bindTo(accessor);
  return accessor;
};

module.exports = {
  makeMine,
};
