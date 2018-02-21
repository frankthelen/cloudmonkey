const dataInterface = ({ owner, data }) => ({
  data,
  dump: () => owner.dump(data),
});

module.exports = ({ owner, data }) => dataInterface({ owner, data });
