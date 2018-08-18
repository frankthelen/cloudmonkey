// Build 'select' interface for services and resourceTypes.
// Examples:
// * select.all.s3.buckets();
// * select.some.s3.buckets({ name: 'my-bucket' });
// * select.one.s3.bucket({ name: 'my-bucket' });

const resourceTypeInterface = ({ monkey, service, one }) => ({
  get: (target, prop) => { // trap
    const alt = prop.match(/^(.+)s$/) ? prop.slice(0, -1) : prop; // singular if plural
    const resourceType = service.resourceTypes[prop] || service.resourceTypes[alt];
    if (!resourceType) {
      throw new Error(`invalid select syntax, unknown resource type: "${prop}"`);
    }
    return monkey.selectResource({ service, resourceType, one });
  },
});

const serviceInterface = ({ monkey, one }) => ({
  get: (target, prop) => { // trap
    const service = monkey.services[prop];
    if (!service) {
      throw new Error(`invalid select syntax, unknown service: "${prop}"`);
    }
    return new Proxy({}, resourceTypeInterface({ monkey, service, one }));
  },
});

const quantifierInterface = ({ monkey }) => ({
  get: (target, prop) => { // trap
    if (prop === 'one') {
      return new Proxy({}, serviceInterface({ monkey, one: true }));
    }
    if (prop === 'all' || prop === 'some') {
      return new Proxy({}, serviceInterface({ monkey }));
    }
    throw new Error(`invalid select syntax, unknown quantifier: "${prop}"`);
  },
});

module.exports = ({ monkey }) => new Proxy({}, quantifierInterface({ monkey }));
