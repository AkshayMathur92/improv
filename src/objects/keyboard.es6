import BaseGroup from '../../node_modules/ccwc-threejs-vrscene/src/basegroup.es6';
import Input from '../input.es6';
import Note from '../musictheory/note.es6';

export default class Keyboard extends BaseGroup {
   onInitialize() {
       /**
        * key visuals
        * @type {Array}
        * @private
        */
       this._keys = [];

       /**
        * key material
        * @type {THREE.MeshLambertMaterial}
        */
       this._keyMaterial = this.createMaterial();

       /**
        * key mapping
        * @type {Array.<string>}
        * @private
        */
       this._keyMapping = Note.sharpNotations.concat(Note.sharpNotations);

       /**
        * keyboard/key input
        * @type {$ES6_ANONYMOUS_CLASS$}
        * @private
        */
       this._input = new Input( Note.sharpNotations.concat(Note.sharpNotations), (keys) => this.onKeyInputChange(keys) );

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
    onCreate(scene, custom) {
        var counter = 0;
        for (var c = 0; c < 14; c++) {
            this.addKey(-c * Math.PI * 2 / 14, true, String.fromCharCode('A'.charCodeAt(0) + counter));

            if (counter !== 1 && counter !== 4) {
                this.addKey(-(c * Math.PI * 2 / 14 + Math.PI/14), false, String.fromCharCode('A'.charCodeAt(0) + counter) + '#');
            }

            counter ++;
            if (counter >= 7) {
                counter = 0;
            }
        }
    }

    /**
     * on key change
     * @param keys
     */
    onKeyInputChange(keys) {
        for (var index in keys.keyIndicesChanged) {
            this.toggleKeyPressed(this._keys[index], keys.keyIndicesChanged[index]);
        }

        if (keys.predictedKey.length > 0 && keys.predictedKey[0] !== this.currentKeySignature) {
            this.onKeySignatureChange(keys.predictedKey[0].key);
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
            this.toggleKeySuggestion(this.suggestedKeys[c], true);
        }
    }

    /**
     * toggle key pressed
     * @param key
     * @param velocity
     */
    toggleKeyPressed(key, velocity) {
        key.object.scale.y = 1 + (velocity/5);
        //this._keys[index].object.rotation.x = -value * Math.PI/64;
    }

    /**
     * toggle key suggestion
     * @param notation
     * @param toggle
     */
    toggleKeySuggestion(notation, toggle) {
        var keys = this.findKeyObjectsForNotation(notation);

        for (var c = 0; c < keys.length; c++) {
            if (toggle) {
                keys[c].object.material.color = new THREE.Color('rgb(40, 20, 20)');
            } else {
                keys[c].object.material.color = new THREE.Color(0xffee00);
            }
        }
    }

    /**
     * create white key geometry
     * @returns {THREE.Mesh}
     */
    createWhiteKey() {
        var keygeom = new THREE.CubeGeometry( 26, 70, 5 );
        var key = new THREE.Mesh( keygeom, this._keyMaterial.clone());
        key.geometry.translate( 0, 100, -400 );
        return key;
    }

    /**
     * create black key geometry
     * @returns {THREE.Mesh}
     */
    createBlackKey() {
        var keygeom =  new THREE.CubeGeometry( 13, 35, 5 );
        var key = new THREE.Mesh( keygeom, this._keyMaterial.clone());
        key.geometry.translate( 0, 130, -400 );
        return key;
    }

    /**
     * create and add a key
     * @param {Number} rotation
     * @param {Boolean} white
     */
    addKey(rotation, white, notation) {
        var key, color;
        if (white) {
            color = 'white';
            key = this.createWhiteKey()
        } else {
            color = 'black';
            key = this.createBlackKey()
        }
        key.rotation.z = rotation;
        this._keys.push({ type: color, object: key, notation: notation });
        this.add(key,'key_' + notation);
    }

    /**
     * create key material
     */
    createMaterial() {
        var loader = new THREE.TextureLoader();
        var envMap = loader.load('./assets/moon.jpg');
        envMap.mapping = THREE.CubeRefractionMapping;
        envMap.format = THREE.RGBFormat;
        return new THREE.MeshLambertMaterial(
            {   color: 0xffee00,
                envMap: envMap,
                refractionRatio: 0.95,
                combine: THREE.MixOperation,
                reflectivity: 0.3 });
    }


    /**
     * find the key for a specific notation
     * todo: choose most appropritae octave
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