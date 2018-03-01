require('../test-helper');
const assert = require('assert');
const AWS = require('@mapbox/mock-aws-sdk-js');
const { CloudMonkey, EC2 } = require('../..');
const mockDescribeInternetGateways = require('../mocks/internetGateways');
const mockDescribeRouteTables = require('../mocks/routeTables');

describe('EC2', () => {
  before(() => {
    AWS.stub('EC2', 'describeInternetGateways').returns({
      promise: () => {
        return Promise.resolve(mockDescribeInternetGateways);
      },
    });
    AWS.stub('EC2', 'describeRouteTables').returns({
      promise: () => {
        return Promise.resolve(mockDescribeRouteTables);
      },
    });
  });

  after(() => {
    AWS.EC2.restore();
  });

  it('should create a new instance', () => {
    const s3 = new EC2({ region: 'eu-central-1' });
    assert(s3);
  });

  it('should throw error if "region" is missing', () => {
    expect(() => { new EC2(); }).to.throw(Error); // eslint-disable-line no-new
  });

  describe('select interface', () => {
    let monkey;

    before(() => {
      monkey = new CloudMonkey();
      monkey.register(new EC2({ region: 'eu-central-1' }));
    });

    it('`all.ec2.internetGateways` should return an array', async () => {
      const data = await monkey.select.all.ec2.internetGateways()
        .should.be.fulfilled;
      expect(data).to.be.an('array').with.a.lengthOf(1);
    });

    it('`one.ec2.internetGateway` should not return an array', async () => {
      const data = await monkey.select.one.ec2.internetGateway()
        .should.be.fulfilled;
      expect(data).to.not.be.an('array');
    });

    it('`one.ec2.internetGateway` should fail if nothing found', async () => {
      await monkey.select.one.ec2.internetGateway({ id: 'bla' })
        .should.be.rejected;
    });

    it('`some.ec2.internetGateways` should return a filtered array', async () => {
      const data = await monkey.select.some.ec2.internetGateways({ id: 'igw-78ef65f2' })
        .should.be.fulfilled;
      expect(data).to.be.an('array').with.a.lengthOf(1);
    });

    it('`some.ec2.internetGateways` should fail if unknown filter', async () => {
      await monkey.select.some.ec2.internetGateways({ bla: 'bla' })
        .should.be.rejected;
    });

    it('`all.ec2.routeTables` should return all route tables', async () => {
      const data = await monkey.select.all.ec2.routeTables();
      expect(data).to.be.an('array').with.a.lengthOf(2);
    });

    it('`some.ec2.routeTables` should return route tables / filter by id', async () => {
      const data = await monkey.select.some.ec2.routeTables({ id: 'rtb-e83ee289' });
      expect(data).to.be.an('array').with.a.lengthOf(1);
    });

    it('`one.ec2.routeTables` should return a route table / filter by id', async () => {
      const data = await monkey.select.one.ec2.routeTable({ id: 'rtb-e83ee289' });
      expect(data.RouteTableId).to.be.equal('rtb-e83ee289');
    });
  });

  describe('data interface', () => {
    let monkey;

    before(async () => {
      monkey = new CloudMonkey();
      monkey.register(new EC2({ region: 'eu-central-1' }));
    });

    it('`one.ec2.internetGateway` should be decorated / one', async () => {
      const data = await monkey.select.one.ec2.internetGateway();
      expect(data.cloudMonkey.dump).to.not.be.undefined;
      expect(data.cloudMonkey.travel).to.not.be.undefined;
    });

    it('`all.ec2.internetGateways` should be decorated / array', async () => {
      const data = await monkey.select.all.ec2.internetGateways();
      expect(data.cloudMonkey.dump).to.not.be.undefined;
      expect(data.cloudMonkey.travel).to.not.be.undefined;
    });

    it('`one.ec2.internetGateway` should be decorated with shortcuts / one', async () => {
      const data = await monkey.select.one.ec2.internetGateway();
      expect(data.dump).to.not.be.undefined;
      expect(data.travel).to.not.be.undefined;
    });

    it('`all.ec2.internetGateways` should be decorated with shortcuts / array', async () => {
      const data = await monkey.select.all.ec2.internetGateways();
      expect(data.dump).to.not.be.undefined;
      expect(data.travel).to.not.be.undefined;
    });

    it('own property should have higher priority', async () => {
      const data = await monkey.select.one.ec2.internetGateway();
      data.dump = 'blablub';
      expect(data.dump).to.be.a('string');
      expect(data.cloudMonkey.dump).to.be.a('function');
    });

    it('`travel` should travel from one internet gateway to all route tables', async () => {
      const igw = await monkey.select.one.ec2.internetGateway();
      const rt = await igw.travel.to.all.routeTables();
      expect(rt).to.be.an('array').with.a.lengthOf(1);
    });

    it('`travel` should travel from internet gateways to all route tables', async () => {
      const igw = await monkey.select.all.ec2.internetGateways();
      const rt = await igw.travel.to.all.routeTables();
      expect(rt).to.be.an('array').with.a.lengthOf(1);
    });
  });
});
