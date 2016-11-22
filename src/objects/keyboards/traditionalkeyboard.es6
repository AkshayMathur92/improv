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
        this.group.position.z = -200;
        this.group.position.y = -200;
        this.group.rotation.x = -Math.PI/2;
        this.group.scale.set(10, 10, 10);
    }
}
