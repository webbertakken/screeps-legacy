import { Creep } from 'screeps-globals';
import '../controller/Creep';

export default class Truck extends Creep {

  instruct() {
    this.memory.activity = 'load';
    if(this.assignToClosestHarvester()) {
      this.isGivenInstructions(true);
    }
  }

  performRole() {
    this.load();
    this.unload();
    this.salvage();
  }

  load() {
    if(this.activity() === 'load') {
      this.loadFromAssignedHarvester();
      if(this.isFull()) {
        this.activity('unload');
      }
    }
  }

  unload() {
    if(this.activity() === 'unload') {
      this.unloadSequence();
      if(this.isEmpty()) {
        if(this.isOld()) {
          this.unassignFromHarvester();
          this.activity('salvaging');
        } else {
          this.activity('load');
          this.load();
        }
      }
    }
  }

  salvage() {

  }

  loadFromAssignedHarvester() {
    const harvester = Game.getObjectById(this.assignedHarvester());
    if(!harvester){
      this.assignToClosestHarvester();
      return;
    }
    const path = this.pos.findPathTo(Game.getObjectById(this.assignedHarvester()), {reusePath: 7});
    if( path.length > 1) {
      this.move(path[0].direction);
    } else {
      const pickups = this.pos.findInRange(FIND_DROPPED_ENERGY, 1);
      if(pickups.length) {
        this.pickup(pickups[0]);
      }
    }
  }

  unloadSequence() {
    let targets = Game.rooms[this.memory.origin].getStructuresNeedingEnergy();
    if(!targets[0]) {
      targets = Game.rooms[this.memory.origin].getCreepsNeedingEnergy();
    }
    if(targets[0] && this.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      this.moveTo(targets[0]);
    }
    if(targets[1]) {
      this.transfer(targets[1], RESOURCE_ENERGY);
    }
    if(targets[2]) {
      this.transfer(targets[2], RESOURCE_ENERGY);
    }
  }

  assignToClosestHarvester() {
    const assigner = this.room.findLonelyHarvesters();
    if(assigner && assigner[0]) {
      this.assignedHarvester(assigner[0].id);
      assigner[0].memory.assignedTruck = this.id;
      return true;
    }
    return false;
  }

  unassignFromHarvester() {
    if(this.assignedHarvester()) {
      const harvester = Game.getObjectById(this.assignedHarvester());
      if(harvester) {
        harvester.memory.assignedTruck = false;
      }
      this.assignedHarvester(false);
    }
  }

  assignedHarvester(setter) {
    return setter === undefined ? this.memory.assignedHarvester : this.memory.assignedHarvester = setter;
  }

}
