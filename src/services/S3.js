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
      filters: ['name'],
      list: async ({ name } = {}) => {
        const data = await this.aws.listBuckets().promise();
        const { Buckets } = data;
        return name ? Buckets.filter(item => item.Name === name) : Buckets;
      },
    });
  }
}

module.exports = S3;
