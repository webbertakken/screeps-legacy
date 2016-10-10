import '../controller/Creep';

export default class Harvester extends Creep {

  instruct() {
    this.memory.activity = 'harvesting';
    this.assignToClosestFreeSource();
    this.isGivenInstructions(true);
    this.say('Mine!?');
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
    this.replacementCheck();
  }

  replacementCheck() {
    if(this.isOld()) {

      if (!this.isBeingReplaced()) {
        this.unassignHarvesterFromSource();
        this.replaceMe();
      } else if (this.replacementHasArrived()) {
        this.activity('emptying');
      }
    }
  }

  replacementHasArrived() {
    return !!_.filter(this.pos.findInRange(FIND_MY_CREEPS, 1), (creep) => {
      return creep.memory.replacementFor && creep.memory.replacementFor === this.id;
    }).length;
  }

  replaceMe() {
    if(Game.rooms[this.origin()].setReplacementIdForFirstRoleInQueue(this.id, this.role())) {
      this.say('beingRep');
      this.isBeingReplaced(true);
      this.say('beingreplacedSetToTrueNow');
    }
  }

  // just move there and harvest till you're old
  task_harvest() {
    if (this.activity() !== 'harvesting') {
      return;
    }
    const targetSource = Game.getObjectById(this.targetSource());
    if (this.harvest(targetSource) == ERR_NOT_IN_RANGE) {
      this.moveTo(targetSource);
    }
  }

  // i'm old, so i'm emptying
  task_empty() {
    if(this.activity !== 'emptying') {
      return;
    }
    this.say('so tired..');
    if(this.isEmpty()) {
      this.activity('salvaging');
    }
  }

  // i'm old and empty, time to salvage myself
  task_salvage() {
    if (this.activity() !== 'salvaging') {
      return;
    }
    this.unassignTruck();
    if(!this.isNextTo(this.disassemblerLocation())) {
      this.moveTo(this.disassemblerLocation());
    }
    this.say('Bye world!');
  }

  assignedTruck(setter) {
    if(setter === undefined) {
      return this.memory.assignedTruck || false;
    } else {
      return this.memory.assignedTruck = setter;
    }
  }

  unassignTruck() {
    if(this.assignedTruck()) {
      Game.getObjectById(this.assignedTruck()).memory.assignedHarvester = false;
      this.assignedTruck(false);
    }
  }

  isAssignedToSource() {
    return !!this.targetSource();
  }

  targetSource(setter) {
    if(setter === undefined) {
      return this.memory.targetSourceId || false;
    } else {
      return this.memory.targetSourceId = setter;
    }
  }

  assignToClosestFreeSource() {
    const target = (this.room.memory.sources)
      .filter((source) => {
        return !source.assignedHarvester;
      })[0];
    if(target && target.id) {
      this.targetSource(target.id);
      target.assignedHarvester = this.id;
    }
  }

  unassignHarvesterFromSource() {
    const target = (this.room.memory.sources)
      .filter((source) => {
        return source.assignedHarvester === this.id;
      })[0];
    if(target && target.assignedHarvester) {
      delete target.assignedHarvester;
    }
  }

}
