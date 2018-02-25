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

  it('should write help information', () => {
    const cloudMonkey = new CloudMonkey();
    cloudMonkey.register(new S3({ region: 'eu-central-1' }));
    const log = [];
    const out = (line) => { log.push(line); };
    cloudMonkey.help(out);
    expect(log.length > 0).to.be.true;
    expect(log[0]).to.match(/^CloudMonkey/);
  });
});
