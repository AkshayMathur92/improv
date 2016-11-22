import BaseKeyboard from './basekeyboard.es6';
import Input from '../../input.es6';
import Note from '../../musictheory/note.es6';
import Style from '../../themeing/style.es6';
import Utils from '../../utils.es6';
import TonePlayback from '../../toneplayback.es6';

export default class CircularKeyboard extends BaseKeyboard {
    /**
     * apply key transform
     * @param {THREE.Mesh} keymesh
     * @param {Number} position in keyboard
     * @param {Number} keyindex
     * @param {Boolean} whitekey
     */
    applyKeyTransform(keymesh, transformPosition, whitekey) {
        var rotate = 0;
        var extraRotate = 0;
        if (whitekey) {
            rotate = (Math.PI * 2) / 14;
        } else {
            extraRotate = (Math.PI * 2) / 28;
        }
        keymesh.rotation.z = transformPosition + rotate + extraRotate;

        return transformPosition + rotate;
    }

    /**
     * setup scene
     * @param geometry
     * @param material
     */
    setupScene(geometry, material) {
        super.setupScene(geometry, material);
        this.group.position.z = -400;
        this.group.scale.set(10, 10, 10);
    }
}
