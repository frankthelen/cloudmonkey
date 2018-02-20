const AWS = require('aws-sdk');

const s3 = new AWS.S3();

const service = {
  resourceTypes: {
    bucket: {
      list: async ({ Name }) => new Promise((resolve, reject) => {
        s3.listBuckets((err, data) => {
          if (err) return reject(err);
          if (!data) return reject();
          const { Buckets } = data;
          const filtered = Name ? Buckets.filter(b => b.Name === Name) : Buckets;
          return resolve(filtered);
        });
      }),
      details: {
        // inventoryConfigurations: async bucket =>
        //   listBucketInventoryConfigurations({ Bucket: bucket.Name }).InventoryConfigurations,
        // metricsConfigurations: async bucket =>
        //   listBucketMetricsConfigurations({ Bucket: bucket.Name }).MetricsConfigurations,
      },
    },
  },
};

module.exports = service;
