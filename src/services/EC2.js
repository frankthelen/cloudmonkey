const assert = require('assert');
const AWS = require('aws-sdk');
const Service = require('../Service');

class EC2 extends Service {
  constructor({ region, alias } = {}) {
    super({ name: 'ec2', alias });
    assert(region, '"region" is required');
    this.aws = new AWS.EC2({ apiVersion: '2016-11-15', region });
    this.registerResourceTypes();
  }

  registerResourceTypes() {
    this.register({
      name: 'instance',
      list: async () => this.loadResources('instance'),
      filters: {
        id: (item, value) => item.InstanceId === value,
        vpc: (item, value) => item.VpcId === value,
      },
      identity: item => item.InstanceId,
    });
    this.register({
      name: 'internetGateway',
      list: async () => this.loadResources('internetGateway'),
      filters: {
        id: (item, value) => item.InternetGatewayId === value,
        vpc: (item, value) => item.Attachments.filter(att => att.VpcId === value).length,
      },
      identity: item => item.InternetGatewayId,
      travel: {
        routeTable: async (igws) => {
          const igwIds = igws.map(igw => igw.InternetGatewayId);
          const rts = await this.loadResources('routeTable');
          return rts.filter(rt =>
            rt.Routes.filter(route => igwIds.includes(route.GatewayId)).length);
        },
      },
    });
    this.register({
      name: 'routeTable',
      list: async () => this.loadResources('routeTable'),
      filters: {
        id: (item, value) => item.RouteTableId === value,
        vpc: (item, value) => item.VpcId === value,
      },
      identity: item => item.RouteTableId,
      travel: {
        subnet: async (rts) => {
          const snIds = rts.reduce((acc, rt) =>
            [...acc, ...rt.Associations.map(a => a.SubnetId)], []);
          const sns = await this.loadResources('subnet');
          return sns.filter(sn => snIds.includes(sn.SubnetId));
        },
      },
    });
    this.register({
      name: 'securityGroup',
      list: async () => this.loadResources('securityGroup'),
      filters: {
        id: (item, value) => item.GroupId === value,
        name: (item, value) => item.GroupName === value,
        vpc: (item, value) => item.VpcId === value,
      },
      identity: item => item.GroupId,
    });
    this.register({
      name: 'subnet',
      list: async () => this.loadResources('subnet'),
      filters: {
        id: (item, value) => item.SubnetId === value,
        vpc: (item, value) => item.VpcId === value,
      },
      identity: item => item.SubnetId,
    });
  }

  async loadResources(resourceType) {
    if (!this.cache) {
      this.cache = {};
    }
    if (this.cache[resourceType]) {
      return this.cache[resourceType];
    }
    let list;
    if (resourceType === 'instance') {
      const params = { MaxResults: 1000 }; // TODO: paging
      const data = await this.aws.describeInstances(params).promise();
      list = data.Reservations.reduce((acc, res) => [...acc, ...res.Instances], []);
    } else if (resourceType === 'internetGateway') {
      const params = {};
      const data = await this.aws.describeInternetGateways(params).promise();
      list = data.InternetGateways;
    } else if (resourceType === 'routeTable') {
      const params = {};
      const data = await this.aws.describeRouteTables(params).promise();
      list = data.RouteTables;
    } else if (resourceType === 'securityGroup') {
      const params = { MaxResults: 1000 }; // TODO: paging
      const data = await this.aws.describeSecurityGroups(params).promise();
      list = data.SecurityGroups;
    } else if (resourceType === 'subnet') {
      const params = {};
      const data = await this.aws.describeSubnets(params).promise();
      list = data.Subnets;
    }
    this.cache[resourceType] = list;
    return list;
  }
}

module.exports = EC2;
