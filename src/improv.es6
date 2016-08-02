import Input from './input.es6';
import Metronome from './objects/metronome.es6';
import Keyboard from './objects/keyboard.es6';
import Dome from './objects/dome.es6';
import FloatingParticles from './objects/floatingparticles.es6';
import Lighting from './objects/lighting.es6';

export default class Improv {
    constructor(scene) {
        scene.onCreate = this.create;
        scene.addObjects([
            new Metronome(),
            new FloatingParticles(),
            new Dome(),
            new Keyboard({ assets: './assets/keyboardkey.json' }),
            new Lighting() ]);
    }

    create(scene, custom) {
        scene.renderer.gammaInput = true;
        scene.renderer.gammaOutput = true;
    }

    render(scene, custom) {}
}