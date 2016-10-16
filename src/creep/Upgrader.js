import '../controller/Creep';

export default class Upgrader extends Creep {

  instruct() {}

  performRole() {
    this.upgrade();
  }

  upgrade() {
    const controller = _(this.room.find(FIND_STRUCTURES)).find(s => s.structureType === STRUCTURE_CONTROLLER);
    if(this.upgradeController(controller) === ERR_NOT_IN_RANGE) {
      this.moveTo(controller);
    }
  }

}
