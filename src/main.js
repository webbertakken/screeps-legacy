/**
 * @Description: Home brew AI Script for Screeps
 * @See: https://github.com/webbertakken/screeps
 */
'use strict';

// Import in order
import 'screeps-perf';
import game from './controller/Game';
import './controller/Source';
import './controller/RoomPosition';
import './controller/Room';
import './controller/Creep';
import './controller/Structure';
import creepMapper from './util/creepMapper';
import structureMapper from './util/structureMapper';
import profiler from 'screeps-profiler';

// Enable profiler
profiler.enable();

// Loop through game ticks
export function loop() {
  profiler.wrap(() => {
    game.init();
    // Creeps (Mapped by role)
    _.forEach(creepMapper.creeps(), (creep) => {
      creep.routine();
    });
    // Rooms
    _.forEach(Object.keys(Game.rooms), (roomName) => {
      Game.rooms[roomName].routine();
    });
    //Structures (Mapped by structureType)
    _.forEach(structureMapper.structures(), (structure) => {
      structure.routine();
    });
    // Clean Memory
    if(Game.time % 100 === 0) {
      Game.cleanMemoryCreeps();
      Game.cleanMemoryRooms();
    }
  });
}
