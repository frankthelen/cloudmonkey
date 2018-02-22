const select = require('./select');
const decorate = require('./decorate');
const util = require('util');

class CloudTest {
  constructor() {
    this.services = {};
    this.select = select({ owner: this, services: this.services });
  }

  register(service) {
    const { name } = service;
    this.services[name] = service;
  }

  help() {
    Object.values(this.services).forEach(service => service.help());
  }

  selectFilter({ resourceType, one }) { // eslint-disable-line class-methods-use-this
    return async (filters = {}) => {
      const supported = resourceType.filters || [];
      const unsupported = Object.keys(filters).filter(key => !supported.includes(key));
      if (unsupported.length) {
        return Promise.reject(new Error(`unsupported filters: ${unsupported}`));
      }
      const list = await resourceType.list(filters);
      if (!list) {
        return Promise.reject(new Error('no resource found'));
      }
      if (one) {
        if (list.length === 0) {
          return Promise.reject(new Error('no resource found'));
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
    console.log(util.inspect(data, { depth: null })); // eslint-disable-line no-console
  }
}

module.exports = CloudTest;
