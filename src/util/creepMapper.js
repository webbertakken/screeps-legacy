import { Creep } from 'screeps-globals';
import Builder from '../creep/Builder';
import Harvester from '../creep/Harvester';
import Truck from '../creep/Truck';
import Upgrader from '../creep/Upgrader';

const creepMap = {
  builder: Builder,
  harvester: Harvester,
  truck: Truck,
  upgrader: Upgrader,
};

class CreepMapper {

  creeps() {
    return Object.keys(Game.creeps).map(creepName => {
      const creep = Game.creeps[creepName];
      return this.mapCreep(creep);
    });
  }

  mapCreep(creep) {
    return new creepMap[creep.memory.role](creep);
  }

}

const creepMapper = new CreepMapper();

Creep.prototype.map = function mapCreep() {
  return creepMapper.mapCreep(this);
};

export default creepMapper;
