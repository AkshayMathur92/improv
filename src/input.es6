import QWERTYKeyManager from './qwertykeymanager.es6';
import MIDIKeyManager from './midikeymanager.es6';
import KeySignaturePrediction from './musictheory/keysignatureprediction.es6';

export default class {
    constructor(params, cb) {
        /**
         * key manager
         * @type {$ES6_ANONYMOUS_CLASS$}
         * @private
         */
        if (params.device === 'QWERTY') {
            this._keymanager = new QWERTYKeyManager(params, changed => this.onKeyChange(changed));
        } else if (params.device === 'MIDI') {
            this._keymanager = new MIDIKeyManager(params, changed => this.onKeyChange(changed));
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
     * clear prediction history
     */
    clearPredictionHistory() {
        this._keySigPrediction.clearHistory();
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
