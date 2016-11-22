import BaseGroup from '../../../node_modules/trivr/src/basegroup.es6';
import Input from '../../input.es6';
import Note from '../../musictheory/note.es6';
import Style from '../../themeing/style.es6';
import Utils from '../../utils.es6';
import TonePlayback from '../../toneplayback.es6';

export default class BaseKeyboard extends BaseGroup {
    onInitialize(params) {
        /**
         * how much rotation occurs on keypress
         * @type {number}
         * @private
         */
        this._rotationOnPress = Math.PI/16;

        /**
         * number of octaves
         * @type {number}
         * @private
         */
        this._numOctaves = params.octaves ? params.octaves : 2;

        /**
         * starting octave (to better match with MIDI input)
         * @type {number}
         * @private
         */
        this._startingOctave = params.startoctave ? params.startoctave : 0;

        /**
         * starting note on keyboard
         * @type {string}
         * @private
         */
        this._startingNote = 'C';

        /**
         * inactivity timer for suggestions
         * @type {null}
         * @private
         */
        this._inactivityTimer = null;

        /**
         * key visuals
         * @type {Array}
         * @private
         */
        this._keys = [];

        /**
         * midi channels used
         * @type {Array}
         * @private
         */
        this._midichannels = [];

        /**
         * starting index at which point to allocate MIDI channels
         * @type {number}
         * @private
         */
        this._midiChannelStartIndex = 11;

        /**
         * keyboard/key input
         * @type {$ES6_ANONYMOUS_CLASS$}
         * @private
         */
        //this._input = new Input(params.input, (keys) => this.onKeyInputChange(keys) );

        /**
         * suggested keys from key signature prediction
         * @type {Array}
         */
        //this.suggestedKeys = [];

        /**
         * current key signature
         * @type {String}
         */
        //this.currentKeySignature = null;
    }
    /**
     * on create scene (or earliest possible opportunity)
     * @param scene
     * @param custom
     */
    onCreate(scene, custom) {
        //TonePlayback.addEventListener('mididata', data => this.onSongData(data));
    }

    /**
     * on render scene
     * @param scene
     * @param custom
     */
    onRender(scene, custom) {
        for (var c = 0; c < this._keys.length; c++) {
            if (this._keys[c].colortween.animating) {
                this._keys[c].object.material.color.setRGB(
                    this._keys[c].colortween.rcolor/100,
                    this._keys[c].colortween.gcolor/100,
                    this._keys[c].colortween.bcolor/100 );
                this._keys[c].object.material.emissive.setRGB(
                    this._keys[c].colortween.remissive/100,
                    this._keys[c].colortween.gemissive/100,
                    this._keys[c].colortween.bemissive/100 );
            }
        }
    }

    /**
     * on assets loaded
     * @param geometry
     */
    onAssetsLoaded(geometry) {
        var mat = new THREE.MeshStandardMaterial( {
            metalness: 0.7,
            roughness: 1,
            side: THREE.FrontSide,
            shading: THREE.FlatShading
        });
        this.setupScene(geometry, mat);
    };

    /**
     * dynamically generate circle of keys
     * @param geometry
     * @param material
     */
    setupScene(geometry, material) {
        var startOffset = Note.indexOfNotation(this._startingNote);
        var ntindex = 0;
        var transformPosition = 0;
        for (var c = 0; c < this._numOctaves; c++) {
            for (var d = 0; d < Note.sharpNotations.length; d++) {
                var note = Note.notationAtIndex(d + startOffset);
                transformPosition = this.addKey(transformPosition, note.indexOf('#') === -1, note, c, geometry, material);
                ntindex ++;
            }
        }

        return transformPosition;
    }

    /**
     * on inactivity (fade away keys and clear key sig)
     */
    ///onInactive() {
    resetKeys() {
        for (var c = 0; c < this._keys.length; c++) {
            if (this._keys[c].suggested) {
                var suggestionType = this._keys[c].suggested;
                Utils.copyPropsTo(this._keys[c].colortween, Utils.decToRGB(Style.keys[suggestionType][this._keys[c].type].emissive, 100), 'emissive');
                Utils.copyPropsTo(this._keys[c].colortween, Utils.decToRGB(Style.keys[suggestionType][this._keys[c].type].color, 100), 'color');
                this._keys[c].colortween.animating = true;

                var target = Utils.copyPropsTo({}, Utils.decToRGB(Style.keys.normal[this._keys[c].type].color, 100), 'emissive');
                Utils.copyPropsTo(target, Utils.decToRGB(Style.keys.normal[this._keys[c].type].emissive, 100), 'color');

                //this._input.clearPredictionHistory();
                createjs.Tween.get(this._keys[c].colortween)
                    .to(target, 2000)
                    .wait(100) // wait a few ticks, or the render cycle won't pick up the changes with the flag
                    .call( function() { this.animating = false; } );
            }
        }
    }

    /**
     * on key change
     * @param keys
     */
    /*onKeyInputChange(event) {
        var key = this.findKeyObjectsForNotation(event.changed.notation);
        var octave;
        if (event.changed.octave / 2 === Math.floor(event.changed.octave / 2)) {
            octave = 1;
        } else {
            octave = 0;
        }

        this.toggleKeyPressed(key[octave], event.changed.velocity);

        if (event.predictedKey.length > 0 && event.predictedKey[0] !== this.currentKeySignature) {
            this.onKeySignatureChange(event.predictedKey[0].key);
        }
    }*/

