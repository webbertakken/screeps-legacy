import '../controller/Creep';

export default class Truck extends Creep {

  instruct() {
    this.memory.activity = 'load';
    this.assignToClosestHarvester();
    this.isGivenInstructions(true);
  }

  performRole() {
    this.load();
    this.unload();
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
      this.unloadToSpawns();
      if(this.isEmpty()) {
        this.activity('load');
        this.load();
      }
    }
  }

  loadFromAssignedHarvester() {
    let harvester = Game.getObjectById(this.memory.assignedHarvester);
    if(!harvester){
      return;
    }
    let path = this.pos.findPathTo(Game.getObjectById(this.memory.assignedHarvester), {reusePath: 7});
    if( path.length > 1) {
      this.move(path[0].direction);
    } else {
      let pickups = this.pos.findInRange(FIND_DROPPED_ENERGY, 1);
      if(pickups.length) {
        this.pickup(pickups[0]);
      }
    }
  }

  unloadToSpawns() {
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
