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

  help() {
    const out = console.log; // eslint-disable-line no-console
    out(`service "${this.name}"`);
    Object.entries(this.resourceTypes).forEach(([name, resourceType]) => {
      const { filters } = resourceType;
      out(`- resource type "${name}"`);
      if (filters.length) {
        const filtersStr = filters
          .reduce((acc, filter, i) => `${acc}${i ? ', ' : ''}"${filter}"`, '');
        out(`  filter by ${filtersStr}`);
      }
    });
    out();
  }
}

module.exports = Service;
