import {Structure} from 'screeps-globals';
import structureMapper from '../util/structureMapper';

Object.assign(Structure.prototype, {

  routine() {
    if (this.performRole) {
      this.performRole();
    }
  },

  reMap() {
    return structureMapper.mapStructure(this);
  }

});
