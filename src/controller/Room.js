import { Room } from 'screeps-globals';

Object.assign(Room.prototype, {

  initiate() {
    !this.memory.buildQueue ? this.memory.buildQueue = [] : false ;
    !this.memory.creeps ? this.memory.creeps = {} : false ;
    this.resetSources();
    this.setHarvestersNeeded();
    this.setTrucksNeeded();
    this.memory.upgradersNeeded = 1;
    this.memory.buildersNeeded = 2;
    this.isInitiated(true);
  },

  routine() {
    !this.isInitiated() ? this.initiate() : false;
    if(Game.time % 12 === 0) {
      this.countRoles();
      this.populate();
    }
    if(Game.time % 30 === 0) {
      this.checkSourcesHarvesters();
    }
  },

  populate() {
    if (this.memory.buildQueue.length <= 2) {
      this.queueInitialCreeps();
      this.queueHarvesters();
      this.queueTrucks();
      this.queueUpgraders();
      this.queueBuilders();
    }
  },

  queueInitialCreeps() {
    if (!this.memory.creeps.harvester) {
      this.addCreepToQueue('harvester', 'harvester', {}, 150);
    }
    if (!this.memory.creeps.truck) {
      this.addCreepToQueue('truck', 'truck', {}, 150);
    }
  },

  queueHarvesters() {
    if (this.memory.creeps.harvester < this.memory.harvestersNeeded) {
      this.addCreepToQueue('harvester', 'harvester', {}, this.energyCapacityAvailable);
    }
  },

  queueTrucks() {
    if (this.memory.creeps.truck < this.memory.trucksNeeded) {
      this.addCreepToQueue('truck', 'truck', {}, this.energyCapacityAvailable);
    }
  },

  queueUpgraders() {
    if (!this.memory.creeps.upgrader || this.memory.creeps.upgrader < this.memory.upgradersNeeded) {
      this.addCreepToQueue('upgrader', 'upgrader', {}, this.energyCapacityAvailable);
    }
  },

  queueBuilders() {
    if (this.controller && this.controller.level > 1 && !this.memory.creeps.builder ||
      this.memory.creeps.builder < this.memory.buildersNeeded) {
      this.addCreepToQueue('builder', 'builder', {}, this.energyCapacityAvailable);
    }
  },

  /**
   * @Description Add creep to end of buildQueue
   *
   * @param role      {String}  Role that creep will get
   * @param template  {String}  Reference to template to generate creep from
   * @param memory    {Object}  Memory to assign to creep on spawn.
   * @param maxEnergy {Number}  Maximum amount of energy the room can spend
   */
  addCreepToQueue(role, template, memory, maxEnergy) {
    Object.assign(memory, { role: role });
    this.memory.buildQueue.push({
      role: role,
      template: template,
      memory: memory,
      maxEnergy: maxEnergy,
    });
    this.memory.creeps[role] = this.memory.creeps[role] + 1 || 1;
  },

  /**
   * @Description Add creep to start of buildQueue
   *
   * @param role      {String}  Role that creep will get
   * @param template  {String}  Reference to template to generate creep from
   * @param memory    {Object}  Memory to assign to creep on spawn.
   * @param maxEnergy {Number}  Maximum amount of energy the room can spend
   */
  addPriorityCreepToQueue(role, template, memory, maxEnergy) {
    Object.assign(memory, { role: role });
    this.memory.buildQueue.unshift({
      role: role,
      template: template,
      memory: memory,
      maxEnergy: maxEnergy,
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
    return _(this.memory.buildQueue).remove(q => q.name === creepName).value();
  },

  findHarvesters() {
    return _(this.find(FIND_MY_CREEPS)).filter(c => c.memory.role === 'harvester').value();
  },

  findLonelyHarvesters() {
    return _(this.findHarvesters()).filter(h => !h.memory.assignedTruck).value();
  },

  isInitiated(setter) {
    return setter === undefined ? !!this.memory.isInitiated : this.memory.isInitiated = !!setter;
  },

  getAllConstructionSites() {
    if(!this._constructionSites) {
      this._constructionSites = this.find(FIND_CONSTRUCTION_SITES);
    }
    return this._constructionSites;
  },

  getMyConstructionSites() {
    if(!this._myConstructionSites) {
      this._myConstructionSites = _(this.getAllConstructionSites()).filter(cs => cs.my).value();
    }
    return this._myConstructionSites;
  },

  getAllStructures() {
    if(!this._allStructures) {
      this._allStructures = this.find(FIND_STRUCTURES);
    }
    return this._allStructures;
  },

  getMyStructures() {
    if(!this._myStructures) {
      this._myStructures = _(this.getAllStructures()).filter(s => s.my).value();
    }
    return this._myStructures;
  },

  getStructuresNeedingEnergy() {
    if(!this._structuresNeedingEnergy) {
      this._structuresNeedingEnergy = _(this.getMyStructures())
        .filter(s => s.energyCapacity && s.energyCapacity > s.energy && s.structureType !== STRUCTURE_LINK).value();
    }
    return this._structuresNeedingEnergy;
  },

  getStorageWithEnergy() {
    if(!this._storageWithEnergy) {
      this._storageWithEnergy = _(this.getAllStructures()).filter((s) => {
        return s.store && RESOURCE_ENERGY in s.store &&
        s.structureType === STRUCTURE_CONTAINER ||
        s.structureType === STRUCTURE_STORAGE;
      }).value();
    }
    return this._storageWithEnergy;
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
        .sortBy('carry.energy')
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
    return this.memory.harvestersNeeded = _(this.memory.sources).filter(s => !s.isGuarded).value().length;
  },

  setTrucksNeeded() {
    return this.memory.trucksNeeded = this.memory.harvestersNeeded;
  }

});
