const AWS = require('aws-sdk');

const ec2 = new AWS.EC2({ apiVersion: '2016-11-15', region: 'eu-central-1' });

const service = {
  resourceTypes: {
    instance: {
      list: async () => {
        const params = {
          MaxResults: 1000, // TODO: paging
        };
        const data = await ec2.describeInstances(params).promise();
        return data.Reservations.reduce((acc, res) => [...acc, ...res.Instances], []);
      },
    },
    internetGateway: {
      list: async () => {
        const params = {};
        const data = await ec2.describeInternetGateways(params).promise();
        return data.InternetGateways;
      },
    },
    routeTable: {
      list: async () => {
        const params = {};
        const data = await ec2.describeRouteTables(params).promise();
        return data.RouteTables;
      },
    },
    securityGroup: {
      list: async () => {
        const params = {
          MaxResults: 1000, // TODO: paging
        };
        const data = await ec2.describeSecurityGroups(params).promise();
        return data.SecurityGroups;
      },
    },
    subnet: {
      list: async () => {
        const params = {};
        const data = await ec2.describeSubnets(params).promise();
        return data.Subnets;
      },
    },
  }
};

module.exports = service;
