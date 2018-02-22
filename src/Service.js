const assert = require('assert');

class Service {
  constructor({ name, alias }) {
    this.name = alias || name;
    assert(this.name, 'service requires "name" or "alias"');
    this.resourceTypes = {};
  }

  register({ name, filters = [], list }) {
    assert(name, 'resource type requires a "name"');
    assert(list, 'resource type requires a "list" function');
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
