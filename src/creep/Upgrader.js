import {Creep} from 'screeps-globals';
import '../controller/Creep';

export default class Upgrader extends Creep {

  /*
   * Actions to perform for this role
   */
  performRole() {
    const controller = _(this.room.find(FIND_STRUCTURES)).find(s => s.structureType === STRUCTURE_CONTROLLER);
    if (this.upgradeController(controller) === ERR_NOT_IN_RANGE) {
      this.moveTo(controller);
    }
  }

}
