import '../controller/Structure';

import Builder from '../template/Builder';
import Harvester from '../template/Harvester';
import Truck from '../template/Truck';
import Upgrader from '../template/Upgrader';

const blueprintMap = {
  builder: Builder,
  harvester: Harvester,
  truck: Truck,
  upgrader: Upgrader,
};

export default class Spawn extends StructureSpawn {

  performRole() {
    this.buildQueuedCreep();
    this.recycleCreeps();
  }

  buildQueuedCreep() {
    if (this.spawning || !this.room.memory.buildQueue || !this.room.memory.buildQueue[0] || this.room.memory.buildQueue[0].beingBuilt) {
      return;
    }
    const queueItem = this.room.memory.buildQueue[0];
    const Constructor = blueprintMap[queueItem.template];
    if (!Constructor) {
      console.log('blueprint for ' + queueItem.template + ' does not exist.');
      return;
    }
    var blueprint = new Constructor();
    const energy = queueItem.maxEnergy <= blueprint.cost() ? queueItem.maxEnergy : blueprint.cost();
    if (energy > this.room.energyAvailable) {
      return;
    }
    Object.assign(blueprint.memory, queueItem.memory);
    const creepName = this.createCreepWithRole(blueprint.generateBody(energy), blueprint.name, blueprint.memory);
    if (creepName) {
      // instant-sync
      this.addCountToRole(queueItem.role);
      this.markQueueItemAsBeingBuiltWithName(creepName);
    }
  }

  createCreepWithRole(body, name, memory) {
    if (this.canCreateCreep(body, name) == 0) {
      return this.createCreep(body, name, memory);
    }
    return false;
  }

  // set beingBuilt to true, add name to watch completion for and move to end of queue
  markQueueItemAsBeingBuiltWithName(creepName) {
    const queue = this.room.memory.buildQueue;
    Object.assign(queue[0], {
      beingBuilt: true,
      name: creepName
    });
    queue.push(queue.shift());
  }

  addCountToRole(role) {
    return (this.room.memory.creeps[role] += 1);
  }

  recycleCreeps() {
    const target = _.find(this.pos.findInRange(FIND_MY_CREEPS, 1), c => c.memory.disassemblerLocation);
    if (target) {
      this.recycleCreep(target);
    }
  }

  isFull() {
    return this.energyCapacity === this.energy;
  }

}
