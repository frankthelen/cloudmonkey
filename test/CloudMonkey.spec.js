require('./test-helper');
const assert = require('assert');
const { CloudMonkey, S3 } = require('..');

describe('CloudMonkey', () => {
  it('should create a new instance', () => {
    const cloudMonkey = new CloudMonkey();
    assert(cloudMonkey);
  });

  it('should register a new service', () => {
    const cloudMonkey = new CloudMonkey();
    cloudMonkey.register(new S3({ region: 'eu-central-1' }));
  });
});
