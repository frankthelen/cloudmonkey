// Build 'select' interface for services and resourceTypes.
// Examples:
// * select.all.s3.buckets();
// * select.some.s3.buckets({ name: 'my-bucket' });
// * select.one.s3.bucket({ name: 'my-bucket' });

const resourceTypeInterface = ({ monkey, service, all, some, one }) => ({
  get: (target, prop) => { // trap
    const alt = prop.match(/^(.+)s$/) ? prop.slice(0, -1) : prop; // singular if plural
    const resourceType = service.resourceTypes[prop] || service.resourceTypes[alt];
    if (!resourceType) {
      throw new Error(`invalid select, unknown resource type: "${prop}"`);
    }
    return monkey.selectResource({ service, resourceType, all, some, one });
  },
});

const serviceInterface = ({ monkey, all, some, one }) => ({
  get: (target, prop) => { // trap
    const service = monkey.services[prop];
    if (!service) {
      throw new Error(`invalid select, unknown service: "${prop}"`);
    }
    return new Proxy({}, resourceTypeInterface({ monkey, service, all, some, one }));
  },
});

const selectInterface = ({ monkey }) => ({
  get: (target, prop) => { // trap
    if (prop === 'one') {
      return new Proxy({}, serviceInterface({ monkey, one: true }));
    } else if (prop === 'all') {
      return new Proxy({}, serviceInterface({ monkey, all: true }));
    } else if (prop === 'some') {
      return new Proxy({}, serviceInterface({ monkey, some: true }));
    }
    throw new Error(`invalid select, unknown quantifier: "${prop}"`);
  },
});

module.exports = ({ monkey }) =>
  new Proxy({}, selectInterface({ monkey }));
