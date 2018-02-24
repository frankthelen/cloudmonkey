require('../test-helper');
const assert = require('assert');
const AWS = require('aws-sdk');
const { EC2 } = require('../..');
const mockS3ListBuckets = require('../mocks/buckets');

describe('EC2', () => {
  before(async () => {
    sinon.stub(AWS.EC2.prototype, 'constructor').returns({
      listBuckets: () => ({
        promise: () => Promise.resolve(mockS3ListBuckets),
      }),
    });
  });

  after(() => {
    AWS.EC2.prototype.constructor();
  });

  it('should create a new instance', () => {
    const s3 = new EC2({ region: 'eu-central-1' });
    assert(s3);
  });

  it('should throw error if "region" is missing', () => {
    expect(() => { new EC2(); }).to.throw(Error); // eslint-disable-line no-new
  });
});
