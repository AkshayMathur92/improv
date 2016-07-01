import QWERTYKeyManager from './qwertykeymanager.es6';
import KeySignaturePrediction from './musictheory/keysignatureprediction.es6';
import Note from './musictheory/note.es6';

export default class {
    constructor(scenecollection, mycollection) {
        /**
         * scene collection of 3D objects
         */
        this._scenecollection = scenecollection;

        /**
         * my collection of 3D scene objects
         */
        this._mycollection = mycollection;

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
        this._keyMapping = Note.sharpNotations.concat(Note.sharpNotations);

        /**
         * key signature prediction
         * @type {$ES6_ANONYMOUS_CLASS$}
         * @private
         */
        this._keySigPrediction = new KeySignaturePrediction();
    }

    /**
     * on key change
     * @param index
     * @param value
     * @param keys
     */
    onKeyChange(index, value, keys) {
        var kd = this._keymanager.getKeysDown(this._keyMapping);
        this._mycollection.keys[index].object.scale.y = 1 + (value/5);
        this._keySigPrediction.update(kd);
        //this._mycollection.keys[index].object.rotation.x = -value * Math.PI/64;

        if (value === 0) {
            this._mycollection.keys[index].object.material.color = new THREE.Color("rgb(20, 20, 20)");
        } else {
            this._mycollection.keys[index].object.material.color = new THREE.Color("rgb(80, 20, 20)");
        }
    }




}