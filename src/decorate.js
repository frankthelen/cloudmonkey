// Build 'data' interface for resource data objects.
// Examples:
// * data.dump();
// * data.cloudMonkey.dump();
// * data.travel.to.all.routeTables();
// * data.cloudMonkey.travel.to.all.routeTables();

const travelInterface = ({ monkey, service, resourceType, array, one }) => ({
  get: (target, prop) => { // trap
    const alt = prop.match(/^(.+)s$/) ? prop.slice(0, -1) : prop; // singular if plural
    const travelResourceType = service.resourceTypes[prop] || service.resourceTypes[alt];
    if (!travelResourceType) {
      throw new Error(`invalid travel syntax, unknown resource type: "${prop}"`);
    }
    const travelFunction = resourceType.travel[prop] || resourceType.travel[alt];
    if (!travelFunction) {
      throw new Error(`invalid travel syntax, resource type not allowed: "${prop}"`);
    }
    return monkey.dataTravel({
      data: target, service, resourceType: travelResourceType, travelFunction, array, one,
    });
  },
});

const quantifierInterface = ({ monkey, service, resourceType, array }) => ({
  get: (target, prop) => { // trap
    if (prop === 'one') { // eslint-disable-next-line max-len
      return new Proxy(target, travelInterface({ monkey, service, resourceType, array, one: true }));
    }
    if (prop === 'all' || prop === 'some') {
      return new Proxy(target, travelInterface({ monkey, service, resourceType, array }));
    }
    throw new Error(`invalid travel syntax, unknown quantifier: "${prop}"`);
  },
});

const toInterface = ({ monkey, service, resourceType, array }) => ({
  get: (target, prop) => { // trap
    if (prop === 'to') {
      return new Proxy(target, quantifierInterface({ monkey, service, resourceType, array }));
    }
    throw new Error(`invalid travel syntax, "to" expected but "${prop}" found`);
  },
});

const dataInterface = ({ monkey, data, service, resourceType, array }) => ({
  dump: () => {
    monkey.dataDump(data);
  },
  travel: new Proxy(data, toInterface({ monkey, service, resourceType, array })),
});

const decorator = ({ monkey, service, resourceType, array }) => ({
  get: (target, prop) => { // trap
    if (prop === monkey.decorator) {
      return dataInterface({ monkey, data: target, service, resourceType, array });
    }
    if (['dump', 'travel'].includes(prop)
      && !Object.prototype.hasOwnProperty.call(target, prop)) {
      return dataInterface({ monkey, data: target, service, resourceType, array })[prop];
    }
    return target[prop];
  },
});

module.exports = ({
  monkey, data, service, resourceType, array,
}) => new Proxy(data, decorator({ monkey, service, resourceType, array }));
