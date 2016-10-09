import '../controller/Creep';

export default class Upgrader extends Creep {

  instruct() {
    this.say('++RCL;');
  }

  performRole() {
    this.upgrade();
  }

  upgrade() {
    if(this.upgradeController(this.room.controller) == ERR_NOT_IN_RANGE) {
      this.moveTo(this.room.controller, {});
    }
  }

}
