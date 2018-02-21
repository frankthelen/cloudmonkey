const AWS = require('aws-sdk');

const s3 = new AWS.S3({ apiVersion: '2006-03-01', region: 'eu-central-1' });

const service = {
  resourceTypes: {
    bucket: {
      list: async ({ Name } = {}) => {
        const data = await s3.listBuckets().promise();
        const { Buckets } = data;
        return Name ? Buckets.filter(b => b.Name === Name) : Buckets;
      },
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
