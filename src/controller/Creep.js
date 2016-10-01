import { Creep } from 'screeps-globals';
import creepMapper from '../util/creepMapper';

Object.assign(Creep.prototype, {

  routine() {

  },

  map() {
    return creepMapper.mapCreep(this);
  }

});
