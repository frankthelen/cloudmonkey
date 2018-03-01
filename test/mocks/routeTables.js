module.exports = {
  RouteTables: [{
    Associations: [{
      Main: false,
      RouteTableAssociationId: 'rtbassoc-347eab82',
      RouteTableId: 'rtb-347eab82',
      SubnetId: 'subnet-347eab82'
    }],
    PropagatingVgws: [],
    RouteTableId: 'rtb-347eab82',
    Routes: [{
      DestinationCidrBlock: '172.18.192.0/20',
      GatewayId: 'local',
      Origin: 'CreateRouteTable',
      State: 'active'
    },
    {
      DestinationCidrBlock: '0.0.0.0/0',
      NatGatewayId: 'nat-187z87efe8487bb65',
      Origin: 'CreateRoute',
      State: 'active'
    }],
    Tags: [{
      Key: 'availability_zone',
      Value: 'eu-central-1c'
    },
    {
      Key: 'Name',
      Value: 'zone_b_az_2_dev'
    }],
    VpcId: 'vpc-78ef65f2'
  },
  {
    Associations: [{
      Main: false,
      RouteTableAssociationId: 'rtbassoc-e83ee289',
      RouteTableId: 'rtb-e83ee289',
      SubnetId: 'subnet-e83ee289'
    }],
    PropagatingVgws: [],
    RouteTableId: 'rtb-e83ee289',
    Routes: [{
      DestinationCidrBlock: '172.18.192.0/20',
      GatewayId: 'local',
      Origin: 'CreateRouteTable',
      State: 'active'
    },
    {
      DestinationCidrBlock: '0.0.0.0/0',
      GatewayId: 'igw-78ef65f2',
      Origin: 'CreateRoute',
      State: 'active'
    }],
    Tags: [{
      Key: 'Name',
      Value: 'zone_c_az_0_dev'
    },
    {
      Key: 'availability_zone',
      Value: 'eu-central-1a'
    }],
    VpcId: 'vpc-78ef65f2'
  }]
};
