const select = require('./select');

class CloudTest {
  constructor(services = {}) {
    this.services = services;
    this.select = select({ owner: this, services });
  }

  info() {
    Object.entries(this.services).forEach(([name, service]) => {
      const { resourceTypes } = service;
      const resourceTypeNames = Object.keys(resourceTypes);
      console.log(name, ' -> ', resourceTypeNames); // eslint-disable-line no-console
    });
  }

  selectFilter({ resourceType, one }) { // eslint-disable-line class-methods-use-this
    return async (filter) => {
      const list = await resourceType.list(filter);
      if (!list) {
        return Promise.reject(new Error('no data'));
      }
      if (one) {
        if (list.length === 0) {
          return Promise.reject(new Error('no data'));
        }
        if (list.length === 1) {
          return Promise.resolve(list[0]);
        }
        return Promise.reject(new Error('one resource expected but multiple received'));
      }
      return Promise.resolve(list);
    };
  }
}

module.exports = CloudTest;
