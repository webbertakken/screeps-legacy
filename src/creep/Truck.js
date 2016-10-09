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

  load() {
    // load from harvester
    let harvester = Game.getObjectById(this.memory.assignedHarvester);
    if(!harvester) {
      this.assignToClosestHarvester();
      return;
    }
    console.log(JSON.stringify(Game.getObjectById(this.memory.assignedHarvester)));
    let path = this.pos.findPathTo(Game.getObjectById(this.memory.assignedHarvester));
    if( path.length > 1) {
      this.move(path[0].direction);
    } else {
      this.say('arrived');
    }
    // this.moveTo(Game.getObjectById(this.memory.assignedHarvester), {noPathFinding: true});
    // if(Game.cpu.tickLimit - Game.cpu.getUsed() > 20) {
    //   this.moveTo(Game.getObjectById(this.memory.assignedHarvester), {reusePath: 10});
    // }
  }

  unload() {

  }

  assignToClosestHarvester() {
    let assigner = this.room.findLonelyHarvesters();
    if(assigner && assigner[0]) {
      this.memory.assignedHarvester = assigner[0].id;
      assigner[0].assignee = this.id;
    }
  }

}
