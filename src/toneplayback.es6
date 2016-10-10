import Note from './musictheory/note.es6';

export default {
    SYNTHDRUM: 'synth_drum',
    PIANO:     'acoustic_grand_piano',

    playerState: 'ready',

    /**
     * instruments loaded
     */
    _instrumentsLoaded: [],

    /**
     * play midi file
     * @param uri of midie file
     */
    play(uri) {
        this.playerState = 'loading';
        MIDI.Player.timeWarp = 1; // speed the song is played back
        MIDI.Player.loadFile(uri,
            () => this.onLoaded(),
            () => this.onProgress(),
            (err) => this.onError(err));
    },

    /**
     * pause playing midi file
     */
    pause() {
        this.playerState = 'paused';
        MIDI.Player.pause();
    },

    /**
     * resume playing midi file
     */
    resume() {
        this.playerState = 'playing';
        MIDI.Player.resume();
    },

    /**
     * check if instrument is loaded
     * @param instrument
     * @returns {boolean}
     */
    isInstrumentLoaded(instrument) {
        if (this._instrumentsLoaded.indexOf(instrument) !== -1) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * load instrument
     * @param instrument
     */
    loadInstrument(instrument, path) {
        MIDI.loadPlugin({
            soundfontUrl: path,
            instrument: instrument,
            onprogress: (state, progress, instrument) => this.onInstrumentLoadProgress(state, progress, instrument),
            onsuccess: (event) => this.onInstrumentLoaded(event),
            onerror: (err) => this.onInstrumentLoadedError(err),
        });
    },

    /**
     * play a tone
     * @param instrument
     * @param notation
     * @param duration
     */
    playTone(instrument, notation, midichannel, duration) {
        if (!this.isInstrumentLoaded(instrument)) { return; }

        MIDI.programChange(0, MIDI.GM.byName[instrument].number);
        var delay = 0; // play one note every quarter second
        var note = Note.notationToMIDI(notation); // the MIDI note
        var velocity = 127; // how hard the note hits
        // play the note
        MIDI.setVolume(0, 127);
        MIDI.noteOn(0, note, velocity, delay);

        if (duration) {
            MIDI.noteOff(0, note, delay + duration);
        }
    },

    /**
     * note on
     * @param instrument
     * @param notation
     * @param midichannel
     */
    noteOn(instrument, notation, midichannel, duration) {
        if (!this.isInstrumentLoaded(instrument)) { return; }
        var note = Note.notationToMIDI(notation);
        MIDI.programChange(midichannel, MIDI.GM.byName[instrument].number);
        var velocity = 127; // how hard the note hits
        MIDI.setVolume(0, 127);
        MIDI.noteOn(midichannel, note, velocity, 0);

        if (duration) {
            MIDI.noteOff(midichannel, note, duration);
        }
    },

    /**
     * note off
     * @param notation
     * @param midichannel
     * @param delay
     */
    noteOff(notation, midichannel, delay) {
        if (!delay) { delay = 0; }
        var note = Note.notationToMIDI(notation);
        MIDI.noteOff(midichannel, note, delay);
    },

    /**
     * add event listener
     * @param eventtype
     * @param callback
     */
    addEventListener(eventtype, callback) {
        if (!this._listeners) { this._listeners = []; }
        this._listeners.push( { type: eventtype, callback: callback });
    },

    /**
     * on instrument loaded
     * @param event
     */
    onInstrumentLoaded() {},

    /**
     * on instrument load progress
     * @param state
     * @param progress
     * @param instrument
     */
    onInstrumentLoadProgress(state, progress, instrument) {
        if (instrument && progress === 1) {
            console.log(instrument + ' loaded');
            this._instrumentsLoaded.push(instrument);
        }
    },

    /**
     * on instrument loaded error
     * @param err
     */
    onInstrumentLoadedError(err) {
        console.log('Instrument loading error', err);
    },

    onLoaded() {
        MIDI.programChange(0, MIDI.GM.byName[this.PIANO].number);
        MIDI.Player.start();
        this.playerState = 'playing';
        this.isPlaying = true;
        MIDI.Player.addListener(data => this.onMIDIData(data));
    },

    onProgress() {
        console.log('progress');
    },

    onError(err) {
        console.log('error', err);
    },

    /**
     * on midi data callback
     * @param data
     */
    onMIDIData(data) {
        if (this._listeners) {
            for (var c = 0; c < this._listeners.length; c++) {
                if (this._listeners[c].type === 'mididata') {
                    console.log(data);
                    this._listeners[c].callback.apply(this, [{ note: data.note - 21, velocity: data.velocity }]);
                }
            }
        }
    }
}