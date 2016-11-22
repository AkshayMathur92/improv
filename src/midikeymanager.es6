import Note from './musictheory/note.es6';

export default class {
    constructor(params, cb) {
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
         * MIDI key to notation mapping (coming from MIDI, so not customizable)
         * the splice happens because 0 index in MIDI starts with C
         * @type {Array.<string>}
         * @private
         */
        this._mapping = Note.sharpNotations
            .concat(Note.sharpNotations)
            .concat(Note.sharpNotations)
            .concat(Note.sharpNotations)
            .concat(Note.sharpNotations)
            .concat(Note.sharpNotations)
            .concat(Note.sharpNotations)
            .concat(Note.sharpNotations)
            .concat(Note.sharpNotations)
            .concat(Note.sharpNotations).splice(3, Note.sharpNotations.length *10);

        // request MIDI access
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess().then(
                (event) => this.onMIDISuccess(event),
                (event) => this.onMIDIFailure(event) );
        } else {
            console.log("No MIDI support in your browser.");
        }
    }

    /**
     * on midi connection success
     * @param midi
     */
    onMIDISuccess(midi) {
        var inputs = midi.inputs;
        for (let input of inputs.values()) {
            input.onmidimessage = msg => this.onMIDIMessage(msg);
        }
    }

    /**
     * on midi connection failure
     * @param event
     */
    onMIDIFailure(event) {
        console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + event);
    }

    /**
     * on midi message
     * @param msg
     */
    onMIDIMessage(msg) {
        var cmd = msg.data[0] >> 4;
        var channel = msg.data[0] & 0xf;
        var noteNumber = msg.data[1];
        var velocity = 0;
        if (msg.data.length > 2)
            velocity = msg.data[2] / 100;

        // MIDI noteon with velocity=0 is the same as noteoff
        if ( cmd==8 || ((cmd==9)&&(velocity==0)) ) { // noteoff
            this.onKeyUp(noteNumber);
        } else if (cmd == 9) { // note on
            this.onKeyDown(noteNumber, velocity);
        } //else if (cmd == 11) { // controller message
    }

    /**
     * get keys down
     */
    getKeysDown() {
        var down = [];
        for (var c = 0; c < this._keys.length; c++) {
            if (this._keys[c] > 0) {
                var octave = 0;
                if (c >= this._keys.length/2) { octave = 1; }
                down.push( { notation: this._mapping[c], octave: octave, index: c, velocity: this._keys[c]} );
            }
        }
        return down;
    }

    /**
     * on key down
     * @param key
     * @param velocity
     */
    onKeyDown(key, velocity) {
        this._keys[key] = velocity;
        var octave = 0;
        octave = Math.floor(key / Note.sharpNotations.length);
        this._callback({
            notation: this._mapping[key],
            octave: octave,
            index: key,
            velocity: velocity,
            action: 'press' });
    }

    /**
     * on key down
     * @param key
     */
    onKeyUp(key) {
        this._keys[key] = 0.0;
        var octave = 0;
        octave = Math.floor(key / Note.sharpNotations.length);
        this._callback({
            notation: this._mapping[key],
            octave: octave,
            index: key,
            velocity: 0,
            action: 'release' });
    }
}
