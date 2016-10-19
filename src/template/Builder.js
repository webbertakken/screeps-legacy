import Blueprint from './_Blueprint';

class Builder extends Blueprint {

  name = 'builder' + _.random(1000, 1999);

  memory = {};

  body = [
    MOVE,
    MOVE,
    CARRY,
    CARRY,
    WORK
  ];

  additionalParts = [
    CARRY,
    MOVE,
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
