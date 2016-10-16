import Blueprint from './_Blueprint';

class Upgrader extends Blueprint {

  name = 'upgrader' + _.random(1000, 1999);

  memory = {};

  body = [
    MOVE,
    WORK,
    WORK,
    CARRY,
  ];

  additionalParts = [
    CARRY,
    WORK,
    CARRY,
    WORK,
    MOVE,
    CARRY,
    WORK,
    WORK,
    WORK,
    WORK,
    WORK,
    WORK,
    MOVE,
  ];

}

export default Upgrader;
