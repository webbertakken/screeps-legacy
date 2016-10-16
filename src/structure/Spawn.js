import '../controller/Structure';
import template from '../controller/Template';

export default class Spawn extends StructureSpawn {

  performRole() {
    if(this.room.memory.buildQueue && this.room.memory.buildQueue.length) {
      this.buildQueuedCreep();
    }
    this.recycleCreeps();
  }

  buildQueuedCreep(){
    if(this.room.memory.buildQueue[0].beingBuilt === true) {
      return;
    }
    const item = this.room.memory.buildQueue[0];
    const bp   = template[item.template];
    if(bp.cost > this.room.energyAvailable) {
      return;
    }
    Object.assign(item.memory, bp.memory);
    const creepName = this.createCreepWithRole(bp.body, bp.name, item.memory);
    if(creepName) {
      this.addCountToRole(item.role);
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
    if(target) {
      this.recycleCreep(target);
    }
  }

  isFull() {
    return this.energyCapacity === this.energy;
  }

}
