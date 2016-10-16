import Blueprint from './_Blueprint';

class Builder extends Blueprint {

  name = 'builder' + _.random(1000, 1999);

  memory = {};

  body = [
    MOVE,
    CARRY,
    CARRY,
    CARRY,
    WORK
  ];

  additionalParts = [
    CARRY,
    WORK,
    MOVE,
    CARRY,
    WORK,
    MOVE,
    CARRY,
    WORK,
    MOVE,
    CARRY,
    WORK,
    MOVE,
  ];

}

export default Builder;
