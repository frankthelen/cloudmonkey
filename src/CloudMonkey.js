const assert = require('assert');
const util = require('util');
const select = require('./select');
const decorate = require('./decorate');
const S3 = require('./services/S3');
const EC2 = require('./services/EC2');
const { version } = require('../package.json');

class CloudMonkey {
  constructor() {
    this.name = 'CloudMonkey';
    this.version = version;
    this.decorator = 'cloudMonkey';
    this.services = {};
    this.select = select({ owner: this, services: this.services });
  }

  register(service) {
    const { name } = service;
    assert(name, '"name" is required');
    assert(!this.services[name], '"name" is not unique, please use "alias"');
    this.services[name] = service;
  }

  help() {
    const out = console.log; // eslint-disable-line no-console
    out(`${this.name} ${this.version}`);
    out();
    Object.values(this.services).forEach(service => service.help());
  }

  selectFilter({ resourceType, one }) {
    return async (filters = {}) => {
      const supported = resourceType.filters;
      const unsupported = Object.keys(filters).filter(key => !supported.includes(key));
      if (unsupported.length) {
        return Promise.reject(new Error(`unsupported filters: ${unsupported}`));
      }
      const list = await resourceType.list(filters);
      if (!list) {
        return Promise.reject(new Error('no resources found'));
      }
      if (one) {
        if (list.length === 0) {
          return Promise.reject(new Error('no resources found'));
        }
        if (list.length === 1) {
          return Promise.resolve(decorate({ data: list[0], owner: this }));
        }
        return Promise.reject(new Error('one resource expected but multiple found'));
      }
      return Promise.resolve(list.map(data => decorate({ data, owner: this })));
    };
  }

  dataDump(data) { // eslint-disable-line class-methods-use-this
    const out = console.log; // eslint-disable-line no-console
    out(util.inspect(data, { depth: null }));
  }
}

module.exports = { CloudMonkey, S3, EC2 };
