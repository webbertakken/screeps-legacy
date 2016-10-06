import '../controller/Creep';

export default class Harvester extends Creep {

  performRole() {
    if (!this.isInitiated) {
      this.initiate();
    } else if (this.memory.activity === 'harvesting') {
      this.task_harvest();
    } else if (this.memory.activity === 'emptying') {
      this.task_empty();
    } else if (this.memory.activity === 'salvaging') {
      this.task_salvage();
    } else {
      console.log('[' + this.name + '] no activity...');
    }
  }

  assignToClosestFreeSource() {
    const targetSource = (this.room.memory.sources)
      .filter((source) => {
        return (source.assignee === false);
      })[0];
    this.memory.targetSourceId = targetSource.id;
    targetSource.assignee = this.id;
  }

  isAssignedToSource() {
    return this.memory.targetSourceId ? true : false ;
  }

  isInitiated() {
    return this.memory.initiated ? true : false;
  }

  initiate() {
    this.memory.activity = 'harvesting';
    if(!this.isAssignedToSource()) {
      this.assignToClosestFreeSource();
    }
    this.memory.origin = this.room.name;
    this.memory.initiated = true;
    this.say('Mining Stations!');
  }

  age_check() {
    if(this.memory.iAmOld && !this.memory.iAmBeingReplaced) {
      this.room.memory.taskQueue.push({
        task: 'replaceCreep',
        creepToReplace: this.name
      });
      this.memory.iAmBeingReplaced = true;
      this.say('I\'m old...');
      this.memory.activity = 'emptying';
    }
  }

  // just move there and harvest till you're old
  task_harvest() {
    if (this.carryCapacity != this.carry.energy) {
      const targetSource = Game.getObjectById(this.memory.targetSourceId);
      if (this.harvest(targetSource) == ERR_NOT_IN_RANGE) {
        this.moveTo(targetSource);
        return;
      }
    } else {
      // todo: adaptive logistics trigger
      this.say('Full!');
      return;
    }
  }

  // i'm old, so i'm emptying
  task_empty() {
    if (this.carry.energy != 0) {
      if ((Game.time & 0x0A) == 0) {
        this.say('so old..zzz');
      }
      // todo: goto emptying flag
      return;
    }
    this.say('scrap metal!');
    this.activity = 'salvaging';
  }

  // i'm old and empty, time to salvage myself
  task_salvage() {
    if( (Game.time & 0x0A) == 0) {
      this.say('Bye world!');
    }
    // todo: move to spawn to dismantle
  }

}
