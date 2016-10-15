import { Room } from 'screeps-globals';

Object.assign(Room.prototype, {

  initiate() {
    !this.memory.buildQueue ? this.memory.buildQueue = [] : false ;
    !this.memory.creeps ? this.memory.creeps = {} : false ;
    this.resetSources();
    this.setHarvestersNeeded();
    this.setTrucksNeeded();
    this.memory.upgradersNeeded = 1;
    this.isInitiated(true);
  },

  routine() {
    this.isInitiated() ? false : this.initiate() ;
    if(Game.time % 12 === 0) {
      this.countRoles();
      this.populate();
    }
    if(Game.time % 30 === 0) {
      this.checkSourcesHarvesters();
    }
  },

  populate() {
    if (this.memory.buildQueue.length >= 5) {
      return;
    }
    // initial creeps
    if (!this.memory.creeps.harvester) {
      this.addCreepToQueue('harvester', 'starterHarvester', {});
    }
    if (!this.memory.creeps.truck) {
      this.addCreepToQueue('truck', 'starterTruck', {});
    }
    // normal queue fill
    if (this.memory.creeps.harvester < this.memory.harvestersNeeded) {
      this.addCreepToQueue('harvester', 'initialHarvester', {});
    }
    if (this.memory.creeps.truck < this.memory.trucksNeeded) {
      this.addCreepToQueue('truck', 'initialTruck', {});
    }
    if (!this.memory.creeps.upgrader || this.memory.creeps.upgrader < this.memory.upgradersNeeded) {
      this.addCreepToQueue('upgrader', 'initialUpgrader', {});
    }
  },

  /**
   * @Description Add creep to end of buildQueue
   *
   * @param role      {String}  Role that creep will get
   * @param template  {String}  Reference to template to generate creep from
   * @param memory    {Object}  Memory to assign to creep on spawn.
   */
  addCreepToQueue(role, template, memory) {
    Object.assign(memory, { role: role });
    this.memory.buildQueue.push({
      role: role,
      template: template,
      memory: memory,
    });
    this.memory.creeps[role] = this.memory.creeps[role] + 1 || 1;
  },

  /**
   * @Description Add creep to start of buildQueue
   *
   * @param role      {String}  Role that creep will get
   * @param template  {String}  Reference to template to generate creep from
   * @param memory    {Object}  Memory to assign to creep on spawn.
   */
  addPriorityCreepToQueue(role, template, memory) {
    Object.assign(memory, { role: role });
    this.memory.buildQueue.unshift({
      role: role,
      template: template,
      memory: memory,
    });
    this.memory.creeps[role] = this.memory.creeps[role] + 1 || 1;
  },

  /**
   * @Description Counts active creeps (except old) + queued creeps and updates room.memory, adding counts, cleaning
   *              up vanished roles.
   */
  countRoles() {
    this.memory.creeps = _(this.find(FIND_MY_CREEPS))
      .filter(c => c.isInitiated() && !c.isOld())
      .concat(this.memory.buildQueue)
      .countBy('memory.role')
      .value();
  },

  /**
   * @Description reset and fill memory.sources with the sources in this room
   */
  resetSources() {
    this.memory.sources = [];
    _.forEach(this.find(FIND_SOURCES), (source) => {
      this.memory.sources.push({
        'id': source.id,
        'energyCapacity': source.energyCapacity,
        'pos': source.pos,
      });
    });
  },

  /**
   * @Description check if harvesters didn't die, mark as hostile, free up source
   */
  checkSourcesHarvesters() {
    _.forEach(this.memory.sources, (source) => {
      if(source.assignedHarvester && !Game.getObjectById(source.assignedHarvester)) {
        delete source.assignedHarvester;
        source.isGuarded = true;
      }
    });
    this.setHarvestersNeeded();
    this.setTrucksNeeded();
  },

  removeQueueItemByName(creepName) {
    return _.remove(this.memory.buildQueue, q => q.name === creepName);
  },

  findHarvesters() {
    return this.find(FIND_MY_CREEPS).filter(c => c.memory.role === 'harvester');
  },

  findLonelyHarvesters() {
    return _.filter(this.findHarvesters(), h => !h.memory.assignedTruck);
  },

  isInitiated(setter) {
    return setter === undefined ? !!this.memory.isInitiated : this.memory.isInitiated = !!setter;
  },

  getMyStructures() {
    if(!this._myStructures) {
      this._myStructures = this.find(FIND_MY_STRUCTURES);
    }
    return this._myStructures;
  },

  getStructuresNeedingEnergy() {
    if(!this._structuresNeedingEnergy) {
      this._structuresNeedingEnergy = _(this.getMyStructures())
        .filter(s => s.energyCapacity && s.energyCapacity > s.energy)
        .value();
    }
    return this._structuresNeedingEnergy;
  },

  getMyCreeps() {
    if(!this._myCreeps) {
      this._myCreeps = this.find(FIND_MY_CREEPS);
    }
    return this._myCreeps;
  },

  getCreepsNeedingEnergy() {
    if(!this._creepsNeedingEnergy) {
      this._creepsNeedingEnergy = _(this.getMyCreeps())
        .filter(c => !c.isOld() && !c.isFull() && (c.memory.role === 'upgrader' || c.memory.role === 'builder'))
        .value();
    }
    return this._creepsNeedingEnergy;
  },

  getTargetsNeedingEnergy() {
    if(!this._targetsNeedingEnergy) {
      this._targetsNeedingEnergy = []
        .concat(this.getStructuresNeedingEnergy())
        .concat(this.getCreepsNeedingEnergy());
    }
    return this._targetsNeedingEnergy;
  },

  setHarvestersNeeded() {
    return this.memory.harvestersNeeded = _.filter(this.memory.sources, s => !s.isGuarded).length;
  },

  setTrucksNeeded() {
    return this.memory.trucksNeeded = this.memory.harvestersNeeded;
  }

});
