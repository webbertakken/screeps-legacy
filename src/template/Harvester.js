import Blueprint from './_Blueprint';

class Harvester extends Blueprint {

  name = 'harvester' + _.random(1000, 1999);

  memory = {};

  body = [
    MOVE,
    WORK,
  ];

  additionalParts = [
    WORK,
    WORK,
    WORK,
    WORK,
    MOVE
  ];

}

export default Harvester;
