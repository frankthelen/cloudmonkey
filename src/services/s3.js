const AWS = require('aws-sdk');

const s3 = new AWS.S3({ apiVersion: '2006-03-01', region: 'eu-central-1' });

const service = {
  resourceTypes: {
    bucket: {
      filters: ['name'],
      list: async ({ name } = {}) => {
        const data = await s3.listBuckets().promise();
        const { Buckets } = data;
        return name ? Buckets.filter(bucket => bucket.Name === name) : Buckets;
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
