const assert = require('assert');
const AWS = require('aws-sdk');
const Service = require('../Service');

class EC2 extends Service {
  constructor({ region, alias } = {}) {
    super({ name: 'ec2', alias });
    assert(region, '"region" is required');
    this.aws = new AWS.EC2({ apiVersion: '2016-11-15', region });
    this.register({
      name: 'instance',
      filters: ['id'],
      list: async ({ id }) => {
        const params = {
          MaxResults: 1000, // TODO: paging
        };
        const data = await this.aws.describeInstances(params).promise();
        return data.Reservations.reduce((acc, res) => [...acc, ...res.Instances], [])
          .filter(item => !id || item.InstanceId === id);
      },
      identity: item => item.InstanceId,
    });
    this.register({
      name: 'internetGateway',
      filters: ['id'],
      list: async ({ id }) => {
        const params = {};
        const data = await this.aws.describeInternetGateways(params).promise();
        return data.InternetGateways
          .filter(item => !id || item.InternetGatewayId === id);
      },
      identity: item => item.InternetGatewayId,
      travel: {
        routeTable: async () => Promise.resolve([]), // TODO: travel internetGateway -> routeTable
      },
    });
    this.register({
      name: 'routeTable',
      filters: ['id'],
      list: async ({ id }) => {
        const params = {};
        const data = await this.aws.describeRouteTables(params).promise();
        return data.RouteTables
          .filter(item => !id || item.RouteTableId === id);
      },
      identity: item => item.RouteTableId,
    });
    this.register({
      name: 'securityGroup',
      filters: ['id', 'name'],
      list: async ({ id, name }) => {
        const params = {
          MaxResults: 1000, // TODO: paging
        };
        const data = await this.aws.describeSecurityGroups(params).promise();
        return data.SecurityGroups
          .filter(item => !id || item.GroupId === id)
          .filter(item => !name || item.GroupName === name);
      },
      identity: item => item.GroupName,
    });
    this.register({
      name: 'subnet',
      filters: ['id'],
      list: async ({ id }) => {
        const params = {};
        const data = await this.aws.describeSubnets(params).promise();
        return data.Subnets
          .filter(item => !id || item.SubnetId === id);
      },
      identity: item => item.SubnetId,
    });
  }
}

module.exports = EC2;
