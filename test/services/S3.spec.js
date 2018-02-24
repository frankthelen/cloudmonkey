require('../test-helper');
const assert = require('assert');
const AWS = require('aws-sdk');
const { S3 } = require('../..');
const mockS3ListBuckets = require('../mocks/buckets');

describe('S3', () => {
  before(async () => {
    sinon.stub(AWS.S3.prototype, 'constructor').returns({
      listBuckets: () => ({
        promise: () => Promise.resolve(mockS3ListBuckets),
      }),
    });
  });

  after(() => {
    AWS.S3.prototype.constructor();
  });

  it('should create a new instance', () => {
    const s3 = new S3({ region: 'eu-central-1' });
    assert(s3);
  });
});
