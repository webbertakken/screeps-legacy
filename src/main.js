/**
 * @Description: Home brew AI Script for Screeps
 * @See: https://github.com/webbertakken/screeps
 */

// Import in order
import 'screeps-perf';
import game from './controller/game';
import './controller/room';
import './controller/creep';
import './controller/structure';
import structureManager from './util/structureMapper';
import profiler from 'screeps-profiler';

// Enable profiler
profiler.enable();

// Loop through game ticks
export function loop() {
  profiler.wrap(() => {
    // Customize Game object
    game.init();
    // Creeps
    _.forEach(Object.keys(Game.creeps), (creepName) => {
      Game.creeps[creepName].routine();
    });
    // Rooms
    _.forEach(Object.keys(Game.rooms), (roomName) => {
      Game.rooms[roomName].routine();
    });
    // Structure class-based

    //Structures
    //console.log(JSON.stringify(structureManager.structures()));
    //console.log(JSON.stringify(Game.structures));
    _.forEach(structureManager.structures(), (structure) => {
      structure.routine();
    });

    // Structures
    // _.forEach(Object.keys(Game.structures), (structureName) => {
    //   Game.structures[structureName].routine();
    // });
  });
}
