const assert = require('assert');

class Service {
  constructor({ name, alias }) {
    this.name = alias || name;
    assert(this.name, '"name" or "alias" is required');
    this.resourceTypes = {};
  }

  register({ name, filters = [], list }) {
    assert(name, '"name" is required');
    assert(list, '"list" is required');
    assert(typeof list === 'function', '"list" must be an async function');
    this.resourceTypes[name] = {
      filters,
      list,
    };
  }

  help() { /* eslint-disable no-console */
    console.log(`# ${this.name}`);
    Object.entries(this.resourceTypes).forEach(([name, resourceType]) => {
      const { filters } = resourceType;
      console.log(`- ${name} / ${filters.length ? 'filter by ' : ''}${filters}`);
    });
  } /* eslint-enable no-console */
}

module.exports = Service;
