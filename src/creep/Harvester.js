import '../controller/Creep';

export default class Harvester extends Creep {

  instruct() {
    this.memory.activity = 'harvesting';
    this.assignToClosestFreeSource();
    this.isGivenInstructions(true);
    this.say('Mine!?');
  }

  performRole() {
    if (this.memory.activity === 'harvesting') {
      this.task_harvest();
    } else if (this.memory.activity === 'emptying') {
      this.task_empty();
    } else if (this.memory.activity === 'salvaging') {
      this.task_salvage();
    } else {
      this.say('bugged');
    }
  }

  assignToClosestFreeSource() {
    const targetSource = (this.room.memory.sources)
      .filter((source) => {
        return !source.assignee.length;
      })[0];
    if(targetSource && targetSource.id) {
      this.memory.targetSourceId = targetSource.id;
      targetSource.assignee = this.id;
    }
  }

  isAssignedToSource() {
    return !!this.memory.targetSourceId;
  }

  age_check() {
    if(this.isOld() && !this.isBeingReplaced()) {
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
    const targetSource = Game.getObjectById(this.memory.targetSourceId);
    if (this.harvest(targetSource) == ERR_NOT_IN_RANGE) {
      this.moveTo(targetSource);
    }
  }

  // i'm old, so i'm emptying
  task_empty() {
    if (this.carry.energy == 0) {
      this.say('scrap metal!');
      this.activity = 'salvaging';
      return;
    }
    if ((Game.time & 0x0A) == 0) {
      this.say('so tired..');
    }
  }

  // i'm old and empty, time to salvage myself
  task_salvage() {
    if( (Game.time & 0x0A) == 0) {
      this.say('Bye world!');
    }
  }

}
