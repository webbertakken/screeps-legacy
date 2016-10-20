import { Room } from 'screeps-globals';

Object.assign(Room.prototype, {

  /**
   * @description Set all initial values for the room and update memory.
   */
  initiate() {
    !this.memory.buildQueue ? this.memory.buildQueue = [] : false ;
    !this.memory.creeps ? this.memory.creeps = {} : false ;
    this.initiateSources();
    this.setHarvestersNeeded();
    this.setTrucksNeeded();
    this.setUpgradersNeeded();
    this.setBuildersNeeded();
    this.isInitiated(true);
  },

  /**
   * @description Routine for every tick
   */
  routine() {
    !this.isInitiated() ? this.initiate() : false;
    if((Game.time+2) % 12 === 0) {
      this.convertBuildFlags();
    }
    if(Game.time % 12 === 0) {
      this.fillBuildQueue();
    }
    if((Game.time-2) % 12 === 0) {
      this.updateSources();
    }
  },

  /**
   * @description Counts active creeps (except old) + queued creeps and updates room.memory, adding counts, cleaning
   *              up vanished roles.
   */
  updateRoleCounts() {
    this.memory.creeps = _(this.find(FIND_MY_CREEPS))
      .filter(c => c.isInitiated() && !c.isOld())
      .concat(this.memory.buildQueue)
      .countBy('memory.role')
      .value();
  },

  /**
   * @description Add types of creeps to buildQueue in priority order
   * @return {Boolean} Has anything been added to the queue?
   */
  fillBuildQueue() {
    this.updateRoleCounts();
    if(this.queueInitialCreeps()) {
      return true;
    }
    if (this.memory.buildQueue.length < 2) {
      return this.queueHarvesters() ||
        this.queueTrucks() ||
        this.queueUpgraders() ||
        this.queueBuilders();
    }
    return false;
  },

  /**
   * @description initial and fallback creeps, for if none of them present at all
   * @return {Boolean} Needed and successfully queued creeps?
   */
  queueInitialCreeps() {
    if (!this.memory.creeps.truck && !this.memory.creeps.harvester) {
      return this.addPriorityCreepToQueue('truck', 'truck', {}, 150) &&
        this.addPriorityCreepToQueue('harvester', 'harvester', {}, 150);
    } else if (!this.memory.creeps.harvester) {
      return !!this.addPriorityCreepToQueue('harvester', 'harvester', {}, 250);
    } else if (!this.memory.creeps.truck) {
      return !!this.addPriorityCreepToQueue('truck', 'truck', {}, 300);
    }
    return false;
  },

  /**
   * @description Determine the amount of harvesters that are needed
   * @return {number} Amount of harvesters needed
   */
  setHarvestersNeeded() {
    return this.memory.harvestersNeeded = _(this.memory.sources).filter(s => !s.isGuarded).value().length;
  },

  /**
   * @description Queue harvesters if any are needed
   * @return {boolean} Needed and successfully queued harvester?
   */
  queueHarvesters() {
    this.setHarvestersNeeded();
    if (this.memory.creeps.harvester < this.memory.harvestersNeeded) {
      return !!this.addCreepToQueue('harvester', 'harvester', {}, this.energyCapacityAvailable);
    }
    return false;
  },

  /**
   * @description Determine the amount of trucks that are needed
   * @return {number} Amount of trucks needed
   */
  setTrucksNeeded() {
    return this.memory.trucksNeeded = this.memory.harvestersNeeded;
  },

  /**
   * @description Queue trucks if any are needed
   * @return {boolean} Needed and successfully queued trucks?
   */
  queueTrucks() {
    this.setTrucksNeeded();
    if (this.memory.creeps.truck < this.memory.trucksNeeded) {
      return !!this.addCreepToQueue('truck', 'truck', {}, this.energyCapacityAvailable);
    }
    return false;
  },

  /**
   * @description Determine the amount of upgraders that are needed
   * @return {number} Amount of upgraders needed
   */
  setUpgradersNeeded() {
    return this.memory.upgradersNeeded = 1;
  },

  /**
   * @description Queue upgraders if any are needed
   * @return {boolean} Needed and successfully queued upgraders?
   */
  queueUpgraders() {
    this.setUpgradersNeeded();
    if (!this.memory.creeps.upgrader || this.memory.creeps.upgrader < this.memory.upgradersNeeded) {
      return !!this.addCreepToQueue('upgrader', 'upgrader', {}, this.energyCapacityAvailable);
    }
    return false;
  },

  /**
   * @description Determine the amount of builders that are needed
   * @return {number} Amount of builders needed
   */
  setBuildersNeeded() {
    return this.memory.buildersNeeded = 2;
  },

  /**
   * @description Queue builders if any are needed
   * @returns {boolean} Builder queued
   */
  queueBuilders() {
    this.setBuildersNeeded();
    const builders = this.memory.creeps.builder;
    if (this.controller && this.controller.level > 1 && (!builders || builders < this.memory.buildersNeeded)) {
      return !!this.addCreepToQueue('builder', 'builder', {}, this.energyCapacityAvailable);
    }
    return false;
  },

  /**
   * @description Add creep to end of buildQueue
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
    return this.memory.creeps[role] = this.memory.creeps[role] + 1 || 1;
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
    return this.memory.creeps[role] = this.memory.creeps[role] + 1 || 1;
  },

  /**
   * @description Remove creep from buildQueue
   * @param creepName
   * @return {Array} Resulting buildQueue
   */
  removeQueueItemByName(creepName) {
    return _(this.memory.buildQueue).remove(q => q.name === creepName).value();
  },

  /**
   * @description build construction site
   */
  convertBuildFlags() {
    _.forEach(this.find(FIND_FLAGS), (flag) => {
      if(flag.name === 'Tower') {
        if(flag.pos.createConstructionSite(STRUCTURE_TOWER) === OK) {
          flag.remove();
        }
      }
    });
  },

  /**
   * @description reset and fill memory.sources with the sources in this room
   */
  initiateSources() {
    this.memory.sources = [];
    _.forEach(this.find(FIND_SOURCES), (source) => {
      source.initiate();
    });
  },

  /**
   * @description check if harvesters didn't die, mark as hostile, free up source
   */
  updateSources() {
    _.forEach(this.memory.sources, (source) => {
      if(source.assignedHarvester && !Game.getObjectById(source.assignedHarvester)) {
        delete source.assignedHarvester;
        source.isGuarded = true;
      }
    });
  },

  /**
   * @description Find creeps with 'harvester' role
   * @return {Array.<Harvester>} Array of creeps
   */
  findHarvesters() {
    return _(this.find(FIND_MY_CREEPS)).filter(c => c.memory.role === 'harvester').value();
  },

  /**
   * @description Find harvesters without assigned truck
   * @return {Array.<Harvester>} Array of creeps
   */
  findLonelyHarvesters() {
    return _(this.findHarvesters()).filter(h => !h.memory.assignedTruck).value();
  },

  /**
   * @description Get or Set initiated state
   * @param setter Boolean to set for this property
   * @return {boolean} The updated value
   */
  isInitiated(setter) {
    return setter === undefined ? !!this.memory.isInitiated : this.memory.isInitiated = !!setter;
  },

  /**
   * @description Get list of all ConstructionSites in the room
   * @return {Array.<ConstructionSite>} All ConstructionSites
   */
  getAllConstructionSites() {
    if(!this._constructionSites) {
      this._constructionSites = this.find(FIND_CONSTRUCTION_SITES);
    }
    return this._constructionSites;
  },

  /**
   * @description Get list of all _my_ ConstructionSites in the room
   * @return {Array.<ConstructionSite>} My ConstructionSites
   */
  getMyConstructionSites() {
    if(!this._myConstructionSites) {
      this._myConstructionSites = _(this.getAllConstructionSites()).filter(cs => cs.my).value();
    }
    return this._myConstructionSites;
  },

  /**
   * @description Get list of all Structures in the room
   * @return {Array.<Structure>} All Structures
   */
  getAllStructures() {
    if(!this._allStructures) {
      this._allStructures = this.find(FIND_STRUCTURES);
    }
    return this._allStructures;
  },

  /**
   * @description Get list of all _my_ Structures in the room
   * @return {Array.<Structure>} My Structures
   */
  getMyStructures() {
    if(!this._myStructures) {
      this._myStructures = _(this.getAllStructures()).filter(s => s.my).value();
    }
    return this._myStructures;
  },

  /**
   * @description Get list of all Structures that do not have max hp, ordered per 100k hits
   * @return {Array.<Structure>} Structures without full hp
   */
  getRepairableStructures() {
    if(!this._repairableStructures) {
      this._repairableStructures = _(this.getAllStructures())
        .filter(s => s.hits < s.hitsMax)
        .sortBy((s) => { return Math.ceil(s.hits/100000);})
        .value();
    }
    return this._repairableStructures;
  },

  /**
   * @description Get list of ramparts (or other decaying structures) that are about to lose health
   * @return {Array.<Structure>} Decaying Structure
   */
  getDecayingRepairables() {
    if(!this._decayingRepairables) {
      this._decayingRepairables = _(this.getRepairableStructures())
        .filter(s => s.ticksToDecay && s.ticksToDecay <= 2)
        .sortBy('ticksToDecay')
        .value();
    }
    return this._decayingRepairables;
  },

  /**
   * @description Get structures below 10k hp
   * @return {Array.<Structure>} Structures below 10k
   */
  getDamagedStructures() {
    if(!this._damagedStructures) {
      this._damagedStructures = _(this.getRepairableStructures())
        .filter((structure) => {
          return structure.hits < 10000;
        })
        .value();
    }
    return this._damagedStructures;
  },

  /**
   * @description get all structures that need energy in the room
   * @return {Array.<Structure>} Structures needing energy in priority order
   */
  getStructuresNeedingEnergy() {
    if(!this._structuresNeedingEnergy) {
      this._structuresNeedingEnergy = _(this.getMyStructures())
        .filter(s => s.energyCapacity && s.energyCapacity > s.energy && s.structureType !== STRUCTURE_LINK)
        .sortBy((s) => {
          if(s.structureType === STRUCTURE_TOWER) {
            return (s.energyCapacity * .9) > s.energy ? 1 : 3;
          }
          return 2;
        })
        .value();
    }
    return this._structuresNeedingEnergy;
  },

  /**
   * @description get any storage containing energy in the room
   * @return {Array.<Structure>} Storage with energy
   */
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

  /**
   * @description Get list of all creeps in the room
   * @return {Array.<Creep>} Array of all creeps of which you are the owner
   */
  getAllCreeps() {
    if(!this._allCreeps) {
      this._allCreeps = this.find(FIND_CREEPS);
    }
    return this._allCreeps;
  },

  /**
   * @description Get list of all _my_ creeps in the room
   * @return {Array.<Creep>} Array of all creeps of which you are the owner
   */
  getMyCreeps() {
    if(!this._myCreeps) {
      this._myCreeps = _(this.getAllCreeps()).filter(c => c.my).value();
    }
    return this._myCreeps;
  },

  /**
   * @description Get creeps that need to be refilled with energy
   * @return {Array.<Creep>} Creeps that need energy
   */
  getCreepsNeedingEnergy() {
    if(!this._creepsNeedingEnergy) {
      this._creepsNeedingEnergy = _(this.getMyCreeps())
        .filter(c => !c.isOld() && !c.isGoodAsFull() && (c.memory.role === 'upgrader' || c.memory.role === 'builder'))
        .sortBy(c => c.carry.energy / c.carryCapacity)
        .value();
    }
    return this._creepsNeedingEnergy;
  },

  /**
   * @description Determine all targets that need energy
   * @todo revisit this function
   * @return {Array.<*>|*}
   */
  getTargetsNeedingEnergy() {
    if(!this._targetsNeedingEnergy) {
      this._targetsNeedingEnergy = []
        .concat(this.getStructuresNeedingEnergy())
        .concat(this.getCreepsNeedingEnergy());
    }
    return this._targetsNeedingEnergy;
  },

});
