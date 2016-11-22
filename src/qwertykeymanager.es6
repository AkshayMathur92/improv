import Note from './musictheory/note.es6';

export default class {
    constructor(params, cb) {
        /**
         * event callback
         */
        this._callback = cb;

        /**
         * JSON config
         */
        this._config = params;

        /**
         * keys down
         * @type {Array}
         * @private
         */
        this._keys = [];

        /**
         * keyboard to key mapping
         * @type {Array.<string>}
         * @private
         */
        this._mapping = Note.sharpNotations;

        /**
         * potential keys pressed in order
         * @type {string[]}
         * @private
         */
        this._potentialKeys = [
            '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '+',
            'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\',
            'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\''
        ];

        document.addEventListener('keydown', event => this.onKeyDown(event));
        document.addEventListener('keyup', event => this.onKeyUp(event));
    }

    /**
     * get keys down
     * @param mapping
     */
    getKeysDown() {
        var down = [];
        for (var c = 0; c < this._keys.length; c++) {
            if (this._keys[c] > 0) {
                var octave = 0;
                if (c >= this._keys.length/2) { octave = 1; }
                down.push( { notation: this._mapping[c], octave: octave + 2, index: c, velocity: this._keys[c]} );
            }
        }
        return down;
    }

    /**
     * on key down
     * @param event
     */
    onKeyDown(event) {
        var key = this._potentialKeys.indexOf(event.key.toLowerCase());
        if (key !== -1 && (this._keys[key] === 0 || !this._keys[key])) {
            this._keys[key] = 1.0; // on an actual MIDI keyboard, we'd have a velocity
            var octave = Math.floor(key / Note.sharpNotations.length);
            var indx = key % this._mapping.length;
            this._callback({
                notation: this._mapping[indx],
                octave: octave + this._config.startoctave,
                index: key,
                velocity: 1.0,
                action: 'press' });
        }
    }

    /**
     * on key down
     * @param event
     */
    onKeyUp(event) {
        var key = this._potentialKeys.indexOf(event.key.toLowerCase());
        if (key !== -1) {
            this._keys[key] = 0.0; // on an actual MIDI keyboard, we'd have a velocity
            var octave = Math.floor(key / Note.sharpNotations.length);
            var indx = key % this._mapping.length;
            this._callback({
                notation: this._mapping[indx],
                octave: octave + this._config.startoctave,
                index: key,
                velocity: 0,
                action: 'release' });
        }
    }
}
