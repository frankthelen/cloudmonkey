const assert = require('assert');

class Service {
  constructor({ name, alias }) {
    this.name = alias || name;
    assert(this.name, '"name" or "alias" is required');
    this.resourceTypes = {};
  }

  register({ name, list, filters = {}, travel = {}, identity }) {
    assert(name, '"name" is required');
    assert(list, '"list" is required');
    assert(typeof list === 'function', '"list" must be an async function');
    assert(identity, '"identity" is required');
    assert(typeof identity === 'function', '"identity" must be a function');
    this.resourceTypes[name] = {
      list,
      filters,
      travel,
      identity,
    };
  }

  help(outln = console.log) { // eslint-disable-line no-console
    outln(`service "${this.name}"`);
    Object.entries(this.resourceTypes).forEach(([name, resourceType]) => {
      outln(`- resource type "${name}"`);
      const filters = Object.keys(resourceType.filters);
      if (filters.length) {
        const filtersStr = filters
          .reduce((acc, filter, i) => `${acc}${i ? ', ' : ''}"${filter}"`, '');
        outln(`  filter by ${filtersStr}`);
      }
      const travel = Object.keys(resourceType.travel);
      if (travel.length) {
        const travelStr = travel
          .reduce((acc, rt, i) => `${acc}${i ? ', ' : ''}"${rt}"`, '');
        outln(`  travel to ${travelStr}`);
      }
    });
    outln();
  }
}

module.exports = Service;
