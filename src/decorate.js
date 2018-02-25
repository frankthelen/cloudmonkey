// Build 'data' interface for resource data objects.
// Examples:
// * data.dump();
// * data.cloudMonkey.dump();
// * data.travel.routeTables();
// * data.cloudMonkey.travel.routeTables();

const travelInterface = ({ monkey, service, resourceType, array }) => ({
  get: (target, prop) => { // trap
    const alt = prop.match(/^(.+)s$/) ? prop.slice(0, -1) : prop; // singular if plural
    const travelResourceType = service.resourceTypes[prop] || service.resourceTypes[alt];
    if (!travelResourceType) {
      throw new Error(`invalid travel, unknown resource type: "${prop}"`);
    }
    const travelFunction = resourceType.travel[prop] || resourceType.travel[alt];
    if (!travelFunction) {
      throw new Error(`invalid travel, resource type not allowed: "${prop}"`);
    }
    return monkey.dataTravel({
      data: target, resourceType, travelResourceType, travelFunction, array,
    });
  },
});

const dataInterface = ({ monkey, data, service, resourceType, array }) => ({
  dump: () => {
    monkey.dataDump(data);
  },
  travel: new Proxy(data, travelInterface({ monkey, service, resourceType, array })),
});

const decorator = ({ monkey, service, resourceType, array }) => ({
  get: (target, prop) => { // trap
    if (prop === monkey.decorator) {
      return dataInterface({ monkey, data: target, service, resourceType, array });
    }
    if (['dump', 'travel'].includes(prop)) {
      if (Object.prototype.hasOwnProperty.call(target, prop)) {
        throw new Error(
          `target has own property "${prop}", use "${monkey.decorator}.${prop}" instead`
        );
      }
      return dataInterface({ monkey, data: target, service, resourceType, array })[prop];
    }
    return target[prop];
  },
});

module.exports = ({ monkey, data, service, resourceType, array }) =>
  new Proxy(data, decorator({ monkey, service, resourceType, array }));
