Object.assign(component, {

  harvester: {

    routine: function (creep) {

      //vars
      var cMemory = creep.memory;

      // initiate
      if (!cMemory.initiated) {
        cMemory.activity = 'harvesting';
        if(!cMemory.targetSourceId) {
          cMemory.targetSourceId = global.go.resource.assignToSource(creep);
        }
        cMemory.origin = creep.room.name;
        cMemory.initiated = true;
        creep.say('Mining Stations!');
      }

      // if old, replace with new one
      if(cMemory.iAmOld && !cMemory.iAmBeingReplaced) {
        creep.room.memory.taskQueue.push({
          task: 'replaceCreep',
          creepToReplace: creep.name
        });
        cMemory.iAmBeingReplaced = true;
        creep.say('I\'m old...');
        cMemory.activity = 'emptying';
      }

      // just move there and harvest till you're old
      if(cMemory.activity == 'harvesting') {
        if (creep.carryCapacity != creep.carry.energy) {
          var targetSource = Game.getObjectById(cMemory.targetSourceId);
          if (creep.harvest(targetSource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targetSource);
            this.saveState(creep, cMemory);
            return;
          }
        } else {
          // todo: adaptive logistics trigger
          creep.say('Full!');
          return;
        }
      }

      // i'm old, so i'm emptying
      if(cMemory.activity == 'emptying') {
        if(creep.carry.energy != 0) {
          if( (Game.time & 0x0A) == 0) {
            creep.say('so old..zzz');
          }
          // todo: goto emptying flag
          return;
        }
        creep.say('scrap metal!');
        creep.activity = 'salvaging';
      }

      // i'm old and empty, time to salvage myself
      if(cMemory.activity == 'salvaging') {
        if( (Game.time & 0x0A) == 0) {
          creep.say('Bye world!');
        }
        // todo: move to spawn to dismantle
      }

    }

  }

});
