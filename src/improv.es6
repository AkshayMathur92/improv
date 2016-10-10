import Metronome from './objects/metronome.es6';
import Keyboard from './objects/keyboard.es6';
import Dome from './objects/dome.es6';
import FloatingParticles from './objects/floatingparticles.es6';
import Lighting from './objects/lighting.es6';
import TonePlayback from './toneplayback.es6';

export default class Improv {
    constructor(scene, params) {
        scene.onCreate = this.create;
        scene.addObjects([
            new Metronome(),
            new FloatingParticles(),
            new Dome(),
            new Keyboard({
                assets: './assets/models/keyboardkey.json',
                input: params.input }),
            new Lighting() ]);

        TonePlayback.loadInstrument(TonePlayback.PIANO, './assets/audio/soundfont/');
        TonePlayback.loadInstrument(TonePlayback.SYNTHDRUM, './assets/audio/soundfont/');

        document.addEventListener('keydown', event => this.onKeyDown(event) );
    }

    /**
     * on keydown
     * @param event
     */
    onKeyDown(event) {
        if (event.code === 'Space') {
            switch (TonePlayback.playerState) {
                case 'ready': TonePlayback.play('./assets/audio/Bonnie_Tyler_-_Total_Eclipse_of_the_Heart.mid'); break;
                case 'playing': TonePlayback.pause(); break;
                case 'paused': TonePlayback.resume(); break;
            }
        }
    }

    create(scene, custom) {
        scene.renderer.gammaInput = true;
        scene.renderer.gammaOutput = true;
    }

    render(scene, custom) {}
}