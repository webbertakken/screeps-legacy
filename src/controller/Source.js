import { Source, PathFinder } from 'screeps-globals';

Object.assign(Source.prototype, {

  /**
   * Room initiate == Source initiate
   */
  initiate() {
    const index = !this.room.memory.sources.length ? 0 : this.room.memory.sources.length;
    this.room.memory.sources.push({
      'index': index,
      'id': this.id,
      'energyCapacity': this.energyCapacity,
      'pos': this.pos,
    });
    this.putSourceFlag();
  },

  /**
   * @description determine shortest route to any spawn, pick RoomPosition #0
   */
  findBestMiningSpot() {
    const shortPath = PathFinder.search(this.pos, this.room.find(FIND_MY_SPAWNS)[0].pos, {plainCost: 1, swampCost: 1});
    if(!shortPath || !shortPath.incomplete) {
      return shortPath.path[0];
    } else {
      return false;
    }
  },

  /**
   * @description get the allocated memory for this source
   */
  getSourceMemory() {
    return _.find(this.room.memory.sources, source => source.id == this.id);
  },

  /**
   * @description create a flag, and save the name
   */
  putSourceFlag() {
    const sourceMem = this.getSourceMemory();
    sourceMem.miningSpot.createFlag('harv' + sourceMem.index, COLOR_CYAN, COLOR_BLUE);
    sourceMem.flag = 'harv' + sourceMem.index;
  }

});
