const dataInterface = ({ owner, target }) => ({
  dump: () => {
    owner.dataDump(target);
  },
  // add further decorations here
});

const decorator = ({ owner }) => ({
  get: (target, prop) => {
    if (prop === owner.decorator) {
      return dataInterface({ owner, target });
    }
    const supported = ['dump']; // add further decorations here
    if (supported.includes(prop)) {
      if (Object.prototype.hasOwnProperty.call(target, prop)) {
        throw new Error(
          `object has own property "${prop}", use "${owner.decorator}.${prop}" instead`
        );
      }
      return dataInterface({ owner, target })[prop];
    }
    return target[prop];
  },
});

module.exports = ({ owner, data }) => new Proxy(data, decorator({ owner }));
