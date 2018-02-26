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
      list: async () => {
        const params = {
          MaxResults: 1000, // TODO: paging
        };
        const data = await this.aws.describeInstances(params).promise();
        return data.Reservations.reduce((acc, res) => [...acc, ...res.Instances], []);
      },
      filters: {
        id: (item, value) => item.InstanceId === value,
        vpc: (item, value) => item.VpcId === value,
      },
      identity: item => item.InstanceId,
    });
    this.register({
      name: 'internetGateway',
      list: async () => {
        const params = {};
        const data = await this.aws.describeInternetGateways(params).promise();
        return data.InternetGateways;
      },
      filters: {
        id: (item, value) => item.InternetGatewayId === value,
        vpc: (item, value) => item.Attachments.filter(att => att.VpcId === value).length,
      },
      identity: item => item.InternetGatewayId,
      travel: {
        routeTable: async () => Promise.resolve([]), // TODO: travel internetGateway -> routeTable
      },
    });
    this.register({
      name: 'routeTable',
      list: async () => {
        const params = {};
        const data = await this.aws.describeRouteTables(params).promise();
        return data.RouteTables;
      },
      filters: {
        id: (item, value) => item.RouteTableId === value,
        vpc: (item, value) => item.VpcId === value,
      },
      identity: item => item.RouteTableId,
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
      filters: {
        id: (item, value) => item.GroupId === value,
        name: (item, value) => item.GroupName === value,
        vpc: (item, value) => item.VpcId === value,
      },
      identity: item => item.GroupId,
    });
    this.register({
      name: 'subnet',
      list: async () => {
        const params = {};
        const data = await this.aws.describeSubnets(params).promise();
        return data.Subnets;
      },
      filters: {
        id: (item, value) => item.SubnetId === value,
        vpc: (item, value) => item.VpcId === value,
      },
      identity: item => item.SubnetId,
    });
  }
}

module.exports = EC2;
