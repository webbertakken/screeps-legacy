import Controller from '../structure/Controller';
import Spawn from '../structure/Spawn';
import Extension from '../structure/Extension';
import Wall from '../structure/Wall';
import Rampart from '../structure/Rampart';
import Tower from '../structure/Tower';
import Link from '../structure/Link';

const structureMap = {
  [STRUCTURE_CONTROLLER]: Controller,
  [STRUCTURE_SPAWN]: Spawn,
  [STRUCTURE_EXTENSION]: Extension,
  [STRUCTURE_WALL]: Wall,
  [STRUCTURE_RAMPART]: Rampart,
  [STRUCTURE_TOWER]: Tower,
  [STRUCTURE_LINK]: Link,
};

class StructureMapper {

  structures() {
    const legacyStructures = [];
    _.forEach(Object.keys(Game.rooms), (roomName) => {
      const room = Game.rooms[roomName];
      Array.prototype.push.apply(legacyStructures, room.find(FIND_STRUCTURES));
    });
    return legacyStructures.map(this.mapStructure);
  }

  mapStructure(structure) {
    const Constructor = structureMap[structure.structureType];
    if (Constructor) {
      return new Constructor(structure.id);
    }
    return structure;
  }

}

const structureMapper = new StructureMapper();
export default structureMapper;
