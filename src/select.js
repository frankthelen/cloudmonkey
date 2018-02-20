// build 'select' interface for all services and resourceTypes,
// e.g., select.all.s3.buckets();
//       select.some.s3.buckets({ Name: 'my-bucket' });
//       select.one.s3.bucket({ Name: 'my-bucket' });

const resourceTypeInterface = ({ owner, service, all, some, one }) => ({
  get: (target, prop) => {
    const plural = prop.match(/^(.+)s$/) ? prop.slice(0, -1) : prop;
    const resourceType = service.resourceTypes[prop] || service.resourceTypes[plural];
    if (!resourceType) {
      throw new Error(`Invalid select syntax, unknown resource type: "${prop}"`);
    }
    return owner.selectFilter({ service, resourceType, all, some, one });
  },
});

const serviceInterface = ({ owner, services, all, some, one }) => ({
  get: (target, prop) => {
    const service = services[prop];
    if (!service) {
      throw new Error(`Invalid select syntax, unknown service: "${prop}"`);
    }
    return new Proxy({}, resourceTypeInterface({ owner, service, all, some, one }));
  },
});

const selectInterface = ({ owner, services }) => ({
  get: (target, prop) => {
    if (prop === 'one') {
      return new Proxy({}, serviceInterface({ owner, services, one: true }));
    } else if (prop === 'all') {
      return new Proxy({}, serviceInterface({ owner, services, all: true }));
    } else if (prop === 'some') {
      return new Proxy({}, serviceInterface({ owner, services, some: true }));
    }
    throw new Error(`Invalid select syntax: "${prop}"`);
  },
});

module.exports = ({ owner, services }) => new Proxy({}, selectInterface({ owner, services }));
