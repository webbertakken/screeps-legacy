import '../controller/Structure';
import template from '../controller/Template';

export default class Spawn extends StructureSpawn {

  performRole() {
    if(this.room.memory.buildQueue.length) {
      this.buildCreep();
    }
  }

  buildCreep(){
    const item = this.room.memory.buildQueue[0];
    const bp   = template[item.template];
    Object.assign(item.memory, bp.memory);
    if(bp.cost <= this.room.energyAvailable) {
      if(this.canCreateCreep(bp.body, bp.name) == 0) {
        console.log(this.createCreep(bp.body, bp.name, item.memory));
        delete this.memory.buildQueue[0];
      }
    }
  }

}
