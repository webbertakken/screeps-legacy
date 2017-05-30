import {Room} from 'screeps-globals';

Object.assign(Room.prototype, {

  /**
   * @description Routine for every tick
   */
  routine() {

  },

  /**
   * @description Set all initial values for the room and update memory.
   */
  initiate() {
    // Only initiate when needed
    if (this.isInitiated()) {
      return;
    }

    // Setup Room Memory
    try {
      !this.memory.buildQueue ? this.memory.buildQueue = [] : false;
      !this.memory.creeps ? this.memory.creeps = {} : false;
      this.initiateSources();

      this.isInitiated(true);
    }
    catch (ex) {
      console.log('Error initiating the room: ' + ex.stack);
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
   *
   * @return {Boolean} Has anything been added to the queue?
   */
  fillBuildQueue() {
    this.updateRoleCounts();
    if (this.queueInitialCreeps()) {
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
   *
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
   * @description Add creep to end of buildQueue
   *
   * @todo: revisit the maxEnergy part
   *
   * @param role      {String}  Role that creep will get
   * @param template  {String}  Reference to template to generate creep from
   * @param memory    {Object}  Memory to assign to creep on spawn.
   * @param maxEnergy {Number}  Maximum amount of energy the room can spend
   *
   * @return {Number} new count for this role
   */
  addCreepToQueue(role, template, memory, maxEnergy, priority = false) {
    // Add role to memory object
    Object.assign(memory, {role: role});

    // Construct QueueItem
    const QueueItem = {
      role: role,
      template: template,
      memory: memory,
      maxEnergy: maxEnergy,
    };

    // Add with or without priority
    if (priority === true) {
      this.memory.buildQueue.unshift(QueueItem);
    } else {
      this.memory.buildQueue.push(QueueItem);
    }

    // Update memory with new amount of creeps for this role
    return this.memory.creeps[role] = this.memory.creeps[role] + 1 || 1;
  },

  /**
   * @Description Add creep to start of buildQueue
   *
   * @param role      {String}  Role that creep will get
   * @param template  {String}  Reference to template to generate creep from
   * @param memory    {Object}  Memory to assign to creep on spawn.
   * @param maxEnergy {Number}  Maximum amount of energy the room can spend
   *
   * @return {Number} new count for this role
   */
  addPriorityCreepToQueue(role, template, memory, maxEnergy) {
    return this.addCreepToQueue(role, template, memory, maxEnergy, true);
  },

  /**
   * @description Remove creep from buildQueue
   *
   * @param creepName
   *
   * @return {Array} Resulting buildQueue
   */
  removeQueueItemByName(creepName) {
    return _(this.memory.buildQueue).remove(q => q.name === creepName).value();
  },

  /**
   * @description build construction site
   *
   * @todo: Make this function generic
   * @todo: Move function to helper class
   */
  convertBuildFlags() {
    _.forEach(this.find(FIND_FLAGS), (flag) => {
      if (flag.name === 'Tower') {
        if (flag.pos.createConstructionSite(STRUCTURE_TOWER) === OK) {
          flag.remove();
        }
      }
    });
  },

  /**
   * @description reset and fill memory.sources with the sources in this room
   *
   * @todo: make sure this works when a room gets reinitiated as well
   */
  initiateSources() {
    this.memory.sources = [];
    _.forEach(this.find(FIND_SOURCES), (source) => {
      source.initiate();
    });
  },

  /**
   * @description Get or Set initiated state
   *
   * @param setter Boolean to set for this property
   *
   * @return {boolean} The updated value
   */
  isInitiated(setter) {
    return setter === undefined ? !!this.memory.isInitiated : this.memory.isInitiated = !!setter;
  },

  /**
   * @description Get list of all ConstructionSites in the room
   *
   * @return {Array.<ConstructionSite>} All ConstructionSites
   */
  getAllConstructionSites() {
    if (!this._constructionSites) {
      this._constructionSites = this.find(FIND_CONSTRUCTION_SITES);
    }
    return this._constructionSites;
  },

  /**
   * @description Get list of all _my_ ConstructionSites in the room
   *
   * @return {Array.<ConstructionSite>} My ConstructionSites
   */
  getMyConstructionSites() {
    if (!this._myConstructionSites) {
      this._myConstructionSites = _(this.getAllConstructionSites()).filter(cs => cs.my).value();
    }
    return this._myConstructionSites;
  },

  /**
   * @description Get list of all Structures in the room
   *
   * @return {Array.<Structure>} All Structures
   */
  getAllStructures() {
    if (!this._allStructures) {
      this._allStructures = this.find(FIND_STRUCTURES);
    }
    return this._allStructures;
  },

  /**
   * @description Get list of all _my_ Structures in the room
   *
   * @return {Array.<Structure>} My Structures
   */
  getMyStructures() {
    if (!this._myStructures) {
      this._myStructures = _(this.getAllStructures()).filter(s => s.my).value();
    }
    return this._myStructures;
  },

  /**
   * @description Get list of all Structures that do not have max hp, ordered per 100k hits
   *
   * @todo: make sure this is actually usable (walls, ramparts, more?)
   *
   * @return {Array.<Structure>} Structures without full hp
   */
  getRepairableStructures() {
    if (!this._repairableStructures) {
      this._repairableStructures = _(this.getAllStructures())
        .filter(s => s.hits < s.hitsMax)
        .sortBy((s) => {
          return Math.ceil(s.hits / 100000);
        })
        .value();
    }
    return this._repairableStructures;
  },

  /**
   * @description Get list of ramparts (or other decaying structures) that are about to lose health
   *
   * @todo: revise ticksToDecay
   *
   * @return {Array.<Structure>} Decaying Structure
   */
  getDecayingRepairables() {
    if (!this._decayingRepairables) {
      this._decayingRepairables = _(this.getRepairableStructures())
        .filter(s => s.ticksToDecay && s.ticksToDecay <= 2)
        .sortBy('ticksToDecay')
        .value();
    }
    return this._decayingRepairables;
  },

  /**
   * @description Get structures below 10k hp
   *
   * @todo: Properly distinguish between walls and other structures
   *
   * @return {Array.<Structure>} Structures below 10k
   */
  getDamagedStructures() {
    if (!this._damagedStructures) {
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
   *
   * @todo: Revise this entire function
   *
   * @return {Array.<Structure>} Structures needing energy in priority order
   */
  getStructuresNeedingEnergy() {
    if (!this._structuresNeedingEnergy) {
      this._structuresNeedingEnergy = _(this.getMyStructures())
        .filter(s => s.energyCapacity && s.energyCapacity > s.energy && s.structureType !== STRUCTURE_LINK)
        .sortBy((s) => {
          if (s.structureType === STRUCTURE_TOWER) {
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
   *
   * @todo: Revise this to actually be reliable
   *
   * @return {Array.<Structure>} Storage with energy
   */
  getStorageWithEnergy() {
    if (!this._storageWithEnergy) {
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
   *
   * @return {Array.<Creep>} Array of all creeps of which you are the owner
   */
  getAllCreeps() {
    if (!this._allCreeps) {
      this._allCreeps = this.find(FIND_CREEPS);
    }
    return this._allCreeps;
  },

  /**
   * @description Get list of all _my_ creeps in the room
   *
   * @return {Array.<Creep>} Array of all creeps of which you are the owner
   */
  getMyCreeps() {
    if (!this._myCreeps) {
      this._myCreeps = _(this.getAllCreeps()).filter(c => c.my).value();
    }
    return this._myCreeps;
  },

  /**
   * @description Get creeps that need to be refilled with energy
   *
   * @deprecated
   * @todo: Rewrite this into a different mechanic
   *
   * @return {Array.<Creep>} Creeps that need energy
   */
  getCreepsNeedingEnergy() {
    if (!this._creepsNeedingEnergy) {
      this._creepsNeedingEnergy = _(this.getMyCreeps())
        .filter(c => !c.isOld() && !c.isGoodAsFull() && (c.memory.role === 'upgrader' || c.memory.role === 'builder'))
        .sortBy(c => c.carry.energy / c.carryCapacity)
        .value();
    }
    return this._creepsNeedingEnergy;
  },

  /**
   * @description Determine all targets that need energy
   *
   * @todo revisit this function (see todo's for sub functions)
   *
   * @return {Array.<*>|*}
   */
  getTargetsNeedingEnergy() {
    if (!this._targetsNeedingEnergy) {
      this._targetsNeedingEnergy = []
        .concat(this.getStructuresNeedingEnergy())
        .concat(this.getCreepsNeedingEnergy());
    }
    return this._targetsNeedingEnergy;
  },

});
