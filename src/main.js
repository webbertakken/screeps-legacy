/**
 * @Description: Home brew AI Script for Screeps.com
 * @See: https://github.com/webbertakken/screeps
 */

/**
 *  Constants
 */
import 'screeps-perf';
import ai from './ai.js';
import controller from './controller.js';
import template from './template.js';
import profiler from 'screeps-profiler';


/**
 * Loop through game ticks
 */

module.exports.loop = () => {

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
