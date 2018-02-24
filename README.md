# CloudMonkey

A little infrastructure testing library for AWS / experimental in an early stage.

The idea is to fill the gap between
unit testing of infrastructure scripts (Terraform, CloudFormation, etc.) on the one hand,
and live integration testing of the real infrastructure on the other hand.
CloudMonkey pulls meta information of cloud infrastructure components
and provides them through a unified abstract interface for testing.
You can write assertions using your preferred test runner and assertion library.
Supported services and resource types are extendable and pluggable.

## Install

```batch
npm install cloudmonkey
```

## Usage

A quick example:
```javascript
const { CloudMonkey, EC2 } = require('./CloudMonkey');

const monkey = new CloudMonkey();
monkey.register(new EC2({ region: 'eu-central-1' }));

const test = async () => {
  try {
    const data = await monkey.select.one.ec2.internetGateway();
    data.dump();
    // ...
  } catch (err) {
    console.error(err);
  }
};

test();
```

## Features
