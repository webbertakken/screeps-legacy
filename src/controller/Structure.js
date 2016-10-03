import { Structure } from 'screeps-globals';
import structureMapper from '../util/structureMapper';

Object.assign(Structure.prototype, {

  routine() {
    if(this.map) {
      this.map();
    }
    if(this.performRole) {
      this.performRole();
    }
  },

  map() {
    return structureMapper.mapStructure(this);
  }

});
