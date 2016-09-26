/**
 * @Title: my-screeps
 * @Description: Home brew AI Script for Screeps.com
 *
 * @Author: Webber, Bram
 * @Date: 20-09-2016
 * @See: https://github.com/brammittendorff/my-screeps
 */

/**
 *  Load files into global
 */

global.ai           = require('ai');
global.controller   = require('controller');
global.template     = require('template');

/**
 * Loop through game ticks
 */

module.exports.loop = function () {

  /**
   * Update Memory
   */

  // Creeps
  _.forEach(Game.creeps, (creep) => {
    global.controller.memory.updateByCreep(creep);
  });

  // Rooms
  _.forEach(Game.rooms, (room) => {
    global.controller.memory.updateByRoom(room);
  });

  /**
   * Distribute Tasks
   */

  // Creeps
  _.forEach(Game.creeps, (creep) => {
    global.controller.creep.routine(creep);
  });

  // Rooms
  _.forEach(Game.rooms, (room) => {
    global.controller.room.routine(room);
  });

  // Structures
  _.forEach(Game.structures, (structure) => {
    global.controller.structure.routine(structure);
  });

};
