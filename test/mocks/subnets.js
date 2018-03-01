module.exports = {
  Subnets: [{
    AvailabilityZone: 'eu-central-1c',
    AvailableIpAddressCount: 244,
    CidrBlock: '172.18.197.0/24',
    DefaultForAz: false,
    MapPublicIpOnLaunch: false,
    State: 'available',
    SubnetId: 'subnet-347eab82',
    VpcId: 'vpc-78ef65f2',
    AssignIpv6AddressOnCreation: false,
    Ipv6CidrBlockAssociationSet: [],
    Tags: [{
      Key: 'availability_zone',
      Value: 'eu-central-1c'
    },
    {
      Key: 'Name',
      Value: 'zone_b_az_2_dev'
    },
    {
      Key: 'Environment',
      Value: 'dev'
    },
    {
      Key: 'security-zone',
      Value: 'b'
    }]
  },
  {
    AvailabilityZone: 'eu-central-1a',
    AvailableIpAddressCount: 250,
    CidrBlock: '172.18.198.0/24',
    DefaultForAz: false,
    MapPublicIpOnLaunch: false,
    State: 'available',
    SubnetId: 'subnet-e83ee289',
    VpcId: 'vpc-78ef65f2',
    AssignIpv6AddressOnCreation: false,
    Ipv6CidrBlockAssociationSet: [],
    Tags: [{
      Key: 'Name',
      Value: 'zone_c_az_0_dev'
    },
    {
      Key: 'security-zone',
      Value: 'b'
    },
    {
      Key: 'availability_zone',
      Value: 'eu-central-1a'
    },
    {
      Key: 'Environment',
      Value: 'dev'
    }]
  }]
};
