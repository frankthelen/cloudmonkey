const assert = require('assert');
const AWS = require('aws-sdk');
const Service = require('../Service');

class S3 extends Service {
  constructor({ region, alias } = {}) {
    super({ name: 's3', alias });
    assert(region, '"region" is required');
    this.aws = new AWS.S3({ apiVersion: '2006-03-01', region });
    this.register({
      name: 'bucket',
      list: async () => {
        const data = await this.aws.listBuckets().promise();
        return data.Buckets;
      },
      filters: {
        name: (item, value) => item.Name === value,
      },
      identity: item => item.Name,
    });
  }
}

module.exports = S3;
