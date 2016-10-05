import '../controller/Structure';

export default class Spawn extends StructureSpawn {

  performRole() {
    if(this.memory.build) {
      this.buildCreep();
    }
  }

  buildCreep(){

  }

}
