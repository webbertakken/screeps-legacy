import '../controller/Creep';

export default class Truck extends Creep {

  instruct() {
    this.memory.activity = 'load';
    this.assignToClosestHarvester();
    this.isGivenInstructions(true);
    this.say('Moap!');
  }

  performRole() {
    if(this.memory.activity === 'load') {
      this.load();
    } else if (this.memory.activity === 'unload') {
      this.unload();
    } else {
      this.say('bugged');
    }
  }

  /**
   *
   * @returns {string} activity
   */
  adjustActivity() {
    if(this.memory.activity === 'load' && _.sum(this.carry) >= this.carryCapacity) {
      this.memory.activity = 'unload';
    }
    if(this.memory.activity === 'unload' && _.sum(this.carry) === 0) {
      this.memory.activity = 'load';
    }
    return this.memory.activity;
  }

  load() {
    this.loadFromHarvester();
    if(this.adjustActivity() !== 'load') {
      this.performRole();
    }
  }

  unload() {
    this.unloadToSpawn();
    if(this.adjustActivity() !== 'unload') {
      this.performRole();
    }
  }

  loadFromHarvester() {
    let harvester = Game.getObjectById(this.memory.assignedHarvester);
    if(!harvester){
      return;
    }
    let path = this.pos.findPathTo(Game.getObjectById(this.memory.assignedHarvester), {reusePath: 30});
    if( path.length > 1) {
      this.move(path[0].direction);
    } else {
      let pickups = this.pos.findInRange(FIND_DROPPED_ENERGY, 1);
      if(pickups.length) {
        this.pickup(pickups[0]);
      }
    }
  }

  unloadToSpawn() {
    let spawns = this.room.find(FIND_MY_SPAWNS).filter((spawn) => {
      return spawn.energyCapacity > spawn.energy;
    });
    if(spawns.length) {
      if(this.transfer(spawns[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        this.moveTo(spawns[0], {reusePath: 30});
      }
    }
  }

  assignToClosestHarvester() {
    let assigner = this.room.findLonelyHarvesters();
    if(assigner && assigner[0]) {
      this.memory.assignedHarvester = assigner[0].id;
      assigner[0].memory.assignedTruck = this.id;
    }
  }

}
