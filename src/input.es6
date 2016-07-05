import QWERTYKeyManager from './qwertykeymanager.es6';
import KeySignaturePrediction from './musictheory/keysignatureprediction.es6';

export default class {
    constructor(mapping, cb) {
        /**
         * key manager
         * @type {$ES6_ANONYMOUS_CLASS$}
         * @private
         */
        this._keymanager = new QWERTYKeyManager( (index, value, keys) => this.onKeyChange(index, value, keys));

        /**
         * key mapping
         * @type {Array.<string>}
         * @private
         */
        this._keyMapping = mapping;

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
     * @param index
     * @param value
     * @param keys
     */
    onKeyChange(index, value, keys) {
        var kd = this._keymanager.getKeysDown(this._keyMapping);
        var predicted = this._keySigPrediction.update(kd);
        this._callback.apply(this, [ { current: kd, predictedKey: predicted, keyIndicesChanged: keys }]);
    }
}