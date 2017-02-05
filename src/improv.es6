import Metronome from './objects/metronome.es6';
import CircularKeyboard from './objects/keyboards/circularkeyboard.es6';
import TraditionalKeyboard from './objects/keyboards/traditionalkeyboard.es6';
import Dome from './objects/dome.es6';
import ParticleSwarm from './objects/particleflock.es6';
import ParticlesFloating from './objects/floatingparticles.es6';
import Lighting from './objects/lighting.es6';
import TonePlayback from './toneplayback.es6';
import Input from './input.es6';
import Style from './themeing/style.es6';
import Note from './musictheory/note.es6';
import NotationTextDisplay from './objects/notationtextdisplay.es6';

export default class Improv {
    constructor(scene, configURI) {
        /**
         * current key signature
         * @type {String}
         */
        this.currentKeySignature = null;

        /**
         * inactivity timer for suggestions
         * @type {null}
         * @private
         */
        this._inactivityTimer = null;

        this._scene = scene;
        this._request = new XMLHttpRequest();
        this._request.onreadystatechange = () => this.onConfigLoaded();
        this._request.open('GET', configURI);
        this._request.send();
        this._lastKey = { key: '', score: 0 };
    }

    /**
     * on key change
     * @param keys
     */
    onKeyInputChange(event) {
        var newKey = event.predictedKey[0];
        for (var c = 0; c < event.predictedKey.length; c++) {
            if (event.predictedKey[c].key === this._lastKey.key) {
                this._lastKey.score = event.predictedKey[c].score;
            }
        }
        if (this._lastKey.key !== newKey.key) {
            var delta = Math.abs(this._lastKey.score - event.predictedKey[0].score);
            if (delta < 1) {
                newKey = this._lastKey;
            }
        }
        this._lastKey = newKey;

        clearTimeout(this._inactivityTimer);
        this._inactivityTimer = setTimeout( () => this.onInactivityTimeout(), 5000);

        this._keyboard.toggleKeyPressed({
            notation: event.changed.notation,
            octave: event.changed.octave,
            velocity: event.changed.velocity });

        if (event.predictedKey.length > 0 && this.currentKeySignature !== event.predictedKey[0].key) {
            var minor = (event.predictedKey[0].key.indexOf('m') > -1);
            this._notationtextdisplay.setText(event.predictedKey[0].key);
            this._keyboard.changeKeySignature(event.predictedKey[0].key);
            this._hudKeyboard.changeKeySignature(event.predictedKey[0].key);
            this.currentKeySignature = event.predictedKey[0].key;
            this._metronome.setHitColor(Style.colorwheelHighSaturation[Note.indexOfNotation(event.predictedKey[0].key)]);
            this._particles.setColor(Style.colorwheelHighSaturation[Note.indexOfNotation(event.predictedKey[0].key)]);
         //   this._dome.setEmissive(minor ? 0x1a1a1a : Style.dome.emissive);
            this._lights.setIntensity(minor ? 2 : 4);
            //this._swarm.setColor(Style.colorwheelHighSaturation[Note.indexOfNotation(newKey.key)]);
        }

        //this._keyboard.toggleKeyPressed(key[octave], event.changed.velocity);
         /*var key = this.findKeyObjectsForNotation(event.changed.notation);
         var octave;
         if (event.changed.octave / 2 === Math.floor(event.changed.octave / 2)) {
            octave = 1;
         } else {
            octave = 0;
         }

         this.toggleKeyPressed(key[octave], event.changed.velocity);

         if (event.predictedKey.length > 0 && event.predictedKey[0] !== this.currentKeySignature) {
            this.onKeySignatureChange(event.predictedKey[0].key);
         }*/
     }

    /**
     * inactivity timeout
     */
    onInactivityTimeout() {
        this._keyboard.resetKeys();
        this._hudKeyboard.resetKeys();
        this._input.clearPredictionHistory();
        this._metronome.setHitColor();
        this._particles.setColor();
        this._notationtextdisplay.setText();
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
     * @param config
     */
    setup(config) {
        this._scene.onCreate = this.create;

        this._input = new Input(config.input, (keys) => this.onKeyInputChange(keys) );
        this._keyboard = new TraditionalKeyboard(config.keyboard);
        this._hudKeyboard = new CircularKeyboard(config.notationdisplay);
        this._metronome = new Metronome(config.metronome);
        this._notationtextdisplay = new NotationTextDisplay();
        this._dome = new Dome();
        this._lights = new Lighting();
        //this._swarm = new ParticleSwarm();
        this._particles = new ParticlesFloating();

        this._scene.addObjects([
            this._metronome,
            //this._swarm,
            this._dome,
            this._notationtextdisplay,
            this._keyboard,
            this._hudKeyboard,
            this._lights,
            this._particles]);

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
