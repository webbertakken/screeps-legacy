Object.assign(component, {

  creep: {

    routine: function (creep) {

      let cMemory = creep.memory;
      ai[cMemory.role].routine(creep);

    }

  }

});