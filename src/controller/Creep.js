import { Creep } from 'screeps-globals';
import creepMapper from '../util/creepMapper';

Object.assign(Creep.prototype, {

  routine() {
    if(this.performRole) {
      this.performRole();
    }
  },

  reMap() {
    return creepMapper.mapCreep(this);
  }

});
