export default class {
    constructor(cb) {
        /**
         * event callback
         */
        this._callback = cb;

        /**
         * keys down
         * @type {Array}
         * @private
         */
        this._keys = [];

        /**
         * potential keys pressed in order
         * @type {string[]}
         * @private
         */
        this._potentialKeys = [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '-', '+',
            'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'
        ];

        document.addEventListener('keydown', event => this.onKeyDown(event));
        document.addEventListener('keyup', event => this.onKeyUp(event));
    }

    /**
     * get keys down
     * @param mapping
     */
    getKeysDown(mapping) {
        var down = [];
        for (var c = 0; c < this._keys.length; c++) {
            if (this._keys[c] > 0) {
                down.push(mapping[c]);
            }
        }
        return down;
    }

    /**
     * on key down
     * @param event
     */
    onKeyDown(event) {
        var indx = this._potentialKeys.indexOf(event.key.toLowerCase());
        if (indx !== -1 && (this._keys[indx] === 0 || !this._keys[indx])) {
            this._keys[indx] = 1.0; // on an actual MIDI keyboard, we'd have a velocity
            this._callback(indx, this._keys[indx], this._keys);
        }
    }


    /**
     * on key down
     * @param event
     */
    onKeyUp(event) {
        var indx = this._potentialKeys.indexOf(event.key.toLowerCase());
        if (indx !== -1) {
            this._keys[indx] = 0.0; // on an actual MIDI keyboard, we'd have a velocity
            this._callback(indx, this._keys[indx], this._keys);
        }
    }
}