import { Creep } from 'screeps-globals';
import '../controller/Creep';

export default class Builder extends Creep {

  instruct() {
    this.activity('loading');
  }

  performRole() {
    this.task_load();
    this.task_build();
    this.task_salvage();
  }

  /**
   * @Description gets filled by trucks early on, if storage available be proactive
   */
  task_load() {
    if(this.activity() === 'loading') {
      const storage = this.room.getStorageWithEnergy();
      if(storage[0]) {
        if (this.withdraw(storage[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          this.moveTo(storage[0]);
        }
      }
      if(this.isGoodAsFull()) {
        return this.activity('building');
      } else {
        return true;
      }
    }
    return false;
  }

  /**
   * @Description build structures in placement order
   */
  task_build() {
    if(this.activity() === 'building' || this.activity() === 'emptying') {
      if (this.activity() === 'emptying' && this.isEmpty()) {
        return this.activity('salvaging');
      }
      if (this.repairBuildings() || this.constructBuildings() || this.repairAnything()) {
        return true;
      }
    }
    return false;
  }

  /**
   * @description Repair any building up to 10000 hp
   * @returns {boolean}
   */
  repairBuildings() {
    const structures = _(this.room.getDamagedStructures())
      .filter(s => s.structureType !== STRUCTURE_ROAD)
      .value();
    if (structures[0]) {
      if(this.repair(structures[0]) == ERR_NOT_IN_RANGE) {
        this.moveTo(structures[0]);
      }
      return true;
    }
    return false;
  }

  /**
   * @description Finish construction sites in order
   * @returns {boolean}
   */
  constructBuildings() {
    const sites = this.room.getMyConstructionSites();
    if (sites[0]) {
      if(this.build(sites[0]) == ERR_NOT_IN_RANGE) {
        this.moveTo(sites[0]);
      }
      return true;
    }
    return false;
  }

  /**
   * @description Repair anything
   * @returns {boolean}
   */
  repairAnything() {
    const repairables = this.room.getRepairableStructures();
    if (repairables[0]) {
      if(this.repair(repairables[0]) == ERR_NOT_IN_RANGE) {
        this.moveTo(repairables[0]);
      }
      return true;
    }
    return false;
  }

}
