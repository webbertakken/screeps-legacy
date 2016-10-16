import { Creep } from 'screeps-globals';
import '../controller/Creep';

export default class Harvester extends Creep {

  instruct() {
    this.activity('harvesting');
    if(this.assignToClosestFreeSource()) {
      this.isGivenInstructions(true);
    }
  }

  performRole() {
    this.MOTTest();
    this.task_harvest();
    this.task_empty();
    this.task_salvage();
  }

  MOTTest() {
    if(Game.time % 30 !== 0) {
      return;
    }
    if(this.isOld()) {
      if(this.isAssignedToSource()) {
        this.unassignFromSource();
      }
      if (this.replacementHasArrived() || this.isVeryOld()) {
        this.activity('emptying');
      }
    } else {
      if(!this.isAssignedToSource()) {
        this.assignToClosestFreeSource();
      }
      if(!Game.getObjectById(this.assignedTruck())) {
        this.unassignTruck();
      }
    }
  }

  replacementHasArrived() {
    return !!_(this.pos.findInRange(FIND_MY_CREEPS, 1)).find(c => c.role() === this.role() && c.id !== this.id);
  }

  /**
   * @Description Just move there and harvest till you're old
   */
  task_harvest() {
    if (this.activity() === 'harvesting') {
      const targetSource = Game.getObjectById(this.targetSource());
      if (this.harvest(targetSource) == ERR_NOT_IN_RANGE) {
        this.moveTo(targetSource);
      }
    }
  }

  /**
   * @Description i'm old, so i'm emptying
   */
  task_empty() {
    if(this.activity() === 'emptying' && this.isEmpty()) {
      this.unassignTruck();
      this.activity('salvaging');
    }
  }

  unassignTruck() {
    if(this.assignedTruck()) {
      const assignedTruck = Game.getObjectById(this.assignedTruck());
      if(assignedTruck) {
        assignedTruck.memory.assignedHarvester = false;
      }
      this.assignedTruck(false);
    }
  }

  assignedTruck(setter) {
    return setter === undefined ? this.memory.assignedTruck || false : this.memory.assignedTruck = setter;
  }

  isAssignedToSource() {
    return !!this.targetSource();
  }

  targetSource(setter) {
    return setter === undefined ? this.memory.targetSourceId || false : this.memory.targetSourceId = setter;
  }

  assignToClosestFreeSource() {
    const target = _.find(this.room.memory.sources, s => !s.isGuarded && !s.assignedHarvester);
    if(target) {
      this.targetSource(target.id);
      target.assignedHarvester = this.id;
      return true;
    }
    return false;
  }

  unassignFromSource() {
    const target = _(this.room.memory.sources).find(s => s.assignedHarvester === this.id);
    if(target) {
      delete target.assignedHarvester;
    }
  }

}
