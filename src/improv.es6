import Metronome from './objects/metronome.es6';
import Keyboard from './objects/keyboard.es6';
import Dome from './objects/dome.es6';
import FloatingParticles from './objects/floatingparticles.es6';
import Lighting from './objects/lighting.es6';
import TonePlayback from './toneplayback.es6';

export default class Improv {
    constructor(scene, configURI) {
        this._scene = scene;
        this._request = new XMLHttpRequest();
        this._request.onreadystatechange = () => this.onConfigLoaded();
        this._request.open('GET', configURI);
        this._request.send();
    }

    /**
     * on config loaded
     */
    onConfigLoaded() {
        if (this._request.readyState === XMLHttpRequest.DONE) {
            if (this._request.status === 200) {
                var config = JSON.parse(this._request.responseText);
                this.setup(config);
            } else {
                console.log('There was a problem with the request.');
            }
        }
    }
    /**
     * setup app
     * @param config
     */
    setup(config) {
        this._scene.onCreate = this.create;
        this._scene.addObjects([
            new Metronome(),
            new FloatingParticles(),
            new Dome(),
            new Keyboard({
                shape: config.keyboard.shape,
                assets: './assets/models/keyboardkey.json',
                input: config.input }),
            new Lighting() ]);

        for (var c = 0; c < config.sound.soundfonts.length; c++) {
            TonePlayback.loadInstrument(config.sound.soundfonts[c], config.sound.soundfontlocation);
        }
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