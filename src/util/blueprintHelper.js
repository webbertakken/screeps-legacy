const blueprintHelper = {

  calculateMaxCosts(bp) {
    return this.calculateCosts(bp.body.concat(bp.additionalParts));
  },

  calculateCosts(body) {
    let cost = 0;
    _.forEach(body, (part) => {
      const bodyPart = typeof part === 'string' ? part : part.type;
      cost += BODYPART_COST[bodyPart];
    });
    return cost;
  },

  sortBodyParts(body) {
    return _.sortBy(body, p => _.indexOf([TOUGH,MOVE,WORK,CARRY,ATTACK,RANGED_ATTACK,HEAL,CLAIM],p));
  },

  generateBody(bp) {
    if(bp.energy < this.calculateCosts(bp.body)) {
      return false;
    }
    if(bp.energy > this.calculateMaxCosts(bp)) {
      bp.energy = this.calculateMaxCosts(bp);
    }
    while( this.calculateCosts(bp.body) < bp.energy ) {
      bp.body.push(bp.additionalParts.shift());
    }
    while( this.calculateCosts(bp.body) > bp.energy ) {
      bp.body.pop();
    }
    bp.body = this.sortBodyParts(bp.body);
    return bp.body;
  }

};

export default blueprintHelper;
