import '../controller/Structure';

export default class Controller extends StructureController {

  actLikeOne(structure) {
    structure.say('hello');
    console.log('i am controller');
  }

}