    /**
     * handler when key signature changes
     * @param keysig
     */
    /*onKeySignatureChange(keysig) {
        var c;
        for (c = 0; c < this.suggestedKeys.length; c++) {
            this.toggleKeySuggestion(this.suggestedKeys[c], false);
        }
        this.currentKeySignature = keysig;
        this.suggestedKeys = Note.keys[keysig];

        for (c = 0; c < this.suggestedKeys.length; c++) {
            this.toggleKeySuggestion(this.suggestedKeys[c], true, c);
        }
    }*/

    /**
     * toggle key pressed
     * @param key
     */
    toggleKeyPressed(k) {
        var key = this.findKeyObjectForNotation(k.notation, k.octave);
        if (key) {
            if (k.velocity === 0) {
                TonePlayback.noteOff(key.notation, key.midichannel, 1/8);
                var channelindex = this._midichannels.indexOf(key.midichannel);
                this._midichannels.splice(channelindex, 1);
                clearTimeout(this._inactivityTimer);
                key.object.rotation.set(key.originalRotation.x, key.originalRotation.y, key.originalRotation.z);
                key.currentRotation = 0;
                key.midichannel = -1;
                key.down = false;
            } else {
                this._midichannels = this._midichannels.sort();
                var midichannel = this._midichannels[this._midichannels.length-1] + 1;
                if (!midichannel) {
                    midichannel = this._midiChannelStartIndex;
                }
                TonePlayback.noteOn(TonePlayback.PIANO, key.notation, midichannel);
                key.currentRotation = k.velocity * this._rotationOnPress;
                key.object.rotateX(key.currentRotation);
                key.midichannel = midichannel;
                key.down = true;
            }
        }
    }

    /**
     * toggle key suggestion
     * @param notation
     * @param toggle
     * @param index in keysig
     */
    toggleKeySuggestion(notation, toggle, index) {
        var keys = this.findKeyObjectsForNotation(notation);
        for (var c = 0; c < keys.length; c++) {
            if (toggle) {
                clearTimeout(this._inactivityTimer);
                this._inactivityTimer = setTimeout( () => this.onInactive(), 5000);
                var clr;
                if ( index===0 || index===2 || index===4 || index===6) {
                    clr = Style.keys.stronglySuggested[keys[c].type];
                    keys[c].suggested = 'stronglySuggested';
                } else {
                    clr = Style.keys.suggested[keys[c].type];
                    keys[c].suggested = 'suggested';
                }
                keys[c].object.material.color.setHex(clr.color);
                keys[c].object.material.emissive.setHex(clr.emissive);
            } else {
                keys[c].object.material.color.setHex(Style.keys.normal[keys[c].type].color);
                keys[c].object.material.emissive.setHex(Style.keys.normal[keys[c].type].emissive);
                keys[c].suggested = false;
            }
        }
    }

    /**
     * create white key geometry
     * @returns {THREE.Mesh}
     */
    createWhiteKey(geometry, material) {
        var keygeom = geometry.clone();
        var mat = material.clone();
        mat.color.setHex(Style.keys.normal.white.color);
        mat.emissive.setHex(Style.keys.normal.white.emissive);
        keygeom.translate( 0, -10, 0 );
        var key = new THREE.Mesh( keygeom, mat);
        return key;
    }

    /**
     * create black key geometry
     * @returns {THREE.Mesh}
     */
    createBlackKey(geometry, material) {
        var keygeom = geometry.clone();
        var mat = material.clone();
        mat.color.setHex(Style.keys.normal.black.color);
        mat.emissive.setHex(Style.keys.normal.black.emissive);
        keygeom.translate( 0, -25, 0 );
        keygeom.scale(1, .5, 1);
        var key = new THREE.Mesh( keygeom, mat);
        return key;
    }

    /**
     * create and add a key
     * @param {Number} transformPosition
     * @param {Boolean} white
     * @param {String} notation
     * @param {Number} octave
     * @param {THREE.Geometry} geometry
     * @param {THREE.Material} material
     * @return {Number} transform position
     */
    addKey(transformPosition, white, notation, octave, geometry, material) {
        var key, color, rotation;
        if (white) {
            color = 'white';
            key = this.createWhiteKey(geometry, material);
        } else {
            color = 'black';
            key = this.createBlackKey(geometry, material);
        }
        transformPosition = this.applyKeyTransform(key, transformPosition, white);
        this._keys.push({
            type: color,
            object: key,
            octave: octave + this._startingOctave,
            colortween: {},
            notation: notation,
            originalRotation: {
                x: key.rotation.x,
                y: key.rotation.y,
                z: key.rotation.z }
        });
        this.add(key,'key_' + notation);
        return transformPosition;
    }

    /**
     * apply key transform
     * @param {THREE.Mesh} keymesh
     * @param {Number} transformPosition
     * @param {Boolean} whitekey
     */
    applyKeyTransform(keymesh, transformPosition, whitekey) {}

    /**
     * find the key for a specific notation
     * @param notation
     * @returns {Array}
     */
    findKeyObjectsForNotation(notation) {
        var keys = [];
        for (var c = 0; c < this._keys.length; c++) {
            if (this._keys[c].notation === notation) {
                keys.push(this._keys[c]);
            }
        }
        return keys;
    }

    /**
     * find specific key object for notation and octave
     * @param notation
     * @param octave
     */
    findKeyObjectForNotation(notation, octave) {
        var notationOffset = Note.indexOfNotation(this._startingNote);
        var indx = octave * Note.sharpNotations.length + Note.sharpNotations.indexOf(notation) - notationOffset;
        return this._keys[indx];
    }

    /**
     * on song data
     * @param data
     */
    onSongData(data) {
        var notation = Note.MIDItoNotation(data.note);
        var key = this.findKeyObjectsForNotation(notation);
        this.toggleKeyPressed(key[0], data.velocity / 127);
    }
}
