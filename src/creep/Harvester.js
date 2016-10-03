import '../controller/Creep';

export default class Harvester extends Creep {

  performRole() {

    //vars
    var cMemory = this.memory;

    // initiate
    if (!cMemory.initiated) {
      cMemory.activity = 'harvesting';
      if(!cMemory.targetSourceId) {
        cMemory.targetSourceId = global.go.resource.assignToSource(this);
      }
      cMemory.origin = this.room.name;
      cMemory.initiated = true;
      this.say('Mining Stations!');
    }

    // if old, replace with new one
    if(cMemory.iAmOld && !cMemory.iAmBeingReplaced) {
      this.room.memory.taskQueue.push({
        task: 'replaceCreep',
        creepToReplace: this.name
      });
      cMemory.iAmBeingReplaced = true;
      this.say('I\'m old...');
      cMemory.activity = 'emptying';
    }

    // just move there and harvest till you're old
    if(cMemory.activity == 'harvesting') {
      if (this.carryCapacity != this.carry.energy) {
        var targetSource = Game.getObjectById(cMemory.targetSourceId);
        if (this.harvest(targetSource) == ERR_NOT_IN_RANGE) {
          this.moveTo(targetSource);
          this.saveState(this, cMemory);
          return;
        }
      } else {
        // todo: adaptive logistics trigger
        this.say('Full!');
        return;
      }
    }

    // i'm old, so i'm emptying
    if(cMemory.activity == 'emptying') {
      if(this.carry.energy != 0) {
        if( (Game.time & 0x0A) == 0) {
          this.say('so old..zzz');
        }
        // todo: goto emptying flag
        return;
      }
      this.say('scrap metal!');
      this.activity = 'salvaging';
    }

    // i'm old and empty, time to salvage myself
    if(cMemory.activity == 'salvaging') {
      if( (Game.time & 0x0A) == 0) {
        this.say('Bye world!');
      }
      // todo: move to spawn to dismantle
    }

  }

}
