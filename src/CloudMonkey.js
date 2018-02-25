const _ = require('lodash');
const assert = require('assert');
const util = require('util');
const select = require('./select');
const decorate = require('./decorate');
const S3 = require('./services/S3');
const EC2 = require('./services/EC2');
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
    return async (filters = {}) => {
      const unsupportedFilters = Object.keys(filters)
        .reduce((acc, filter) => (resourceType.filters[filter] ? acc : [...acc, filter]), []);
      if (unsupportedFilters.length) {
        return Promise.reject(new Error(`unsupported filters: ${unsupportedFilters}`));
      }
      const listComplete = await resourceType.list();
      const list = Object.entries(filters).reduce((acc, [name, value]) => {
        const filterFunction = resourceType.filters[name];
        return acc.filter(item => filterFunction(item, value));
      }, listComplete);
      if (one) {
        if (list.length === 0) {
          return Promise.reject(new Error('one resource expected but none found'));
        }
        if (list.length === 1) {
          return Promise.resolve(
            decorate({ data: list[0], service, resourceType, monkey: this })
          );
        }
        return Promise.reject(new Error('one resource expected but multiple found'));
      }
      return Promise.resolve(
        decorate({
          data: list.map(item => decorate({ data: item, service, resourceType, monkey: this })),
          service,
          resourceType,
          array: true,
          monkey: this,
        })
      );
    };
  }

  dataTravel({ data, service, travelResourceType: resourceType, travelFunction, array }) {
    return async (filters = {}) => {
      const dataArray = array ? data : [data];
      const listPartitioned = await Promise.all(dataArray.map(item => travelFunction(item)));
      const list = _.unionBy(...listPartitioned, resourceType.identity);
      // TODO: Apply filters
      return Promise.resolve(
        decorate({
          data: list.map(item => decorate({ data: item, service, resourceType, monkey: this })),
          service,
          resourceType,
          array: true,
          monkey: this,
        })
      );
    };
  }

  dataDump(data) {
    console.log(util.inspect(data, { depth: null })); // eslint-disable-line no-console
  }
}

module.exports = { CloudMonkey, S3, EC2 };
