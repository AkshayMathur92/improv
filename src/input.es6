import QWERTYKeyManager from './qwertykeymanager.es6';
import MIDIKeyManager from './midikeymanager.es6';
import KeySignaturePrediction from './musictheory/keysignatureprediction.es6';

export default class {
    constructor(type, cb) {
        /**
         * key manager
         * @type {$ES6_ANONYMOUS_CLASS$}
         * @private
         */
        if (type === 'QWERTY') {
            this._keymanager = new QWERTYKeyManager( changed => this.onKeyChange(changed));
        } else if (type === 'MIDI') {
            this._keymanager = new MIDIKeyManager( changed => this.onKeyChange(changed));
        }

        /**
         * key signature prediction
         * @type {$ES6_ANONYMOUS_CLASS$}
         * @private
         */
        this._keySigPrediction = new KeySignaturePrediction();

        /**
         * key change callback
         */
        this._callback = cb;
    }

    /**
     * on key change
     * @param changed
     */
    onKeyChange(changed) {
        var kd = this._keymanager.getKeysDown();
        var predicted = this._keySigPrediction.update(kd);
        this._callback.apply(this, [ { down: kd, predictedKey: predicted, changed: changed }]);
    }
}