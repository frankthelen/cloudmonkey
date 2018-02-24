const dataInterface = ({ owner }) => ({
  get: (target, prop) => {
    if (prop === owner.decorator) {
      return {
        dump: () => {
          owner.dataDump(target);
        },
      };
    }
    if (prop === 'dump') {
      if (Object.prototype.hasOwnProperty.call(target, 'dump')) {
        throw new Error(
          `object has own property "${prop}", use "${owner.decorator}.${prop}" instead`
        );
      }
      return () => {
        owner.dataDump(target);
      };
    }
    return target[prop];
  },
});

module.exports = ({ owner, data }) => new Proxy(data, dataInterface({ owner }));
