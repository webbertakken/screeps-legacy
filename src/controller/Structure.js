import { Structure } from 'screeps-globals';
import structureMapper from '../util/structureMapper';

Object.assign(Structure.prototype, {

  routine() {

  },

  map() {
    return structureMapper.mapStructure(this);
  }

});
