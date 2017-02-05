import BaseKeyboard from './basekeyboard.es6';
import Input from '../../input.es6';
import Note from '../../musictheory/note.es6';
import Style from '../../themeing/style.es6';
import Utils from '../../utils.es6';
import TonePlayback from '../../toneplayback.es6';

export default class TraditionalKeyboard extends BaseKeyboard {
    onInitialize(params) {
        super.onInitialize(params);

        /**
         * how much rotation occurs on keypress
         * @type {number}
         * @private
         */
        this._rotationOnPress = Math.PI/64;
    }

    /**
     * on render scene
     * @param scene
     * @param custom
     */
    onRender(scene, custom) {
        super.onRender(scene, custom);
        for (var c = 0; c < this._keys.length; c++) {
            if (this._keys[c].colortween.animating) {
                var scale;
                if (this._keys[c].stronglySuggested) {
                    scale = 0.01 + this._keys[c].colortween.steps * 1.0;
                } else {
                    scale = 0.01 + this._keys[c].colortween.steps * 0.5;
                }
                this._keys[c].marker.scale.set(scale, scale, scale);
                this._keys[c].marker.material.color.setRGB(
                    this._keys[c].colortween.rcolor/100,
                    this._keys[c].colortween.gcolor/100,
                    this._keys[c].colortween.bcolor/100 );
            }
        }
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
        material = material.clone();
        var keymarker = new THREE.Mesh(new THREE.SphereGeometry(.25), material);
        keymarker.scale.set(.01, .01, .01);

        if (white) {
            keymarker.position.x = transformPosition +2;
            keymarker.position.y = -11.5;
            keymarker.position.z = .75;
            material.emissive.setHex(Style.keys.normal.white.emissive);
        } else {
            keymarker.position.x = transformPosition +1;
            keymarker.position.y = -7;
            keymarker.position.z = 1.55;
            material.emissive.setHex(Style.keys.normal.white.emissive);
        }

        this.add(keymarker, 'keymarker_' + notation);
        transformPosition = super.addKey(transformPosition, white, notation, octave, geometry, material);
        this._keys[this._keys.length-1].marker = keymarker;
        return transformPosition;
    }

    /**
     * toggle key suggestion
     * @param notation
     * @param keysignotation
     * @param toggle
     */
    toggleKeySuggestion(notation, keysignotation, toggle) {
        var keys = super.toggleKeySuggestion(notation, keysignotation, toggle);
        for (var c = 0; c < keys.length; c++) {
            if (toggle) {
                if (keys[c].stronglySuggested) {
                    keys[c].marker.scale.set(1, 1, 1);
                } else {
                    keys[c].marker.scale.set(.5, .5, .5);
                }
            } else {
                keys[c].marker.scale.set(.01, .01, .01);
            }
            keys[c].marker.material.color = keys[c].object.material.color;
        }
        return keys;
    }

    /**
     * apply key transform
     * @param {THREE.Mesh} keymesh
     * @param {Number} position in keyboard
     * @param {Boolean} whitekey
     * @return {Number} current position
     */
    applyKeyTransform(keymesh, transformPosition, whitekey) {
        var translate = 2;
        if (!whitekey) {
            keymesh.position.y = 5;
            keymesh.position.z = 1;
            keymesh.position.x = transformPosition +1;
            translate = 0;
        } else {
            keymesh.position.x = transformPosition +2;
        }
        keymesh.rotation.x = 0;
        return transformPosition + translate;
    }

    /**
     * setup scene
     * @param geometry
     * @param material
     */
    setupScene(geometry, material) {
        var lastTransformPosition = super.setupScene(geometry, material);
        this.group.position.x = -lastTransformPosition/2 * 10;
        this.group.position.z = -230;
        this.group.position.y = -200;
        this.group.rotation.x = -Math.PI/2;
        this.group.scale.set(10, 10, 10);
    }
}
