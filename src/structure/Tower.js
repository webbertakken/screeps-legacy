import '../controller/Structure';

export default class Tower extends StructureTower {

  /**
   * @see http://support.screeps.com/hc/en-us/articles/203339002-Defending-your-room
   */

  performRole() {
    let targets = {};
    var room = this.room;

    /**
     * priority order
     */

    // things to always shoot at
    if (this.energy > 0) {
      targets = room.find(FIND_HOSTILE_CREEPS);
      if (targets.length) {
        this.attackClosestTarget(this, targets);
        return;
      }
      // attack enemy military structures //STRUCTURE_TOWER
      targets = room.find(FIND_HOSTILE_STRUCTURES, {
        filter: function(structure) {
          return structure.structureType == STRUCTURE_TOWER;
        },
      });
      if (targets.length) {
        this.attackClosestTarget(this, targets);
        return;
      }
    }

    if (this.energy > this.energyCapacity / 4) {
      // attack hostile construction sites //FIND_HOSTILE_CONSTRUCTION_SITES
      targets = room.find(FIND_HOSTILE_CONSTRUCTION_SITES);
      if (targets.length) {
        this.attackClosestTarget(this, targets);
        return;
      }
    }
    if (this.energy > this.energyCapacity / 2) {

      // attack enemy primary structures //STRUCTURE_TOWER
      targets = room.find(FIND_HOSTILE_SPAWNS);
      if (targets.length) {
        this.attackClosestTarget(this, targets);
        return;
      }
      // attack enemy //FIND_HOSTILE_STRUCTURES
      targets = room.find(FIND_HOSTILE_STRUCTURES);
      if (targets.length) {
        this.attackClosestTarget(this, targets);
      }
      targets = room.find(FIND_MY_STRUCTURES, {
        filter: function(structure) {
          return structure.structureType == STRUCTURE_TOWER && structure.hitsMax > structure.hits;
        },
      });
      if (targets.length) {
        return this.repairClosestTarget(this, targets);
      }
    }

    if (this.energy > (this.energyCapacity / 4) * 3) {
      // heal friendly non-military creeps
      targets = room.find(FIND_MY_CREEPS, {
        filter: function(creep) {
          return creep.hitsMax > creep.hits;
        },
      });
      if (targets.length) {
        return this.healClosestTarget(this, targets);
      }
      // repair friendly buildings
      targets = room.find(FIND_MY_STRUCTURES, {
        filter: function(structure) {
          return structure.hitsMax > structure.hits && structure.structureType != STRUCTURE_RAMPART;
        }
      });
      if (targets.length) {
        return this.repairClosestTarget(this, targets);
      }
    }
    if (this.energy > (this.energyCapacity / 10) * 9) {
      // repair roads
      targets = room.find(FIND_STRUCTURES, {
        filter: function(structure) {
          return structure.structureType == STRUCTURE_ROAD && structure.hitsMax > structure.hits;
        },
      });
      if (targets.length) {
        return this.repairClosestTarget(this, targets);
      }
      // prevent rampart from decaying
      targets = this.room.getDecayingRepairables();
      if (targets.length) {
        return this.repairLowestTarget(this, targets);
      }
    }
    return targets;
  }

  attackClosestTarget = function(entity, targets) {
    var target = entity.pos.findClosestByRange(targets);
    var attackCode = entity.attack(target);
    if (attackCode != 0) {
      console.log('Attacking failed, for unknown reason with code: ' + attackCode);
    }
  };

  healClosestTarget = function(entity, targets) {
    var target = entity.pos.findClosestByRange(targets);
    var healCode = entity.heal(target);
    if (healCode != 0) {
      console.log('Repairing failed, for unknown reason with code: ' + healCode);
    }
  };

  repairClosestTarget = function(entity, targets) {
    var target = entity.pos.findClosestByRange(targets);
    var repairCode = entity.repair(target);
    if (repairCode != 0) {
      console.log('Repairing failed, for unknown reason with code: ' + repairCode);
    }
  };

  repairLowestTarget = function(entity, targets) {
    var target = _.min(targets, target => target.hits);
    var repairCode = entity.repair(target);
    if (repairCode != 0) {
      console.log('Repairing failed, for unknown reason with code: ' + repairCode);
    }
  };

  repairFirstTarget = function(entity, targets) {
    if (!targets[0]) {
      return;
    }
    var target = targets[0];
    var repairCode = entity.repair(target);
    if (repairCode !== OK) {
      console.log('Repairing failed, for unknown reason with code: ' + repairCode);
    }
  };

}
