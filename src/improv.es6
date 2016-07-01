import Input from './input.es6';
import Metronome from './objects/metronome.es6';
import Keyboard from './objects/keyboard.es6';
import Dome from './objects/dome.es6';
import Lighting from './objects/lighting.es6';

export default class Improv {
    constructor(scene) {
        scene.onCreate = this.create;
        scene.addObjects([ new Metronome(), new Dome(), new Keyboard(), new Lighting() ]);
    }

    create(scene, custom) {
        var input = new Input(scene, custom);
    }

    render(scene, custom) {}
}