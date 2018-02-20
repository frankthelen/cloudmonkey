const AWS = require('aws-sdk');

const ec2 = new AWS.EC2();

const service = {
  resourceTypes: {
    instance: {
      list: async () => Promise.resolve([]),
    },
    internetGateway: {
      list: async () => Promise.resolve([]),
    },
    routeTable: {
      list: async () => Promise.resolve([]),
    },
    securityGroup: {
      list: async () => Promise.resolve([]),
    },
    subnet: {
      list: async () => Promise.resolve([]),
    },
  }
};

module.exports = service;
