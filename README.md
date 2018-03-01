# CloudMonkey

Small infrastructure testing framework -- **EXPERIMENTAL** -- use at your own risk!

The idea is to fill the gap between
unit testing of infrastructure scripts (Terraform, CloudFormation, etc.) on the one hand,
and live integration testing of the real infrastructure on the other hand.
CloudMonkey pulls meta information of cloud infrastructure elements
and provides them through a unified abstract interface for testing.
Write assertions against your cloud infrastructure
using your preferred test runner and assertion library.
Services and resource types are extendable and pluggable.

[![Build Status](https://travis-ci.org/frankthelen/cloudmonkey.svg?branch=master)](https://travis-ci.org/frankthelen/cloudmonkey)
[![Coverage Status](https://coveralls.io/repos/github/frankthelen/cloudmonkey/badge.svg?branch=master)](https://coveralls.io/github/frankthelen/cloudmonkey?branch=master)
[![Dependency Status](https://gemnasium.com/badges/github.com/frankthelen/cloudmonkey.svg)](https://gemnasium.com/github.com/frankthelen/cloudmonkey)
[![Greenkeeper badge](https://badges.greenkeeper.io/frankthelen/cloudmonkey.svg)](https://greenkeeper.io/)
[![Maintainability](https://api.codeclimate.com/v1/badges/2b21f79b2657870c146f/maintainability)](https://codeclimate.com/github/frankthelen/cloudmonkey/maintainability)
[![node](https://img.shields.io/node/v/cloudmonkey.svg)]()
[![code style](https://img.shields.io/badge/code_style-airbnb-brightgreen.svg)](https://github.com/airbnb/javascript)
[![License Status](http://img.shields.io/npm/l/cloudmonkey.svg)]()

## Install

```batch
npm install cloudmonkey
```

## Usage

A quick example (assuming mocha and chai):
```javascript
const { CloudMonkey, EC2 } = require('cloudmonkey');

const monkey = new CloudMonkey();
monkey.register(new EC2({ region: 'eu-central-1' }));

describe('my subnets', () => {
  it('should be tagged "zone c" if public', async () => {
    const igw = await monkey.select.one.ec2.internetGateway({ vpc: 'vpc-12345678' });
    const rtb = await igw.travel.to.all.routeTables();
    const sn = await rtb.travel.to.all.subnets();
    expect(sn).to.containAll(subnet =>
      subnet.Tags.filter(tag =>
        tag.Key === 'security-zone' &&
        tag.Value === 'c').length);
  });
});
```

## Prerequisites

Configure the [AWS access keys](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-started-nodejs.html#getting-started-nodejs-configure-keys).

## Features
### Register services and resource types

The interface model knows services and resource types.
Services must be registered with CloudMonkey.
Each service defines its resource types.
Services are registered like this:

```javascript
const { CloudMonkey, EC2 } = require('cloudmonkey');

const monkey = new CloudMonkey();
monkey.register(new EC2({ region: 'eu-central-1' }));
monkey.help();
```

Use `help()` to printout information such as the registered services,
their resource types, filter and travel options:
```bash
CloudMonkey 1.0.0-alpha.0

service "ec2"
* resource type "instance"
  filter by "id", "vpc"
* resource type "internetGateway"
  filter by "id", "vpc"
  travel to "routeTable"
* resource type "routeTable"
  filter by "id", "vpc"
  travel to "subnet"
* resource type "securityGroup"
  filter by "id", "name", "vpc"
* resource type "subnet"
  filter by "id", "vpc"
```

### Selecting resources

The selection syntax provides a means to select resources. For example:
```javascript
const monkey = new CloudMonkey();
...
const igw = await monkey.select.one.ec2.internetGateway({ vpc: 'vpc-12345678' });
```

The general format is this:
```
select.<quantifier>.<service>.<resourceType>(<filter>)
```

Quantifier is `one`, `some` or `all`. `one` returns one single object while `all` and `some` always return an array. `one` will throw an error if there is none or multiple objects available. `<service>` must be one of the services registered. `<resourceType>` must be one of the resource types provided by the service (plural, i.e., adding an `s` for nicer reading, is working as well).

Both cases, an array representing multiple resources or a single object, can be used for further assertions. Use mocha or jasmine or chai or any assertion library.

Both cases are decorated. You can use `dump()` and travel to related resources within the same service.

```javascript
const igw = await monkey.select.one.ec2.internetGateway({ vpc: 'vpc-12345678' });
igw.dump();
const rtb = await monkey.select.all.ec2.routeTables();
rtb.dump();
```

### Travel to other resources

The travel syntax allows to travel from resources (of one resource type) to related resources (of another resource type within the same service). It can be combined with filters. Use `help()` (see above) to learn which travel and filter options are available for a particular resource type.

```javascript
const igw = await monkey.select.one.ec2.internetGateway();
const rtb = await igw.travel.to.all.routeTables();
const sn = await rtb.travel.to.all.subnets();
sn.dump();
```

The general format is this:
```
travel.to.<quantifier>.<resourceType>(<filter>)
```
