import blueprintHelper from '../util/blueprintHelper';
import profiler from 'screeps-profiler';

class _Blueprint {

  energy;
  maxEnergy;

  cost() {
    return blueprintHelper.calculateMaxCosts(this);
  }

  generateBody(energy) {
    this.energy = energy;
    return blueprintHelper.generateBody(this);
  }

}

profiler.registerClass(_Blueprint, 'Blueprint');

export default _Blueprint;
