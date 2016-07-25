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
        * colors
        * @type {{whitekey: number, blackkey: number}}
        * @private
        */
       this._colors = {
           white: 0x67B9BF,
           black: 0x457B7F,
           suggested: {
               white: 0x8AF7FF,
               black: 0x223E40
           }
       };

       /**
        * keyboard/key input
        * @type {$ES6_ANONYMOUS_CLASS$}
        * @private
        */
       this._input = new Input('MIDI', (keys) => this.onKeyInputChange(keys) );

       /**
        * suggested keys from key signature prediction
        * @type {Array}
        */
       this.suggestedKeys = [];

       /**
        * scene
        * @type {null}
        * @private
        */
       this._scene = null;

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
        this._scene = scene;
    }

    /**
     * on assets loaded
     * @param geometry
     */
    onAssetsLoaded(geometry) {
        var mat = new THREE.MeshStandardMaterial( {
            metalness: 0.5,
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
        this.group.position.z = -30;
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
            this.toggleKeySuggestion(this.suggestedKeys[c], true);
        }
    }

    /**
     * toggle key pressed
     * @param key
     * @param velocity
     */
    toggleKeyPressed(key, velocity) {
        if (velocity === 0) {
            key.object.rotation.set(key.originalRotation.x, key.originalRotation.y, key.originalRotation.z);
            key.currentRotation = 0;
        } else {
            key.currentRotation = velocity * Math.PI/16;
            key.object.rotateX(key.currentRotation);
        }
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
                keys[c].object.material.color.setHex(this._colors.suggested[keys[0].type]);
            } else {
                keys[c].object.material.color.setHex(this._colors[keys[0].type]);
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
        mat.color.setHex(this._colors.white);
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
        mat.color.setHex(this._colors.black);
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
            notation: notation,
            originalRotation: {
                x: key.rotation.x,
                y: key.rotation.y,
                z: key.rotation.z }
        });
        this.add(key,'key_' + notation);
    }

    /**
     * create key material
     */
    createMaterial(scenecollection, cb) {
        /*var map = new THREE.TextureLoader().load('./assets/roughness_map.jpg');
        map.anisotropy = 4;
        map.repeat.set( 0.1, 0.1 );
        map.wrapS = map.wrapT = THREE.RepeatWrapping;

        var standardMaterial = new THREE.MeshStandardMaterial( {
            bumpScale: 0.5,
            color: 0x6a6a44,
            metalness: 0.5,
            roughness: 1,
            //bumpMap: map,
            //roughnessMap: map,
            shading: THREE.FlatShading
        });

        var ldrCubeRenderTarget;
        var cubeenvmap = [
            './assets/domeenvmap/nx2.png', './assets/domeenvmap/ny.png', './assets/domeenvmap/nz.png',
            './assets/domeenvmap/px2.png', './assets/domeenvmap/py.png', './assets/domeenvmap/pz.png'
        ];

        new THREE.CubeTextureLoader().load(cubeenvmap,
                function ( ldrCubeMap ) {
                    ldrCubeMap.encoding = THREE.GammaEncoding;
                    var pmremGenerator = new THREE.PMREMGenerator( ldrCubeMap );
                    pmremGenerator.update( scenecollection.renderer );

                    var pmremCubeUVPacker = new THREE.PMREMCubeUVPacker( pmremGenerator.cubeLods );
                    pmremCubeUVPacker.update( scenecollection.renderer );

                    ldrCubeRenderTarget = pmremCubeUVPacker.CubeUVRenderTarget;
                    standardMaterial.envMap = ldrCubeRenderTarget.texture;
                    standardMaterial.needsUpdate = true;
                    cb(standardMaterial);
                }
        );*/
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