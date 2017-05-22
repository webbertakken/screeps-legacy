import {Creep} from 'screeps-globals';
import '../controller/Creep';

export default class Upgrader extends Creep {

  instruct() {
    this.activity('upgrading');

    this.isGivenInstructions(true);
  }

  performRole() {
    this.task_upgrade();
    this.task_salvage();
  }

  task_upgrade() {
    if (this.activity() === 'upgrading' || this.activity() === 'emptying') {
      const controller = _(this.room.find(FIND_STRUCTURES)).find(s => s.structureType === STRUCTURE_CONTROLLER);
      if (this.upgradeController(controller) === ERR_NOT_IN_RANGE) {
        this.moveTo(controller);
      }
      if (Game.time % 30 === 0 && this.isOld() && this.activity() === 'upgrading') {
        this.activity('emptying');
      }
      if (this.activity() === 'emptying' && this.isEmpty()) {
        this.activity('salvaging');
      }
    }
  }

}
