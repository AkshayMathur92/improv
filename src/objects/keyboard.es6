import BaseGroup from '../../node_modules/trivr/src/basegroup.es6';
import Input from '../input.es6';
import Note from '../musictheory/note.es6';
import Style from '../themeing/style.es6';
import Utils from '../utils.es6';

export default class Keyboard extends BaseGroup {
   onInitialize() {
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
        * keyboard/key input
        * @type {$ES6_ANONYMOUS_CLASS$}
        * @private
        */
       this._input = new Input('QWERTY', (keys) => this.onKeyInputChange(keys) );

       /**
        * suggested keys from key signature prediction
        * @type {Array}
        */
       this.suggestedKeys = [];

       /**
        * current key signature
        * @type {String}
        */
       this.currentKeySignature = null;
   }
    /**
     * on create scene (or earliest possible opportunity)
     * @param scene
     * @param custom
     */
    onCreate(scene, custom) {}

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
        var counter = 0;
        for (var c = 0; c < 14; c++) {
            this.addKey(- c * Math.PI * 2 / 14, true, String.fromCharCode('A'.charCodeAt(0) + counter), geometry, material);

            if (counter !== 1 && counter !== 4) {
                this.addKey(-(c * Math.PI * 2 / 14 + Math.PI/14), false, String.fromCharCode('A'.charCodeAt(0) + counter) + '#', geometry, material);
            }

            counter ++;
            if (counter >= 7) {
                counter = 0;
            }
        }
        this.group.rotation.z = Math.PI;
        this.group.position.z = -400;
        this.group.scale.set(10, 10, 10);
    }

    /**
     * on inactivity (fade away keys and clear key sig)
     */
    onInactive() {
        for (var c = 0; c < this._keys.length; c++) {
            if (this._keys[c].suggested) {
                var suggestionType = this._keys[c].suggested;
                Utils.copyPropsTo(this._keys[c].colortween, Utils.decToRGB(Style.keys[suggestionType][this._keys[c].type].emissive, 100), 'emissive');
                Utils.copyPropsTo(this._keys[c].colortween, Utils.decToRGB(Style.keys[suggestionType][this._keys[c].type].color, 100), 'color');
                this._keys[c].colortween.animating = true;

                var target = Utils.copyPropsTo({}, Utils.decToRGB(Style.keys.normal[this._keys[c].type].color, 100), 'emissive');
                Utils.copyPropsTo(target, Utils.decToRGB(Style.keys.normal[this._keys[c].type].emissive, 100), 'color');

                this._input.clearPredictionHistory();
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
    onKeyInputChange(event) {
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
    }

    /**
     * handler when key signature changes
     * @param keysig
     */
    onKeySignatureChange(keysig) {
        var c;
        for (c = 0; c < this.suggestedKeys.length; c++) {
            this.toggleKeySuggestion(this.suggestedKeys[c], false);
        }
        this.currentKeySignature = keysig;
        this.suggestedKeys = Note.keys[keysig];

        for (c = 0; c < this.suggestedKeys.length; c++) {
            this.toggleKeySuggestion(this.suggestedKeys[c], true, c);
        }
    }

    /**
     * toggle key pressed
     * @param key
     * @param velocity
     */
    toggleKeyPressed(key, velocity) {
        if (velocity === 0) {
            clearTimeout(this._inactivityTimer);
            key.object.rotation.set(key.originalRotation.x, key.originalRotation.y, key.originalRotation.z);
            key.currentRotation = 0;
            key.down = false;
        } else {
            key.currentRotation = velocity * Math.PI/16;
            key.object.rotateX(key.currentRotation);
            key.down = true;
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
     * @param {Number} rotation
     * @param {Boolean} white
     */
    addKey(rotation, white, notation, geometry, material) {
        var key, color;
        if (white) {
            color = 'white';
            key = this.createWhiteKey(geometry, material);
        } else {
            color = 'black';
            key = this.createBlackKey(geometry, material);
        }
        key.rotation.z = rotation;
        this._keys.push({
            type: color,
            object: key,
            colortween: {},
            notation: notation,
            originalRotation: {
                x: key.rotation.x,
                y: key.rotation.y,
                z: key.rotation.z }
        });
        this.add(key,'key_' + notation);
    }


    /**
     * find the key for a specific notation
     * todo: choose most appropriate octave
     * @param notation
     * @returns {Array}
     */
    findKeyObjectsForNotation(notation) {
        var keys = []; // multiple keys for multiple octaves (just 2 right now)
        for (var c = 0; c < this._keys.length; c++) {
            if (this._keys[c].notation === notation) {
                keys.push(this._keys[c]);
            }
        }
        return keys;
    }
}