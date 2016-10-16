import '../controller/Creep';

export default class Builder extends Creep {

  instruct() {
    this.activity('loading');
  }

  performRole() {
    this.MOTTest();
    this.task_load();
    this.task_build();
    this.task_salvage();
  }

  MOTTest() {
    if(Game.time % 30 === 0 && this.isOld()) {
      this.activity('emptying');
    }
  }

  /**
   * @Description gets filled by trucks early on, if storage available be proactive
   */
  task_load() {
    if(this.activity() === 'loading') {
      const storage = this.room.getStorageWithEnergy();
      if(storage[0] && this.withdraw(storage[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        this.moveTo(storage[0]);
      }
      if(this.isFull()) {
        this.activity('building');
      }
    }
  }

  /**
   * @Description build structures in placement order
   */
  task_build() {
    if(this.activity() === 'building' || this.activity() === 'emptying') {
      if (this.activity() === 'emptying' && this.isEmpty()) {
        return this.activity('salvaging');
      }
      const sites = this.room.getMyConstructionSites();
      if (sites[0] && this.build(sites[0]) == ERR_NOT_IN_RANGE) {
        this.moveTo(sites[0]);
      }
    }
  }

  /**
   * @Description i'm old and empty, time to salvage myself
   */
  task_salvage() {
    if (this.activity() === 'salvaging' && !this.isNextTo(this.disassemblerLocation())) {
      this.moveTo(this.disassemblerLocation().x, this.disassemblerLocation().y);
    }
  }
}
