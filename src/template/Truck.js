import Blueprint from './_Blueprint';

class Truck extends Blueprint {

  name = 'truck' + _.random(1000, 1999);

  memory = {};

  body = [
    MOVE,
    CARRY,
    CARRY,
  ];

  additionalParts = [
    MOVE,
    CARRY,
    MOVE,
    CARRY,
    MOVE,
    CARRY,
    CARRY,
    MOVE,
    CARRY,
  ];

}

export default Truck;
