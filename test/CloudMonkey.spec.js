require('./test-helper');
const assert = require('assert');
const AWS = require('aws-sdk');
const { CloudMonkey, S3 } = require('..');
const mockS3ListBuckets = require('./mocks/buckets');

describe('CloudMonkey', () => {
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
    const cloudMonkey = new CloudMonkey();
    assert(cloudMonkey);
  });

  it('should register a new service', () => {
    const cloudMonkey = new CloudMonkey();
    cloudMonkey.register(new S3({ region: 'eu-central-1' }));
  });
});
