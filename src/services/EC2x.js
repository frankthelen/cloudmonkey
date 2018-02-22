const assert = require('assert');
const AWS = require('aws-sdk');
const Service = require('../Service');

class EC2 extends Service {
  constructor({ region, alias } = {}) {
    assert(region, '"region" is required');
    super({ name: 'ec2', alias });
    this.aws = new AWS.EC2({ apiVersion: '2016-11-15', region });
    this.register({
      name: 'instance',
      list: async () => {
        const params = {
          MaxResults: 1000, // TODO: paging
        };
        const data = await this.aws.describeInstances(params).promise();
        return data.Reservations.reduce((acc, res) => [...acc, ...res.Instances], []);
      },
    });
    this.register({
      name: 'internetGateway',
      list: async () => {
        const params = {};
        const data = await this.aws.describeInternetGateways(params).promise();
        return data.InternetGateways;
      },
    });
    this.register({
      name: 'routeTable',
      list: async () => {
        const params = {};
        const data = await this.aws.describeRouteTables(params).promise();
        return data.RouteTables;
      },
    });
    this.register({
      name: 'securityGroup',
      list: async () => {
        const params = {
          MaxResults: 1000, // TODO: paging
        };
        const data = await this.aws.describeSecurityGroups(params).promise();
        return data.SecurityGroups;
      },
    });
    this.register({
      name: 'subnet',
      list: async () => {
        const params = {};
        const data = await this.aws.describeSubnets(params).promise();
        return data.Subnets;
      },
    });
  }
}

module.exports = EC2;
