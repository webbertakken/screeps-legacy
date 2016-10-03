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

  creepsWithRole(role) {
    return this.creeps().filter(creep => creep.memory.role === role);
  }

  mapCreep(creep) {
    const Constructor = creepMap[creep.memory.role];
    if (Constructor) {
      return new Constructor(creep.id);
    }
    return creep;
  }
}

const creepMapper = new CreepMapper();
export default creepMapper;
