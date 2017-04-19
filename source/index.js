'use strict';

let config = {
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

    return constructor;
  }
);

const bindAllTo = accessor => (
  (instance) => {
    const constructor = Object.getPrototypeOf(instance).constructor;
    const propMap = accessor(constructor);

    Object.keys(propMap).forEach((name) => {
      const prop = propMap[name];

      // Skip non-methods
      if (!(prop instanceof Function)) return;

      accessor(instance)[name] = prop.bind(instance);
    });

    return instance;
  }
);

const makeMine = () => {
  const map = new WeakMap();

  const accessor = function (object) {
    if (!map.has(object)) map.set(object, {});
    return map.get(object);
  };

  accessor.restrict = restrictTo(accessor);
  accessor.bindAllTo = bindAllTo(accessor);
  return accessor;
};

const findConfigErrors = (newConfig) => {
  const validPrefixTypes = ['string', 'undefined'];
  const prefixProps = ['privatePrefix', 'protectedPrefix'];
  const errors = [];

  // Config must be a valid object
  if (typeof newConfig !== 'object') {
    errors.push('Configuration must be an object');
    return errors;
  }

  prefixProps.forEach((prop) => {
    // Check prefix types
    if (!validPrefixTypes.includes(typeof newConfig[prop])) {
      errors.push(`${prop} must be a string if provided`);
    }

    // Prefixes may not be blank strings
    if (newConfig[prop] === '') {
      errors.push(`Invalid prefix for ${prop}: Prefix may not be a blank string`);
    }
  });

  // Prefixes may not be the same
  const priv = newConfig.privatePrefix;
  const prot = newConfig.protectedPrefix;
  if (priv && prot && priv === prot) {
    errors.push('Invalid prefixes: Prefixes may not be the same');
  }

  return `Invalid configuration - ${errors.join('; ')}.`;
};

const configure = (newConfig) => {
  const errors = findConfigErrors(newConfig);
  if (errors.length > 0) throw new Error(errors);
  config = Object.assign({}, this.config, newConfig);
};

module.exports = {
  makeMine,
  configure,
};
