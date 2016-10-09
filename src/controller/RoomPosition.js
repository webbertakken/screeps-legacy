import { RoomPosition } from 'screeps-globals';

Object.assign(RoomPosition.prototype, {

  routine() {

  },

  isWalkable() {
    this.lookFor(LOOK_TERRAIN)[0].filter((terrain) => {
      return (terrain == 'plain' || terrain == 'swamp');
    });
  },

  findSpotsAround() {
    return this.room.lookForAtArea(LOOK_TERRAIN, this.pos.y-1, this.pos.x-1, this.pos.y+1, this.pos.x+1, true);
  },

  findWalkableSpotsAround() {
    return this.findSpotsAround().filter((position) => {
      return (position.terrain == 'swamp' || position.terrain == 'plain');
    });
  }

});
