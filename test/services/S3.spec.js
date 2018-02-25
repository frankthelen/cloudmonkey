require('../test-helper');
const assert = require('assert');
const AWS = require('@mapbox/mock-aws-sdk-js');
const { CloudMonkey, S3 } = require('../..');
const mockListBuckets = require('../mocks/buckets');

describe('S3', () => {
  before(() => {
    AWS.stub('S3', 'listBuckets').returns({
      promise: () => {
        return Promise.resolve(mockListBuckets);
      },
    });
  });

  after(() => {
    AWS.S3.restore();
  });

  it('should create a new instance', () => {
    const s3 = new S3({ region: 'eu-central-1' });
    assert(s3);
  });

  it('should throw error if "region" is missing', () => {
    expect(() => { new S3(); }).to.throw(Error); // eslint-disable-line no-new
  });

  describe('select interface', () => {
    let monkey;

    before(() => {
      monkey = new CloudMonkey();
      monkey.register(new S3({ region: 'eu-central-1' }));
    });

    it('`all.s3.buckets` should return an array', async () => {
      const data = await monkey.select.all.s3.buckets()
        .should.be.fulfilled;
      expect(data).to.be.an('array').with.a.lengthOf(3);
    });

    it('`one.s3.bucket` should not return an array', async () => {
      const data = await monkey.select.one.s3.bucket({ name: 'test-badges' })
        .should.be.fulfilled;
      expect(data).to.not.be.an('array');
    });

    it('`one.s3.bucket` should fail if multiple resources', async () => {
      await monkey.select.one.s3.bucket()
        .should.be.rejected;
    });

    it('`one.s3.bucket` should fail if nothing found', async () => {
      await monkey.select.one.s3.bucket({ name: 'bla' })
        .should.be.rejected;
    });

    it('`some.s3.buckets` should return a filtered array', async () => {
      const data = await monkey.select.some.s3.buckets({ name: 'test-badges' })
        .should.be.fulfilled;
      expect(data).to.be.an('array').with.a.lengthOf(1);
    });

    it('`some.s3.buckets` should fail if unknown filter', async () => {
      await monkey.select.some.s3.buckets({ bla: 'bla' })
        .should.be.rejected;
    });

    it('`bla.s3.buckets` should throw because unknown syntax', async () => {
      expect(() => { monkey.select.bla.s3.buckets(); })
        .to.throw(Error);
    });

    it('`one.bla.bucket` should throw because unknown service', async () => {
      expect(() => { monkey.select.one.bla.bucket(); })
        .to.throw(Error);
    });

    it('`all.s3.bla` should throw because unknown resource type', async () => {
      expect(() => { monkey.select.all.s3.bla(); })
        .to.throw(Error);
    });
  });

  describe('data interface', () => {
    let monkey;

    before(async () => {
      monkey = new CloudMonkey();
      monkey.register(new S3({ region: 'eu-central-1' }));
    });

    it('should decorate', async () => {
      const data = await monkey.select.one.s3.bucket({ name: 'test-badges' });
      expect(data.cloudMonkey).has.property('dump');
    });

    it('should decorate / provide shortcuts', async () => {
      const data = await monkey.select.one.s3.bucket({ name: 'test-badges' });
      expect(data.dump).to.be.a('function');
    });

    it('should decorate but fail if conflicting with own property', async () => {
      const data = await monkey.select.one.s3.bucket({ name: 'test-badges' });
      data.dump = () => {};
      expect(() => { data.dump(); }).to.throw(Error);
    });
  });
});
