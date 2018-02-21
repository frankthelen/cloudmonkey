const dataInterface = ({ owner }) => ({
  get: (target, prop) => {
    if (prop === 'dump') {
      // TODO: check if conflicting with existing property
      return () => {
        owner.dataDump(target);
      };
    }
    return target[prop];
  },
});

module.exports = ({ owner, data }) => new Proxy(data, dataInterface({ owner }));
