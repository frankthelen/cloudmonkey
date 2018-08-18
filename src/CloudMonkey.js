const assert = require('assert');
const util = require('util');
const Promise = require('bluebird');
const select = require('./select');
const decorate = require('./decorate');
const Service = require('./Service');
const { version } = require('../package.json');

/* eslint-disable class-methods-use-this */

class CloudMonkey {
  constructor() {
    this.name = 'CloudMonkey';
    this.version = version;
    this.decorator = 'cloudMonkey';
    this.services = {};
    this.select = select({ monkey: this });
  }

  register(service) {
    assert(service instanceof Service, 'service must be an instance of Service');
    const { name } = service;
    assert(name, '"name" is required');
    assert(!this.services[name], '"name" is not unique, please use "alias"');
    this.services[name] = service;
  }

  help(outln = console.log) { // eslint-disable-line no-console
    outln(`${this.name} ${this.version}`);
    outln();
    Object.values(this.services).forEach(service => service.help(outln));
  }

  selectResource({ service, resourceType, one }) {
    return async (filters = {}) => Promise.try(async () => {
      const listComplete = await resourceType.list();
      const listFiltered = this.dataFilter({ list: listComplete, resourceType, filters });
      const listDecorated = this.dataDecorate({ list: listFiltered, one, service, resourceType });
      return listDecorated;
    });
  }

  dataTravel({ data, array, service, resourceType, travelFunction, one }) {
    return async (filters = {}) => Promise.try(async () => {
      const listComplete = await travelFunction(array ? data : [data]);
      const listFiltered = this.dataFilter({ list: listComplete, resourceType, filters });
      const listDecorated = this.dataDecorate({ list: listFiltered, one, service, resourceType });
      return listDecorated;
    });
  }

  dataFilter({ list, resourceType, filters }) {
    return Object.entries(filters).reduce((acc, [filter, value]) => {
      const filterFunction = resourceType.filters[filter];
      if (!filterFunction) {
        throw new Error(`unsupported filter: ${filter}`);
      }
      return acc.filter(item => filterFunction(item, value));
    }, list);
  }

  dataDecorate({ list, one, service, resourceType }) {
    if (one) {
      if (list.length === 0) {
        throw new Error('one resource expected but none found');
      }
      if (list.length === 1) {
        return decorate({ data: list[0], service, resourceType, monkey: this });
      }
      throw new Error('one resource expected but more than one found');
    }
    return decorate({
      data: list.map(item => decorate({ data: item, service, resourceType, monkey: this })),
      service,
      resourceType,
      array: true,
      monkey: this,
    });
  }

  dataDump(data) {
    console.log(util.inspect(data, { depth: null })); // eslint-disable-line no-console
  }
}

module.exports = CloudMonkey;
