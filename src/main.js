/**
 * @Description: Home brew AI Script for Screeps.com
 * @See: https://github.com/webbertakken/screeps
 */

/**
 *  Load files into global
 */

const ai           = require('ai');
const controller   = require('controller');
const template     = require('template');
//const profiler      = require('screeps-profiler');

//profiler.enable();
if(ai && template) {
  // do something
}
/**
 * Loop through game ticks
 */

module.exports.loop = function() {

  //profiler.wrap(() => {

  /**
   * Update Memory
   */

  // Creeps
  _.forEach(Game.creeps, (creep) => {
    controller.memory.updateByCreep(creep);
  });

  // Rooms
  _.forEach(Game.rooms, (room) => {
    controller.memory.updateByRoom(room);
  });

  /**
   * Distribute Tasks
   */

  // Creeps
  _.forEach(Game.creeps, (creep) => {
    controller.creep.routine(creep);
  });

  // Rooms
  _.forEach(Game.rooms, (room) => {
    controller.room.routine(room);
  });

  // Structures
  _.forEach(Game.structures, (structure) => {
    controller.structure.routine(structure);
  });

  // }

};
