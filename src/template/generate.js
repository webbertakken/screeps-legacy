module.exports = {
  generate() {

  },
  sortBodyParts(body) {
    return _.sortBy(body, p => _.indexOf([TOUGH,MOVE,WORK,CARRY,ATTACK,RANGED_ATTACK,HEAL,CLAIM],p));
  }
};
