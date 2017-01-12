(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Improv = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _metronome = require('./objects/metronome.es6');

var _metronome2 = _interopRequireDefault(_metronome);

var _circularkeyboard = require('./objects/keyboards/circularkeyboard.es6');

var _circularkeyboard2 = _interopRequireDefault(_circularkeyboard);

var _traditionalkeyboard = require('./objects/keyboards/traditionalkeyboard.es6');

var _traditionalkeyboard2 = _interopRequireDefault(_traditionalkeyboard);

var _dome = require('./objects/dome.es6');

var _dome2 = _interopRequireDefault(_dome);

var _particleflock = require('./objects/particleflock.es6');

var _particleflock2 = _interopRequireDefault(_particleflock);

var _lighting = require('./objects/lighting.es6');

var _lighting2 = _interopRequireDefault(_lighting);

var _toneplayback = require('./toneplayback.es6');

var _toneplayback2 = _interopRequireDefault(_toneplayback);

var _input = require('./input.es6');

var _input2 = _interopRequireDefault(_input);

var _style = require('./themeing/style.es6');

var _style2 = _interopRequireDefault(_style);

var _note = require('./musictheory/note.es6');

var _note2 = _interopRequireDefault(_note);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Improv = function () {
    function Improv(scene, configURI) {
        var _this = this;

        _classCallCheck(this, Improv);

        /**
         * current key signature
         * @type {String}
         */
        this.currentKeySignature = null;

        /**
         * inactivity timer for suggestions
         * @type {null}
         * @private
         */
        this._inactivityTimer = null;

        this._scene = scene;
        this._request = new XMLHttpRequest();
        this._request.onreadystatechange = function () {
            return _this.onConfigLoaded();
        };
        this._request.open('GET', configURI);
        this._request.send();
    }

    /**
     * on key change
     * @param keys
     */


    _createClass(Improv, [{
        key: 'onKeyInputChange',
        value: function onKeyInputChange(event) {
            var _this2 = this;

            clearTimeout(this._inactivityTimer);
            this._inactivityTimer = setTimeout(function () {
                return _this2.onInactivityTimeout();
            }, 5000);

            this._keyboard.toggleKeyPressed({
                notation: event.changed.notation,
                octave: event.changed.octave,
                velocity: event.changed.velocity });

            if (event.predictedKey.length > 0 && this.currentKeySignature !== event.predictedKey[0].key) {
                this._keyboard.changeKeySignature(event.predictedKey[0].key);
                this._hudKeyboard.changeKeySignature(event.predictedKey[0].key);
                this.currentKeySignature = event.predictedKey[0].key;
                this._metronome.setHitColor(_style2.default.colorwheel[_note2.default.indexOfNotation(event.predictedKey[0].key)]);
                this._particles.setColor(_style2.default.colorwheel[_note2.default.indexOfNotation(event.predictedKey[0].key)]);
            }

            //this._keyboard.toggleKeyPressed(key[octave], event.changed.velocity);
            /*var key = this.findKeyObjectsForNotation(event.changed.notation);
            var octave;
            if (event.changed.octave / 2 === Math.floor(event.changed.octave / 2)) {
               octave = 1;
            } else {
               octave = 0;
            }
             this.toggleKeyPressed(key[octave], event.changed.velocity);
             if (event.predictedKey.length > 0 && event.predictedKey[0] !== this.currentKeySignature) {
               this.onKeySignatureChange(event.predictedKey[0].key);
            }*/
        }

        /**
         * inactivity timeout
         */

    }, {
        key: 'onInactivityTimeout',
        value: function onInactivityTimeout() {
            this._keyboard.resetKeys();
            this._hudKeyboard.resetKeys();
            this._input.clearPredictionHistory();
            this._metronome.setHitColor();
            this._particles.setColor();
        }

        /**
         * on config loaded
         */

    }, {
        key: 'onConfigLoaded',
        value: function onConfigLoaded() {
            if (this._request.readyState === XMLHttpRequest.DONE) {
                if (this._request.status === 200) {
                    var config = JSON.parse(this._request.responseText);
                    this.setup(config);
                } else {
                    console.log('There was a problem with the request.');
                }
            }
        }
        /**
         * setup app
         * @param config
         * @param config
         */

    }, {
        key: 'setup',
        value: function setup(config) {
            var _this3 = this;

            this._scene.onCreate = this.create;

            this._input = new _input2.default(config.input, function (keys) {
                return _this3.onKeyInputChange(keys);
            });
            this._keyboard = new _traditionalkeyboard2.default(config.keyboard);
            this._hudKeyboard = new _circularkeyboard2.default(config.notationdisplay);
            this._metronome = new _metronome2.default();
            this._particles = new _particleflock2.default();

            this._scene.addObjects([this._metronome, this._particles, new _dome2.default(), this._keyboard, this._hudKeyboard, new _lighting2.default()]);

            for (var c = 0; c < config.sound.soundfonts.length; c++) {
                _toneplayback2.default.loadInstrument(config.sound.soundfonts[c], config.sound.soundfontlocation);
            }
            document.addEventListener('keydown', function (event) {
                return _this3.onKeyDown(event);
            });
        }

        /**
         * on keydown
         * @param event
         */

    }, {
        key: 'onKeyDown',
        value: function onKeyDown(event) {
            if (event.code === 'Space') {
                switch (_toneplayback2.default.playerState) {
                    case 'ready':
                        _toneplayback2.default.play('./assets/audio/Bonnie_Tyler_-_Total_Eclipse_of_the_Heart.mid');break;
                    case 'playing':
                        _toneplayback2.default.pause();break;
                    case 'paused':
                        _toneplayback2.default.resume();break;
                }
            }
        }
    }, {
        key: 'create',
        value: function create(scene, custom) {
            scene.renderer.gammaInput = true;
            scene.renderer.gammaOutput = true;
        }
    }, {
        key: 'render',
        value: function render(scene, custom) {}
    }]);

    return Improv;
}();

exports.default = Improv;

},{"./input.es6":2,"./musictheory/note.es6":5,"./objects/dome.es6":6,"./objects/keyboards/circularkeyboard.es6":8,"./objects/keyboards/traditionalkeyboard.es6":9,"./objects/lighting.es6":10,"./objects/metronome.es6":11,"./objects/particleflock.es6":12,"./themeing/style.es6":16,"./toneplayback.es6":17}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _qwertykeymanager = require('./qwertykeymanager.es6');

var _qwertykeymanager2 = _interopRequireDefault(_qwertykeymanager);

var _midikeymanager = require('./midikeymanager.es6');

var _midikeymanager2 = _interopRequireDefault(_midikeymanager);

var _keysignatureprediction = require('./musictheory/keysignatureprediction.es6');

var _keysignatureprediction2 = _interopRequireDefault(_keysignatureprediction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class(params, cb) {
        var _this = this;

        _classCallCheck(this, _class);

        /**
         * key manager
         * @type {$ES6_ANONYMOUS_CLASS$}
         * @private
         */
        if (params.device === 'QWERTY') {
            this._keymanager = new _qwertykeymanager2.default(params, function (changed) {
                return _this.onKeyChange(changed);
            });
        } else if (params.device === 'MIDI') {
            this._keymanager = new _midikeymanager2.default(params, function (changed) {
                return _this.onKeyChange(changed);
            });
        }

        /**
         * key signature prediction
         * @type {$ES6_ANONYMOUS_CLASS$}
         * @private
         */
        this._keySigPrediction = new _keysignatureprediction2.default();

        /**
         * key change callback
         */
        this._callback = cb;
    }

    /**
     * clear prediction history
     */


    _createClass(_class, [{
        key: 'clearPredictionHistory',
        value: function clearPredictionHistory() {
            this._keySigPrediction.clearHistory();
        }

        /**
         * on key change
         * @param changed
         */

    }, {
        key: 'onKeyChange',
        value: function onKeyChange(changed) {
            var kd = this._keymanager.getKeysDown();
            var predicted = this._keySigPrediction.update(kd);
            this._callback.apply(this, [{ down: kd, predictedKey: predicted, changed: changed }]);
        }
    }]);

    return _class;
}();

exports.default = _class;

},{"./midikeymanager.es6":3,"./musictheory/keysignatureprediction.es6":4,"./qwertykeymanager.es6":13}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _note = require("./musictheory/note.es6");

var _note2 = _interopRequireDefault(_note);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class(params, cb) {
        _classCallCheck(this, _class);

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
        this._mapping = _note2.default.sharpNotations.concat(_note2.default.sharpNotations).concat(_note2.default.sharpNotations).concat(_note2.default.sharpNotations).concat(_note2.default.sharpNotations).concat(_note2.default.sharpNotations).concat(_note2.default.sharpNotations).concat(_note2.default.sharpNotations).concat(_note2.default.sharpNotations).concat(_note2.default.sharpNotations).splice(3, _note2.default.sharpNotations.length * 10);

        this.initializeDevice();
    }

    /**
     * initialize midi device
     */


    _createClass(_class, [{
        key: "initializeDevice",
        value: function initializeDevice() {
            var _this = this;

            // request MIDI access
            if (navigator.requestMIDIAccess) {
                navigator.requestMIDIAccess().then(function (event) {
                    return _this.onMIDISuccess(event);
                }, function (event) {
                    return _this.onMIDIFailure(event);
                });
            } else {
                console.log("No MIDI support in your browser.");
            }
        }

        /**
         * on midi connection success
         * @param midi
         */

    }, {
        key: "onMIDISuccess",
        value: function onMIDISuccess(midi) {
            var _this2 = this;

            var inputs = midi.inputs;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = inputs.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var input = _step.value;

                    input.onmidimessage = function (msg) {
                        return _this2.onMIDIMessage(msg);
                    };
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }

        /**
         * on midi connection failure
         * @param event
         */

    }, {
        key: "onMIDIFailure",
        value: function onMIDIFailure(event) {
            console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + event);
        }

        /**
         * on midi message
         * @param msg
         */

    }, {
        key: "onMIDIMessage",
        value: function onMIDIMessage(msg) {
            console.log(msg);
            var cmd = msg.data[0] >> 4;
            var channel = msg.data[0] & 0xf;
            var noteNumber = msg.data[1];
            var velocity = 0;
            if (msg.data.length > 2) velocity = msg.data[2] / 100;

            // MIDI noteon with velocity=0 is the same as noteoff
            if (cmd == 8 || cmd == 9 && velocity == 0) {
                // noteoff
                this.onKeyUp(noteNumber);
            } else if (cmd == 9) {
                // note on
                this.onKeyDown(noteNumber, velocity);
            } //else if (cmd == 11) { // controller message
        }

        /**
         * get keys down
         */

    }, {
        key: "getKeysDown",
        value: function getKeysDown() {
            var down = [];
            for (var c = 0; c < this._keys.length; c++) {
                if (this._keys[c] > 0) {
                    var octave = 0;
                    if (c >= this._keys.length / 2) {
                        octave = 1;
                    }
                    down.push({ notation: this._mapping[c], octave: octave, index: c, velocity: this._keys[c] });
                }
            }
            return down;
        }

        /**
         * on key down
         * @param key
         * @param velocity
         */

    }, {
        key: "onKeyDown",
        value: function onKeyDown(key, velocity) {
            this._keys[key] = velocity;
            var octave = 0;
            octave = Math.floor(key / _note2.default.sharpNotations.length);
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

    }, {
        key: "onKeyUp",
        value: function onKeyUp(key) {
            this._keys[key] = 0.0;
            var octave = 0;
            octave = Math.floor(key / _note2.default.sharpNotations.length);
            this._callback({
                notation: this._mapping[key],
                octave: octave,
                index: key,
                velocity: 0,
                action: 'release' });
        }
    }]);

    return _class;
}();

exports.default = _class;

},{"./musictheory/note.es6":5}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _note = require('./note.es6');

var _note2 = _interopRequireDefault(_note);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class() {
        _classCallCheck(this, _class);

        /**
         * key signature score history
         * @type {Array}
         * @private
         */
        this._keySignatureScoreHistory = [];

        /**
         * history decay rate
         * @type {Number}
         * @private
         */
        this._keySignatureDecayRate = 0.9;

        _note2.default.generateKeySignatureLookup();
    }

    /**
     * update keys pressed
     * @param {Array} keys
     */


    _createClass(_class, [{
        key: 'update',
        value: function update(keys) {
            if (keys.length === 0) {
                return this._keySignatureScoreHistory;
            }
            var keysigScores = {};
            for (var sig in _note2.default.keys) {
                for (var d = 0; d < keys.length; d++) {
                    if (_note2.default.keys[sig].indexOf(keys[d].notation) !== -1) {
                        if (!keysigScores[sig]) {
                            keysigScores[sig] = 0;
                        }
                        keysigScores[sig]++;

                        if (keys[d].notation === sig) {
                            keysigScores[sig] += .01; // small priority boost for root note
                        }
                    }
                }
            }

            var scores = [];
            for (var score in keysigScores) {
                scores.push({ score: keysigScores[score], key: score, timestamp: Date.now() });
            }

            this.decayHistoricalScores();
            return this.applyCurrentScoreToHistory(scores);
        }

        /**
         * clear history
         */

    }, {
        key: 'clearHistory',
        value: function clearHistory() {
            this._keySignatureScoreHistory = [];
        }

        /**
         * slowly decay current historical scores
         */

    }, {
        key: 'decayHistoricalScores',
        value: function decayHistoricalScores() {
            for (var c = 0; c < this._keySignatureScoreHistory.length; c++) {
                this._keySignatureScoreHistory[c].score *= this._keySignatureDecayRate;
            }
        }

        /**
         * apply scores to history (aggregate all scores: current and past)
         * @param scores
         */

    }, {
        key: 'applyCurrentScoreToHistory',
        value: function applyCurrentScoreToHistory(scores) {
            for (var c = 0; c < scores.length; c++) {
                var found = false;
                for (var d = 0; d < this._keySignatureScoreHistory.length; d++) {
                    if (this._keySignatureScoreHistory[d].key === scores[c].key) {
                        found = true;
                        this._keySignatureScoreHistory[d].score += scores[c].score;
                    }
                }
                if (!found) {
                    this._keySignatureScoreHistory.push(scores[c]);
                }
            }
            return this._keySignatureScoreHistory.sort(function (a, b) {
                return a.score < b.score ? 1 : b.score < a.score ? -1 : 0;
            });
        }
    }]);

    return _class;
}();

exports.default = _class;

},{"./note.es6":5}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Note static class
 * @constructor
 */
exports.default = {
    /** cached keysignature lookup table */
    keys: {},

    /**
     * incremental tones as sharp notation
     * @const
     * @static
     * @type {Array.<string>}
     **/
    sharpNotations: ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"],

    /**
     * incremental tones as flat notation
     * @const
     * @static
     * @type {Array.<string>}
     **/
    flatNotations: ["A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab"],

    /**
     * get notation index when notation is either flat or sharp
     * @param notation
     */
    indexOfNotation: function indexOfNotation(notation) {
        var index = this.sharpNotations.indexOf(notation);
        if (index === -1) {
            index = this.flatNotations.indexOf(notation);
        }
        return index;
    },


    /**
     * get notation given an index
     * @param index
     */
    notationAtIndex: function notationAtIndex(index, preferFlat) {
        if (index >= this.sharpNotations.length) {
            index = index % this.sharpNotations.length;
        }

        if (preferFlat) {
            return this.flatNotations[index];
        } else {
            return this.sharpNotations[index];
        }
    },


    /**
     * odd notations
     * @const
     * @static
     * @type {Array.<string>}
     **/
    oddNotations: ["B#", "Cb", "E#", "Fb"],

    /**
     * corrected notations
     * @const
     * @static
     * @type {Array.<string>}
     **/
    correctedNotations: ["C", "C", "F", "F"],

    /**
     * translate index from MIDI to notation
     * @param index
     * @constructor
     */
    MIDItoNotation: function MIDItoNotation(index) {
        var position = index % this.sharpNotations.length;
        return this.sharpNotations[position];
    },


    /**
     * translate notation and octave to MIDI index
     * @param notation
     */
    notationToMIDI: function notationToMIDI(notation) {
        var ntObj = this.parseNotation(notation);
        var ntindx = this.sharpNotations.indexOf(ntObj.notation);
        if (ntindx === -1) {
            ntindx = this.flatNotations.indexOf(ntObj.notation);
        }
        return ntObj.octave * this.sharpNotations.length + ntindx;
    },


    /**
     * parse notation to notation and octave
     * @param notation
     */
    parseNotation: function parseNotation(notation) {
        var note = {};
        // only supports one digit octaves (if thats even a real issue)
        var octave = notation.charAt(notation.length - 1);
        if (parseInt(octave) == octave) {
            note.octave = octave;
            note.notation = notation.substr(0, notation.length - 2);
        } else {
            note.octave = 4; // default
            note.notation = notation;
        }

        return note;
    },


    /**
     * turn a notation into a frequency
     * @static
     * @param {string} notation
     * @return {string} frequency
     */
    getFrequencyForNotation: function getFrequencyForNotation(nt) {
        var octave = 4;

        // does notation include the octave?
        if (!isNaN(parseInt(nt.charAt(nt.length - 1)))) {
            octave = parseInt(nt.charAt(nt.length - 1));
            nt = nt.substr(0, nt.length - 1);
        }

        // correct any flat/sharps that resolve to a natural
        if (this.oddNotations.indexOf(nt) != -1) {
            nt = this.correctedNotations[this.oddNotations.indexOf(nt)];
        }

        var freq;
        var indx = this.sharpNotations.indexOf(nt);

        if (indx == -1) {
            indx = this.flatNotations.indexOf(nt);
        }

        if (indx != -1) {
            indx += (octave - 4) * this.sharpNotations.length;
            freq = 440 * Math.pow(2, indx / 12);
        }
        return freq;
    },


    /**
     * get notes in a specific key signature
     *
     * @static
     * @param {string} key (root note)
     * @param {boolean} if major key signature
     * @param {number} octave to use (optional)
     * @return {Array.<string>} keys in key signature
     */
    notesInKeySignature: function notesInKeySignature(key, major, octave) {
        var notesToIndex;
        var notesInKey = [];
        var startPos;

        // correct any flat/sharps that resolve to a natural
        if (this.oddNotations.indexOf(key) != -1) {
            key = this.correctedNotations[this.oddNotations.indexOf(key)];
        }

        // find the correct note and notation
        if (this.sharpNotations.indexOf(key) != -1) {
            notesToIndex = this.sharpNotations.slice();
            startPos = this.sharpNotations.indexOf(key);
        } else {
            notesToIndex = this.flatNotations.slice();
            startPos = this.flatNotations.indexOf(key);
        }

        // double the array length
        var len = notesToIndex.length;
        for (var c = 0; c < len; c++) {
            if (octave) {
                notesToIndex.push(notesToIndex[c] + (octave + 1));
            } else {
                notesToIndex.push(notesToIndex[c]);
            }
        }

        // add octave notation to the first half of the array
        if (octave) {
            for (var c = 0; c < this.flatNotations.length; c++) {
                notesToIndex[c] += octave;
            }
        }
        // chop off the front of the array to start at the root key in the key signature
        notesToIndex.splice(0, startPos);

        // build the key signature
        if (major) {
            // MAJOR From root: whole step, whole step, half step, whole step, whole step, whole step, half step
            notesInKey.push(notesToIndex[0]);
            notesInKey.push(notesToIndex[2]);
            notesInKey.push(notesToIndex[4]);
            notesInKey.push(notesToIndex[5]);
            notesInKey.push(notesToIndex[7]);
            notesInKey.push(notesToIndex[9]);
            notesInKey.push(notesToIndex[11]);
        } else {
            // MINOR From root: whole step, half step, whole step, whole step, half step, whole step, whole step
            notesInKey.push(notesToIndex[0]);
            notesInKey.push(notesToIndex[2]);
            notesInKey.push(notesToIndex[3]);
            notesInKey.push(notesToIndex[5]);
            notesInKey.push(notesToIndex[7]);
            notesInKey.push(notesToIndex[8]);
            notesInKey.push(notesToIndex[10]);
        }
        return notesInKey;
    },


    /**
     * pregenerate a key signature lookup table for every note
     */
    generateKeySignatureLookup: function generateKeySignatureLookup() {
        var kys = this.sharpNotations;
        for (var c = 0; c < kys.length; c++) {
            this.keys[kys[c]] = this.notesInKeySignature(kys[c], true);
            this.keys[kys[c] + 'm'] = this.notesInKeySignature(kys[c], false);
        }
    }
};

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _basegroup = require('../../node_modules/trivr/src/basegroup.es6');

var _basegroup2 = _interopRequireDefault(_basegroup);

var _style = require('../themeing/style.es6');

var _style2 = _interopRequireDefault(_style);

var _toneplayback = require('../toneplayback.es6');

var _toneplayback2 = _interopRequireDefault(_toneplayback);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Dome = function (_BaseGroup) {
    _inherits(Dome, _BaseGroup);

    function Dome() {
        _classCallCheck(this, Dome);

        return _possibleConstructorReturn(this, (Dome.__proto__ || Object.getPrototypeOf(Dome)).apply(this, arguments));
    }

    _createClass(Dome, [{
        key: 'onCreate',

        /**
         * on create scene (or earliest possible opportunity)
         * @param scene
         * @param custom
         */
        value: function onCreate(scene, custom) {
            var mesh = new THREE.Mesh(this.createGeometry(), this.createMaterial());
            mesh.position.z = 5;
            this.add(mesh, 'dome');
        }

        /**
         * on render
         * @param scenecollection
         * @param mycollection
         */

    }, {
        key: 'onRender',
        value: function onRender(scenecollection, mycollection) {
            if (_toneplayback2.default.isPlaying) {
                this.group.rotation.y += Math.PI / 1024;
            }
        }

        /**
         * create globe geometry
         * @returns {THREE.IcosahedronGeometry}
         */

    }, {
        key: 'createGeometry',
        value: function createGeometry() {
            return new THREE.IcosahedronGeometry(800, 2);
        }

        /**
         * create globe material
         */

    }, {
        key: 'createMaterial',
        value: function createMaterial() {
            return new THREE.MeshPhongMaterial({
                color: _style2.default.dome.color,
                emissive: _style2.default.dome.emissive,
                specular: _style2.default.dome.specular,
                side: THREE.BackSide,
                shininess: 10,
                shading: THREE.FlatShading,
                transparent: 1,
                opacity: 1
            });
        }
    }]);

    return Dome;
}(_basegroup2.default);

exports.default = Dome;

},{"../../node_modules/trivr/src/basegroup.es6":19,"../themeing/style.es6":16,"../toneplayback.es6":17}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _basegroup = require('../../../node_modules/trivr/src/basegroup.es6');

var _basegroup2 = _interopRequireDefault(_basegroup);

var _input = require('../../input.es6');

var _input2 = _interopRequireDefault(_input);

var _note = require('../../musictheory/note.es6');

var _note2 = _interopRequireDefault(_note);

var _style = require('../../themeing/style.es6');

var _style2 = _interopRequireDefault(_style);

var _utils = require('../../utils.es6');

var _utils2 = _interopRequireDefault(_utils);

var _toneplayback = require('../../toneplayback.es6');

var _toneplayback2 = _interopRequireDefault(_toneplayback);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseKeyboard = function (_BaseGroup) {
    _inherits(BaseKeyboard, _BaseGroup);

    function BaseKeyboard() {
        _classCallCheck(this, BaseKeyboard);

        return _possibleConstructorReturn(this, (BaseKeyboard.__proto__ || Object.getPrototypeOf(BaseKeyboard)).apply(this, arguments));
    }

    _createClass(BaseKeyboard, [{
        key: 'onInitialize',
        value: function onInitialize(params) {
            /**
             * how much rotation occurs on keypress
             * @type {number}
             * @private
             */
            this._rotationOnPress = Math.PI / 16;

            /**
             * number of octaves
             * @type {number}
             * @private
             */
            this._numOctaves = params.octaves ? params.octaves : 2;

            /**
             * starting octave (to better match with MIDI input)
             * @type {number}
             * @private
             */
            this._startingOctave = params.startoctave ? params.startoctave : 0;

            /**
             * starting note on keyboard
             * @type {string}
             * @private
             */
            this._startingNote = 'C';

            /**
             * key visuals
             * @type {Array}
             * @private
             */
            this._keys = [];

            /**
             * midi channels used
             * @type {Array}
             * @private
             */
            this._midichannels = [];

            /**
             * starting index at which point to allocate MIDI channels
             * @type {number}
             * @private
             */
            this._midiChannelStartIndex = 11;

            /**
             * suggested keys from key signature prediction
             * @type {Array}
             */
            this.suggestedKeys = [];
        }
        /**
         * on create scene (or earliest possible opportunity)
         * @param scene
         * @param custom
         */

    }, {
        key: 'onCreate',
        value: function onCreate(scene, custom) {}
        //TonePlayback.addEventListener('mididata', data => this.onSongData(data));


        /**
         * on render scene
         * @param scene
         * @param custom
         */

    }, {
        key: 'onRender',
        value: function onRender(scene, custom) {
            for (var c = 0; c < this._keys.length; c++) {
                if (this._keys[c].colortween.animating) {
                    this._keys[c].object.material.color.setRGB(this._keys[c].colortween.rcolor / 100, this._keys[c].colortween.gcolor / 100, this._keys[c].colortween.bcolor / 100);
                }
            }
        }

        /**
         * on assets loaded
         * @param geometry
         */

    }, {
        key: 'onAssetsLoaded',
        value: function onAssetsLoaded(geometry) {
            var mat = new THREE.MeshStandardMaterial({
                metalness: 0.7,
                roughness: 1,
                side: THREE.FrontSide,
                shading: THREE.FlatShading
            });
            this.setupScene(geometry, mat);
        }
    }, {
        key: 'setupScene',


        /**
         * dynamically generate circle of keys
         * @param geometry
         * @param material
         */
        value: function setupScene(geometry, material) {
            var startOffset = _note2.default.indexOfNotation(this._startingNote);
            var ntindex = 0;
            var transformPosition = 0;
            for (var c = 0; c < this._numOctaves; c++) {
                for (var d = 0; d < _note2.default.sharpNotations.length; d++) {
                    var note = _note2.default.notationAtIndex(d + startOffset);
                    transformPosition = this.addKey(transformPosition, note.indexOf('#') === -1, note, c, geometry, material);
                    ntindex++;
                }
            }

            return transformPosition;
        }

        /**
         * on inactivity (fade away keys and clear key sig)
         */

    }, {
        key: 'resetKeys',
        value: function resetKeys() {
            for (var c = 0; c < this._keys.length; c++) {
                if (this._keys[c].suggested) {
                    var currentColor = this._keys[c].object.material.color.getHex();
                    _utils2.default.copyPropsTo(this._keys[c].colortween, _utils2.default.decToRGB(currentColor, 100), 'color');
                    this._keys[c].colortween.animating = true;
                    var target = _utils2.default.copyPropsTo({}, _utils2.default.decToRGB(_style2.default.keys.normal[this._keys[c].type].color, 100), 'color');
                    createjs.Tween.get(this._keys[c].colortween).to(target, 2000).wait(100) // wait a few ticks, or the render cycle won't pick up the changes with the flag
                    .call(function () {
                        this.animating = false;
                    });
                }
            }
        }

        /**
         * change key signature to notation given
         * @param notation
         */

    }, {
        key: 'changeKeySignature',
        value: function changeKeySignature(notation) {
            var c;
            for (c = 0; c < this.suggestedKeys.length; c++) {
                this.toggleKeySuggestion(this.suggestedKeys[c], notation, false);
            }
            this.suggestedKeys = _note2.default.keys[notation];

            for (c = 0; c < this.suggestedKeys.length; c++) {
                this.toggleKeySuggestion(this.suggestedKeys[c], notation, true, c);
            }
        }

        /**
         * toggle key pressed
         * @param key
         */

    }, {
        key: 'toggleKeyPressed',
        value: function toggleKeyPressed(k) {
            var key = this.findKeyObjectForNotation(k.notation, k.octave);
            if (key) {
                if (k.velocity === 0) {
                    _toneplayback2.default.noteOff(key.notation, key.midichannel, 1 / 8);
                    var channelindex = this._midichannels.indexOf(key.midichannel);
                    this._midichannels.splice(channelindex, 1);
                    clearTimeout(this._inactivityTimer);
                    key.object.rotation.set(key.originalRotation.x, key.originalRotation.y, key.originalRotation.z);
                    key.currentRotation = 0;
                    key.midichannel = -1;
                    key.down = false;
                } else {
                    this._midichannels = this._midichannels.sort();
                    var midichannel = this._midichannels[this._midichannels.length - 1] + 1;
                    if (!midichannel) {
                        midichannel = this._midiChannelStartIndex;
                    }
                    _toneplayback2.default.noteOn(_toneplayback2.default.PIANO, key.notation, midichannel);
                    key.currentRotation = k.velocity * this._rotationOnPress;
                    key.object.rotateX(key.currentRotation);
                    key.midichannel = midichannel;
                    key.down = true;
                }
            }
        }

        /**
         * toggle key suggestion
         * @param notation
         * @param keysignotation
         * @param toggle
         */

    }, {
        key: 'toggleKeySuggestion',
        value: function toggleKeySuggestion(notation, keysignotation, toggle) {
            var ntIndex = _note2.default.indexOfNotation(keysignotation);
            var rootclr = _style2.default.colorwheel[ntIndex];

            var keys = this.findKeyObjectsForNotation(notation);

            for (var c = 0; c < keys.length; c++) {
                if (toggle) {
                    var clr;
                    if (ntIndex === 0 || ntIndex === 2 || ntIndex === 4 || ntIndex === 6) {
                        clr = _style2.default.keys.stronglySuggested[keys[c].type];
                        keys[c].suggested = 'stronglySuggested';
                    } else {
                        clr = _style2.default.keys.suggested[keys[c].type];
                        keys[c].suggested = 'suggested';
                    }

                    keys[c].object.material.color.setHex(rootclr); //clr.color);
                    //  keys[c].object.material.emissive.setHex(rootclr) ; //clr.emissive);
                } else {
                    keys[c].object.material.color.setHex(_style2.default.keys.normal[keys[c].type].color);
                    // keys[c].object.material.emissive.setHex(Style.keys.normal[keys[c].type].emissive);
                    keys[c].suggested = false;
                }
            }
        }

        /**
         * create white key geometry
         * @returns {THREE.Mesh}
         */

    }, {
        key: 'createWhiteKey',
        value: function createWhiteKey(geometry, material) {
            var keygeom = geometry.clone();
            var mat = material.clone();
            mat.color.setHex(_style2.default.keys.normal.white.color);
            mat.emissive.setHex(_style2.default.keys.normal.white.emissive);
            keygeom.translate(0, -10, 0);
            var key = new THREE.Mesh(keygeom, mat);
            return key;
        }

        /**
         * create black key geometry
         * @returns {THREE.Mesh}
         */

    }, {
        key: 'createBlackKey',
        value: function createBlackKey(geometry, material) {
            var keygeom = geometry.clone();
            var mat = material.clone();
            mat.color.setHex(_style2.default.keys.normal.black.color);
            mat.emissive.setHex(_style2.default.keys.normal.black.emissive);
            keygeom.translate(0, -25, 0);
            keygeom.scale(1, .5, 1);
            var key = new THREE.Mesh(keygeom, mat);
            return key;
        }

        /**
         * create and add a key
         * @param {Number} transformPosition
         * @param {Boolean} white
         * @param {String} notation
         * @param {Number} octave
         * @param {THREE.Geometry} geometry
         * @param {THREE.Material} material
         * @return {Number} transform position
         */

    }, {
        key: 'addKey',
        value: function addKey(transformPosition, white, notation, octave, geometry, material) {
            var key, color, rotation;
            if (white) {
                color = 'white';
                key = this.createWhiteKey(geometry, material);
            } else {
                color = 'black';
                key = this.createBlackKey(geometry, material);
            }
            transformPosition = this.applyKeyTransform(key, transformPosition, white);
            this._keys.push({
                type: color,
                object: key,
                octave: octave + this._startingOctave,
                colortween: {},
                notation: notation,
                originalRotation: {
                    x: key.rotation.x,
                    y: key.rotation.y,
                    z: key.rotation.z }
            });
            this.add(key, 'key_' + notation);
            return transformPosition;
        }

        /**
         * apply key transform
         * @param {THREE.Mesh} keymesh
         * @param {Number} transformPosition
         * @param {Boolean} whitekey
         */

    }, {
        key: 'applyKeyTransform',
        value: function applyKeyTransform(keymesh, transformPosition, whitekey) {}

        /**
         * find the key for a specific notation
         * @param notation
         * @returns {Array}
         */

    }, {
        key: 'findKeyObjectsForNotation',
        value: function findKeyObjectsForNotation(notation) {
            var keys = [];
            for (var c = 0; c < this._keys.length; c++) {
                if (this._keys[c].notation === notation) {
                    keys.push(this._keys[c]);
                }
            }
            return keys;
        }

        /**
         * find specific key object for notation and octave
         * @param notation
         * @param octave
         */

    }, {
        key: 'findKeyObjectForNotation',
        value: function findKeyObjectForNotation(notation, octave) {
            var notationOffset = _note2.default.indexOfNotation(this._startingNote);
            var indx = octave * _note2.default.sharpNotations.length + _note2.default.sharpNotations.indexOf(notation) - notationOffset;
            return this._keys[indx];
        }

        /**
         * on song data
         * @param data
         */

    }, {
        key: 'onSongData',
        value: function onSongData(data) {
            var notation = _note2.default.MIDItoNotation(data.note);
            var key = this.findKeyObjectsForNotation(notation);
            this.toggleKeyPressed(key[0], data.velocity / 127);
        }
    }]);

    return BaseKeyboard;
}(_basegroup2.default);

exports.default = BaseKeyboard;

},{"../../../node_modules/trivr/src/basegroup.es6":19,"../../input.es6":2,"../../musictheory/note.es6":5,"../../themeing/style.es6":16,"../../toneplayback.es6":17,"../../utils.es6":18}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _basekeyboard = require('./basekeyboard.es6');

var _basekeyboard2 = _interopRequireDefault(_basekeyboard);

var _input = require('../../input.es6');

var _input2 = _interopRequireDefault(_input);

var _note = require('../../musictheory/note.es6');

var _note2 = _interopRequireDefault(_note);

var _style = require('../../themeing/style.es6');

var _style2 = _interopRequireDefault(_style);

var _utils = require('../../utils.es6');

var _utils2 = _interopRequireDefault(_utils);

var _toneplayback = require('../../toneplayback.es6');

var _toneplayback2 = _interopRequireDefault(_toneplayback);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CircularKeyboard = function (_BaseKeyboard) {
    _inherits(CircularKeyboard, _BaseKeyboard);

    function CircularKeyboard() {
        _classCallCheck(this, CircularKeyboard);

        return _possibleConstructorReturn(this, (CircularKeyboard.__proto__ || Object.getPrototypeOf(CircularKeyboard)).apply(this, arguments));
    }

    _createClass(CircularKeyboard, [{
        key: 'applyKeyTransform',

        /**
         * apply key transform
         * @param {THREE.Mesh} keymesh
         * @param {Number} position in keyboard
         * @param {Number} keyindex
         * @param {Boolean} whitekey
         */
        value: function applyKeyTransform(keymesh, transformPosition, whitekey) {
            var rotate = 0;
            var extraRotate = 0;
            if (whitekey) {
                rotate = Math.PI * 2 / 14;
            } else {
                extraRotate = Math.PI * 2 / 28;
            }
            keymesh.rotation.z = transformPosition + rotate + extraRotate;

            return transformPosition + rotate;
        }

        /**
         * setup scene
         * @param geometry
         * @param material
         */

    }, {
        key: 'setupScene',
        value: function setupScene(geometry, material) {
            _get(CircularKeyboard.prototype.__proto__ || Object.getPrototypeOf(CircularKeyboard.prototype), 'setupScene', this).call(this, geometry, material);
            this.group.position.z = -400;
            this.group.scale.set(10, 10, 10);
        }
    }]);

    return CircularKeyboard;
}(_basekeyboard2.default);

exports.default = CircularKeyboard;

},{"../../input.es6":2,"../../musictheory/note.es6":5,"../../themeing/style.es6":16,"../../toneplayback.es6":17,"../../utils.es6":18,"./basekeyboard.es6":7}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _basekeyboard = require('./basekeyboard.es6');

var _basekeyboard2 = _interopRequireDefault(_basekeyboard);

var _input = require('../../input.es6');

var _input2 = _interopRequireDefault(_input);

var _note = require('../../musictheory/note.es6');

var _note2 = _interopRequireDefault(_note);

var _style = require('../../themeing/style.es6');

var _style2 = _interopRequireDefault(_style);

var _utils = require('../../utils.es6');

var _utils2 = _interopRequireDefault(_utils);

var _toneplayback = require('../../toneplayback.es6');

var _toneplayback2 = _interopRequireDefault(_toneplayback);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TraditionalKeyboard = function (_BaseKeyboard) {
    _inherits(TraditionalKeyboard, _BaseKeyboard);

    function TraditionalKeyboard() {
        _classCallCheck(this, TraditionalKeyboard);

        return _possibleConstructorReturn(this, (TraditionalKeyboard.__proto__ || Object.getPrototypeOf(TraditionalKeyboard)).apply(this, arguments));
    }

    _createClass(TraditionalKeyboard, [{
        key: 'onInitialize',
        value: function onInitialize(params) {
            _get(TraditionalKeyboard.prototype.__proto__ || Object.getPrototypeOf(TraditionalKeyboard.prototype), 'onInitialize', this).call(this, params);

            /**
             * how much rotation occurs on keypress
             * @type {number}
             * @private
             */
            this._rotationOnPress = Math.PI / 64;
        }

        /**
         * apply key transform
         * @param {THREE.Mesh} keymesh
         * @param {Number} position in keyboard
         * @param {Boolean} whitekey
         * @return {Number} current position
         */

    }, {
        key: 'applyKeyTransform',
        value: function applyKeyTransform(keymesh, transformPosition, whitekey) {
            var translate = 2;
            if (!whitekey) {
                keymesh.position.y = 5;
                keymesh.position.z = 1;
                keymesh.position.x = transformPosition + 1;
                translate = 0;
            } else {
                keymesh.position.x = transformPosition + 2;
            }
            keymesh.rotation.x = 0;
            return transformPosition + translate;
        }

        /**
         * setup scene
         * @param geometry
         * @param material
         */

    }, {
        key: 'setupScene',
        value: function setupScene(geometry, material) {
            var lastTransformPosition = _get(TraditionalKeyboard.prototype.__proto__ || Object.getPrototypeOf(TraditionalKeyboard.prototype), 'setupScene', this).call(this, geometry, material);
            this.group.position.x = -lastTransformPosition / 2 * 10;
            this.group.position.z = -200;
            this.group.position.y = -200;
            this.group.rotation.x = -Math.PI / 2;
            this.group.scale.set(10, 10, 10);
        }
    }]);

    return TraditionalKeyboard;
}(_basekeyboard2.default);

exports.default = TraditionalKeyboard;

},{"../../input.es6":2,"../../musictheory/note.es6":5,"../../themeing/style.es6":16,"../../toneplayback.es6":17,"../../utils.es6":18,"./basekeyboard.es6":7}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _basegroup = require('../../node_modules/trivr/src/basegroup.es6');

var _basegroup2 = _interopRequireDefault(_basegroup);

var _style = require('../themeing/style.es6');

var _style2 = _interopRequireDefault(_style);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Lighting = function (_BaseGroup) {
    _inherits(Lighting, _BaseGroup);

    function Lighting() {
        _classCallCheck(this, Lighting);

        return _possibleConstructorReturn(this, (Lighting.__proto__ || Object.getPrototypeOf(Lighting)).apply(this, arguments));
    }

    _createClass(Lighting, [{
        key: 'onCreate',

        /**
         * on create scene (or earliest possible opportunity)
         * @param scene
         * @param custom
         */
        value: function onCreate(scene, custom) {
            var light = new THREE.HemisphereLight(_style2.default.lighting.hemisphere.top, _style2.default.lighting.hemisphere.bottom, 4);
            var spotLight = new THREE.SpotLight(_style2.default.lighting.spotlight);
            spotLight.position.set(0, 0, 400);
            spotLight.rotation.x = Math.PI / 2;

            spotLight.shadow.mapSize.width = 1024;
            spotLight.shadow.mapSize.height = 1024;

            spotLight.shadow.camera.near = 100;
            spotLight.shadow.camera.far = 400;
            spotLight.shadow.camera.fov = 30;

            this.add(spotLight);
            this.add(light);
        }
    }]);

    return Lighting;
}(_basegroup2.default);

exports.default = Lighting;

},{"../../node_modules/trivr/src/basegroup.es6":19,"../themeing/style.es6":16}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _shaders = require('./../shaders.es6');

var _shaders2 = _interopRequireDefault(_shaders);

var _basegroup = require('../../node_modules/trivr/src/basegroup.es6');

var _basegroup2 = _interopRequireDefault(_basegroup);

var _style = require('../themeing/style.es6');

var _style2 = _interopRequireDefault(_style);

var _utils = require('../utils.es6');

var _utils2 = _interopRequireDefault(_utils);

var _toneplayback = require('../toneplayback.es6');

var _toneplayback2 = _interopRequireDefault(_toneplayback);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Metronome = function (_BaseGroup) {
    _inherits(Metronome, _BaseGroup);

    function Metronome() {
        _classCallCheck(this, Metronome);

        return _possibleConstructorReturn(this, (Metronome.__proto__ || Object.getPrototypeOf(Metronome)).apply(this, arguments));
    }

    _createClass(Metronome, [{
        key: 'onInitialize',
        value: function onInitialize() {
            /**
             * metronome hammers in scene
             * @type {Array}
             * @private
             */
            this._hammers = [];

            /**
             * synth
             * @type {Tone}
             * @private
             */
            //this._synth = new Tone.DrumSynth().toMaster();

            /**
             * tween targets
             * @type {{drum: {animating: boolean, props: {}}}}
             * @private
             */
            this._tweenTargets = {
                drum: { animating: false, props: {} }
            };

            this.setHitColor();
        }

        /**
         * set drum hit/trigger color
         * @param hex
         */

    }, {
        key: 'setHitColor',
        value: function setHitColor(hex) {
            if (hex) {
                this._hitColor = _utils2.default.decToRGB(hex, 100);
            } else {
                this._hitColor = _utils2.default.decToRGB(_style2.default.metronome.hammer.hitcolor, 100);
            }
        }
    }, {
        key: 'onCreate',
        value: function onCreate(scenecollection, mycollection) {
            //this.addHammer('right', Math.PI/64, Math.PI * 2, 'C4');
            //this.addHammer('left', Math.PI/128, Math.PI/4, 'A4');
            this.addHammer('up', Math.PI / 128, Math.PI / 2, 'G4');
            this.addHammer('down', Math.PI / 32, 0, 'F3');
            this.addDrum();
        }

        /**
         * on render
         * @param scenecollection
         * @param mycollection
         */

    }, {
        key: 'onRender',
        value: function onRender(scenecollection, mycollection) {
            this.animateHammers();
            this.animateDrum();
        }

        /**
         * render cycle for drum
         */

    }, {
        key: 'animateDrum',
        value: function animateDrum() {
            if (this._tweenTargets.drum.animating) {
                this.drum.position.z = this._tweenTargets.drum.props.zPosition;
                this.drum.material.bumpScale = this._tweenTargets.drum.props.bumpscale;
                this.drum.material.color.setRGB(this._tweenTargets.drum.props.r / 100, this._tweenTargets.drum.props.g / 100, this._tweenTargets.drum.props.b / 100);
            }
        }

        /**
         * render cycle for hammers
         */

    }, {
        key: 'animateHammers',
        value: function animateHammers() {
            for (var c = 0; c < this._hammers.length; c++) {
                var hammer = this._hammers[c];

                if (hammer.animatingGlow) {
                    hammer.glow.material.color.setRGB(hammer.glowColor.r / 100, hammer.glowColor.g / 100, hammer.glowColor.b / 100);
                }

                var newrotation = hammer.pivot.rotation[hammer.rotationaxis] + hammer.direction * hammer.rate;

                if (Math.abs(newrotation) > Math.PI - Math.PI / 16) {
                    hammer.direction *= -1;
                    newrotation = Math.abs(newrotation) / newrotation * (Math.PI - Math.PI / 16);
                    this.triggerDrum(hammer);
                }
                hammer.pivot.rotation[hammer.rotationaxis] = newrotation;
            }
        }

        /**
         * sound the drum, the hammer hit it
         * @param hammer
         */

    }, {
        key: 'triggerDrum',
        value: function triggerDrum(hammer) {
            var _this2 = this;

            _toneplayback2.default.noteOn(_toneplayback2.default.SYNTHDRUM, hammer.note, 10, 1 / 8);
            // this._synth.triggerAttackRelease(hammer.note, "16n");
            hammer.animatingGlow = true;
            var startcolor = _utils2.default.decToRGB(_style2.default.metronome.hammer.color, 100);
            var endcolor = this._hitColor;
            hammer.glowColor.r = startcolor.r;
            hammer.glowColor.g = startcolor.g;
            hammer.glowColor.b = startcolor.b;
            createjs.Tween.get(hammer.glowColor).to({ r: endcolor.r, g: endcolor.g, b: endcolor.b }, 500).to({ r: startcolor.r, g: startcolor.g, b: startcolor.b }, 500).wait(100) // wait a few ticks, or the render cycle won't pick up the changes with the flag
            .call(function (scope) {
                scope.animatingGlow = false;
            });

            var startcolor = _utils2.default.decToRGB(_style2.default.metronome.drum.color, 100);
            var endcolor = this._hitColor;
            this._tweenTargets.drum.props.r = startcolor.r;
            this._tweenTargets.drum.props.g = startcolor.g;
            this._tweenTargets.drum.props.b = startcolor.b;
            this._tweenTargets.drum.props.zPosition = -400;
            this._tweenTargets.drum.props.bumpscale = 0;
            this._tweenTargets.drum.animating = true;
            this._tweenTargets.drum.currentTween = createjs.Tween.get(this._tweenTargets.drum.props).to({
                r: endcolor.r, g: endcolor.g, b: endcolor.b,
                bumpscale: 1.5,
                zPosition: -400 + hammer.direction * 50 }, 150).to({
                r: startcolor.r, g: startcolor.g, b: startcolor.b,
                bumpscale: 0,
                zPosition: -400 }, 150).wait(100) // wait a few ticks, or the render cycle won't pick up the changes with the flag
            .call(function () {
                _this2._tweenTargets.drum.animating = false;
            });
        }

        /**
         * add center drum
         */

    }, {
        key: 'addDrum',
        value: function addDrum() {
            var drumgeom = new THREE.CircleGeometry(30, 24);
            drumgeom.scale(1, 1, 0.75);
            var mapHeight = new THREE.TextureLoader().load(_style2.default.metronome.drum.bumpmap);
            mapHeight.anisotropy = 4;
            mapHeight.repeat.set(1, 1);
            mapHeight.wrapS = mapHeight.wrapT = THREE.ClampToEdgeWrapping;
            mapHeight.format = THREE.RGBFormat;

            var material = new THREE.MeshPhongMaterial({
                color: _style2.default.metronome.drum.color,
                emissive: _style2.default.metronome.drum.emissive,
                specular: _style2.default.metronome.drum.specular,
                bumpMap: mapHeight,
                bumpScale: 0
            });

            this.drum = new THREE.Mesh(drumgeom, material);
            this.drum.position.z = -400;
            this.add(this.drum, 'drum');
        }

        /**
         * add metronome hammer
         * @param origin
         * @param rate
         * @param offset
         */

    }, {
        key: 'addHammer',
        value: function addHammer(origin, rate, offset, tone) {
            var hammergeom = new THREE.SphereGeometry(5);
            var centerpivot = new THREE.Object3D();

            var textureCube = new THREE.CubeTextureLoader().load(_style2.default.metronome.hammer.refractioncube);
            textureCube.mapping = THREE.CubeRefractionMapping;

            var innermaterial = new THREE.MeshBasicMaterial({
                envMap: textureCube });

            var outermaterial = new THREE.MeshBasicMaterial({
                color: _style2.default.metronome.hammer.color,
                transparent: true,
                wireframe: true,
                opacity: 0.5 });

            var hammer = new THREE.Mesh(hammergeom, innermaterial);
            hammer.name = 'ball';
            centerpivot.add(hammer);
            centerpivot.position.z = -400;

            var glow = new THREE.Mesh(hammergeom.clone(), outermaterial);
            glow.name = 'glow';
            glow.scale.multiplyScalar(1.2);
            centerpivot.add(glow);

            var rotationaxis;
            switch (origin) {
                case 'right':
                    glow.position.x = -100;
                    centerpivot.position.x = -100;
                    hammer.position.x = -100;
                    rotationaxis = 'y';
                    break;

                case 'left':
                    glow.position.x = 100;
                    centerpivot.position.x = 100;
                    hammer.position.x = 100;
                    rotationaxis = 'y';
                    break;

                case 'down':
                    glow.position.y = 100;
                    centerpivot.position.y = 100;
                    hammer.position.y = 100;
                    rotationaxis = 'x';
                    break;

                case 'up':
                    glow.position.y = -100;
                    centerpivot.position.y = -100;
                    hammer.position.y = -100;
                    rotationaxis = 'x';
                    break;
            }

            centerpivot.rotation[rotationaxis] += offset;

            this._hammers.push({
                animatingGlow: false,
                glow: glow,
                glowColor: {},
                hammer: hammer,
                pivot: centerpivot,
                direction: 1,
                rate: rate,
                rotationaxis: rotationaxis,
                note: tone });

            this.add(centerpivot, 'hammer');
        }
    }]);

    return Metronome;
}(_basegroup2.default);

exports.default = Metronome;

},{"../../node_modules/trivr/src/basegroup.es6":19,"../themeing/style.es6":16,"../toneplayback.es6":17,"../utils.es6":18,"./../shaders.es6":14}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _basegroup = require('../../node_modules/trivr/src/basegroup.es6');

var _basegroup2 = _interopRequireDefault(_basegroup);

var _style = require('../themeing/style.es6');

var _style2 = _interopRequireDefault(_style);

var _utils = require('../utils.es6');

var _utils2 = _interopRequireDefault(_utils);

var _shaders = require('../shaders.es6');

var _shaders2 = _interopRequireDefault(_shaders);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ParticleFlock = function (_BaseGroup) {
    _inherits(ParticleFlock, _BaseGroup);

    function ParticleFlock() {
        _classCallCheck(this, ParticleFlock);

        return _possibleConstructorReturn(this, (ParticleFlock.__proto__ || Object.getPrototypeOf(ParticleFlock)).apply(this, arguments));
    }

    _createClass(ParticleFlock, [{
        key: 'onCreate',

        /**
         * on create scene
         * @param scene
         * @param custom
         */
        value: function onCreate(scene, custom) {
            this.flockGPURenderer = {
                gpuCompute: null,
                velocityVariable: null,
                positionVariable: null,
                positionUniforms: null,
                velocityUniforms: null,
                uniforms: null
            };

            this._color;

            /* TEXTURE WIDTH FOR SIMULATION */
            this.WIDTH = 64;

            var BIRDS = this.WIDTH * this.WIDTH;

            this.mouseX = 0;
            this.mouseY = 0;
            this.BOUNDS = 1000;
            this.BOUNDS_HALF = this.BOUNDS / 2;

            this.immersed = false;
            this.immersionLevels = { min: -200.0, max: 2000.0 };
            this.initComputeRenderer(scene.renderer);

            /*document.addEventListener( 'mousemove', e => this.onDocumentMouseMove(e), false );
            document.addEventListener( 'touchstart', e => this.onDocumentTouchStart(e), false );
            document.addEventListener( 'touchmove', e => this.onDocumentTouchMove(e), false );*/
            this.initBirds();
        }
    }, {
        key: 'onDocumentMouseMove',
        value: function onDocumentMouseMove(event) {
            this.mouseX = event.clientX - 600; //- windowHalfX;
            this.mouseY = event.clientY - 600; //- windowHalfY;
        }
    }, {
        key: 'onDocumentTouchStart',
        value: function onDocumentTouchStart(event) {
            if (event.touches.length === 1) {

                event.preventDefault();

                this.mouseX = event.touches[0].pageX - 600; //- windowHalfX;
                this.mouseY = event.touches[0].pageY - 600; //- windowHalfY;
            }
        }
    }, {
        key: 'onDocumentTouchMove',
        value: function onDocumentTouchMove(event) {

            if (event.touches.length === 1) {

                event.preventDefault();

                this.mouseX = event.touches[0].pageX - 600; //windowHalfX;
                this.mouseY = event.touches[0].pageY - 600; //windowHalfY;
            }
        }

        /**
         * set drum hit/trigger color
         * @param hex
         */

    }, {
        key: 'setColor',
        value: function setColor(hex) {
            var color;
            if (hex) {
                color = _utils2.default.decToRGB(hex, 1);
                this.immersed = true;
            } else {
                color = _utils2.default.decToRGB(_style2.default.floatingparticles.color, 1);
                this.immersed = false;
            }

            if (!this._color) {
                this._color = color;
                this.mesh.material.uniforms.color.value = [this._color.r, this._color.g, this._color.b];
            } else {
                this._color.animating = true;
                createjs.Tween.get(this._color).to(color, 2000).wait(100) // wait a few ticks, or the render cycle won't pick up the changes with the flag
                .call(function () {
                    this.animating = false;
                });
            }
        }
    }, {
        key: 'onRender',
        value: function onRender(time) {

            if (this.immersed && this.flockGPURenderer.positionUniforms.depth.value < this.immersionLevels.max) {
                this.flockGPURenderer.positionUniforms.depth.value += 1.0;
            }

            if (!this.immersed && this.flockGPURenderer.positionUniforms.depth.value > this.immersionLevels.min) {
                this.flockGPURenderer.positionUniforms.depth.value -= 1.0;
            }

            var delta = time.delta / 1000;
            if (delta > 1) delta = 1;
            this.flockGPURenderer.positionUniforms.time.value = time.now;
            this.flockGPURenderer.positionUniforms.delta.value = delta;
            this.flockGPURenderer.velocityUniforms.time.value = time.now;
            this.flockGPURenderer.velocityUniforms.delta.value = delta;
            this.flockGPURenderer.uniforms.time.value = time.now;
            this.flockGPURenderer.uniforms.delta.value = delta;
            //this.flockGPURenderer.uniforms.depth.value = -200.0;

            //this.flockGPURenderer.velocityUniforms.predator.value.set( 0.5 * this.mouseX / 600, - 0.5 * this.mouseY / 600, 0 );
            this.flockGPURenderer.gpuCompute.compute();

            this.flockGPURenderer.uniforms.texturePosition.value = this.flockGPURenderer.gpuCompute.getCurrentRenderTarget(this.flockGPURenderer.positionVariable).texture;
            this.flockGPURenderer.uniforms.textureVelocity.value = this.flockGPURenderer.gpuCompute.getCurrentRenderTarget(this.flockGPURenderer.velocityVariable).texture;

            if (this._color.animating) {
                this.mesh.material.uniforms.color.value = [this._color.r, this._color.g, this._color.b];
            }
        }
    }, {
        key: 'initComputeRenderer',
        value: function initComputeRenderer(renderer) {
            this.flockGPURenderer.gpuCompute = new GPUComputationRenderer(this.WIDTH, this.WIDTH, renderer);
            var dtPosition = this.flockGPURenderer.gpuCompute.createTexture();
            var dtVelocity = this.flockGPURenderer.gpuCompute.createTexture();
            this.fillPositionTexture(dtPosition);
            this.fillVelocityTexture(dtVelocity);

            this.flockGPURenderer.velocityVariable = this.flockGPURenderer.gpuCompute.addVariable("textureVelocity", _shaders2.default.flockvelocity.fragment, dtVelocity);
            this.flockGPURenderer.positionVariable = this.flockGPURenderer.gpuCompute.addVariable("texturePosition", _shaders2.default.flockposition.fragment, dtPosition);

            this.flockGPURenderer.gpuCompute.setVariableDependencies(this.flockGPURenderer.velocityVariable, [this.flockGPURenderer.positionVariable, this.flockGPURenderer.velocityVariable]);
            this.flockGPURenderer.gpuCompute.setVariableDependencies(this.flockGPURenderer.positionVariable, [this.flockGPURenderer.positionVariable, this.flockGPURenderer.velocityVariable]);

            this.flockGPURenderer.positionUniforms = this.flockGPURenderer.positionVariable.material.uniforms;
            this.flockGPURenderer.velocityUniforms = this.flockGPURenderer.velocityVariable.material.uniforms;

            this.flockGPURenderer.positionUniforms.time = { value: 0.0 };
            this.flockGPURenderer.positionUniforms.delta = { value: 0.0 };
            this.flockGPURenderer.positionUniforms.depth = { value: -200.0 };
            this.flockGPURenderer.velocityUniforms.time = { value: 1.0 };
            this.flockGPURenderer.velocityUniforms.delta = { value: 0.0 };
            this.flockGPURenderer.velocityUniforms.testing = { value: 1.0 };
            this.flockGPURenderer.velocityUniforms.seperationDistance = { value: 1.0 };
            this.flockGPURenderer.velocityUniforms.alignmentDistance = { value: 1.0 };
            this.flockGPURenderer.velocityUniforms.cohesionDistance = { value: 1.0 };
            this.flockGPURenderer.velocityUniforms.freedomFactor = { value: 1.0 };
            this.flockGPURenderer.velocityUniforms.predator = { value: new THREE.Vector3() };
            this.flockGPURenderer.velocityVariable.material.defines.BOUNDS = this.BOUNDS.toFixed(2);

            this.flockGPURenderer.velocityVariable.wrapS = THREE.RepeatWrapping;
            this.flockGPURenderer.velocityVariable.wrapT = THREE.RepeatWrapping;
            this.flockGPURenderer.positionVariable.wrapS = THREE.RepeatWrapping;
            this.flockGPURenderer.positionVariable.wrapT = THREE.RepeatWrapping;

            var error = this.flockGPURenderer.gpuCompute.init();
            if (error !== null) {
                console.error(error);
            }
        }
    }, {
        key: 'initBirds',
        value: function initBirds() {
            var geometry = new THREE.SwarmParticleGeometry(this.WIDTH);

            // For Vertex and Fragment
            this.flockGPURenderer.uniforms = {
                color: { value: [0.0, 0.0, 0.0] },
                texturePosition: { value: null },
                textureVelocity: { value: null },
                time: { value: 1.0 },
                delta: { value: 0.0 }
            };

            // ShaderMaterial
            var material = new THREE.ShaderMaterial({
                uniforms: this.flockGPURenderer.uniforms,
                vertexShader: _shaders2.default.flock.vertex,
                fragmentShader: _shaders2.default.flock.fragment
            });

            this.mesh = new THREE.Mesh(geometry, material);
            this.mesh.rotation.y = Math.PI / 2;
            // this.mesh.position.z = -100;
            // this.mesh.position.y = -10;
            /*this.mesh.scale.x = .2;
            this.mesh.scale.y = .2;
            this.mesh.scale.z = .2;*/
            this.mesh.matrixAutoUpdate = true;
            this.mesh.updateMatrix();

            this.add(this.mesh);
            this.setColor();
        }
    }, {
        key: 'fillPositionTexture',
        value: function fillPositionTexture(texture) {
            var theArray = texture.image.data;

            for (var k = 0, kl = theArray.length; k < kl; k += 4) {

                var x = (Math.random() * this.BOUNDS - this.BOUNDS_HALF) / 1;
                var y = (Math.random() * this.BOUNDS - this.BOUNDS_HALF) / 1;
                var z = (Math.random() * this.BOUNDS - this.BOUNDS_HALF) / 1;

                theArray[k + 0] = x;
                theArray[k + 1] = y;
                theArray[k + 2] = z;
                theArray[k + 3] = 1;
            }
        }
    }, {
        key: 'fillVelocityTexture',
        value: function fillVelocityTexture(texture) {
            var theArray = texture.image.data;

            for (var k = 0, kl = theArray.length; k < kl; k += 4) {
                var x = Math.random() - 0.5;
                var y = Math.random() - 0.5;
                var z = Math.random() - 0.5;

                theArray[k + 0] = x * 10;
                theArray[k + 1] = y * 10;
                theArray[k + 2] = z * 10;
                theArray[k + 3] = 1;
            }
        }
    }]);

    return ParticleFlock;
}(_basegroup2.default);

exports.default = ParticleFlock;

},{"../../node_modules/trivr/src/basegroup.es6":19,"../shaders.es6":14,"../themeing/style.es6":16,"../utils.es6":18}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _note = require('./musictheory/note.es6');

var _note2 = _interopRequireDefault(_note);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class(params, cb) {
        var _this = this;

        _classCallCheck(this, _class);

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
         * potential keys pressed in order
         * @type {string[]}
         * @private
         */
        this._potentialKeys = ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '+', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\''];

        document.addEventListener('keydown', function (event) {
            return _this.onKeyDown(event);
        });
        document.addEventListener('keyup', function (event) {
            return _this.onKeyUp(event);
        });
    }

    /**
     * get keys down
     * @param mapping
     */


    _createClass(_class, [{
        key: 'getKeysDown',
        value: function getKeysDown() {
            var down = [];
            for (var c = 0; c < this._keys.length; c++) {
                if (this._keys[c] > 0) {
                    var octave = 0;
                    if (c >= this._keys.length / 2) {
                        octave = 1;
                    }
                    down.push({ notation: _note2.default.notationAtIndex(c), octave: octave + 2, index: c, velocity: this._keys[c] });
                }
            }
            return down;
        }

        /**
         * on key down
         * @param event
         */

    }, {
        key: 'onKeyDown',
        value: function onKeyDown(event) {
            var key = this._potentialKeys.indexOf(event.key.toLowerCase());
            if (key !== -1 && (this._keys[key] === 0 || !this._keys[key])) {
                this._keys[key] = 1.0; // on an actual MIDI keyboard, we'd have a velocity
                var octave = Math.floor(key / _note2.default.sharpNotations.length);
                this._callback({
                    notation: _note2.default.notationAtIndex(key),
                    octave: octave + this._config.startoctave,
                    //index: key,
                    velocity: 1.0,
                    action: 'press' });
            }
        }

        /**
         * on key down
         * @param event
         */

    }, {
        key: 'onKeyUp',
        value: function onKeyUp(event) {
            var key = this._potentialKeys.indexOf(event.key.toLowerCase());
            if (key !== -1) {
                this._keys[key] = 0.0; // on an actual MIDI keyboard, we'd have a velocity
                var octave = Math.floor(key / _note2.default.sharpNotations.length);
                this._callback({
                    notation: _note2.default.notationAtIndex(key),
                    octave: octave + this._config.startoctave,
                    //index: key,
                    velocity: 0,
                    action: 'release' });
            }
        }
    }]);

    return _class;
}();

exports.default = _class;

},{"./musictheory/note.es6":5}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  "explosion": {
    "fragment": "varying float noise; uniform sampler2D tExplosion;  float random( vec3 scale, float seed ){   return fract( sin( dot( gl_FragCoord.xyz + seed, scale ) ) * 43758.5453 + seed ) ; }  void main() {    float r = .01 * random( vec3( 12.9898, 78.233, 151.7182 ), 0.0 );   vec2 tPos = vec2( 0, 1.0 - 1.3 * noise + r );   vec4 color = texture2D( tExplosion, tPos );   gl_FragColor = vec4( color.rgb, 1.0 );  }",
    "vertex": "  vec3 mod289(vec3 x) {   return x - floor(x * (1.0 / 289.0)) * 289.0; }  vec4 mod289(vec4 x) {   return x - floor(x * (1.0 / 289.0)) * 289.0; }  vec4 permute(vec4 x) {   return mod289(((x*34.0)+1.0)*x); }  vec4 taylorInvSqrt(vec4 r) {   return 1.79284291400159 - 0.85373472095314 * r; }  vec3 fade(vec3 t) {   return t*t*t*(t*(t*6.0-15.0)+10.0); }  float cnoise(vec3 P) {   vec3 Pi0 = floor(P);   vec3 Pi1 = Pi0 + vec3(1.0);   Pi0 = mod289(Pi0);   Pi1 = mod289(Pi1);   vec3 Pf0 = fract(P);   vec3 Pf1 = Pf0 - vec3(1.0);   vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);   vec4 iy = vec4(Pi0.yy, Pi1.yy);   vec4 iz0 = Pi0.zzzz;   vec4 iz1 = Pi1.zzzz;    vec4 ixy = permute(permute(ix) + iy);   vec4 ixy0 = permute(ixy + iz0);   vec4 ixy1 = permute(ixy + iz1);    vec4 gx0 = ixy0 * (1.0 / 7.0);   vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;   gx0 = fract(gx0);   vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);   vec4 sz0 = step(gz0, vec4(0.0));   gx0 -= sz0 * (step(0.0, gx0) - 0.5);   gy0 -= sz0 * (step(0.0, gy0) - 0.5);    vec4 gx1 = ixy1 * (1.0 / 7.0);   vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;   gx1 = fract(gx1);   vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);   vec4 sz1 = step(gz1, vec4(0.0));   gx1 -= sz1 * (step(0.0, gx1) - 0.5);   gy1 -= sz1 * (step(0.0, gy1) - 0.5);    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);   vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);   vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);   vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);   vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);   vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);   vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);   vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));   g000 *= norm0.x;   g010 *= norm0.y;   g100 *= norm0.z;   g110 *= norm0.w;   vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));   g001 *= norm1.x;   g011 *= norm1.y;   g101 *= norm1.z;   g111 *= norm1.w;    float n000 = dot(g000, Pf0);   float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));   float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));   float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));   float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));   float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));   float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));   float n111 = dot(g111, Pf1);    vec3 fade_xyz = fade(Pf0);   vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);   vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);   float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);   return 2.2 * n_xyz; }  float pnoise(vec3 P, vec3 rep) {   vec3 Pi0 = mod(floor(P), rep);   vec3 Pi1 = mod(Pi0 + vec3(1.0), rep);   Pi0 = mod289(Pi0);   Pi1 = mod289(Pi1);   vec3 Pf0 = fract(P);   vec3 Pf1 = Pf0 - vec3(1.0);   vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);   vec4 iy = vec4(Pi0.yy, Pi1.yy);   vec4 iz0 = Pi0.zzzz;   vec4 iz1 = Pi1.zzzz;    vec4 ixy = permute(permute(ix) + iy);   vec4 ixy0 = permute(ixy + iz0);   vec4 ixy1 = permute(ixy + iz1);    vec4 gx0 = ixy0 * (1.0 / 7.0);   vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;   gx0 = fract(gx0);   vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);   vec4 sz0 = step(gz0, vec4(0.0));   gx0 -= sz0 * (step(0.0, gx0) - 0.5);   gy0 -= sz0 * (step(0.0, gy0) - 0.5);    vec4 gx1 = ixy1 * (1.0 / 7.0);   vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;   gx1 = fract(gx1);   vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);   vec4 sz1 = step(gz1, vec4(0.0));   gx1 -= sz1 * (step(0.0, gx1) - 0.5);   gy1 -= sz1 * (step(0.0, gy1) - 0.5);    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);   vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);   vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);   vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);   vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);   vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);   vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);   vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));   g000 *= norm0.x;   g010 *= norm0.y;   g100 *= norm0.z;   g110 *= norm0.w;   vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));   g001 *= norm1.x;   g011 *= norm1.y;   g101 *= norm1.z;   g111 *= norm1.w;    float n000 = dot(g000, Pf0);   float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));   float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));   float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));   float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));   float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));   float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));   float n111 = dot(g111, Pf1);    vec3 fade_xyz = fade(Pf0);   vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);   vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);   float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);   return 2.2 * n_xyz; }  varying float noise; uniform float time;  float turbulence( vec3 p ) {   float w = 100.0;   float t = -.5;   for (float f = 1.0 ; f <= 10.0 ; f++ ){     float power = pow( 2.0, f );     t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );   }   return t; }  void main() {   noise = 10.0 *  -.10 * turbulence( .5 * normal + time );   float b = 5.0 * pnoise( 0.05 * position + vec3( 2.0 * time ), vec3( 100.0 ) );   float displacement = - 10. * noise + b;    vec3 newPosition = position + normal * displacement;   gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );  }"
  },
  "flock": {
    "fragment": "uniform vec3 color;  void main() {     gl_FragColor = vec4( color, 0.1 ); } ",
    "vertex": "attribute vec2 reference; attribute float vertex;  uniform sampler2D texturePosition; uniform sampler2D textureVelocity;  uniform float time;  void main() {      vec4 tmpPos = texture2D( texturePosition, reference );     vec3 pos = tmpPos.xyz;     vec3 velocity = normalize(texture2D( textureVelocity, reference ).xyz);      vec3 newPosition = position;      if ( vertex == 4.0 || vertex == 7.0 ) {                 newPosition.y = sin( tmpPos.w ) * 5.;     }      newPosition = mat3( modelMatrix ) * newPosition;       velocity.z *= -1.;     float xz = length( velocity.xz );     float xyz = 1.;     float x = sqrt( 1. - velocity.y * velocity.y );      float cosry = velocity.x / xz;     float sinry = velocity.z / xz;      float cosrz = x / xyz;     float sinrz = velocity.y / xyz;      mat3 maty =  mat3(         cosry, 0, -sinry,         0    , 1, 0     ,         sinry, 0, cosry      );      mat3 matz =  mat3(         cosrz , sinrz, 0,         -sinrz, cosrz, 0,         0     , 0    , 1     );      newPosition =  maty * matz * newPosition;     newPosition += pos;     gl_Position = projectionMatrix *  viewMatrix  * vec4( newPosition, 1.0 ); } "
  },
  "flockposition": {
    "fragment": "uniform float time; uniform float delta; uniform float depth;  void main() {      vec2 uv = gl_FragCoord.xy / resolution.xy;     vec4 tmpPos = texture2D( texturePosition, uv );     vec3 position = tmpPos.xyz;     vec3 velocity = texture2D( textureVelocity, uv ).xyz;      float phase = tmpPos.w;      phase = mod( ( phase + delta +         length( velocity.xz ) * delta * 3. +         max( velocity.y, 0.0 ) * delta * 6. ), 62.83 );      vec3 calculatedPos = vec3( position + velocity * delta * 15.);     calculatedPos.y = clamp( calculatedPos.y, -2000.0, depth);     gl_FragColor = vec4( calculatedPos, phase);  } "
  },
  "flockvelocity": {
    "fragment": "uniform float time; uniform float testing; uniform float delta; uniform float seperationDistance; uniform float alignmentDistance; uniform float cohesionDistance; uniform float freedomFactor;  const float width = resolution.x; const float height = resolution.y;  const float PI = 3.141592653589793; const float PI_2 = PI * 2.0;  float zoneRadius = 160.0; float zoneRadiusSquared = 25600.0;  float separationThresh = 0.45; float alignmentThresh = 0.65;  const float UPPER_BOUNDS = BOUNDS; const float LOWER_BOUNDS = -UPPER_BOUNDS;  const float SPEED_LIMIT = 9.0;  float rand(vec2 co){     return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453); }  void main() {      zoneRadius = seperationDistance + alignmentDistance + cohesionDistance;     separationThresh = seperationDistance / zoneRadius;     alignmentThresh = ( seperationDistance + alignmentDistance ) / zoneRadius;     zoneRadiusSquared = zoneRadius * zoneRadius;       vec2 uv = gl_FragCoord.xy / resolution.xy;     vec3 flockposition, flockvelocity;      vec3 selfPosition = texture2D( texturePosition, uv ).xyz;     vec3 selfVelocity = texture2D( textureVelocity, uv ).xyz;      float dist;     vec3 dir;     float distSquared;      float seperationSquared = seperationDistance * seperationDistance;     float cohesionSquared = cohesionDistance * cohesionDistance;      float f;     float percent;      vec3 velocity = selfVelocity;      float limit = SPEED_LIMIT;                                      vec3 central = vec3( 0., 0., 0. );     dir = selfPosition - central;     dist = length( dir );      dir.y *= 2.5;     velocity -= normalize( dir ) * delta * 5.;      for (float y=0.0;y<height;y++) {         for (float x=0.0;x<width;x++) {              vec2 ref = vec2( x + 0.5, y + 0.5 ) / resolution.xy;             flockposition = texture2D( texturePosition, ref ).xyz;              dir = flockposition - selfPosition;             dist = length(dir);              if (dist < 0.0001) continue;              distSquared = dist * dist;              if (distSquared > zoneRadiusSquared ) continue;              percent = distSquared / zoneRadiusSquared;              if ( percent < separationThresh ) {                                  f = (separationThresh / percent - 1.0) * delta;                 velocity -= normalize(dir) * f;              } else if ( percent < alignmentThresh ) {                                  float threshDelta = alignmentThresh - separationThresh;                 float adjustedPercent = ( percent - separationThresh ) / threshDelta;                  flockvelocity = texture2D( textureVelocity, ref ).xyz;                  f = ( 0.5 - cos( adjustedPercent * PI_2 ) * 0.5 + 0.5 ) * delta;                 flockvelocity += normalize(flockvelocity) * f;              } else {                                  float threshDelta = 1.0 - alignmentThresh;                 float adjustedPercent = ( percent - alignmentThresh ) / threshDelta;                  f = ( 0.5 - ( cos( adjustedPercent * PI_2 ) * -0.5 + 0.5 ) ) * delta;                  velocity += normalize(dir) * f;              }          }      }                    if ( length( velocity ) > limit ) {         velocity = normalize( velocity ) * limit;     }      gl_FragColor = vec4( velocity, 1.0 );  } "
  },
  "glow": {
    "fragment": "uniform vec3 glowColor; varying float intensity; void main()  {  vec3 glow = glowColor * intensity;     gl_FragColor = vec4( glow, 1.0 ); }",
    "vertex": "uniform vec3 viewVector; uniform float c; uniform float p; varying float intensity; void main()  {     vec3 vNormal = normalize( normalMatrix * normal );  vec3 vNormel = normalize( normalMatrix * viewVector );  intensity = pow( c - dot(vNormal, vNormel), p );       gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }"
  }
};

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    neutral: {
        red: 0x7A6869,
        darkred: 0x2d2627,
        //green: 0x65876E,

        green: 0xc0c4b6,
        lightred: 0xeadfdb,
        grayblue: 0xadaeb0,
        brown: 0xd8c2b5,
        orange: 0xf2cfb3
    },

    neon: {
        blue: 0x00ecff,
        green: 0x7cff00,
        yellow: 0xe3ff00,
        orange: 0xffb400,
        violet: 0xfd00ff
    },

    grayscale: [0x000000, 0x2a2a2a, 0x5a5a5a, 0x8a8a8a, 0xaaaaaa, 0xffffff]
};

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _colors = require('./colors.es6');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    colorwheel: [0xfffa00, 0xffcf00, 0xffa600, 0xff7d01, 0xff2000, 0xf42494, 0x8b20bb, 0x0024ba, 0x007ac7, 0x00b2d6, 0x02b801, 0x84ce00],

    keys: {
        normal: {
            white: {
                emissive: _colors2.default.grayscale[3],
                color: _colors2.default.neutral.red
            },
            black: {
                emissive: _colors2.default.grayscale[1],
                color: _colors2.default.neutral.red
            }
        },
        suggested: {
            white: {
                emissive: _colors2.default.grayscale[2],
                color: _colors2.default.neon.green
            },
            black: {
                emissive: _colors2.default.grayscale[1],
                color: _colors2.default.neon.green
            }
        },
        stronglySuggested: {
            white: {
                emissive: _colors2.default.grayscale[2],
                color: _colors2.default.neon.orange
            },
            black: {
                emissive: _colors2.default.grayscale[1],
                color: _colors2.default.neon.orange
            }
        }

    },

    metronome: {
        drum: {
            bumpmap: './assets/images/ripplemap.jpg',
            color: _colors2.default.neutral.darkred,
            hitcolor: _colors2.default.grayscale[0],
            emissive: _colors2.default.grayscale[0],
            specular: _colors2.default.neutral.grayblue
        },

        hammer: {
            refractioncube: ['./assets/images/nx.jpg', './assets/images/ny.jpg', './assets/images/nz.jpg', './assets/images/nx.jpg', './assets/images/ny.jpg', './assets/images/nz.jpg'],
            color: _colors2.default.neutral.red,
            hitcolor: _colors2.default.grayscale[0]
        }
    },

    dome: {
        color: _colors2.default.neutral.darkred,
        emissive: _colors2.default.neutral.darkred,
        specular: _colors2.default.neutral.red
    },

    floatingparticles: {
        sprite: './assets/images/snowflake1.png',
        color: _colors2.default.grayscale[2]
    },

    lighting: {
        hemisphere: {
            top: _colors2.default.neutral.darkred,
            bottom: _colors2.default.neutral.green
        },
        spotlight: _colors2.default.grayscale[1]
    }
};

},{"./colors.es6":15}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _note = require('./musictheory/note.es6');

var _note2 = _interopRequireDefault(_note);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    SYNTHDRUM: 'synth_drum',
    PIANO: 'acoustic_grand_piano',

    playerState: 'ready',

    /**
     * instruments loaded
     */
    _instrumentsLoaded: [],

    /**
     * play midi file
     * @param uri of midie file
     */
    play: function play(uri) {
        var _this = this;

        this.playerState = 'loading';
        MIDI.Player.timeWarp = 1; // speed the song is played back
        MIDI.Player.loadFile(uri, function () {
            return _this.onLoaded();
        }, function () {
            return _this.onProgress();
        }, function (err) {
            return _this.onError(err);
        });
    },


    /**
     * pause playing midi file
     */
    pause: function pause() {
        this.playerState = 'paused';
        MIDI.Player.pause();
    },


    /**
     * resume playing midi file
     */
    resume: function resume() {
        this.playerState = 'playing';
        MIDI.Player.resume();
    },


    /**
     * check if instrument is loaded
     * @param instrument
     * @returns {boolean}
     */
    isInstrumentLoaded: function isInstrumentLoaded(instrument) {
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
    loadInstrument: function loadInstrument(instrument, path) {
        var _this2 = this;

        MIDI.loadPlugin({
            soundfontUrl: path,
            instrument: instrument,
            onprogress: function onprogress(state, progress, instrument) {
                return _this2.onInstrumentLoadProgress(state, progress, instrument);
            },
            onsuccess: function onsuccess(event) {
                return _this2.onInstrumentLoaded(event);
            },
            onerror: function onerror(err) {
                return _this2.onInstrumentLoadedError(err);
            }
        });
    },


    /**
     * play a tone
     * @param instrument
     * @param notation
     * @param duration
     */
    playTone: function playTone(instrument, notation, midichannel, duration) {
        if (!this.isInstrumentLoaded(instrument)) {
            return;
        }

        MIDI.programChange(0, MIDI.GM.byName[instrument].number);
        var delay = 0; // play one note every quarter second
        var note = _note2.default.notationToMIDI(notation); // the MIDI note
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
    noteOn: function noteOn(instrument, notation, midichannel, duration) {
        if (!this.isInstrumentLoaded(instrument)) {
            return;
        }
        var note = _note2.default.notationToMIDI(notation);
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
    noteOff: function noteOff(notation, midichannel, delay) {
        if (!delay) {
            delay = 0;
        }
        var note = _note2.default.notationToMIDI(notation);
        MIDI.noteOff(midichannel, note, delay);
    },


    /**
     * add event listener
     * @param eventtype
     * @param callback
     */
    addEventListener: function addEventListener(eventtype, callback) {
        if (!this._listeners) {
            this._listeners = [];
        }
        this._listeners.push({ type: eventtype, callback: callback });
    },


    /**
     * on instrument loaded
     * @param event
     */
    onInstrumentLoaded: function onInstrumentLoaded() {},


    /**
     * on instrument load progress
     * @param state
     * @param progress
     * @param instrument
     */
    onInstrumentLoadProgress: function onInstrumentLoadProgress(state, progress, instrument) {
        if (instrument && progress === 1) {
            console.log(instrument + ' loaded');
            this._instrumentsLoaded.push(instrument);
        }
    },


    /**
     * on instrument loaded error
     * @param err
     */
    onInstrumentLoadedError: function onInstrumentLoadedError(err) {
        console.log('Instrument loading error', err);
    },
    onLoaded: function onLoaded() {
        var _this3 = this;

        MIDI.programChange(0, MIDI.GM.byName[this.PIANO].number);
        MIDI.Player.start();
        this.playerState = 'playing';
        this.isPlaying = true;
        MIDI.Player.addListener(function (data) {
            return _this3.onMIDIData(data);
        });
    },
    onProgress: function onProgress() {
        console.log('progress');
    },
    onError: function onError(err) {
        console.log('error', err);
    },


    /**
     * on midi data callback
     * @param data
     */
    onMIDIData: function onMIDIData(data) {
        if (this._listeners) {
            for (var c = 0; c < this._listeners.length; c++) {
                if (this._listeners[c].type === 'mididata') {
                    console.log(data);
                    this._listeners[c].callback.apply(this, [{ note: data.note - 21, velocity: data.velocity }]);
                }
            }
        }
    }
};

},{"./musictheory/note.es6":5}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _note = require('./musictheory/note.es6');

var _note2 = _interopRequireDefault(_note);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    /**
     * apply n number of properties to an object
     * @param object
     * @param {Object} props
     * @param {String} namespace of property (prepend key name)
     */
    copyPropsTo: function copyPropsTo(object, props, namespace) {
        if (!namespace) {
            namespace = '';
        }
        for (var c in props) {
            object[c + namespace] = props[c];
        }
        return object;
    },


    /**
     * turn decimal color to RGB
     * @param dec
     * @param max
     * @returns {{r: number, g: number, b: number}}
     */
    decToRGB: function decToRGB(dec, max) {
        if (!max) {
            max = 255;
        }
        max += 1; // aids with rounding
        var r = Math.floor(dec / (256 * 256));
        var g = Math.floor(dec / 256) % 256;
        var b = dec % 256;
        return { r: r / 255 * max, g: g / 255 * max, b: b / 255 * max };
    },
    RGBToDec: function RGBToDec(rgb) {
        return rgb.r << 16 + rgb.g << 16 + rgb.b;
    }
};

},{"./musictheory/note.es6":5}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseGroup = function () {
    function BaseGroup(params) {
        var _this = this;

        _classCallCheck(this, BaseGroup);

        /**
         * parent group of child objects we will create
         * @type {THREE.Object3D}
         * @private
         */
        this._group = new THREE.Object3D();

        if (params && params.assets) {
            // todo: determine when to use JSON Loader, OBJ loader, or whatever
            var loader = new THREE.JSONLoader();
            loader.load(params.assets, function (geometry, materials) {
                _this.onAssetsLoaded(geometry, materials);
            });
        }

        this.onInitialize(params);
    }

    /**
     * get name of group
     */


    _createClass(BaseGroup, [{
        key: 'onCreate',


        /**
         * overridable methods
         * leave empty to be a simple abstraction we don't have to call super on
         * @param scene
         * @param custom
         */
        value: function onCreate(scene, custom) {}
    }, {
        key: 'onRender',
        value: function onRender(scene, custom) {}
    }, {
        key: 'onInitialize',
        value: function onInitialize(params) {}
    }, {
        key: 'onAssetsLoaded',
        value: function onAssetsLoaded(geometry, material) {}
    }, {
        key: 'create',


        /**
         * on create scene (or earliest possible opportunity)
         * @param scene
         * @param custom
         */
        value: function create(scene, custom) {
            this._group.name = this.name;
            scene.scene.add(this._group);
            this.onCreate(scene, custom);
        }

        /**
         * add object to scene
         * @param object
         */

    }, {
        key: 'add',
        value: function add(object, name) {
            if (!name) {
                name = this.name + '-child';
            }
            object.name = name;
            this._group.add(object);
        }

        /**
         * get parent group object
         * @returns {THREE.Object3D}
         */

    }, {
        key: 'preRender',


        /**
         * on prerender scene
         * @param scene
         * @param custom
         */
        value: function preRender(scene, custom) {}

        /**
         * on render scene
         * @param scene
         * @param custom
         */

    }, {
        key: 'render',
        value: function render(scene, custom) {
            this.onRender(scene, custom);
        }
    }, {
        key: 'name',
        get: function get() {
            return this.constructor.name;
        }
    }, {
        key: 'group',
        get: function get() {
            return this._group;
        }

        /**
         * get children of this group
         * @returns {Array}
         */

    }, {
        key: 'children',
        get: function get() {
            return this._group.children;
        }
    }]);

    return BaseGroup;
}();

exports.default = BaseGroup;

},{}]},{},[1])(1)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW1wcm92LmVzNiIsInNyYy9pbnB1dC5lczYiLCJzcmMvbWlkaWtleW1hbmFnZXIuZXM2Iiwic3JjL211c2ljdGhlb3J5L2tleXNpZ25hdHVyZXByZWRpY3Rpb24uZXM2Iiwic3JjL211c2ljdGhlb3J5L25vdGUuZXM2Iiwic3JjL29iamVjdHMvZG9tZS5lczYiLCJzcmMvb2JqZWN0cy9rZXlib2FyZHMvYmFzZWtleWJvYXJkLmVzNiIsInNyYy9vYmplY3RzL2tleWJvYXJkcy9jaXJjdWxhcmtleWJvYXJkLmVzNiIsInNyYy9vYmplY3RzL2tleWJvYXJkcy90cmFkaXRpb25hbGtleWJvYXJkLmVzNiIsInNyYy9vYmplY3RzL2xpZ2h0aW5nLmVzNiIsInNyYy9vYmplY3RzL21ldHJvbm9tZS5lczYiLCJzcmMvb2JqZWN0cy9wYXJ0aWNsZWZsb2NrLmVzNiIsInNyYy9xd2VydHlrZXltYW5hZ2VyLmVzNiIsInNyYy9zaGFkZXJzLmVzNiIsInNyYy90aGVtZWluZy9jb2xvcnMuZXM2Iiwic3JjL3RoZW1laW5nL3N0eWxlLmVzNiIsInNyYy90b25lcGxheWJhY2suZXM2Iiwic3JjL3V0aWxzLmVzNiIsIi4uL3RyaXZyL3NyYy9iYXNlZ3JvdXAuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7SUFFcUIsTTtBQUNqQixvQkFBWSxLQUFaLEVBQW1CLFNBQW5CLEVBQThCO0FBQUE7O0FBQUE7O0FBQzFCOzs7O0FBSUEsYUFBSyxtQkFBTCxHQUEyQixJQUEzQjs7QUFFQTs7Ozs7QUFLQSxhQUFLLGdCQUFMLEdBQXdCLElBQXhCOztBQUVBLGFBQUssTUFBTCxHQUFjLEtBQWQ7QUFDQSxhQUFLLFFBQUwsR0FBZ0Is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Q0g7QUFDRCxtQkFBTyxJQUFQLEdBQWMsSUFBZDtBQUNBLGlCQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLE1BQWhCO0FBQ0g7O0FBRUQ7Ozs7Ozs7OztBQWdCQTs7Ozs7a0NBS1UsSyxFQUFPLE0sRUFBUSxDQUFFOztBQUUzQjs7Ozs7Ozs7K0JBS08sSyxFQUFPLE0sRUFBUTtBQUNsQixpQkFBSyxRQUFMLENBQWMsS0FBZCxFQUFxQixNQUFyQjtBQUNIOzs7NEJBcEVVO0FBQ1AsbUJBQU8sS0FBSyxXQUFMLENBQWlCLElBQXhCO0FBQ0g7Ozs0QkF3Q1c7QUFDUixtQkFBTyxLQUFLLE1BQVo7QUFDSDs7QUFFRDs7Ozs7Ozs0QkFJZTtBQUNYLG1CQUFPLEtBQUssTUFBTCxDQUFZLFFBQW5CO0FBQ0g7Ozs7OztrQkE1RWdCLFMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IE1ldHJvbm9tZSBmcm9tICcuL29iamVjdHMvbWV0cm9ub21lLmVzNic7XG5pbXBvcnQgQ2lyY3VsYXJLZXlib2FyZCBmcm9tICcuL29iamVjdHMva2V5Ym9hcmRzL2NpcmN1bGFya2V5Ym9hcmQuZXM2JztcbmltcG9ydCBUcmFkaXRpb25hbEtleWJvYXJkIGZyb20gJy4vb2JqZWN0cy9rZXlib2FyZHMvdHJhZGl0aW9uYWxrZXlib2FyZC5lczYnO1xuaW1wb3J0IERvbWUgZnJvbSAnLi9vYmplY3RzL2RvbWUuZXM2JztcbmltcG9ydCBQYXJ0aWNsZXMgZnJvbSAnLi9vYmplY3RzL3BhcnRpY2xlZmxvY2suZXM2JztcbmltcG9ydCBMaWdodGluZyBmcm9tICcuL29iamVjdHMvbGlnaHRpbmcuZXM2JztcbmltcG9ydCBUb25lUGxheWJhY2sgZnJvbSAnLi90b25lcGxheWJhY2suZXM2JztcbmltcG9ydCBJbnB1dCBmcm9tICcuL2lucHV0LmVzNic7XG5pbXBvcnQgU3R5bGUgZnJvbSAnLi90aGVtZWluZy9zdHlsZS5lczYnO1xuaW1wb3J0IE5vdGUgZnJvbSAnLi9tdXNpY3RoZW9yeS9ub3RlLmVzNic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEltcHJvdiB7XG4gICAgY29uc3RydWN0b3Ioc2NlbmUsIGNvbmZpZ1VSSSkge1xuICAgICAgICAvKipcbiAgICAgICAgICogY3VycmVudCBrZXkgc2lnbmF0dXJlXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmN1cnJlbnRLZXlTaWduYXR1cmUgPSBudWxsO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBpbmFjdGl2aXR5IHRpbWVyIGZvciBzdWdnZXN0aW9uc1xuICAgICAgICAgKiBAdHlwZSB7bnVsbH1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2luYWN0aXZpdHlUaW1lciA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5fc2NlbmUgPSBzY2VuZTtcbiAgICAgICAgdGhpcy5fcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB0aGlzLl9yZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHRoaXMub25Db25maWdMb2FkZWQoKTtcbiAgICAgICAgdGhpcy5fcmVxdWVzdC5vcGVuKCdHRVQnLCBjb25maWdVUkkpO1xuICAgICAgICB0aGlzLl9yZXF1ZXN0LnNlbmQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvbiBrZXkgY2hhbmdlXG4gICAgICogQHBhcmFtIGtleXNcbiAgICAgKi9cbiAgICBvbktleUlucHV0Q2hhbmdlKGV2ZW50KSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9pbmFjdGl2aXR5VGltZXIpO1xuICAgICAgICB0aGlzLl9pbmFjdGl2aXR5VGltZXIgPSBzZXRUaW1lb3V0KCAoKSA9PiB0aGlzLm9uSW5hY3Rpdml0eVRpbWVvdXQoKSwgNTAwMCk7XG5cbiAgICAgICAgdGhpcy5fa2V5Ym9hcmQudG9nZ2xlS2V5UHJlc3NlZCh7XG4gICAgICAgICAgICBub3RhdGlvbjogZXZlbnQuY2hhbmdlZC5ub3RhdGlvbixcbiAgICAgICAgICAgIG9jdGF2ZTogZXZlbnQuY2hhbmdlZC5vY3RhdmUsXG4gICAgICAgICAgICB2ZWxvY2l0eTogZXZlbnQuY2hhbmdlZC52ZWxvY2l0eSB9KTtcblxuICAgICAgICBpZiAoZXZlbnQucHJlZGljdGVkS2V5Lmxlbmd0aCA+IDAgJiYgdGhpcy5jdXJyZW50S2V5U2lnbmF0dXJlICE9PSBldmVudC5wcmVkaWN0ZWRLZXlbMF0ua2V5KSB7XG4gICAgICAgICAgICB0aGlzLl9rZXlib2FyZC5jaGFuZ2VLZXlTaWduYXR1cmUoZXZlbnQucHJlZGljdGVkS2V5WzBdLmtleSk7XG4gICAgICAgICAgICB0aGlzLl9odWRLZXlib2FyZC5jaGFuZ2VLZXlTaWduYXR1cmUoZXZlbnQucHJlZGljdGVkS2V5WzBdLmtleSk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRLZXlTaWduYXR1cmUgPSBldmVudC5wcmVkaWN0ZWRLZXlbMF0ua2V5O1xuICAgICAgICAgICAgdGhpcy5fbWV0cm9ub21lLnNldEhpdENvbG9yKFN0eWxlLmNvbG9yd2hlZWxbTm90ZS5pbmRleE9mTm90YXRpb24oZXZlbnQucHJlZGljdGVkS2V5WzBdLmtleSldKTtcbiAgICAgICAgICAgIHRoaXMuX3BhcnRpY2xlcy5zZXRDb2xvcihTdHlsZS5jb2xvcndoZWVsW05vdGUuaW5kZXhPZk5vdGF0aW9uKGV2ZW50LnByZWRpY3RlZEtleVswXS5rZXkpXSk7XG4gICAgICAgIH1cblxuICAgICAgICAvL3RoaXMuX2tleWJvYXJkLnRvZ2dsZUtleVByZXNzZWQoa2V5W29jdGF2ZV0sIGV2ZW50LmNoYW5nZWQudmVsb2NpdHkpO1xuICAgICAgICAgLyp2YXIga2V5ID0gdGhpcy5maW5kS2V5T2JqZWN0c0Zvck5vdGF0aW9uKGV2ZW50LmNoYW5nZWQubm90YXRpb24pO1xuICAgICAgICAgdmFyIG9jdGF2ZTtcbiAgICAgICAgIGlmIChldmVudC5jaGFuZ2VkLm9jdGF2ZSAvIDIgPT09IE1hdGguZmxvb3IoZXZlbnQuY2hhbmdlZC5vY3RhdmUgLyAyKSkge1xuICAgICAgICAgICAgb2N0YXZlID0gMTtcbiAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvY3RhdmUgPSAwO1xuICAgICAgICAgfVxuXG4gICAgICAgICB0aGlzLnRvZ2dsZUtleVByZXNzZWQoa2V5W29jdGF2ZV0sIGV2ZW50LmNoYW5nZWQudmVsb2NpdHkpO1xuXG4gICAgICAgICBpZiAoZXZlbnQucHJlZGljdGVkS2V5Lmxlbmd0aCA+IDAgJiYgZXZlbnQucHJlZGljdGVkS2V5WzBdICE9PSB0aGlzLmN1cnJlbnRLZXlTaWduYXR1cmUpIHtcbiAgICAgICAgICAgIHRoaXMub25LZXlTaWduYXR1cmVDaGFuZ2UoZXZlbnQucHJlZGljdGVkS2V5WzBdLmtleSk7XG4gICAgICAgICB9Ki9cbiAgICAgfVxuXG4gICAgLyoqXG4gICAgICogaW5hY3Rpdml0eSB0aW1lb3V0XG4gICAgICovXG4gICAgb25JbmFjdGl2aXR5VGltZW91dCgpIHtcbiAgICAgICAgdGhpcy5fa2V5Ym9hcmQucmVzZXRLZXlzKCk7XG4gICAgICAgIHRoaXMuX2h1ZEtleWJvYXJkLnJlc2V0S2V5cygpO1xuICAgICAgICB0aGlzLl9pbnB1dC5jbGVhclByZWRpY3Rpb25IaXN0b3J5KCk7XG4gICAgICAgIHRoaXMuX21ldHJvbm9tZS5zZXRIaXRDb2xvcigpO1xuICAgICAgICB0aGlzLl9wYXJ0aWNsZXMuc2V0Q29sb3IoKTtcbiAgICAgfVxuXG4gICAgLyoqXG4gICAgICogb24gY29uZmlnIGxvYWRlZFxuICAgICAqL1xuICAgIG9uQ29uZmlnTG9hZGVkKCkge1xuICAgICAgICBpZiAodGhpcy5fcmVxdWVzdC5yZWFkeVN0YXRlID09PSBYTUxIdHRwUmVxdWVzdC5ET05FKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fcmVxdWVzdC5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgIHZhciBjb25maWcgPSBKU09OLnBhcnNlKHRoaXMuX3JlcXVlc3QucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldHVwKGNvbmZpZyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdUaGVyZSB3YXMgYSBwcm9ibGVtIHdpdGggdGhlIHJlcXVlc3QuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogc2V0dXAgYXBwXG4gICAgICogQHBhcmFtIGNvbmZpZ1xuICAgICAqIEBwYXJhbSBjb25maWdcbiAgICAgKi9cbiAgICBzZXR1cChjb25maWcpIHtcbiAgICAgICAgdGhpcy5fc2NlbmUub25DcmVhdGUgPSB0aGlzLmNyZWF0ZTtcblxuICAgICAgICB0aGlzLl9pbnB1dCA9IG5ldyBJbnB1dChjb25maWcuaW5wdXQsIChrZXlzKSA9PiB0aGlzLm9uS2V5SW5wdXRDaGFuZ2Uoa2V5cykgKTtcbiAgICAgICAgdGhpcy5fa2V5Ym9hcmQgPSBuZXcgVHJhZGl0aW9uYWxLZXlib2FyZChjb25maWcua2V5Ym9hcmQpO1xuICAgICAgICB0aGlzLl9odWRLZXlib2FyZCA9IG5ldyBDaXJjdWxhcktleWJvYXJkKGNvbmZpZy5ub3RhdGlvbmRpc3BsYXkpO1xuICAgICAgICB0aGlzLl9tZXRyb25vbWUgPSBuZXcgTWV0cm9ub21lKCk7XG4gICAgICAgIHRoaXMuX3BhcnRpY2xlcyA9IG5ldyBQYXJ0aWNsZXMoKTtcblxuICAgICAgICB0aGlzLl9zY2VuZS5hZGRPYmplY3RzKFtcbiAgICAgICAgICAgIHRoaXMuX21ldHJvbm9tZSxcbiAgICAgICAgICAgIHRoaXMuX3BhcnRpY2xlcyxcbiAgICAgICAgICAgIG5ldyBEb21lKCksXG4gICAgICAgICAgICB0aGlzLl9rZXlib2FyZCxcbiAgICAgICAgICAgIHRoaXMuX2h1ZEtleWJvYXJkLFxuICAgICAgICAgICAgbmV3IExpZ2h0aW5nKCkgXSk7XG5cbiAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCBjb25maWcuc291bmQuc291bmRmb250cy5sZW5ndGg7IGMrKykge1xuICAgICAgICAgICAgVG9uZVBsYXliYWNrLmxvYWRJbnN0cnVtZW50KGNvbmZpZy5zb3VuZC5zb3VuZGZvbnRzW2NdLCBjb25maWcuc291bmQuc291bmRmb250bG9jYXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBldmVudCA9PiB0aGlzLm9uS2V5RG93bihldmVudCkgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvbiBrZXlkb3duXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICovXG4gICAgb25LZXlEb3duKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC5jb2RlID09PSAnU3BhY2UnKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKFRvbmVQbGF5YmFjay5wbGF5ZXJTdGF0ZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3JlYWR5JzogVG9uZVBsYXliYWNrLnBsYXkoJy4vYXNzZXRzL2F1ZGlvL0Jvbm5pZV9UeWxlcl8tX1RvdGFsX0VjbGlwc2Vfb2ZfdGhlX0hlYXJ0Lm1pZCcpOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdwbGF5aW5nJzogVG9uZVBsYXliYWNrLnBhdXNlKCk7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3BhdXNlZCc6IFRvbmVQbGF5YmFjay5yZXN1bWUoKTsgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGUoc2NlbmUsIGN1c3RvbSkge1xuICAgICAgICBzY2VuZS5yZW5kZXJlci5nYW1tYUlucHV0ID0gdHJ1ZTtcbiAgICAgICAgc2NlbmUucmVuZGVyZXIuZ2FtbWFPdXRwdXQgPSB0cnVlO1xuICAgIH1cblxuICAgIHJlbmRlcihzY2VuZSwgY3VzdG9tKSB7fVxufVxuIiwiaW1wb3J0IFFXRVJUWUtleU1hbmFnZXIgZnJvbSAnLi9xd2VydHlrZXltYW5hZ2VyLmVzNic7XG5pbXBvcnQgTUlESUtleU1hbmFnZXIgZnJvbSAnLi9taWRpa2V5bWFuYWdlci5lczYnO1xuaW1wb3J0IEtleVNpZ25hdHVyZVByZWRpY3Rpb24gZnJvbSAnLi9tdXNpY3RoZW9yeS9rZXlzaWduYXR1cmVwcmVkaWN0aW9uLmVzNic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXMsIGNiKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBrZXkgbWFuYWdlclxuICAgICAgICAgKiBAdHlwZSB7JEVTNl9BTk9OWU1PVVNfQ0xBU1MkfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKHBhcmFtcy5kZXZpY2UgPT09ICdRV0VSVFknKSB7XG4gICAgICAgICAgICB0aGlzLl9rZXltYW5hZ2VyID0gbmV3IFFXRVJUWUtleU1hbmFnZXIocGFyYW1zLCBjaGFuZ2VkID0+IHRoaXMub25LZXlDaGFuZ2UoY2hhbmdlZCkpO1xuICAgICAgICB9IGVsc2UgaWYgKHBhcmFtcy5kZXZpY2UgPT09ICdNSURJJykge1xuICAgICAgICAgICAgdGhpcy5fa2V5bWFuYWdlciA9IG5ldyBNSURJS2V5TWFuYWdlcihwYXJhbXMsIGNoYW5nZWQgPT4gdGhpcy5vbktleUNoYW5nZShjaGFuZ2VkKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICoga2V5IHNpZ25hdHVyZSBwcmVkaWN0aW9uXG4gICAgICAgICAqIEB0eXBlIHskRVM2X0FOT05ZTU9VU19DTEFTUyR9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9rZXlTaWdQcmVkaWN0aW9uID0gbmV3IEtleVNpZ25hdHVyZVByZWRpY3Rpb24oKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICoga2V5IGNoYW5nZSBjYWxsYmFja1xuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fY2FsbGJhY2sgPSBjYjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjbGVhciBwcmVkaWN0aW9uIGhpc3RvcnlcbiAgICAgKi9cbiAgICBjbGVhclByZWRpY3Rpb25IaXN0b3J5KCkge1xuICAgICAgICB0aGlzLl9rZXlTaWdQcmVkaWN0aW9uLmNsZWFySGlzdG9yeSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG9uIGtleSBjaGFuZ2VcbiAgICAgKiBAcGFyYW0gY2hhbmdlZFxuICAgICAqL1xuICAgIG9uS2V5Q2hhbmdlKGNoYW5nZWQpIHtcbiAgICAgICAgdmFyIGtkID0gdGhpcy5fa2V5bWFuYWdlci5nZXRLZXlzRG93bigpO1xuICAgICAgICB2YXIgcHJlZGljdGVkID0gdGhpcy5fa2V5U2lnUHJlZGljdGlvbi51cGRhdGUoa2QpO1xuICAgICAgICB0aGlzLl9jYWxsYmFjay5hcHBseSh0aGlzLCBbIHsgZG93bjoga2QsIHByZWRpY3RlZEtleTogcHJlZGljdGVkLCBjaGFuZ2VkOiBjaGFuZ2VkIH1dKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgTm90ZSBmcm9tICcuL211c2ljdGhlb3J5L25vdGUuZXM2JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKHBhcmFtcywgY2IpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGV2ZW50IGNhbGxiYWNrXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9jYWxsYmFjayA9IGNiO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBrZXlzIGRvd25cbiAgICAgICAgICogQHR5cGUge0FycmF5fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fa2V5cyA9IFtdO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNSURJIGtleSB0byBub3RhdGlvbiBtYXBwaW5nIChjb21pbmcgZnJvbSBNSURJLCBzbyBub3QgY3VzdG9taXphYmxlKVxuICAgICAgICAgKiB0aGUgc3BsaWNlIGhhcHBlbnMgYmVjYXVzZSAwIGluZGV4IGluIE1JREkgc3RhcnRzIHdpdGggQ1xuICAgICAgICAgKiBAdHlwZSB7QXJyYXkuPHN0cmluZz59XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9tYXBwaW5nID0gTm90ZS5zaGFycE5vdGF0aW9uc1xuICAgICAgICAgICAgLmNvbmNhdChOb3RlLnNoYXJwTm90YXRpb25zKVxuICAgICAgICAgICAgLmNvbmNhdChOb3RlLnNoYXJwTm90YXRpb25zKVxuICAgICAgICAgICAgLmNvbmNhdChOb3RlLnNoYXJwTm90YXRpb25zKVxuICAgICAgICAgICAgLmNvbmNhdChOb3RlLnNoYXJwTm90YXRpb25zKVxuICAgICAgICAgICAgLmNvbmNhdChOb3RlLnNoYXJwTm90YXRpb25zKVxuICAgICAgICAgICAgLmNvbmNhdChOb3RlLnNoYXJwTm90YXRpb25zKVxuICAgICAgICAgICAgLmNvbmNhdChOb3RlLnNoYXJwTm90YXRpb25zKVxuICAgICAgICAgICAgLmNvbmNhdChOb3RlLnNoYXJwTm90YXRpb25zKVxuICAgICAgICAgICAgLmNvbmNhdChOb3RlLnNoYXJwTm90YXRpb25zKS5zcGxpY2UoMywgTm90ZS5zaGFycE5vdGF0aW9ucy5sZW5ndGggKjEwKTtcblxuICAgICAgICB0aGlzLmluaXRpYWxpemVEZXZpY2UoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBpbml0aWFsaXplIG1pZGkgZGV2aWNlXG4gICAgICovXG4gICAgaW5pdGlhbGl6ZURldmljZSgpIHtcbiAgICAgICAgLy8gcmVxdWVzdCBNSURJIGFjY2Vzc1xuICAgICAgICBpZiAobmF2aWdhdG9yLnJlcXVlc3RNSURJQWNjZXNzKSB7XG4gICAgICAgICAgICBuYXZpZ2F0b3IucmVxdWVzdE1JRElBY2Nlc3MoKS50aGVuKFxuICAgICAgICAgICAgICAgIChldmVudCkgPT4gdGhpcy5vbk1JRElTdWNjZXNzKGV2ZW50KSxcbiAgICAgICAgICAgICAgICAoZXZlbnQpID0+IHRoaXMub25NSURJRmFpbHVyZShldmVudCkgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm8gTUlESSBzdXBwb3J0IGluIHlvdXIgYnJvd3Nlci5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvbiBtaWRpIGNvbm5lY3Rpb24gc3VjY2Vzc1xuICAgICAqIEBwYXJhbSBtaWRpXG4gICAgICovXG4gICAgb25NSURJU3VjY2VzcyhtaWRpKSB7XG4gICAgICAgIHZhciBpbnB1dHMgPSBtaWRpLmlucHV0cztcbiAgICAgICAgZm9yIChsZXQgaW5wdXQgb2YgaW5wdXRzLnZhbHVlcygpKSB7XG4gICAgICAgICAgICBpbnB1dC5vbm1pZGltZXNzYWdlID0gbXNnID0+IHRoaXMub25NSURJTWVzc2FnZShtc2cpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb24gbWlkaSBjb25uZWN0aW9uIGZhaWx1cmVcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKi9cbiAgICBvbk1JRElGYWlsdXJlKGV2ZW50KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTm8gYWNjZXNzIHRvIE1JREkgZGV2aWNlcyBvciB5b3VyIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IFdlYk1JREkgQVBJLiBQbGVhc2UgdXNlIFdlYk1JRElBUElTaGltIFwiICsgZXZlbnQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG9uIG1pZGkgbWVzc2FnZVxuICAgICAqIEBwYXJhbSBtc2dcbiAgICAgKi9cbiAgICBvbk1JRElNZXNzYWdlKG1zZykge1xuICAgICAgICBjb25zb2xlLmxvZyhtc2cpXG4gICAgICAgIHZhciBjbWQgPSBtc2cuZGF0YVswXSA+PiA0O1xuICAgICAgICB2YXIgY2hhbm5lbCA9IG1zZy5kYXRhWzBdICYgMHhmO1xuICAgICAgICB2YXIgbm90ZU51bWJlciA9IG1zZy5kYXRhWzFdO1xuICAgICAgICB2YXIgdmVsb2NpdHkgPSAwO1xuICAgICAgICBpZiAobXNnLmRhdGEubGVuZ3RoID4gMilcbiAgICAgICAgICAgIHZlbG9jaXR5ID0gbXNnLmRhdGFbMl0gLyAxMDA7XG5cbiAgICAgICAgLy8gTUlESSBub3Rlb24gd2l0aCB2ZWxvY2l0eT0wIGlzIHRoZSBzYW1lIGFzIG5vdGVvZmZcbiAgICAgICAgaWYgKCBjbWQ9PTggfHwgKChjbWQ9PTkpJiYodmVsb2NpdHk9PTApKSApIHsgLy8gbm90ZW9mZlxuICAgICAgICAgICAgdGhpcy5vbktleVVwKG5vdGVOdW1iZXIpO1xuICAgICAgICB9IGVsc2UgaWYgKGNtZCA9PSA5KSB7IC8vIG5vdGUgb25cbiAgICAgICAgICAgIHRoaXMub25LZXlEb3duKG5vdGVOdW1iZXIsIHZlbG9jaXR5KTtcbiAgICAgICAgfSAvL2Vsc2UgaWYgKGNtZCA9PSAxMSkgeyAvLyBjb250cm9sbGVyIG1lc3NhZ2VcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBnZXQga2V5cyBkb3duXG4gICAgICovXG4gICAgZ2V0S2V5c0Rvd24oKSB7XG4gICAgICAgIHZhciBkb3duID0gW107XG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgdGhpcy5fa2V5cy5sZW5ndGg7IGMrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2tleXNbY10gPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIG9jdGF2ZSA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKGMgPj0gdGhpcy5fa2V5cy5sZW5ndGgvMikgeyBvY3RhdmUgPSAxOyB9XG4gICAgICAgICAgICAgICAgZG93bi5wdXNoKCB7IG5vdGF0aW9uOiB0aGlzLl9tYXBwaW5nW2NdLCBvY3RhdmU6IG9jdGF2ZSwgaW5kZXg6IGMsIHZlbG9jaXR5OiB0aGlzLl9rZXlzW2NdfSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkb3duO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG9uIGtleSBkb3duXG4gICAgICogQHBhcmFtIGtleVxuICAgICAqIEBwYXJhbSB2ZWxvY2l0eVxuICAgICAqL1xuICAgIG9uS2V5RG93bihrZXksIHZlbG9jaXR5KSB7XG4gICAgICAgIHRoaXMuX2tleXNba2V5XSA9IHZlbG9jaXR5O1xuICAgICAgICB2YXIgb2N0YXZlID0gMDtcbiAgICAgICAgb2N0YXZlID0gTWF0aC5mbG9vcihrZXkgLyBOb3RlLnNoYXJwTm90YXRpb25zLmxlbmd0aCk7XG4gICAgICAgIHRoaXMuX2NhbGxiYWNrKHtcbiAgICAgICAgICAgIG5vdGF0aW9uOiB0aGlzLl9tYXBwaW5nW2tleV0sXG4gICAgICAgICAgICBvY3RhdmU6IG9jdGF2ZSxcbiAgICAgICAgICAgIGluZGV4OiBrZXksXG4gICAgICAgICAgICB2ZWxvY2l0eTogdmVsb2NpdHksXG4gICAgICAgICAgICBhY3Rpb246ICdwcmVzcycgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb24ga2V5IGRvd25cbiAgICAgKiBAcGFyYW0ga2V5XG4gICAgICovXG4gICAgb25LZXlVcChrZXkpIHtcbiAgICAgICAgdGhpcy5fa2V5c1trZXldID0gMC4wO1xuICAgICAgICB2YXIgb2N0YXZlID0gMDtcbiAgICAgICAgb2N0YXZlID0gTWF0aC5mbG9vcihrZXkgLyBOb3RlLnNoYXJwTm90YXRpb25zLmxlbmd0aCk7XG4gICAgICAgIHRoaXMuX2NhbGxiYWNrKHtcbiAgICAgICAgICAgIG5vdGF0aW9uOiB0aGlzLl9tYXBwaW5nW2tleV0sXG4gICAgICAgICAgICBvY3RhdmU6IG9jdGF2ZSxcbiAgICAgICAgICAgIGluZGV4OiBrZXksXG4gICAgICAgICAgICB2ZWxvY2l0eTogMCxcbiAgICAgICAgICAgIGFjdGlvbjogJ3JlbGVhc2UnIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCBOb3RlIGZyb20gJy4vbm90ZS5lczYnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBrZXkgc2lnbmF0dXJlIHNjb3JlIGhpc3RvcnlcbiAgICAgICAgICogQHR5cGUge0FycmF5fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fa2V5U2lnbmF0dXJlU2NvcmVIaXN0b3J5ID0gW107XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGhpc3RvcnkgZGVjYXkgcmF0ZVxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fa2V5U2lnbmF0dXJlRGVjYXlSYXRlID0gMC45O1xuXG4gICAgICAgIE5vdGUuZ2VuZXJhdGVLZXlTaWduYXR1cmVMb29rdXAoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB1cGRhdGUga2V5cyBwcmVzc2VkXG4gICAgICogQHBhcmFtIHtBcnJheX0ga2V5c1xuICAgICAqL1xuICAgIHVwZGF0ZShrZXlzKSB7XG4gICAgICAgIGlmIChrZXlzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gdGhpcy5fa2V5U2lnbmF0dXJlU2NvcmVIaXN0b3J5OyB9XG4gICAgICAgIHZhciBrZXlzaWdTY29yZXMgPSB7fTtcbiAgICAgICAgZm9yICh2YXIgc2lnIGluIE5vdGUua2V5cykge1xuICAgICAgICAgICAgZm9yICh2YXIgZCA9IDA7IGQgPCBrZXlzLmxlbmd0aDsgZCsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKE5vdGUua2V5c1tzaWddLmluZGV4T2Yoa2V5c1tkXS5ub3RhdGlvbikgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgha2V5c2lnU2NvcmVzW3NpZ10pIHsga2V5c2lnU2NvcmVzW3NpZ10gPSAwOyB9XG4gICAgICAgICAgICAgICAgICAgIGtleXNpZ1Njb3Jlc1tzaWddICsrO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXlzW2RdLm5vdGF0aW9uID09PSBzaWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleXNpZ1Njb3Jlc1tzaWddICs9IC4wMTsgLy8gc21hbGwgcHJpb3JpdHkgYm9vc3QgZm9yIHJvb3Qgbm90ZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNjb3JlcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBzY29yZSBpbiBrZXlzaWdTY29yZXMpIHtcbiAgICAgICAgICAgIHNjb3Jlcy5wdXNoKCB7IHNjb3JlOiBrZXlzaWdTY29yZXNbc2NvcmVdLCBrZXk6IHNjb3JlLCB0aW1lc3RhbXA6IERhdGUubm93KCkgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRlY2F5SGlzdG9yaWNhbFNjb3JlcygpO1xuICAgICAgICByZXR1cm4gdGhpcy5hcHBseUN1cnJlbnRTY29yZVRvSGlzdG9yeShzY29yZXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNsZWFyIGhpc3RvcnlcbiAgICAgKi9cbiAgICBjbGVhckhpc3RvcnkoKSB7XG4gICAgICAgIHRoaXMuX2tleVNpZ25hdHVyZVNjb3JlSGlzdG9yeSA9IFtdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNsb3dseSBkZWNheSBjdXJyZW50IGhpc3RvcmljYWwgc2NvcmVzXG4gICAgICovXG4gICAgZGVjYXlIaXN0b3JpY2FsU2NvcmVzKCkge1xuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IHRoaXMuX2tleVNpZ25hdHVyZVNjb3JlSGlzdG9yeS5sZW5ndGg7IGMrKykge1xuICAgICAgICAgICAgdGhpcy5fa2V5U2lnbmF0dXJlU2NvcmVIaXN0b3J5W2NdLnNjb3JlICo9IHRoaXMuX2tleVNpZ25hdHVyZURlY2F5UmF0ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFwcGx5IHNjb3JlcyB0byBoaXN0b3J5IChhZ2dyZWdhdGUgYWxsIHNjb3JlczogY3VycmVudCBhbmQgcGFzdClcbiAgICAgKiBAcGFyYW0gc2NvcmVzXG4gICAgICovXG4gICAgYXBwbHlDdXJyZW50U2NvcmVUb0hpc3Rvcnkoc2NvcmVzKSB7XG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgc2NvcmVzLmxlbmd0aDsgYysrKSB7XG4gICAgICAgICAgICB2YXIgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAodmFyIGQgPSAwOyBkIDwgdGhpcy5fa2V5U2lnbmF0dXJlU2NvcmVIaXN0b3J5Lmxlbmd0aDsgZCsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2tleVNpZ25hdHVyZVNjb3JlSGlzdG9yeVtkXS5rZXkgPT09IHNjb3Jlc1tjXS5rZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9rZXlTaWduYXR1cmVTY29yZUhpc3RvcnlbZF0uc2NvcmUgKz0gc2NvcmVzW2NdLnNjb3JlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9rZXlTaWduYXR1cmVTY29yZUhpc3RvcnkucHVzaChzY29yZXNbY10pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9rZXlTaWduYXR1cmVTY29yZUhpc3Rvcnkuc29ydChmdW5jdGlvbihhLCBiKSB7IHJldHVybiAoYS5zY29yZSA8IGIuc2NvcmUgKSA/IDEgOiAoKGIuc2NvcmUgPCBhLnNjb3JlKSA/IC0xIDogMCk7IH0pO1xuICAgIH1cbn1cbiIsIi8qKlxuICogTm90ZSBzdGF0aWMgY2xhc3NcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgLyoqIGNhY2hlZCBrZXlzaWduYXR1cmUgbG9va3VwIHRhYmxlICovXG4gICAga2V5czoge30sXG5cbiAgICAvKipcbiAgICAgKiBpbmNyZW1lbnRhbCB0b25lcyBhcyBzaGFycCBub3RhdGlvblxuICAgICAqIEBjb25zdFxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAdHlwZSB7QXJyYXkuPHN0cmluZz59XG4gICAgICoqL1xuICAgIHNoYXJwTm90YXRpb25zOiBbXCJBXCIsIFwiQSNcIiwgXCJCXCIsIFwiQ1wiLCBcIkMjXCIsIFwiRFwiLCBcIkQjXCIsIFwiRVwiLCBcIkZcIiwgXCJGI1wiLCBcIkdcIiwgXCJHI1wiXSxcblxuICAgIC8qKlxuICAgICAqIGluY3JlbWVudGFsIHRvbmVzIGFzIGZsYXQgbm90YXRpb25cbiAgICAgKiBAY29uc3RcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHR5cGUge0FycmF5LjxzdHJpbmc+fVxuICAgICAqKi9cbiAgICBmbGF0Tm90YXRpb25zOiBbXCJBXCIsIFwiQmJcIiwgXCJCXCIsIFwiQ1wiLCBcIkRiXCIsIFwiRFwiLCBcIkViXCIsIFwiRVwiLCBcIkZcIiwgXCJHYlwiLCBcIkdcIiwgXCJBYlwiXSxcblxuICAgIC8qKlxuICAgICAqIGdldCBub3RhdGlvbiBpbmRleCB3aGVuIG5vdGF0aW9uIGlzIGVpdGhlciBmbGF0IG9yIHNoYXJwXG4gICAgICogQHBhcmFtIG5vdGF0aW9uXG4gICAgICovXG4gICAgaW5kZXhPZk5vdGF0aW9uKG5vdGF0aW9uKSB7XG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuc2hhcnBOb3RhdGlvbnMuaW5kZXhPZihub3RhdGlvbik7XG4gICAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgIGluZGV4ID0gdGhpcy5mbGF0Tm90YXRpb25zLmluZGV4T2Yobm90YXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbmRleDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogZ2V0IG5vdGF0aW9uIGdpdmVuIGFuIGluZGV4XG4gICAgICogQHBhcmFtIGluZGV4XG4gICAgICovXG4gICAgbm90YXRpb25BdEluZGV4KGluZGV4LCBwcmVmZXJGbGF0KSB7XG4gICAgICAgIGlmIChpbmRleCA+PSB0aGlzLnNoYXJwTm90YXRpb25zLmxlbmd0aCkge1xuICAgICAgICAgICAgaW5kZXggPSBpbmRleCAlIHRoaXMuc2hhcnBOb3RhdGlvbnMubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByZWZlckZsYXQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZsYXROb3RhdGlvbnNbaW5kZXhdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hhcnBOb3RhdGlvbnNbaW5kZXhdO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIG9kZCBub3RhdGlvbnNcbiAgICAgKiBAY29uc3RcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHR5cGUge0FycmF5LjxzdHJpbmc+fVxuICAgICAqKi9cbiAgICAgb2RkTm90YXRpb25zOiBbXCJCI1wiLCBcIkNiXCIsIFwiRSNcIiwgXCJGYlwiXSxcblxuICAgIC8qKlxuICAgICAqIGNvcnJlY3RlZCBub3RhdGlvbnNcbiAgICAgKiBAY29uc3RcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHR5cGUge0FycmF5LjxzdHJpbmc+fVxuICAgICAqKi9cbiAgICAgY29ycmVjdGVkTm90YXRpb25zOiBbXCJDXCIsIFwiQ1wiLCBcIkZcIiwgXCJGXCJdLFxuXG4gICAgLyoqXG4gICAgICogdHJhbnNsYXRlIGluZGV4IGZyb20gTUlESSB0byBub3RhdGlvblxuICAgICAqIEBwYXJhbSBpbmRleFxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIE1JREl0b05vdGF0aW9uKGluZGV4KSB7XG4gICAgICAgIHZhciBwb3NpdGlvbiA9IGluZGV4ICUgdGhpcy5zaGFycE5vdGF0aW9ucy5sZW5ndGg7XG4gICAgICAgIHJldHVybiB0aGlzLnNoYXJwTm90YXRpb25zW3Bvc2l0aW9uXTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogdHJhbnNsYXRlIG5vdGF0aW9uIGFuZCBvY3RhdmUgdG8gTUlESSBpbmRleFxuICAgICAqIEBwYXJhbSBub3RhdGlvblxuICAgICAqL1xuICAgIG5vdGF0aW9uVG9NSURJKG5vdGF0aW9uKSB7XG4gICAgICAgIHZhciBudE9iaiA9IHRoaXMucGFyc2VOb3RhdGlvbihub3RhdGlvbik7XG4gICAgICAgIHZhciBudGluZHggPSB0aGlzLnNoYXJwTm90YXRpb25zLmluZGV4T2YobnRPYmoubm90YXRpb24pO1xuICAgICAgICBpZiAobnRpbmR4ID09PSAtMSkge1xuICAgICAgICAgICAgbnRpbmR4ID0gdGhpcy5mbGF0Tm90YXRpb25zLmluZGV4T2YobnRPYmoubm90YXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudE9iai5vY3RhdmUgKiB0aGlzLnNoYXJwTm90YXRpb25zLmxlbmd0aCArIG50aW5keDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogcGFyc2Ugbm90YXRpb24gdG8gbm90YXRpb24gYW5kIG9jdGF2ZVxuICAgICAqIEBwYXJhbSBub3RhdGlvblxuICAgICAqL1xuICAgIHBhcnNlTm90YXRpb24obm90YXRpb24pIHtcbiAgICAgICAgdmFyIG5vdGUgPSB7fTtcbiAgICAgICAgLy8gb25seSBzdXBwb3J0cyBvbmUgZGlnaXQgb2N0YXZlcyAoaWYgdGhhdHMgZXZlbiBhIHJlYWwgaXNzdWUpXG4gICAgICAgIHZhciBvY3RhdmUgPSBub3RhdGlvbi5jaGFyQXQobm90YXRpb24ubGVuZ3RoLTEpO1xuICAgICAgICBpZiAocGFyc2VJbnQob2N0YXZlKSA9PSBvY3RhdmUpIHtcbiAgICAgICAgICAgIG5vdGUub2N0YXZlID0gb2N0YXZlO1xuICAgICAgICAgICAgbm90ZS5ub3RhdGlvbiA9IG5vdGF0aW9uLnN1YnN0cigwLCBub3RhdGlvbi5sZW5ndGgtMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub3RlLm9jdGF2ZSA9IDQ7IC8vIGRlZmF1bHRcbiAgICAgICAgICAgIG5vdGUubm90YXRpb24gPSBub3RhdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub3RlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiB0dXJuIGEgbm90YXRpb24gaW50byBhIGZyZXF1ZW5jeVxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbm90YXRpb25cbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IGZyZXF1ZW5jeVxuICAgICAqL1xuICAgIGdldEZyZXF1ZW5jeUZvck5vdGF0aW9uKG50KSB7XG4gICAgICAgIHZhciBvY3RhdmUgPSA0O1xuXG4gICAgICAgIC8vIGRvZXMgbm90YXRpb24gaW5jbHVkZSB0aGUgb2N0YXZlP1xuICAgICAgICBpZiAoICFpc05hTiggcGFyc2VJbnQobnQuY2hhckF0KG50Lmxlbmd0aCAtMSkpICkpIHtcbiAgICAgICAgICAgIG9jdGF2ZSA9IHBhcnNlSW50KG50LmNoYXJBdChudC5sZW5ndGggLTEpKTtcbiAgICAgICAgICAgIG50ID0gbnQuc3Vic3RyKDAsIG50Lmxlbmd0aC0xKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNvcnJlY3QgYW55IGZsYXQvc2hhcnBzIHRoYXQgcmVzb2x2ZSB0byBhIG5hdHVyYWxcbiAgICAgICAgaWYgKHRoaXMub2RkTm90YXRpb25zLmluZGV4T2YobnQpICE9IC0xKSB7XG4gICAgICAgICAgICBudCA9IHRoaXMuY29ycmVjdGVkTm90YXRpb25zW3RoaXMub2RkTm90YXRpb25zLmluZGV4T2YobnQpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmcmVxO1xuICAgICAgICB2YXIgaW5keCA9IHRoaXMuc2hhcnBOb3RhdGlvbnMuaW5kZXhPZihudCk7XG5cbiAgICAgICAgaWYgKGluZHggPT0gLTEpIHtcbiAgICAgICAgICAgIGluZHggPSB0aGlzLmZsYXROb3RhdGlvbnMuaW5kZXhPZihudCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW5keCAhPSAtMSkge1xuICAgICAgICAgICAgaW5keCArPSAob2N0YXZlLTQpICogdGhpcy5zaGFycE5vdGF0aW9ucy5sZW5ndGg7XG4gICAgICAgICAgICBmcmVxID0gNDQwICogKE1hdGgucG93KDIsIGluZHgvMTIpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnJlcTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogZ2V0IG5vdGVzIGluIGEgc3BlY2lmaWMga2V5IHNpZ25hdHVyZVxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgKHJvb3Qgbm90ZSlcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlmIG1ham9yIGtleSBzaWduYXR1cmVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gb2N0YXZlIHRvIHVzZSAob3B0aW9uYWwpXG4gICAgICogQHJldHVybiB7QXJyYXkuPHN0cmluZz59IGtleXMgaW4ga2V5IHNpZ25hdHVyZVxuICAgICAqL1xuICAgIG5vdGVzSW5LZXlTaWduYXR1cmUoa2V5LCBtYWpvciwgb2N0YXZlKSB7XG4gICAgICAgIHZhciBub3Rlc1RvSW5kZXg7XG4gICAgICAgIHZhciBub3Rlc0luS2V5ID0gW107XG4gICAgICAgIHZhciBzdGFydFBvcztcblxuICAgICAgICAvLyBjb3JyZWN0IGFueSBmbGF0L3NoYXJwcyB0aGF0IHJlc29sdmUgdG8gYSBuYXR1cmFsXG4gICAgICAgIGlmICh0aGlzLm9kZE5vdGF0aW9ucy5pbmRleE9mKGtleSkgIT0gLTEpIHtcbiAgICAgICAgICAgIGtleSA9IHRoaXMuY29ycmVjdGVkTm90YXRpb25zW3RoaXMub2RkTm90YXRpb25zLmluZGV4T2Yoa2V5KV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmaW5kIHRoZSBjb3JyZWN0IG5vdGUgYW5kIG5vdGF0aW9uXG4gICAgICAgIGlmICh0aGlzLnNoYXJwTm90YXRpb25zLmluZGV4T2Yoa2V5KSAhPSAtMSkge1xuICAgICAgICAgICAgbm90ZXNUb0luZGV4ID0gdGhpcy5zaGFycE5vdGF0aW9ucy5zbGljZSgpO1xuICAgICAgICAgICAgc3RhcnRQb3MgPSB0aGlzLnNoYXJwTm90YXRpb25zLmluZGV4T2Yoa2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vdGVzVG9JbmRleCA9IHRoaXMuZmxhdE5vdGF0aW9ucy5zbGljZSgpO1xuICAgICAgICAgICAgc3RhcnRQb3MgPSB0aGlzLmZsYXROb3RhdGlvbnMuaW5kZXhPZihrZXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZG91YmxlIHRoZSBhcnJheSBsZW5ndGhcbiAgICAgICAgdmFyIGxlbiA9IG5vdGVzVG9JbmRleC5sZW5ndGg7XG4gICAgICAgIGZvciAoIHZhciBjID0gMDsgYyA8IGxlbjsgYysrICkge1xuICAgICAgICAgICAgaWYgKG9jdGF2ZSkge1xuICAgICAgICAgICAgICAgIG5vdGVzVG9JbmRleC5wdXNoKG5vdGVzVG9JbmRleFtjXSArIChvY3RhdmUrMSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBub3Rlc1RvSW5kZXgucHVzaChub3Rlc1RvSW5kZXhbY10pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWRkIG9jdGF2ZSBub3RhdGlvbiB0byB0aGUgZmlyc3QgaGFsZiBvZiB0aGUgYXJyYXlcbiAgICAgICAgaWYgKG9jdGF2ZSkge1xuICAgICAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCB0aGlzLmZsYXROb3RhdGlvbnMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgICAgICBub3Rlc1RvSW5kZXhbY10gKz0gb2N0YXZlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGNob3Agb2ZmIHRoZSBmcm9udCBvZiB0aGUgYXJyYXkgdG8gc3RhcnQgYXQgdGhlIHJvb3Qga2V5IGluIHRoZSBrZXkgc2lnbmF0dXJlXG4gICAgICAgIG5vdGVzVG9JbmRleC5zcGxpY2UoMCwgc3RhcnRQb3MpO1xuXG4gICAgICAgIC8vIGJ1aWxkIHRoZSBrZXkgc2lnbmF0dXJlXG4gICAgICAgIGlmIChtYWpvcikge1xuICAgICAgICAgICAgLy8gTUFKT1IgRnJvbSByb290OiB3aG9sZSBzdGVwLCB3aG9sZSBzdGVwLCBoYWxmIHN0ZXAsIHdob2xlIHN0ZXAsIHdob2xlIHN0ZXAsIHdob2xlIHN0ZXAsIGhhbGYgc3RlcFxuICAgICAgICAgICAgbm90ZXNJbktleS5wdXNoKCBub3Rlc1RvSW5kZXhbMF0gKTtcbiAgICAgICAgICAgIG5vdGVzSW5LZXkucHVzaCggbm90ZXNUb0luZGV4WzJdICk7XG4gICAgICAgICAgICBub3Rlc0luS2V5LnB1c2goIG5vdGVzVG9JbmRleFs0XSApO1xuICAgICAgICAgICAgbm90ZXNJbktleS5wdXNoKCBub3Rlc1RvSW5kZXhbNV0gKTtcbiAgICAgICAgICAgIG5vdGVzSW5LZXkucHVzaCggbm90ZXNUb0luZGV4WzddICk7XG4gICAgICAgICAgICBub3Rlc0luS2V5LnB1c2goIG5vdGVzVG9JbmRleFs5XSApO1xuICAgICAgICAgICAgbm90ZXNJbktleS5wdXNoKCBub3Rlc1RvSW5kZXhbMTFdICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBNSU5PUiBGcm9tIHJvb3Q6IHdob2xlIHN0ZXAsIGhhbGYgc3RlcCwgd2hvbGUgc3RlcCwgd2hvbGUgc3RlcCwgaGFsZiBzdGVwLCB3aG9sZSBzdGVwLCB3aG9sZSBzdGVwXG4gICAgICAgICAgICBub3Rlc0luS2V5LnB1c2goIG5vdGVzVG9JbmRleFswXSApO1xuICAgICAgICAgICAgbm90ZXNJbktleS5wdXNoKCBub3Rlc1RvSW5kZXhbMl0gKTtcbiAgICAgICAgICAgIG5vdGVzSW5LZXkucHVzaCggbm90ZXNUb0luZGV4WzNdICk7XG4gICAgICAgICAgICBub3Rlc0luS2V5LnB1c2goIG5vdGVzVG9JbmRleFs1XSApO1xuICAgICAgICAgICAgbm90ZXNJbktleS5wdXNoKCBub3Rlc1RvSW5kZXhbN10gKTtcbiAgICAgICAgICAgIG5vdGVzSW5LZXkucHVzaCggbm90ZXNUb0luZGV4WzhdICk7XG4gICAgICAgICAgICBub3Rlc0luS2V5LnB1c2goIG5vdGVzVG9JbmRleFsxMF0gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm90ZXNJbktleTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogcHJlZ2VuZXJhdGUgYSBrZXkgc2lnbmF0dXJlIGxvb2t1cCB0YWJsZSBmb3IgZXZlcnkgbm90ZVxuICAgICAqL1xuICAgIGdlbmVyYXRlS2V5U2lnbmF0dXJlTG9va3VwKCkge1xuICAgICAgICB2YXIga3lzID0gdGhpcy5zaGFycE5vdGF0aW9ucztcbiAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCBreXMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgIHRoaXMua2V5c1treXNbY11dID0gdGhpcy5ub3Rlc0luS2V5U2lnbmF0dXJlKGt5c1tjXSwgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLmtleXNba3lzW2NdICsgJ20nXSA9IHRoaXMubm90ZXNJbktleVNpZ25hdHVyZShreXNbY10sIGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cblxufTtcbiIsImltcG9ydCBCYXNlR3JvdXAgZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3RyaXZyL3NyYy9iYXNlZ3JvdXAuZXM2JztcbmltcG9ydCBTdHlsZSBmcm9tICcuLi90aGVtZWluZy9zdHlsZS5lczYnO1xuaW1wb3J0IFRvbmVQbGF5YmFjayBmcm9tICcuLi90b25lcGxheWJhY2suZXM2JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG9tZSBleHRlbmRzIEJhc2VHcm91cCB7XG4gICAgLyoqXG4gICAgICogb24gY3JlYXRlIHNjZW5lIChvciBlYXJsaWVzdCBwb3NzaWJsZSBvcHBvcnR1bml0eSlcbiAgICAgKiBAcGFyYW0gc2NlbmVcbiAgICAgKiBAcGFyYW0gY3VzdG9tXG4gICAgICovXG4gICAgb25DcmVhdGUoc2NlbmUsIGN1c3RvbSkge1xuICAgICAgICB2YXIgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKHRoaXMuY3JlYXRlR2VvbWV0cnkoKSwgdGhpcy5jcmVhdGVNYXRlcmlhbCgpKTtcbiAgICAgICAgbWVzaC5wb3NpdGlvbi56ID0gNTtcbiAgICAgICAgdGhpcy5hZGQobWVzaCwgJ2RvbWUnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvbiByZW5kZXJcbiAgICAgKiBAcGFyYW0gc2NlbmVjb2xsZWN0aW9uXG4gICAgICogQHBhcmFtIG15Y29sbGVjdGlvblxuICAgICAqL1xuICAgIG9uUmVuZGVyKHNjZW5lY29sbGVjdGlvbiwgbXljb2xsZWN0aW9uKSB7XG4gICAgICAgIGlmIChUb25lUGxheWJhY2suaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICB0aGlzLmdyb3VwLnJvdGF0aW9uLnkgKz0gTWF0aC5QSSAvIDEwMjQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjcmVhdGUgZ2xvYmUgZ2VvbWV0cnlcbiAgICAgKiBAcmV0dXJucyB7VEhSRUUuSWNvc2FoZWRyb25HZW9tZXRyeX1cbiAgICAgKi9cbiAgICBjcmVhdGVHZW9tZXRyeSgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUSFJFRS5JY29zYWhlZHJvbkdlb21ldHJ5KCA4MDAsIDIgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjcmVhdGUgZ2xvYmUgbWF0ZXJpYWxcbiAgICAgKi9cbiAgICBjcmVhdGVNYXRlcmlhbCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7XG4gICAgICAgICAgICBjb2xvciAgICAgIDogIFN0eWxlLmRvbWUuY29sb3IsXG4gICAgICAgICAgICBlbWlzc2l2ZSAgIDogIFN0eWxlLmRvbWUuZW1pc3NpdmUsXG4gICAgICAgICAgICBzcGVjdWxhciAgIDogIFN0eWxlLmRvbWUuc3BlY3VsYXIsXG4gICAgICAgICAgICBzaWRlICAgICAgIDogIFRIUkVFLkJhY2tTaWRlLFxuICAgICAgICAgICAgc2hpbmluZXNzICA6ICAxMCxcbiAgICAgICAgICAgIHNoYWRpbmcgICAgOiAgVEhSRUUuRmxhdFNoYWRpbmcsXG4gICAgICAgICAgICB0cmFuc3BhcmVudDogMSxcbiAgICAgICAgICAgIG9wYWNpdHkgICAgOiAxXG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCJpbXBvcnQgQmFzZUdyb3VwIGZyb20gJy4uLy4uLy4uL25vZGVfbW9kdWxlcy90cml2ci9zcmMvYmFzZWdyb3VwLmVzNic7XG5pbXBvcnQgSW5wdXQgZnJvbSAnLi4vLi4vaW5wdXQuZXM2JztcbmltcG9ydCBOb3RlIGZyb20gJy4uLy4uL211c2ljdGhlb3J5L25vdGUuZXM2JztcbmltcG9ydCBTdHlsZSBmcm9tICcuLi8uLi90aGVtZWluZy9zdHlsZS5lczYnO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4uLy4uL3V0aWxzLmVzNic7XG5pbXBvcnQgVG9uZVBsYXliYWNrIGZyb20gJy4uLy4uL3RvbmVwbGF5YmFjay5lczYnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlS2V5Ym9hcmQgZXh0ZW5kcyBCYXNlR3JvdXAge1xuICAgIG9uSW5pdGlhbGl6ZShwYXJhbXMpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGhvdyBtdWNoIHJvdGF0aW9uIG9jY3VycyBvbiBrZXlwcmVzc1xuICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fcm90YXRpb25PblByZXNzID0gTWF0aC5QSS8xNjtcblxuICAgICAgICAvKipcbiAgICAgICAgICogbnVtYmVyIG9mIG9jdGF2ZXNcbiAgICAgICAgICogQHR5cGUge251bWJlcn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX251bU9jdGF2ZXMgPSBwYXJhbXMub2N0YXZlcyA/IHBhcmFtcy5vY3RhdmVzIDogMjtcblxuICAgICAgICAvKipcbiAgICAgICAgICogc3RhcnRpbmcgb2N0YXZlICh0byBiZXR0ZXIgbWF0Y2ggd2l0aCBNSURJIGlucHV0KVxuICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fc3RhcnRpbmdPY3RhdmUgPSBwYXJhbXMuc3RhcnRvY3RhdmUgPyBwYXJhbXMuc3RhcnRvY3RhdmUgOiAwO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBzdGFydGluZyBub3RlIG9uIGtleWJvYXJkXG4gICAgICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9zdGFydGluZ05vdGUgPSAnQyc7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGtleSB2aXN1YWxzXG4gICAgICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2tleXMgPSBbXTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogbWlkaSBjaGFubmVscyB1c2VkXG4gICAgICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX21pZGljaGFubmVscyA9IFtdO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBzdGFydGluZyBpbmRleCBhdCB3aGljaCBwb2ludCB0byBhbGxvY2F0ZSBNSURJIGNoYW5uZWxzXG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9taWRpQ2hhbm5lbFN0YXJ0SW5kZXggPSAxMTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogc3VnZ2VzdGVkIGtleXMgZnJvbSBrZXkgc2lnbmF0dXJlIHByZWRpY3Rpb25cbiAgICAgICAgICogQHR5cGUge0FycmF5fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5zdWdnZXN0ZWRLZXlzID0gW107XG4gICAgfVxuICAgIC8qKlxuICAgICAqIG9uIGNyZWF0ZSBzY2VuZSAob3IgZWFybGllc3QgcG9zc2libGUgb3Bwb3J0dW5pdHkpXG4gICAgICogQHBhcmFtIHNjZW5lXG4gICAgICogQHBhcmFtIGN1c3RvbVxuICAgICAqL1xuICAgIG9uQ3JlYXRlKHNjZW5lLCBjdXN0b20pIHtcbiAgICAgICAgLy9Ub25lUGxheWJhY2suYWRkRXZlbnRMaXN0ZW5lcignbWlkaWRhdGEnLCBkYXRhID0+IHRoaXMub25Tb25nRGF0YShkYXRhKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb24gcmVuZGVyIHNjZW5lXG4gICAgICogQHBhcmFtIHNjZW5lXG4gICAgICogQHBhcmFtIGN1c3RvbVxuICAgICAqL1xuICAgIG9uUmVuZGVyKHNjZW5lLCBjdXN0b20pIHtcbiAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCB0aGlzLl9rZXlzLmxlbmd0aDsgYysrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fa2V5c1tjXS5jb2xvcnR3ZWVuLmFuaW1hdGluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2tleXNbY10ub2JqZWN0Lm1hdGVyaWFsLmNvbG9yLnNldFJHQihcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fa2V5c1tjXS5jb2xvcnR3ZWVuLnJjb2xvci8xMDAsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2tleXNbY10uY29sb3J0d2Vlbi5nY29sb3IvMTAwLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9rZXlzW2NdLmNvbG9ydHdlZW4uYmNvbG9yLzEwMCApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb24gYXNzZXRzIGxvYWRlZFxuICAgICAqIEBwYXJhbSBnZW9tZXRyeVxuICAgICAqL1xuICAgIG9uQXNzZXRzTG9hZGVkKGdlb21ldHJ5KSB7XG4gICAgICAgIHZhciBtYXQgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoIHtcbiAgICAgICAgICAgIG1ldGFsbmVzczogMC43LFxuICAgICAgICAgICAgcm91Z2huZXNzOiAxLFxuICAgICAgICAgICAgc2lkZTogVEhSRUUuRnJvbnRTaWRlLFxuICAgICAgICAgICAgc2hhZGluZzogVEhSRUUuRmxhdFNoYWRpbmdcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc2V0dXBTY2VuZShnZW9tZXRyeSwgbWF0KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogZHluYW1pY2FsbHkgZ2VuZXJhdGUgY2lyY2xlIG9mIGtleXNcbiAgICAgKiBAcGFyYW0gZ2VvbWV0cnlcbiAgICAgKiBAcGFyYW0gbWF0ZXJpYWxcbiAgICAgKi9cbiAgICBzZXR1cFNjZW5lKGdlb21ldHJ5LCBtYXRlcmlhbCkge1xuICAgICAgICB2YXIgc3RhcnRPZmZzZXQgPSBOb3RlLmluZGV4T2ZOb3RhdGlvbih0aGlzLl9zdGFydGluZ05vdGUpO1xuICAgICAgICB2YXIgbnRpbmRleCA9IDA7XG4gICAgICAgIHZhciB0cmFuc2Zvcm1Qb3NpdGlvbiA9IDA7XG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgdGhpcy5fbnVtT2N0YXZlczsgYysrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBkID0gMDsgZCA8IE5vdGUuc2hhcnBOb3RhdGlvbnMubGVuZ3RoOyBkKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgbm90ZSA9IE5vdGUubm90YXRpb25BdEluZGV4KGQgKyBzdGFydE9mZnNldCk7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtUG9zaXRpb24gPSB0aGlzLmFkZEtleSh0cmFuc2Zvcm1Qb3NpdGlvbiwgbm90ZS5pbmRleE9mKCcjJykgPT09IC0xLCBub3RlLCBjLCBnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgICAgICAgICAgIG50aW5kZXggKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJhbnNmb3JtUG9zaXRpb247XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb24gaW5hY3Rpdml0eSAoZmFkZSBhd2F5IGtleXMgYW5kIGNsZWFyIGtleSBzaWcpXG4gICAgICovXG4gICAgcmVzZXRLZXlzKCkge1xuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IHRoaXMuX2tleXMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9rZXlzW2NdLnN1Z2dlc3RlZCkge1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50Q29sb3IgPSB0aGlzLl9rZXlzW2NdLm9iamVjdC5tYXRlcmlhbC5jb2xvci5nZXRIZXgoKTtcbiAgICAgICAgICAgICAgICBVdGlscy5jb3B5UHJvcHNUbyh0aGlzLl9rZXlzW2NdLmNvbG9ydHdlZW4sIFV0aWxzLmRlY1RvUkdCKGN1cnJlbnRDb2xvciwgMTAwKSwgJ2NvbG9yJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fa2V5c1tjXS5jb2xvcnR3ZWVuLmFuaW1hdGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IFV0aWxzLmNvcHlQcm9wc1RvKHt9LCBVdGlscy5kZWNUb1JHQihTdHlsZS5rZXlzLm5vcm1hbFt0aGlzLl9rZXlzW2NdLnR5cGVdLmNvbG9yLCAxMDApLCAnY29sb3InKTtcbiAgICAgICAgICAgICAgICBjcmVhdGVqcy5Ud2Vlbi5nZXQodGhpcy5fa2V5c1tjXS5jb2xvcnR3ZWVuKVxuICAgICAgICAgICAgICAgICAgICAudG8odGFyZ2V0LCAyMDAwKVxuICAgICAgICAgICAgICAgICAgICAud2FpdCgxMDApIC8vIHdhaXQgYSBmZXcgdGlja3MsIG9yIHRoZSByZW5kZXIgY3ljbGUgd29uJ3QgcGljayB1cCB0aGUgY2hhbmdlcyB3aXRoIHRoZSBmbGFnXG4gICAgICAgICAgICAgICAgICAgIC5jYWxsKCBmdW5jdGlvbigpIHsgdGhpcy5hbmltYXRpbmcgPSBmYWxzZTsgfSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY2hhbmdlIGtleSBzaWduYXR1cmUgdG8gbm90YXRpb24gZ2l2ZW5cbiAgICAgKiBAcGFyYW0gbm90YXRpb25cbiAgICAgKi9cbiAgICBjaGFuZ2VLZXlTaWduYXR1cmUobm90YXRpb24pIHtcbiAgICAgICAgdmFyIGM7XG4gICAgICAgIGZvciAoYyA9IDA7IGMgPCB0aGlzLnN1Z2dlc3RlZEtleXMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlS2V5U3VnZ2VzdGlvbih0aGlzLnN1Z2dlc3RlZEtleXNbY10sIG5vdGF0aW9uLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdWdnZXN0ZWRLZXlzID0gTm90ZS5rZXlzW25vdGF0aW9uXTtcblxuICAgICAgICBmb3IgKGMgPSAwOyBjIDwgdGhpcy5zdWdnZXN0ZWRLZXlzLmxlbmd0aDsgYysrKSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZUtleVN1Z2dlc3Rpb24odGhpcy5zdWdnZXN0ZWRLZXlzW2NdLCBub3RhdGlvbiwgdHJ1ZSwgYyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0b2dnbGUga2V5IHByZXNzZWRcbiAgICAgKiBAcGFyYW0ga2V5XG4gICAgICovXG4gICAgdG9nZ2xlS2V5UHJlc3NlZChrKSB7XG4gICAgICAgIHZhciBrZXkgPSB0aGlzLmZpbmRLZXlPYmplY3RGb3JOb3RhdGlvbihrLm5vdGF0aW9uLCBrLm9jdGF2ZSk7XG4gICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgIGlmIChrLnZlbG9jaXR5ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgVG9uZVBsYXliYWNrLm5vdGVPZmYoa2V5Lm5vdGF0aW9uLCBrZXkubWlkaWNoYW5uZWwsIDEvOCk7XG4gICAgICAgICAgICAgICAgdmFyIGNoYW5uZWxpbmRleCA9IHRoaXMuX21pZGljaGFubmVscy5pbmRleE9mKGtleS5taWRpY2hhbm5lbCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWlkaWNoYW5uZWxzLnNwbGljZShjaGFubmVsaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9pbmFjdGl2aXR5VGltZXIpO1xuICAgICAgICAgICAgICAgIGtleS5vYmplY3Qucm90YXRpb24uc2V0KGtleS5vcmlnaW5hbFJvdGF0aW9uLngsIGtleS5vcmlnaW5hbFJvdGF0aW9uLnksIGtleS5vcmlnaW5hbFJvdGF0aW9uLnopO1xuICAgICAgICAgICAgICAgIGtleS5jdXJyZW50Um90YXRpb24gPSAwO1xuICAgICAgICAgICAgICAgIGtleS5taWRpY2hhbm5lbCA9IC0xO1xuICAgICAgICAgICAgICAgIGtleS5kb3duID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX21pZGljaGFubmVscyA9IHRoaXMuX21pZGljaGFubmVscy5zb3J0KCk7XG4gICAgICAgICAgICAgICAgdmFyIG1pZGljaGFubmVsID0gdGhpcy5fbWlkaWNoYW5uZWxzW3RoaXMuX21pZGljaGFubmVscy5sZW5ndGgtMV0gKyAxO1xuICAgICAgICAgICAgICAgIGlmICghbWlkaWNoYW5uZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgbWlkaWNoYW5uZWwgPSB0aGlzLl9taWRpQ2hhbm5lbFN0YXJ0SW5kZXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFRvbmVQbGF5YmFjay5ub3RlT24oVG9uZVBsYXliYWNrLlBJQU5PLCBrZXkubm90YXRpb24sIG1pZGljaGFubmVsKTtcbiAgICAgICAgICAgICAgICBrZXkuY3VycmVudFJvdGF0aW9uID0gay52ZWxvY2l0eSAqIHRoaXMuX3JvdGF0aW9uT25QcmVzcztcbiAgICAgICAgICAgICAgICBrZXkub2JqZWN0LnJvdGF0ZVgoa2V5LmN1cnJlbnRSb3RhdGlvbik7XG4gICAgICAgICAgICAgICAga2V5Lm1pZGljaGFubmVsID0gbWlkaWNoYW5uZWw7XG4gICAgICAgICAgICAgICAga2V5LmRvd24gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdG9nZ2xlIGtleSBzdWdnZXN0aW9uXG4gICAgICogQHBhcmFtIG5vdGF0aW9uXG4gICAgICogQHBhcmFtIGtleXNpZ25vdGF0aW9uXG4gICAgICogQHBhcmFtIHRvZ2dsZVxuICAgICAqL1xuICAgIHRvZ2dsZUtleVN1Z2dlc3Rpb24obm90YXRpb24sIGtleXNpZ25vdGF0aW9uLCB0b2dnbGUpIHtcbiAgICAgICAgdmFyIG50SW5kZXggPSBOb3RlLmluZGV4T2ZOb3RhdGlvbihrZXlzaWdub3RhdGlvbik7XG4gICAgICAgIHZhciByb290Y2xyID0gU3R5bGUuY29sb3J3aGVlbFtudEluZGV4XTtcblxuICAgICAgICB2YXIga2V5cyA9IHRoaXMuZmluZEtleU9iamVjdHNGb3JOb3RhdGlvbihub3RhdGlvbik7XG5cbiAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCBrZXlzLmxlbmd0aDsgYysrKSB7XG4gICAgICAgICAgICBpZiAodG9nZ2xlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNscjtcbiAgICAgICAgICAgICAgICBpZiAoIG50SW5kZXg9PT0wIHx8IG50SW5kZXg9PT0yIHx8IG50SW5kZXg9PT00IHx8IG50SW5kZXg9PT02KSB7XG4gICAgICAgICAgICAgICAgICAgIGNsciA9IFN0eWxlLmtleXMuc3Ryb25nbHlTdWdnZXN0ZWRba2V5c1tjXS50eXBlXTtcbiAgICAgICAgICAgICAgICAgICAga2V5c1tjXS5zdWdnZXN0ZWQgPSAnc3Ryb25nbHlTdWdnZXN0ZWQnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNsciA9IFN0eWxlLmtleXMuc3VnZ2VzdGVkW2tleXNbY10udHlwZV07XG4gICAgICAgICAgICAgICAgICAgIGtleXNbY10uc3VnZ2VzdGVkID0gJ3N1Z2dlc3RlZCc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAga2V5c1tjXS5vYmplY3QubWF0ZXJpYWwuY29sb3Iuc2V0SGV4KHJvb3RjbHIpIDsvL2Nsci5jb2xvcik7XG4gICAgICAgICAgICAgIC8vICBrZXlzW2NdLm9iamVjdC5tYXRlcmlhbC5lbWlzc2l2ZS5zZXRIZXgocm9vdGNscikgOyAvL2Nsci5lbWlzc2l2ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGtleXNbY10ub2JqZWN0Lm1hdGVyaWFsLmNvbG9yLnNldEhleChTdHlsZS5rZXlzLm5vcm1hbFtrZXlzW2NdLnR5cGVdLmNvbG9yKTtcbiAgICAgICAgICAgICAgIC8vIGtleXNbY10ub2JqZWN0Lm1hdGVyaWFsLmVtaXNzaXZlLnNldEhleChTdHlsZS5rZXlzLm5vcm1hbFtrZXlzW2NdLnR5cGVdLmVtaXNzaXZlKTtcbiAgICAgICAgICAgICAgICBrZXlzW2NdLnN1Z2dlc3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY3JlYXRlIHdoaXRlIGtleSBnZW9tZXRyeVxuICAgICAqIEByZXR1cm5zIHtUSFJFRS5NZXNofVxuICAgICAqL1xuICAgIGNyZWF0ZVdoaXRlS2V5KGdlb21ldHJ5LCBtYXRlcmlhbCkge1xuICAgICAgICB2YXIga2V5Z2VvbSA9IGdlb21ldHJ5LmNsb25lKCk7XG4gICAgICAgIHZhciBtYXQgPSBtYXRlcmlhbC5jbG9uZSgpO1xuICAgICAgICBtYXQuY29sb3Iuc2V0SGV4KFN0eWxlLmtleXMubm9ybWFsLndoaXRlLmNvbG9yKTtcbiAgICAgICAgbWF0LmVtaXNzaXZlLnNldEhleChTdHlsZS5rZXlzLm5vcm1hbC53aGl0ZS5lbWlzc2l2ZSk7XG4gICAgICAgIGtleWdlb20udHJhbnNsYXRlKCAwLCAtMTAsIDAgKTtcbiAgICAgICAgdmFyIGtleSA9IG5ldyBUSFJFRS5NZXNoKCBrZXlnZW9tLCBtYXQpO1xuICAgICAgICByZXR1cm4ga2V5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNyZWF0ZSBibGFjayBrZXkgZ2VvbWV0cnlcbiAgICAgKiBAcmV0dXJucyB7VEhSRUUuTWVzaH1cbiAgICAgKi9cbiAgICBjcmVhdGVCbGFja0tleShnZW9tZXRyeSwgbWF0ZXJpYWwpIHtcbiAgICAgICAgdmFyIGtleWdlb20gPSBnZW9tZXRyeS5jbG9uZSgpO1xuICAgICAgICB2YXIgbWF0ID0gbWF0ZXJpYWwuY2xvbmUoKTtcbiAgICAgICAgbWF0LmNvbG9yLnNldEhleChTdHlsZS5rZXlzLm5vcm1hbC5ibGFjay5jb2xvcik7XG4gICAgICAgIG1hdC5lbWlzc2l2ZS5zZXRIZXgoU3R5bGUua2V5cy5ub3JtYWwuYmxhY2suZW1pc3NpdmUpO1xuICAgICAgICBrZXlnZW9tLnRyYW5zbGF0ZSggMCwgLTI1LCAwICk7XG4gICAgICAgIGtleWdlb20uc2NhbGUoMSwgLjUsIDEpO1xuICAgICAgICB2YXIga2V5ID0gbmV3IFRIUkVFLk1lc2goIGtleWdlb20sIG1hdCk7XG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY3JlYXRlIGFuZCBhZGQgYSBrZXlcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdHJhbnNmb3JtUG9zaXRpb25cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IHdoaXRlXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5vdGF0aW9uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9jdGF2ZVxuICAgICAqIEBwYXJhbSB7VEhSRUUuR2VvbWV0cnl9IGdlb21ldHJ5XG4gICAgICogQHBhcmFtIHtUSFJFRS5NYXRlcmlhbH0gbWF0ZXJpYWxcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IHRyYW5zZm9ybSBwb3NpdGlvblxuICAgICAqL1xuICAgIGFkZEtleSh0cmFuc2Zvcm1Qb3NpdGlvbiwgd2hpdGUsIG5vdGF0aW9uLCBvY3RhdmUsIGdlb21ldHJ5LCBtYXRlcmlhbCkge1xuICAgICAgICB2YXIga2V5LCBjb2xvciwgcm90YXRpb247XG4gICAgICAgIGlmICh3aGl0ZSkge1xuICAgICAgICAgICAgY29sb3IgPSAnd2hpdGUnO1xuICAgICAgICAgICAga2V5ID0gdGhpcy5jcmVhdGVXaGl0ZUtleShnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29sb3IgPSAnYmxhY2snO1xuICAgICAgICAgICAga2V5ID0gdGhpcy5jcmVhdGVCbGFja0tleShnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgICB9XG4gICAgICAgIHRyYW5zZm9ybVBvc2l0aW9uID0gdGhpcy5hcHBseUtleVRyYW5zZm9ybShrZXksIHRyYW5zZm9ybVBvc2l0aW9uLCB3aGl0ZSk7XG4gICAgICAgIHRoaXMuX2tleXMucHVzaCh7XG4gICAgICAgICAgICB0eXBlOiBjb2xvcixcbiAgICAgICAgICAgIG9iamVjdDoga2V5LFxuICAgICAgICAgICAgb2N0YXZlOiBvY3RhdmUgKyB0aGlzLl9zdGFydGluZ09jdGF2ZSxcbiAgICAgICAgICAgIGNvbG9ydHdlZW46IHt9LFxuICAgICAgICAgICAgbm90YXRpb246IG5vdGF0aW9uLFxuICAgICAgICAgICAgb3JpZ2luYWxSb3RhdGlvbjoge1xuICAgICAgICAgICAgICAgIHg6IGtleS5yb3RhdGlvbi54LFxuICAgICAgICAgICAgICAgIHk6IGtleS5yb3RhdGlvbi55LFxuICAgICAgICAgICAgICAgIHo6IGtleS5yb3RhdGlvbi56IH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuYWRkKGtleSwna2V5XycgKyBub3RhdGlvbik7XG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm1Qb3NpdGlvbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhcHBseSBrZXkgdHJhbnNmb3JtXG4gICAgICogQHBhcmFtIHtUSFJFRS5NZXNofSBrZXltZXNoXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHRyYW5zZm9ybVBvc2l0aW9uXG4gICAgICogQHBhcmFtIHtCb29sZWFufSB3aGl0ZWtleVxuICAgICAqL1xuICAgIGFwcGx5S2V5VHJhbnNmb3JtKGtleW1lc2gsIHRyYW5zZm9ybVBvc2l0aW9uLCB3aGl0ZWtleSkge31cblxuICAgIC8qKlxuICAgICAqIGZpbmQgdGhlIGtleSBmb3IgYSBzcGVjaWZpYyBub3RhdGlvblxuICAgICAqIEBwYXJhbSBub3RhdGlvblxuICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgKi9cbiAgICBmaW5kS2V5T2JqZWN0c0Zvck5vdGF0aW9uKG5vdGF0aW9uKSB7XG4gICAgICAgIHZhciBrZXlzID0gW107XG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgdGhpcy5fa2V5cy5sZW5ndGg7IGMrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2tleXNbY10ubm90YXRpb24gPT09IG5vdGF0aW9uKSB7XG4gICAgICAgICAgICAgICAga2V5cy5wdXNoKHRoaXMuX2tleXNbY10pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBrZXlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGZpbmQgc3BlY2lmaWMga2V5IG9iamVjdCBmb3Igbm90YXRpb24gYW5kIG9jdGF2ZVxuICAgICAqIEBwYXJhbSBub3RhdGlvblxuICAgICAqIEBwYXJhbSBvY3RhdmVcbiAgICAgKi9cbiAgICBmaW5kS2V5T2JqZWN0Rm9yTm90YXRpb24obm90YXRpb24sIG9jdGF2ZSkge1xuICAgICAgICB2YXIgbm90YXRpb25PZmZzZXQgPSBOb3RlLmluZGV4T2ZOb3RhdGlvbih0aGlzLl9zdGFydGluZ05vdGUpO1xuICAgICAgICB2YXIgaW5keCA9IG9jdGF2ZSAqIE5vdGUuc2hhcnBOb3RhdGlvbnMubGVuZ3RoICsgTm90ZS5zaGFycE5vdGF0aW9ucy5pbmRleE9mKG5vdGF0aW9uKSAtIG5vdGF0aW9uT2Zmc2V0O1xuICAgICAgICByZXR1cm4gdGhpcy5fa2V5c1tpbmR4XTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvbiBzb25nIGRhdGFcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqL1xuICAgIG9uU29uZ0RhdGEoZGF0YSkge1xuICAgICAgICB2YXIgbm90YXRpb24gPSBOb3RlLk1JREl0b05vdGF0aW9uKGRhdGEubm90ZSk7XG4gICAgICAgIHZhciBrZXkgPSB0aGlzLmZpbmRLZXlPYmplY3RzRm9yTm90YXRpb24obm90YXRpb24pO1xuICAgICAgICB0aGlzLnRvZ2dsZUtleVByZXNzZWQoa2V5WzBdLCBkYXRhLnZlbG9jaXR5IC8gMTI3KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgQmFzZUtleWJvYXJkIGZyb20gJy4vYmFzZWtleWJvYXJkLmVzNic7XG5pbXBvcnQgSW5wdXQgZnJvbSAnLi4vLi4vaW5wdXQuZXM2JztcbmltcG9ydCBOb3RlIGZyb20gJy4uLy4uL211c2ljdGhlb3J5L25vdGUuZXM2JztcbmltcG9ydCBTdHlsZSBmcm9tICcuLi8uLi90aGVtZWluZy9zdHlsZS5lczYnO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4uLy4uL3V0aWxzLmVzNic7XG5pbXBvcnQgVG9uZVBsYXliYWNrIGZyb20gJy4uLy4uL3RvbmVwbGF5YmFjay5lczYnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaXJjdWxhcktleWJvYXJkIGV4dGVuZHMgQmFzZUtleWJvYXJkIHtcbiAgICAvKipcbiAgICAgKiBhcHBseSBrZXkgdHJhbnNmb3JtXG4gICAgICogQHBhcmFtIHtUSFJFRS5NZXNofSBrZXltZXNoXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc2l0aW9uIGluIGtleWJvYXJkXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGtleWluZGV4XG4gICAgICogQHBhcmFtIHtCb29sZWFufSB3aGl0ZWtleVxuICAgICAqL1xuICAgIGFwcGx5S2V5VHJhbnNmb3JtKGtleW1lc2gsIHRyYW5zZm9ybVBvc2l0aW9uLCB3aGl0ZWtleSkge1xuICAgICAgICB2YXIgcm90YXRlID0gMDtcbiAgICAgICAgdmFyIGV4dHJhUm90YXRlID0gMDtcbiAgICAgICAgaWYgKHdoaXRla2V5KSB7XG4gICAgICAgICAgICByb3RhdGUgPSAoTWF0aC5QSSAqIDIpIC8gMTQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBleHRyYVJvdGF0ZSA9IChNYXRoLlBJICogMikgLyAyODtcbiAgICAgICAgfVxuICAgICAgICBrZXltZXNoLnJvdGF0aW9uLnogPSB0cmFuc2Zvcm1Qb3NpdGlvbiArIHJvdGF0ZSArIGV4dHJhUm90YXRlO1xuXG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm1Qb3NpdGlvbiArIHJvdGF0ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzZXR1cCBzY2VuZVxuICAgICAqIEBwYXJhbSBnZW9tZXRyeVxuICAgICAqIEBwYXJhbSBtYXRlcmlhbFxuICAgICAqL1xuICAgIHNldHVwU2NlbmUoZ2VvbWV0cnksIG1hdGVyaWFsKSB7XG4gICAgICAgIHN1cGVyLnNldHVwU2NlbmUoZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgICAgdGhpcy5ncm91cC5wb3NpdGlvbi56ID0gLTQwMDtcbiAgICAgICAgdGhpcy5ncm91cC5zY2FsZS5zZXQoMTAsIDEwLCAxMCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IEJhc2VLZXlib2FyZCBmcm9tICcuL2Jhc2VrZXlib2FyZC5lczYnO1xuaW1wb3J0IElucHV0IGZyb20gJy4uLy4uL2lucHV0LmVzNic7XG5pbXBvcnQgTm90ZSBmcm9tICcuLi8uLi9tdXNpY3RoZW9yeS9ub3RlLmVzNic7XG5pbXBvcnQgU3R5bGUgZnJvbSAnLi4vLi4vdGhlbWVpbmcvc3R5bGUuZXM2JztcbmltcG9ydCBVdGlscyBmcm9tICcuLi8uLi91dGlscy5lczYnO1xuaW1wb3J0IFRvbmVQbGF5YmFjayBmcm9tICcuLi8uLi90b25lcGxheWJhY2suZXM2JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhZGl0aW9uYWxLZXlib2FyZCBleHRlbmRzIEJhc2VLZXlib2FyZCB7XG4gICAgb25Jbml0aWFsaXplKHBhcmFtcykge1xuICAgICAgICBzdXBlci5vbkluaXRpYWxpemUocGFyYW1zKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogaG93IG11Y2ggcm90YXRpb24gb2NjdXJzIG9uIGtleXByZXNzXG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9yb3RhdGlvbk9uUHJlc3MgPSBNYXRoLlBJLzY0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFwcGx5IGtleSB0cmFuc2Zvcm1cbiAgICAgKiBAcGFyYW0ge1RIUkVFLk1lc2h9IGtleW1lc2hcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcG9zaXRpb24gaW4ga2V5Ym9hcmRcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IHdoaXRla2V5XG4gICAgICogQHJldHVybiB7TnVtYmVyfSBjdXJyZW50IHBvc2l0aW9uXG4gICAgICovXG4gICAgYXBwbHlLZXlUcmFuc2Zvcm0oa2V5bWVzaCwgdHJhbnNmb3JtUG9zaXRpb24sIHdoaXRla2V5KSB7XG4gICAgICAgIHZhciB0cmFuc2xhdGUgPSAyO1xuICAgICAgICBpZiAoIXdoaXRla2V5KSB7XG4gICAgICAgICAgICBrZXltZXNoLnBvc2l0aW9uLnkgPSA1O1xuICAgICAgICAgICAga2V5bWVzaC5wb3NpdGlvbi56ID0gMTtcbiAgICAgICAgICAgIGtleW1lc2gucG9zaXRpb24ueCA9IHRyYW5zZm9ybVBvc2l0aW9uICsxO1xuICAgICAgICAgICAgdHJhbnNsYXRlID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGtleW1lc2gucG9zaXRpb24ueCA9IHRyYW5zZm9ybVBvc2l0aW9uICsyO1xuICAgICAgICB9XG4gICAgICAgIGtleW1lc2gucm90YXRpb24ueCA9IDA7XG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm1Qb3NpdGlvbiArIHRyYW5zbGF0ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzZXR1cCBzY2VuZVxuICAgICAqIEBwYXJhbSBnZW9tZXRyeVxuICAgICAqIEBwYXJhbSBtYXRlcmlhbFxuICAgICAqL1xuICAgIHNldHVwU2NlbmUoZ2VvbWV0cnksIG1hdGVyaWFsKSB7XG4gICAgICAgIHZhciBsYXN0VHJhbnNmb3JtUG9zaXRpb24gPSBzdXBlci5zZXR1cFNjZW5lKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgICAgIHRoaXMuZ3JvdXAucG9zaXRpb24ueCA9IC1sYXN0VHJhbnNmb3JtUG9zaXRpb24vMiAqIDEwO1xuICAgICAgICB0aGlzLmdyb3VwLnBvc2l0aW9uLnogPSAtMjAwO1xuICAgICAgICB0aGlzLmdyb3VwLnBvc2l0aW9uLnkgPSAtMjAwO1xuICAgICAgICB0aGlzLmdyb3VwLnJvdGF0aW9uLnggPSAtTWF0aC5QSS8yO1xuICAgICAgICB0aGlzLmdyb3VwLnNjYWxlLnNldCgxMCwgMTAsIDEwKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgQmFzZUdyb3VwIGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy90cml2ci9zcmMvYmFzZWdyb3VwLmVzNic7XG5pbXBvcnQgU3R5bGUgZnJvbSAnLi4vdGhlbWVpbmcvc3R5bGUuZXM2JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGlnaHRpbmcgZXh0ZW5kcyBCYXNlR3JvdXAge1xuICAgIC8qKlxuICAgICAqIG9uIGNyZWF0ZSBzY2VuZSAob3IgZWFybGllc3QgcG9zc2libGUgb3Bwb3J0dW5pdHkpXG4gICAgICogQHBhcmFtIHNjZW5lXG4gICAgICogQHBhcmFtIGN1c3RvbVxuICAgICAqL1xuICAgIG9uQ3JlYXRlKHNjZW5lLCBjdXN0b20pIHtcbiAgICAgICAgdmFyIGxpZ2h0ID0gbmV3IFRIUkVFLkhlbWlzcGhlcmVMaWdodCggU3R5bGUubGlnaHRpbmcuaGVtaXNwaGVyZS50b3AsIFN0eWxlLmxpZ2h0aW5nLmhlbWlzcGhlcmUuYm90dG9tLCA0ICk7XG4gICAgICAgIHZhciBzcG90TGlnaHQgPSBuZXcgVEhSRUUuU3BvdExpZ2h0KCBTdHlsZS5saWdodGluZy5zcG90bGlnaHQgKTtcbiAgICAgICAgc3BvdExpZ2h0LnBvc2l0aW9uLnNldCggMCwgMCwgNDAwICk7XG4gICAgICAgIHNwb3RMaWdodC5yb3RhdGlvbi54ID0gTWF0aC5QSSAvIDI7XG5cbiAgICAgICAgc3BvdExpZ2h0LnNoYWRvdy5tYXBTaXplLndpZHRoID0gMTAyNDtcbiAgICAgICAgc3BvdExpZ2h0LnNoYWRvdy5tYXBTaXplLmhlaWdodCA9IDEwMjQ7XG5cbiAgICAgICAgc3BvdExpZ2h0LnNoYWRvdy5jYW1lcmEubmVhciA9IDEwMDtcbiAgICAgICAgc3BvdExpZ2h0LnNoYWRvdy5jYW1lcmEuZmFyID0gNDAwO1xuICAgICAgICBzcG90TGlnaHQuc2hhZG93LmNhbWVyYS5mb3YgPSAzMDtcblxuICAgICAgICB0aGlzLmFkZChzcG90TGlnaHQpO1xuICAgICAgICB0aGlzLmFkZChsaWdodCk7XG4gICAgfVxufSIsImltcG9ydCBTaGFkZXJzIGZyb20gJy4vLi4vc2hhZGVycy5lczYnO1xuaW1wb3J0IEJhc2VHcm91cCBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvdHJpdnIvc3JjL2Jhc2Vncm91cC5lczYnO1xuaW1wb3J0IFN0eWxlIGZyb20gJy4uL3RoZW1laW5nL3N0eWxlLmVzNic7XG5pbXBvcnQgVXRpbHMgZnJvbSAnLi4vdXRpbHMuZXM2JztcbmltcG9ydCBUb25lUGxheWJhY2sgZnJvbSAnLi4vdG9uZXBsYXliYWNrLmVzNic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1ldHJvbm9tZSBleHRlbmRzIEJhc2VHcm91cCB7XG4gICAgb25Jbml0aWFsaXplKCkge1xuICAgICAgICAvKipcbiAgICAgICAgICogbWV0cm9ub21lIGhhbW1lcnMgaW4gc2NlbmVcbiAgICAgICAgICogQHR5cGUge0FycmF5fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5faGFtbWVycyA9IFtdO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBzeW50aFxuICAgICAgICAgKiBAdHlwZSB7VG9uZX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIC8vdGhpcy5fc3ludGggPSBuZXcgVG9uZS5EcnVtU3ludGgoKS50b01hc3RlcigpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiB0d2VlbiB0YXJnZXRzXG4gICAgICAgICAqIEB0eXBlIHt7ZHJ1bToge2FuaW1hdGluZzogYm9vbGVhbiwgcHJvcHM6IHt9fX19XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl90d2VlblRhcmdldHMgPSB7XG4gICAgICAgICAgICBkcnVtOiB7IGFuaW1hdGluZzogZmFsc2UsIHByb3BzOiB7fSB9LFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuc2V0SGl0Q29sb3IoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzZXQgZHJ1bSBoaXQvdHJpZ2dlciBjb2xvclxuICAgICAqIEBwYXJhbSBoZXhcbiAgICAgKi9cbiAgICBzZXRIaXRDb2xvcihoZXgpIHtcbiAgICAgICAgaWYgKGhleCkge1xuICAgICAgICAgICAgdGhpcy5faGl0Q29sb3IgPSBVdGlscy5kZWNUb1JHQihoZXgsIDEwMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9oaXRDb2xvciA9IFV0aWxzLmRlY1RvUkdCKFN0eWxlLm1ldHJvbm9tZS5oYW1tZXIuaGl0Y29sb3IsIDEwMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkNyZWF0ZShzY2VuZWNvbGxlY3Rpb24sIG15Y29sbGVjdGlvbikge1xuICAgICAgICAvL3RoaXMuYWRkSGFtbWVyKCdyaWdodCcsIE1hdGguUEkvNjQsIE1hdGguUEkgKiAyLCAnQzQnKTtcbiAgICAgICAgLy90aGlzLmFkZEhhbW1lcignbGVmdCcsIE1hdGguUEkvMTI4LCBNYXRoLlBJLzQsICdBNCcpO1xuICAgICAgICB0aGlzLmFkZEhhbW1lcigndXAnLCBNYXRoLlBJLzEyOCwgTWF0aC5QSS8yLCAnRzQnKTtcbiAgICAgICAgdGhpcy5hZGRIYW1tZXIoJ2Rvd24nLCBNYXRoLlBJLzMyLCAwLCAnRjMnKTtcbiAgICAgICAgdGhpcy5hZGREcnVtKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb24gcmVuZGVyXG4gICAgICogQHBhcmFtIHNjZW5lY29sbGVjdGlvblxuICAgICAqIEBwYXJhbSBteWNvbGxlY3Rpb25cbiAgICAgKi9cbiAgICBvblJlbmRlcihzY2VuZWNvbGxlY3Rpb24sIG15Y29sbGVjdGlvbikge1xuICAgICAgICB0aGlzLmFuaW1hdGVIYW1tZXJzKCk7XG4gICAgICAgIHRoaXMuYW5pbWF0ZURydW0oKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZW5kZXIgY3ljbGUgZm9yIGRydW1cbiAgICAgKi9cbiAgICBhbmltYXRlRHJ1bSgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3R3ZWVuVGFyZ2V0cy5kcnVtLmFuaW1hdGluZykge1xuICAgICAgICAgICAgdGhpcy5kcnVtLnBvc2l0aW9uLnogPSB0aGlzLl90d2VlblRhcmdldHMuZHJ1bS5wcm9wcy56UG9zaXRpb247XG4gICAgICAgICAgICB0aGlzLmRydW0ubWF0ZXJpYWwuYnVtcFNjYWxlID0gdGhpcy5fdHdlZW5UYXJnZXRzLmRydW0ucHJvcHMuYnVtcHNjYWxlO1xuICAgICAgICAgICAgdGhpcy5kcnVtLm1hdGVyaWFsLmNvbG9yLnNldFJHQihcbiAgICAgICAgICAgICAgICB0aGlzLl90d2VlblRhcmdldHMuZHJ1bS5wcm9wcy5yLzEwMCxcbiAgICAgICAgICAgICAgICB0aGlzLl90d2VlblRhcmdldHMuZHJ1bS5wcm9wcy5nLzEwMCxcbiAgICAgICAgICAgICAgICB0aGlzLl90d2VlblRhcmdldHMuZHJ1bS5wcm9wcy5iLzEwMCApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmVuZGVyIGN5Y2xlIGZvciBoYW1tZXJzXG4gICAgICovXG4gICAgYW5pbWF0ZUhhbW1lcnMoKSB7XG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgdGhpcy5faGFtbWVycy5sZW5ndGg7IGMrKykge1xuICAgICAgICAgICAgdmFyIGhhbW1lciA9IHRoaXMuX2hhbW1lcnNbY107XG5cbiAgICAgICAgICAgIGlmIChoYW1tZXIuYW5pbWF0aW5nR2xvdykge1xuICAgICAgICAgICAgICAgIGhhbW1lci5nbG93Lm1hdGVyaWFsLmNvbG9yLnNldFJHQihcbiAgICAgICAgICAgICAgICAgICAgaGFtbWVyLmdsb3dDb2xvci5yLzEwMCxcbiAgICAgICAgICAgICAgICAgICAgaGFtbWVyLmdsb3dDb2xvci5nLzEwMCxcbiAgICAgICAgICAgICAgICAgICAgaGFtbWVyLmdsb3dDb2xvci5iLzEwMCApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbmV3cm90YXRpb24gPSBoYW1tZXIucGl2b3Qucm90YXRpb25baGFtbWVyLnJvdGF0aW9uYXhpc10gKyBoYW1tZXIuZGlyZWN0aW9uICogaGFtbWVyLnJhdGU7XG5cbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhuZXdyb3RhdGlvbikgPiBNYXRoLlBJIC0gTWF0aC5QSS8xNikge1xuICAgICAgICAgICAgICAgIGhhbW1lci5kaXJlY3Rpb24gKj0gLTE7XG4gICAgICAgICAgICAgICAgbmV3cm90YXRpb24gPSBNYXRoLmFicyhuZXdyb3RhdGlvbikvbmV3cm90YXRpb24gKiAoTWF0aC5QSSAtIE1hdGguUEkvMTYpO1xuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlckRydW0oaGFtbWVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGhhbW1lci5waXZvdC5yb3RhdGlvbltoYW1tZXIucm90YXRpb25heGlzXSA9IG5ld3JvdGF0aW9uO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc291bmQgdGhlIGRydW0sIHRoZSBoYW1tZXIgaGl0IGl0XG4gICAgICogQHBhcmFtIGhhbW1lclxuICAgICAqL1xuICAgIHRyaWdnZXJEcnVtKGhhbW1lcikge1xuICAgICAgICBUb25lUGxheWJhY2subm90ZU9uKFRvbmVQbGF5YmFjay5TWU5USERSVU0sIGhhbW1lci5ub3RlLCAxMCwgMS84KTtcbiAgICAgICAvLyB0aGlzLl9zeW50aC50cmlnZ2VyQXR0YWNrUmVsZWFzZShoYW1tZXIubm90ZSwgXCIxNm5cIik7XG4gICAgICAgIGhhbW1lci5hbmltYXRpbmdHbG93ID0gdHJ1ZTtcbiAgICAgICAgdmFyIHN0YXJ0Y29sb3IgPSBVdGlscy5kZWNUb1JHQihTdHlsZS5tZXRyb25vbWUuaGFtbWVyLmNvbG9yLCAxMDApO1xuICAgICAgICB2YXIgZW5kY29sb3IgPSB0aGlzLl9oaXRDb2xvcjtcbiAgICAgICAgaGFtbWVyLmdsb3dDb2xvci5yID0gc3RhcnRjb2xvci5yO1xuICAgICAgICBoYW1tZXIuZ2xvd0NvbG9yLmcgPSBzdGFydGNvbG9yLmc7XG4gICAgICAgIGhhbW1lci5nbG93Q29sb3IuYiA9IHN0YXJ0Y29sb3IuYjtcbiAgICAgICAgY3JlYXRlanMuVHdlZW4uZ2V0KGhhbW1lci5nbG93Q29sb3IpXG4gICAgICAgICAgICAudG8oeyByOiBlbmRjb2xvci5yLCBnOiBlbmRjb2xvci5nLCBiOiBlbmRjb2xvci5iIH0sIDUwMClcbiAgICAgICAgICAgIC50byh7IHI6IHN0YXJ0Y29sb3IuciwgZzogc3RhcnRjb2xvci5nLCBiOiBzdGFydGNvbG9yLmIgfSwgNTAwKVxuICAgICAgICAgICAgLndhaXQoMTAwKSAvLyB3YWl0IGEgZmV3IHRpY2tzLCBvciB0aGUgcmVuZGVyIGN5Y2xlIHdvbid0IHBpY2sgdXAgdGhlIGNoYW5nZXMgd2l0aCB0aGUgZmxhZ1xuICAgICAgICAgICAgLmNhbGwoIGZ1bmN0aW9uIChzY29wZSkgeyBzY29wZS5hbmltYXRpbmdHbG93ID0gZmFsc2U7IH0gKTtcblxuICAgICAgICB2YXIgc3RhcnRjb2xvciA9IFV0aWxzLmRlY1RvUkdCKFN0eWxlLm1ldHJvbm9tZS5kcnVtLmNvbG9yLCAxMDApO1xuICAgICAgICB2YXIgZW5kY29sb3IgPSB0aGlzLl9oaXRDb2xvcjtcbiAgICAgICAgdGhpcy5fdHdlZW5UYXJnZXRzLmRydW0ucHJvcHMuciA9IHN0YXJ0Y29sb3IucjtcbiAgICAgICAgdGhpcy5fdHdlZW5UYXJnZXRzLmRydW0ucHJvcHMuZyA9IHN0YXJ0Y29sb3IuZztcbiAgICAgICAgdGhpcy5fdHdlZW5UYXJnZXRzLmRydW0ucHJvcHMuYiA9IHN0YXJ0Y29sb3IuYjtcbiAgICAgICAgdGhpcy5fdHdlZW5UYXJnZXRzLmRydW0ucHJvcHMuelBvc2l0aW9uID0gLTQwMDtcbiAgICAgICAgdGhpcy5fdHdlZW5UYXJnZXRzLmRydW0ucHJvcHMuYnVtcHNjYWxlID0gMDtcbiAgICAgICAgdGhpcy5fdHdlZW5UYXJnZXRzLmRydW0uYW5pbWF0aW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fdHdlZW5UYXJnZXRzLmRydW0uY3VycmVudFR3ZWVuID0gY3JlYXRlanMuVHdlZW4uZ2V0KHRoaXMuX3R3ZWVuVGFyZ2V0cy5kcnVtLnByb3BzKVxuICAgICAgICAgICAgLnRvKHtcbiAgICAgICAgICAgICAgICByOiBlbmRjb2xvci5yLCBnOiBlbmRjb2xvci5nLCBiOiBlbmRjb2xvci5iLFxuICAgICAgICAgICAgICAgIGJ1bXBzY2FsZTogMS41LFxuICAgICAgICAgICAgICAgIHpQb3NpdGlvbjogLTQwMCArIGhhbW1lci5kaXJlY3Rpb24gKiA1MCB9LCAxNTApXG4gICAgICAgICAgICAudG8oe1xuICAgICAgICAgICAgICAgIHI6IHN0YXJ0Y29sb3IuciwgZzogc3RhcnRjb2xvci5nLCBiOiBzdGFydGNvbG9yLmIsXG4gICAgICAgICAgICAgICAgYnVtcHNjYWxlOiAwLFxuICAgICAgICAgICAgICAgIHpQb3NpdGlvbjogLTQwMCB9LCAxNTApXG4gICAgICAgICAgICAud2FpdCgxMDApIC8vIHdhaXQgYSBmZXcgdGlja3MsIG9yIHRoZSByZW5kZXIgY3ljbGUgd29uJ3QgcGljayB1cCB0aGUgY2hhbmdlcyB3aXRoIHRoZSBmbGFnXG4gICAgICAgICAgICAuY2FsbCggKCkgPT4geyB0aGlzLl90d2VlblRhcmdldHMuZHJ1bS5hbmltYXRpbmcgPSBmYWxzZTsgfSApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFkZCBjZW50ZXIgZHJ1bVxuICAgICAqL1xuICAgIGFkZERydW0oKSB7XG4gICAgICAgIHZhciBkcnVtZ2VvbSA9IG5ldyBUSFJFRS5DaXJjbGVHZW9tZXRyeSggMzAsIDI0ICk7XG4gICAgICAgIGRydW1nZW9tLnNjYWxlKDEsMSwgMC43NSk7XG4gICAgICAgIHZhciBtYXBIZWlnaHQgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcigpLmxvYWQoU3R5bGUubWV0cm9ub21lLmRydW0uYnVtcG1hcCk7XG4gICAgICAgIG1hcEhlaWdodC5hbmlzb3Ryb3B5ID0gNDtcbiAgICAgICAgbWFwSGVpZ2h0LnJlcGVhdC5zZXQoMSwgMSk7XG4gICAgICAgIG1hcEhlaWdodC53cmFwUyA9IG1hcEhlaWdodC53cmFwVCA9IFRIUkVFLkNsYW1wVG9FZGdlV3JhcHBpbmc7XG4gICAgICAgIG1hcEhlaWdodC5mb3JtYXQgPSBUSFJFRS5SR0JGb3JtYXQ7XG5cbiAgICAgICAgdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKCB7XG4gICAgICAgICAgICBjb2xvcjogU3R5bGUubWV0cm9ub21lLmRydW0uY29sb3IsXG4gICAgICAgICAgICBlbWlzc2l2ZTogU3R5bGUubWV0cm9ub21lLmRydW0uZW1pc3NpdmUsXG4gICAgICAgICAgICBzcGVjdWxhcjogU3R5bGUubWV0cm9ub21lLmRydW0uc3BlY3VsYXIsXG4gICAgICAgICAgICBidW1wTWFwOiBtYXBIZWlnaHQsXG4gICAgICAgICAgICBidW1wU2NhbGU6IDAsXG4gICAgICAgIH0gKTtcblxuICAgICAgICB0aGlzLmRydW0gPSBuZXcgVEhSRUUuTWVzaCggZHJ1bWdlb20sIG1hdGVyaWFsICk7XG4gICAgICAgIHRoaXMuZHJ1bS5wb3NpdGlvbi56ID0gLTQwMDtcbiAgICAgICAgdGhpcy5hZGQodGhpcy5kcnVtLCAnZHJ1bScpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFkZCBtZXRyb25vbWUgaGFtbWVyXG4gICAgICogQHBhcmFtIG9yaWdpblxuICAgICAqIEBwYXJhbSByYXRlXG4gICAgICogQHBhcmFtIG9mZnNldFxuICAgICAqL1xuICAgIGFkZEhhbW1lcihvcmlnaW4sIHJhdGUsIG9mZnNldCwgdG9uZSkge1xuICAgICAgICB2YXIgaGFtbWVyZ2VvbSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSg1KTtcbiAgICAgICAgdmFyIGNlbnRlcnBpdm90ID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG5cbiAgICAgICAgdmFyIHRleHR1cmVDdWJlID0gbmV3IFRIUkVFLkN1YmVUZXh0dXJlTG9hZGVyKCkubG9hZChTdHlsZS5tZXRyb25vbWUuaGFtbWVyLnJlZnJhY3Rpb25jdWJlKTtcbiAgICAgICAgdGV4dHVyZUN1YmUubWFwcGluZyA9IFRIUkVFLkN1YmVSZWZyYWN0aW9uTWFwcGluZztcblxuICAgICAgICB2YXIgaW5uZXJtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgge1xuICAgICAgICAgICAgZW52TWFwOiB0ZXh0dXJlQ3ViZSB9ICk7XG5cbiAgICAgICAgdmFyIG91dGVybWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoIHtcbiAgICAgICAgICAgIGNvbG9yOiBTdHlsZS5tZXRyb25vbWUuaGFtbWVyLmNvbG9yLFxuICAgICAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICB3aXJlZnJhbWU6IHRydWUsXG4gICAgICAgICAgICBvcGFjaXR5OiAwLjUgfSApO1xuXG5cbiAgICAgICAgdmFyIGhhbW1lciA9IG5ldyBUSFJFRS5NZXNoKCBoYW1tZXJnZW9tLCBpbm5lcm1hdGVyaWFsICk7XG4gICAgICAgIGhhbW1lci5uYW1lID0gJ2JhbGwnO1xuICAgICAgICBjZW50ZXJwaXZvdC5hZGQoaGFtbWVyKTtcbiAgICAgICAgY2VudGVycGl2b3QucG9zaXRpb24ueiA9IC00MDA7XG5cbiAgICAgICAgdmFyIGdsb3cgPSBuZXcgVEhSRUUuTWVzaCggaGFtbWVyZ2VvbS5jbG9uZSgpLCBvdXRlcm1hdGVyaWFsICk7XG4gICAgICAgIGdsb3cubmFtZSA9ICdnbG93JztcbiAgICAgICAgZ2xvdy5zY2FsZS5tdWx0aXBseVNjYWxhcigxLjIpO1xuICAgICAgICBjZW50ZXJwaXZvdC5hZGQoZ2xvdyk7XG5cbiAgICAgICAgdmFyIHJvdGF0aW9uYXhpcztcbiAgICAgICAgc3dpdGNoIChvcmlnaW4pIHtcbiAgICAgICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICAgICAgICBnbG93LnBvc2l0aW9uLnggPSAtMTAwO1xuICAgICAgICAgICAgICAgIGNlbnRlcnBpdm90LnBvc2l0aW9uLnggPSAtMTAwO1xuICAgICAgICAgICAgICAgIGhhbW1lci5wb3NpdGlvbi54ID0gLTEwMDtcbiAgICAgICAgICAgICAgICByb3RhdGlvbmF4aXMgPSAneSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgICAgICAgIGdsb3cucG9zaXRpb24ueCA9IDEwMDtcbiAgICAgICAgICAgICAgICBjZW50ZXJwaXZvdC5wb3NpdGlvbi54ID0gMTAwO1xuICAgICAgICAgICAgICAgIGhhbW1lci5wb3NpdGlvbi54ID0gMTAwO1xuICAgICAgICAgICAgICAgIHJvdGF0aW9uYXhpcyA9ICd5JztcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnZG93bic6XG4gICAgICAgICAgICAgICAgZ2xvdy5wb3NpdGlvbi55ID0gMTAwO1xuICAgICAgICAgICAgICAgIGNlbnRlcnBpdm90LnBvc2l0aW9uLnkgPSAxMDA7XG4gICAgICAgICAgICAgICAgaGFtbWVyLnBvc2l0aW9uLnkgPSAxMDA7XG4gICAgICAgICAgICAgICAgcm90YXRpb25heGlzID0gJ3gnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICd1cCc6XG4gICAgICAgICAgICAgICAgZ2xvdy5wb3NpdGlvbi55ID0gLTEwMDtcbiAgICAgICAgICAgICAgICBjZW50ZXJwaXZvdC5wb3NpdGlvbi55ID0gLTEwMDtcbiAgICAgICAgICAgICAgICBoYW1tZXIucG9zaXRpb24ueSA9IC0xMDA7XG4gICAgICAgICAgICAgICAgcm90YXRpb25heGlzID0gJ3gnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY2VudGVycGl2b3Qucm90YXRpb25bcm90YXRpb25heGlzXSArPSBvZmZzZXQ7XG5cbiAgICAgICAgdGhpcy5faGFtbWVycy5wdXNoKCB7XG4gICAgICAgICAgICBhbmltYXRpbmdHbG93OiBmYWxzZSxcbiAgICAgICAgICAgIGdsb3c6IGdsb3csXG4gICAgICAgICAgICBnbG93Q29sb3I6IHt9LFxuICAgICAgICAgICAgaGFtbWVyOiBoYW1tZXIsXG4gICAgICAgICAgICBwaXZvdDogY2VudGVycGl2b3QsXG4gICAgICAgICAgICBkaXJlY3Rpb246IDEsXG4gICAgICAgICAgICByYXRlOiByYXRlLFxuICAgICAgICAgICAgcm90YXRpb25heGlzOiByb3RhdGlvbmF4aXMsXG4gICAgICAgICAgICBub3RlOiB0b25lIH1cbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmFkZChjZW50ZXJwaXZvdCwgJ2hhbW1lcicpO1xuICAgIH1cbn1cbiIsImltcG9ydCBCYXNlR3JvdXAgZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3RyaXZyL3NyYy9iYXNlZ3JvdXAuZXM2JztcbmltcG9ydCBTdHlsZSBmcm9tICcuLi90aGVtZWluZy9zdHlsZS5lczYnO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4uL3V0aWxzLmVzNic7XG5pbXBvcnQgU2hhZGVycyBmcm9tICcuLi9zaGFkZXJzLmVzNic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcnRpY2xlRmxvY2sgZXh0ZW5kcyBCYXNlR3JvdXAge1xuICAgIC8qKlxuICAgICAqIG9uIGNyZWF0ZSBzY2VuZVxuICAgICAqIEBwYXJhbSBzY2VuZVxuICAgICAqIEBwYXJhbSBjdXN0b21cbiAgICAgKi9cbiAgICBvbkNyZWF0ZShzY2VuZSwgY3VzdG9tKSB7XG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlciA9IHtcbiAgICAgICAgICAgIGdwdUNvbXB1dGU6IG51bGwsXG4gICAgICAgICAgICB2ZWxvY2l0eVZhcmlhYmxlOiBudWxsLFxuICAgICAgICAgICAgcG9zaXRpb25WYXJpYWJsZTogbnVsbCxcbiAgICAgICAgICAgIHBvc2l0aW9uVW5pZm9ybXM6IG51bGwsXG4gICAgICAgICAgICB2ZWxvY2l0eVVuaWZvcm1zOiBudWxsLFxuICAgICAgICAgICAgdW5pZm9ybXM6IG51bGxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLl9jb2xvcjtcblxuICAgICAgICAvKiBURVhUVVJFIFdJRFRIIEZPUiBTSU1VTEFUSU9OICovXG4gICAgICAgIHRoaXMuV0lEVEggPSA2NDtcblxuICAgICAgICB2YXIgQklSRFMgPSB0aGlzLldJRFRIICogdGhpcy5XSURUSDtcblxuICAgICAgICB0aGlzLm1vdXNlWCA9IDA7XG4gICAgICAgIHRoaXMubW91c2VZID0gMDtcbiAgICAgICAgdGhpcy5CT1VORFMgPSAxMDAwO1xuICAgICAgICB0aGlzLkJPVU5EU19IQUxGID0gdGhpcy5CT1VORFMgLyAyO1xuXG4gICAgICAgIHRoaXMuaW1tZXJzZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pbW1lcnNpb25MZXZlbHMgPSB7IG1pbjogLTIwMC4wLCBtYXg6IDIwMDAuMCB9O1xuICAgICAgICB0aGlzLmluaXRDb21wdXRlUmVuZGVyZXIoc2NlbmUucmVuZGVyZXIpO1xuXG4gICAgICAgIC8qZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlbW92ZScsIGUgPT4gdGhpcy5vbkRvY3VtZW50TW91c2VNb3ZlKGUpLCBmYWxzZSApO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAndG91Y2hzdGFydCcsIGUgPT4gdGhpcy5vbkRvY3VtZW50VG91Y2hTdGFydChlKSwgZmFsc2UgKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ3RvdWNobW92ZScsIGUgPT4gdGhpcy5vbkRvY3VtZW50VG91Y2hNb3ZlKGUpLCBmYWxzZSApOyovXG4gICAgICAgIHRoaXMuaW5pdEJpcmRzKCk7XG4gICAgfVxuXG4gICAgb25Eb2N1bWVudE1vdXNlTW92ZSggZXZlbnQgKSB7XG4gICAgICAgIHRoaXMubW91c2VYID0gZXZlbnQuY2xpZW50WCAtIDYwMDsvLy0gd2luZG93SGFsZlg7XG4gICAgICAgIHRoaXMubW91c2VZID0gZXZlbnQuY2xpZW50WSAtIDYwMDsvLy0gd2luZG93SGFsZlk7XG4gICAgfVxuXG4gICAgb25Eb2N1bWVudFRvdWNoU3RhcnQoIGV2ZW50ICkge1xuICAgICAgICBpZiAoIGV2ZW50LnRvdWNoZXMubGVuZ3RoID09PSAxICkge1xuXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICB0aGlzLm1vdXNlWCA9IGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCAtIDYwMDsvLy0gd2luZG93SGFsZlg7XG4gICAgICAgICAgICB0aGlzLm1vdXNlWSA9IGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSAtIDYwMDsvLy0gd2luZG93SGFsZlk7XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uRG9jdW1lbnRUb3VjaE1vdmUoIGV2ZW50ICkge1xuXG4gICAgICAgIGlmICggZXZlbnQudG91Y2hlcy5sZW5ndGggPT09IDEgKSB7XG5cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHRoaXMubW91c2VYID0gZXZlbnQudG91Y2hlc1sgMCBdLnBhZ2VYIC0gNjAwOy8vd2luZG93SGFsZlg7XG4gICAgICAgICAgICB0aGlzLm1vdXNlWSA9IGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWSAtIDYwMDsvL3dpbmRvd0hhbGZZO1xuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzZXQgZHJ1bSBoaXQvdHJpZ2dlciBjb2xvclxuICAgICAqIEBwYXJhbSBoZXhcbiAgICAgKi9cbiAgICBzZXRDb2xvcihoZXgpIHtcbiAgICAgICAgdmFyIGNvbG9yO1xuICAgICAgICBpZiAoaGV4KSB7XG4gICAgICAgICAgICBjb2xvciA9IFV0aWxzLmRlY1RvUkdCKGhleCwgMSk7XG4gICAgICAgICAgICB0aGlzLmltbWVyc2VkID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbG9yID0gVXRpbHMuZGVjVG9SR0IoU3R5bGUuZmxvYXRpbmdwYXJ0aWNsZXMuY29sb3IsIDEpO1xuICAgICAgICAgICAgdGhpcy5pbW1lcnNlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLl9jb2xvciApIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbG9yID0gY29sb3I7XG4gICAgICAgICAgICB0aGlzLm1lc2gubWF0ZXJpYWwudW5pZm9ybXMuY29sb3IudmFsdWUgPSBbIHRoaXMuX2NvbG9yLnIsIHRoaXMuX2NvbG9yLmcsIHRoaXMuX2NvbG9yLmIgXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbG9yLmFuaW1hdGluZyA9IHRydWU7XG4gICAgICAgICAgICBjcmVhdGVqcy5Ud2Vlbi5nZXQodGhpcy5fY29sb3IpXG4gICAgICAgICAgICAgICAgLnRvKGNvbG9yLCAyMDAwKVxuICAgICAgICAgICAgICAgIC53YWl0KDEwMCkgLy8gd2FpdCBhIGZldyB0aWNrcywgb3IgdGhlIHJlbmRlciBjeWNsZSB3b24ndCBwaWNrIHVwIHRoZSBjaGFuZ2VzIHdpdGggdGhlIGZsYWdcbiAgICAgICAgICAgICAgICAuY2FsbCggZnVuY3Rpb24oKSB7IHRoaXMuYW5pbWF0aW5nID0gZmFsc2U7IH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25SZW5kZXIodGltZSkge1xuXG4gICAgICAgIGlmICh0aGlzLmltbWVyc2VkICYmIHRoaXMuZmxvY2tHUFVSZW5kZXJlci5wb3NpdGlvblVuaWZvcm1zLmRlcHRoLnZhbHVlIDwgdGhpcy5pbW1lcnNpb25MZXZlbHMubWF4KSB7XG4gICAgICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIucG9zaXRpb25Vbmlmb3Jtcy5kZXB0aC52YWx1ZSArPSAxLjA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuaW1tZXJzZWQgJiYgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnBvc2l0aW9uVW5pZm9ybXMuZGVwdGgudmFsdWUgPiB0aGlzLmltbWVyc2lvbkxldmVscy5taW4pIHtcbiAgICAgICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci5wb3NpdGlvblVuaWZvcm1zLmRlcHRoLnZhbHVlIC09IDEuMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkZWx0YSA9IHRpbWUuZGVsdGEgLyAxMDAwO1xuICAgICAgICBpZiAoZGVsdGEgPiAxKSBkZWx0YSA9IDE7XG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci5wb3NpdGlvblVuaWZvcm1zLnRpbWUudmFsdWUgPSB0aW1lLm5vdztcbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnBvc2l0aW9uVW5pZm9ybXMuZGVsdGEudmFsdWUgPSBkZWx0YTtcbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnZlbG9jaXR5VW5pZm9ybXMudGltZS52YWx1ZSA9IHRpbWUubm93O1xuICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIudmVsb2NpdHlVbmlmb3Jtcy5kZWx0YS52YWx1ZSA9IGRlbHRhO1xuICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIudW5pZm9ybXMudGltZS52YWx1ZSA9IHRpbWUubm93O1xuICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIudW5pZm9ybXMuZGVsdGEudmFsdWUgPSBkZWx0YTtcbiAgICAgICAgLy90aGlzLmZsb2NrR1BVUmVuZGVyZXIudW5pZm9ybXMuZGVwdGgudmFsdWUgPSAtMjAwLjA7XG5cbiAgICAgICAgLy90aGlzLmZsb2NrR1BVUmVuZGVyZXIudmVsb2NpdHlVbmlmb3Jtcy5wcmVkYXRvci52YWx1ZS5zZXQoIDAuNSAqIHRoaXMubW91c2VYIC8gNjAwLCAtIDAuNSAqIHRoaXMubW91c2VZIC8gNjAwLCAwICk7XG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci5ncHVDb21wdXRlLmNvbXB1dGUoKTtcblxuICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIudW5pZm9ybXMudGV4dHVyZVBvc2l0aW9uLnZhbHVlID0gdGhpcy5mbG9ja0dQVVJlbmRlcmVyLmdwdUNvbXB1dGUuZ2V0Q3VycmVudFJlbmRlclRhcmdldCggdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnBvc2l0aW9uVmFyaWFibGUgKS50ZXh0dXJlO1xuICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIudW5pZm9ybXMudGV4dHVyZVZlbG9jaXR5LnZhbHVlID0gdGhpcy5mbG9ja0dQVVJlbmRlcmVyLmdwdUNvbXB1dGUuZ2V0Q3VycmVudFJlbmRlclRhcmdldCggdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnZlbG9jaXR5VmFyaWFibGUgKS50ZXh0dXJlO1xuXG4gICAgICAgIGlmICh0aGlzLl9jb2xvci5hbmltYXRpbmcpIHtcbiAgICAgICAgICAgIHRoaXMubWVzaC5tYXRlcmlhbC51bmlmb3Jtcy5jb2xvci52YWx1ZSA9IFsgdGhpcy5fY29sb3IuciwgdGhpcy5fY29sb3IuZywgdGhpcy5fY29sb3IuYiBdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW5pdENvbXB1dGVSZW5kZXJlcihyZW5kZXJlcikge1xuICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIuZ3B1Q29tcHV0ZSA9IG5ldyBHUFVDb21wdXRhdGlvblJlbmRlcmVyKCB0aGlzLldJRFRILCB0aGlzLldJRFRILCByZW5kZXJlciApO1xuICAgICAgICB2YXIgZHRQb3NpdGlvbiA9IHRoaXMuZmxvY2tHUFVSZW5kZXJlci5ncHVDb21wdXRlLmNyZWF0ZVRleHR1cmUoKTtcbiAgICAgICAgdmFyIGR0VmVsb2NpdHkgPSB0aGlzLmZsb2NrR1BVUmVuZGVyZXIuZ3B1Q29tcHV0ZS5jcmVhdGVUZXh0dXJlKCk7XG4gICAgICAgIHRoaXMuZmlsbFBvc2l0aW9uVGV4dHVyZSggZHRQb3NpdGlvbiApO1xuICAgICAgICB0aGlzLmZpbGxWZWxvY2l0eVRleHR1cmUoIGR0VmVsb2NpdHkgKTtcblxuICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIudmVsb2NpdHlWYXJpYWJsZSA9IHRoaXMuZmxvY2tHUFVSZW5kZXJlci5ncHVDb21wdXRlLmFkZFZhcmlhYmxlKCBcInRleHR1cmVWZWxvY2l0eVwiLCBTaGFkZXJzLmZsb2NrdmVsb2NpdHkuZnJhZ21lbnQsIGR0VmVsb2NpdHkgKTtcbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnBvc2l0aW9uVmFyaWFibGUgPSB0aGlzLmZsb2NrR1BVUmVuZGVyZXIuZ3B1Q29tcHV0ZS5hZGRWYXJpYWJsZSggXCJ0ZXh0dXJlUG9zaXRpb25cIiwgU2hhZGVycy5mbG9ja3Bvc2l0aW9uLmZyYWdtZW50LCBkdFBvc2l0aW9uICk7XG5cbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLmdwdUNvbXB1dGUuc2V0VmFyaWFibGVEZXBlbmRlbmNpZXMoIHRoaXMuZmxvY2tHUFVSZW5kZXJlci52ZWxvY2l0eVZhcmlhYmxlLCBbIHRoaXMuZmxvY2tHUFVSZW5kZXJlci5wb3NpdGlvblZhcmlhYmxlLCB0aGlzLmZsb2NrR1BVUmVuZGVyZXIudmVsb2NpdHlWYXJpYWJsZSBdICk7XG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci5ncHVDb21wdXRlLnNldFZhcmlhYmxlRGVwZW5kZW5jaWVzKCB0aGlzLmZsb2NrR1BVUmVuZGVyZXIucG9zaXRpb25WYXJpYWJsZSwgWyB0aGlzLmZsb2NrR1BVUmVuZGVyZXIucG9zaXRpb25WYXJpYWJsZSwgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnZlbG9jaXR5VmFyaWFibGUgXSApO1xuXG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci5wb3NpdGlvblVuaWZvcm1zID0gdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnBvc2l0aW9uVmFyaWFibGUubWF0ZXJpYWwudW5pZm9ybXM7XG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci52ZWxvY2l0eVVuaWZvcm1zID0gdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnZlbG9jaXR5VmFyaWFibGUubWF0ZXJpYWwudW5pZm9ybXM7XG5cbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnBvc2l0aW9uVW5pZm9ybXMudGltZSA9IHsgdmFsdWU6IDAuMCB9O1xuICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIucG9zaXRpb25Vbmlmb3Jtcy5kZWx0YSA9IHsgdmFsdWU6IDAuMCB9O1xuICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIucG9zaXRpb25Vbmlmb3Jtcy5kZXB0aCA9IHsgdmFsdWU6IC0yMDAuMCB9O1xuICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIudmVsb2NpdHlVbmlmb3Jtcy50aW1lID0geyB2YWx1ZTogMS4wIH07XG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci52ZWxvY2l0eVVuaWZvcm1zLmRlbHRhID0geyB2YWx1ZTogMC4wIH07XG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci52ZWxvY2l0eVVuaWZvcm1zLnRlc3RpbmcgPSB7IHZhbHVlOiAxLjAgfTtcbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnZlbG9jaXR5VW5pZm9ybXMuc2VwZXJhdGlvbkRpc3RhbmNlID0geyB2YWx1ZTogMS4wIH07XG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci52ZWxvY2l0eVVuaWZvcm1zLmFsaWdubWVudERpc3RhbmNlID0geyB2YWx1ZTogMS4wIH07XG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci52ZWxvY2l0eVVuaWZvcm1zLmNvaGVzaW9uRGlzdGFuY2UgPSB7IHZhbHVlOiAxLjAgfTtcbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnZlbG9jaXR5VW5pZm9ybXMuZnJlZWRvbUZhY3RvciA9IHsgdmFsdWU6IDEuMCB9O1xuICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIudmVsb2NpdHlVbmlmb3Jtcy5wcmVkYXRvciA9IHsgdmFsdWU6IG5ldyBUSFJFRS5WZWN0b3IzKCkgfTtcbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnZlbG9jaXR5VmFyaWFibGUubWF0ZXJpYWwuZGVmaW5lcy5CT1VORFMgPSB0aGlzLkJPVU5EUy50b0ZpeGVkKCAyICk7XG5cbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnZlbG9jaXR5VmFyaWFibGUud3JhcFMgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnZlbG9jaXR5VmFyaWFibGUud3JhcFQgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnBvc2l0aW9uVmFyaWFibGUud3JhcFMgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnBvc2l0aW9uVmFyaWFibGUud3JhcFQgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcblxuICAgICAgICB2YXIgZXJyb3IgPSB0aGlzLmZsb2NrR1BVUmVuZGVyZXIuZ3B1Q29tcHV0ZS5pbml0KCk7XG4gICAgICAgIGlmICggZXJyb3IgIT09IG51bGwgKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCBlcnJvciApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW5pdEJpcmRzKCkge1xuICAgICAgICB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuU3dhcm1QYXJ0aWNsZUdlb21ldHJ5KHRoaXMuV0lEVEgpO1xuXG4gICAgICAgIC8vIEZvciBWZXJ0ZXggYW5kIEZyYWdtZW50XG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci51bmlmb3JtcyA9IHtcbiAgICAgICAgICAgIGNvbG9yOiB7IHZhbHVlOiBbMC4wLDAuMCwwLjBdIH0sXG4gICAgICAgICAgICB0ZXh0dXJlUG9zaXRpb246IHsgdmFsdWU6IG51bGwgfSxcbiAgICAgICAgICAgIHRleHR1cmVWZWxvY2l0eTogeyB2YWx1ZTogbnVsbCB9LFxuICAgICAgICAgICAgdGltZTogeyB2YWx1ZTogMS4wIH0sXG4gICAgICAgICAgICBkZWx0YTogeyB2YWx1ZTogMC4wIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBTaGFkZXJNYXRlcmlhbFxuICAgICAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuU2hhZGVyTWF0ZXJpYWwoIHtcbiAgICAgICAgICAgIHVuaWZvcm1zOiAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIudW5pZm9ybXMsXG4gICAgICAgICAgICB2ZXJ0ZXhTaGFkZXI6ICAgU2hhZGVycy5mbG9jay52ZXJ0ZXgsXG4gICAgICAgICAgICBmcmFnbWVudFNoYWRlcjogU2hhZGVycy5mbG9jay5mcmFnbWVudCxcbiAgICAgICAgICAgIC8vc2lkZTogVEhSRUUuRG91YmxlU2lkZVxuICAgICAgICAgICAgLy90cmFuc3BhcmVudDogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm1lc2ggPSBuZXcgVEhSRUUuTWVzaCggZ2VvbWV0cnksIG1hdGVyaWFsICk7XG4gICAgICAgIHRoaXMubWVzaC5yb3RhdGlvbi55ID0gTWF0aC5QSSAvIDI7XG4gICAgICAgIC8vIHRoaXMubWVzaC5wb3NpdGlvbi56ID0gLTEwMDtcbiAgICAgICAgLy8gdGhpcy5tZXNoLnBvc2l0aW9uLnkgPSAtMTA7XG4gICAgICAgIC8qdGhpcy5tZXNoLnNjYWxlLnggPSAuMjtcbiAgICAgICAgdGhpcy5tZXNoLnNjYWxlLnkgPSAuMjtcbiAgICAgICAgdGhpcy5tZXNoLnNjYWxlLnogPSAuMjsqL1xuICAgICAgICB0aGlzLm1lc2gubWF0cml4QXV0b1VwZGF0ZSA9IHRydWU7XG4gICAgICAgIHRoaXMubWVzaC51cGRhdGVNYXRyaXgoKTtcblxuICAgICAgICB0aGlzLmFkZCh0aGlzLm1lc2gpO1xuICAgICAgICB0aGlzLnNldENvbG9yKCk7XG5cbiAgICB9XG5cbiAgICBmaWxsUG9zaXRpb25UZXh0dXJlKCB0ZXh0dXJlICkge1xuICAgICAgICB2YXIgdGhlQXJyYXkgPSB0ZXh0dXJlLmltYWdlLmRhdGE7XG5cbiAgICAgICAgZm9yICggdmFyIGsgPSAwLCBrbCA9IHRoZUFycmF5Lmxlbmd0aDsgayA8IGtsOyBrICs9IDQgKSB7XG5cbiAgICAgICAgICAgIHZhciB4ID0gKE1hdGgucmFuZG9tKCkgKiB0aGlzLkJPVU5EUyAtIHRoaXMuQk9VTkRTX0hBTEYpLzE7XG4gICAgICAgICAgICB2YXIgeSA9IChNYXRoLnJhbmRvbSgpICogdGhpcy5CT1VORFMgLSB0aGlzLkJPVU5EU19IQUxGKS8xO1xuICAgICAgICAgICAgdmFyIHogPSAoTWF0aC5yYW5kb20oKSAqIHRoaXMuQk9VTkRTIC0gdGhpcy5CT1VORFNfSEFMRikvMTtcblxuICAgICAgICAgICAgdGhlQXJyYXlbIGsgKyAwIF0gPSB4O1xuICAgICAgICAgICAgdGhlQXJyYXlbIGsgKyAxIF0gPSB5O1xuICAgICAgICAgICAgdGhlQXJyYXlbIGsgKyAyIF0gPSB6O1xuICAgICAgICAgICAgdGhlQXJyYXlbIGsgKyAzIF0gPSAxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmlsbFZlbG9jaXR5VGV4dHVyZSggdGV4dHVyZSApIHtcbiAgICAgICAgdmFyIHRoZUFycmF5ID0gdGV4dHVyZS5pbWFnZS5kYXRhO1xuXG4gICAgICAgIGZvciAoIHZhciBrID0gMCwga2wgPSB0aGVBcnJheS5sZW5ndGg7IGsgPCBrbDsgayArPSA0ICkge1xuICAgICAgICAgICAgdmFyIHggPSBNYXRoLnJhbmRvbSgpIC0gMC41O1xuICAgICAgICAgICAgdmFyIHkgPSBNYXRoLnJhbmRvbSgpIC0gMC41O1xuICAgICAgICAgICAgdmFyIHogPSBNYXRoLnJhbmRvbSgpIC0gMC41O1xuXG4gICAgICAgICAgICB0aGVBcnJheVsgayArIDAgXSA9IHggKiAxMDtcbiAgICAgICAgICAgIHRoZUFycmF5WyBrICsgMSBdID0geSAqIDEwO1xuICAgICAgICAgICAgdGhlQXJyYXlbIGsgKyAyIF0gPSB6ICogMTA7XG4gICAgICAgICAgICB0aGVBcnJheVsgayArIDMgXSA9IDE7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiIsImltcG9ydCBOb3RlIGZyb20gJy4vbXVzaWN0aGVvcnkvbm90ZS5lczYnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gICAgY29uc3RydWN0b3IocGFyYW1zLCBjYikge1xuICAgICAgICAvKipcbiAgICAgICAgICogZXZlbnQgY2FsbGJhY2tcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrID0gY2I7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEpTT04gY29uZmlnXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9jb25maWcgPSBwYXJhbXM7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGtleXMgZG93blxuICAgICAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9rZXlzID0gW107XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIHBvdGVudGlhbCBrZXlzIHByZXNzZWQgaW4gb3JkZXJcbiAgICAgICAgICogQHR5cGUge3N0cmluZ1tdfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fcG90ZW50aWFsS2V5cyA9IFtcbiAgICAgICAgICAgICdgJywgJzEnLCAnMicsICczJywgJzQnLCAnNScsICc2JywgJzcnLCAnOCcsICc5JywgJzAnLCAnLScsICcrJyxcbiAgICAgICAgICAgICdxJywgJ3cnLCAnZScsICdyJywgJ3QnLCAneScsICd1JywgJ2knLCAnbycsICdwJywgJ1snLCAnXScsICdcXFxcJyxcbiAgICAgICAgICAgICdhJywgJ3MnLCAnZCcsICdmJywgJ2cnLCAnaCcsICdqJywgJ2snLCAnbCcsICc7JywgJ1xcJydcbiAgICAgICAgXTtcblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZXZlbnQgPT4gdGhpcy5vbktleURvd24oZXZlbnQpKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBldmVudCA9PiB0aGlzLm9uS2V5VXAoZXZlbnQpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBnZXQga2V5cyBkb3duXG4gICAgICogQHBhcmFtIG1hcHBpbmdcbiAgICAgKi9cbiAgICBnZXRLZXlzRG93bigpIHtcbiAgICAgICAgdmFyIGRvd24gPSBbXTtcbiAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCB0aGlzLl9rZXlzLmxlbmd0aDsgYysrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fa2V5c1tjXSA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgb2N0YXZlID0gMDtcbiAgICAgICAgICAgICAgICBpZiAoYyA+PSB0aGlzLl9rZXlzLmxlbmd0aC8yKSB7IG9jdGF2ZSA9IDE7IH1cbiAgICAgICAgICAgICAgICBkb3duLnB1c2goIHsgbm90YXRpb246IE5vdGUubm90YXRpb25BdEluZGV4KGMpLCBvY3RhdmU6IG9jdGF2ZSArIDIsIGluZGV4OiBjLCB2ZWxvY2l0eTogdGhpcy5fa2V5c1tjXX0gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZG93bjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvbiBrZXkgZG93blxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqL1xuICAgIG9uS2V5RG93bihldmVudCkge1xuICAgICAgICB2YXIga2V5ID0gdGhpcy5fcG90ZW50aWFsS2V5cy5pbmRleE9mKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgaWYgKGtleSAhPT0gLTEgJiYgKHRoaXMuX2tleXNba2V5XSA9PT0gMCB8fCAhdGhpcy5fa2V5c1trZXldKSkge1xuICAgICAgICAgICAgdGhpcy5fa2V5c1trZXldID0gMS4wOyAvLyBvbiBhbiBhY3R1YWwgTUlESSBrZXlib2FyZCwgd2UnZCBoYXZlIGEgdmVsb2NpdHlcbiAgICAgICAgICAgIHZhciBvY3RhdmUgPSBNYXRoLmZsb29yKGtleSAvIE5vdGUuc2hhcnBOb3RhdGlvbnMubGVuZ3RoKTtcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrKHtcbiAgICAgICAgICAgICAgICBub3RhdGlvbjogTm90ZS5ub3RhdGlvbkF0SW5kZXgoa2V5KSxcbiAgICAgICAgICAgICAgICBvY3RhdmU6IG9jdGF2ZSArIHRoaXMuX2NvbmZpZy5zdGFydG9jdGF2ZSxcbiAgICAgICAgICAgICAgICAvL2luZGV4OiBrZXksXG4gICAgICAgICAgICAgICAgdmVsb2NpdHk6IDEuMCxcbiAgICAgICAgICAgICAgICBhY3Rpb246ICdwcmVzcycgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvbiBrZXkgZG93blxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqL1xuICAgIG9uS2V5VXAoZXZlbnQpIHtcbiAgICAgICAgdmFyIGtleSA9IHRoaXMuX3BvdGVudGlhbEtleXMuaW5kZXhPZihldmVudC5rZXkudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgIGlmIChrZXkgIT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLl9rZXlzW2tleV0gPSAwLjA7IC8vIG9uIGFuIGFjdHVhbCBNSURJIGtleWJvYXJkLCB3ZSdkIGhhdmUgYSB2ZWxvY2l0eVxuICAgICAgICAgICAgdmFyIG9jdGF2ZSA9IE1hdGguZmxvb3Ioa2V5IC8gTm90ZS5zaGFycE5vdGF0aW9ucy5sZW5ndGgpO1xuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2soe1xuICAgICAgICAgICAgICAgIG5vdGF0aW9uOiBOb3RlLm5vdGF0aW9uQXRJbmRleChrZXkpLFxuICAgICAgICAgICAgICAgIG9jdGF2ZTogb2N0YXZlICsgdGhpcy5fY29uZmlnLnN0YXJ0b2N0YXZlLFxuICAgICAgICAgICAgICAgIC8vaW5kZXg6IGtleSxcbiAgICAgICAgICAgICAgICB2ZWxvY2l0eTogMCxcbiAgICAgICAgICAgICAgICBhY3Rpb246ICdyZWxlYXNlJyB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IHtcbiAgXCJleHBsb3Npb25cIjoge1xuICAgIFwiZnJhZ21lbnRcIjogXCJ2YXJ5aW5nIGZsb2F0IG5vaXNlOyB1bmlmb3JtIHNhbXBsZXIyRCB0RXhwbG9zaW9uOyAgZmxvYXQgcmFuZG9tKCB2ZWMzIHNjYWxlLCBmbG9hdCBzZWVkICl7ICAgcmV0dXJuIGZyYWN0KCBzaW4oIGRvdCggZ2xfRnJhZ0Nvb3JkLnh5eiArIHNlZWQsIHNjYWxlICkgKSAqIDQzNzU4LjU0NTMgKyBzZWVkICkgOyB9ICB2b2lkIG1haW4oKSB7ICAgIGZsb2F0IHIgPSAuMDEgKiByYW5kb20oIHZlYzMoIDEyLjk4OTgsIDc4LjIzMywgMTUxLjcxODIgKSwgMC4wICk7ICAgdmVjMiB0UG9zID0gdmVjMiggMCwgMS4wIC0gMS4zICogbm9pc2UgKyByICk7ICAgdmVjNCBjb2xvciA9IHRleHR1cmUyRCggdEV4cGxvc2lvbiwgdFBvcyApOyAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoIGNvbG9yLnJnYiwgMS4wICk7ICB9XCIsXG4gICAgXCJ2ZXJ0ZXhcIjogXCIgIHZlYzMgbW9kMjg5KHZlYzMgeCkgeyAgIHJldHVybiB4IC0gZmxvb3IoeCAqICgxLjAgLyAyODkuMCkpICogMjg5LjA7IH0gIHZlYzQgbW9kMjg5KHZlYzQgeCkgeyAgIHJldHVybiB4IC0gZmxvb3IoeCAqICgxLjAgLyAyODkuMCkpICogMjg5LjA7IH0gIHZlYzQgcGVybXV0ZSh2ZWM0IHgpIHsgICByZXR1cm4gbW9kMjg5KCgoeCozNC4wKSsxLjApKngpOyB9ICB2ZWM0IHRheWxvckludlNxcnQodmVjNCByKSB7ICAgcmV0dXJuIDEuNzkyODQyOTE0MDAxNTkgLSAwLjg1MzczNDcyMDk1MzE0ICogcjsgfSAgdmVjMyBmYWRlKHZlYzMgdCkgeyAgIHJldHVybiB0KnQqdCoodCoodCo2LjAtMTUuMCkrMTAuMCk7IH0gIGZsb2F0IGNub2lzZSh2ZWMzIFApIHsgICB2ZWMzIFBpMCA9IGZsb29yKFApOyAgIHZlYzMgUGkxID0gUGkwICsgdmVjMygxLjApOyAgIFBpMCA9IG1vZDI4OShQaTApOyAgIFBpMSA9IG1vZDI4OShQaTEpOyAgIHZlYzMgUGYwID0gZnJhY3QoUCk7ICAgdmVjMyBQZjEgPSBQZjAgLSB2ZWMzKDEuMCk7ICAgdmVjNCBpeCA9IHZlYzQoUGkwLngsIFBpMS54LCBQaTAueCwgUGkxLngpOyAgIHZlYzQgaXkgPSB2ZWM0KFBpMC55eSwgUGkxLnl5KTsgICB2ZWM0IGl6MCA9IFBpMC56enp6OyAgIHZlYzQgaXoxID0gUGkxLnp6eno7ICAgIHZlYzQgaXh5ID0gcGVybXV0ZShwZXJtdXRlKGl4KSArIGl5KTsgICB2ZWM0IGl4eTAgPSBwZXJtdXRlKGl4eSArIGl6MCk7ICAgdmVjNCBpeHkxID0gcGVybXV0ZShpeHkgKyBpejEpOyAgICB2ZWM0IGd4MCA9IGl4eTAgKiAoMS4wIC8gNy4wKTsgICB2ZWM0IGd5MCA9IGZyYWN0KGZsb29yKGd4MCkgKiAoMS4wIC8gNy4wKSkgLSAwLjU7ICAgZ3gwID0gZnJhY3QoZ3gwKTsgICB2ZWM0IGd6MCA9IHZlYzQoMC41KSAtIGFicyhneDApIC0gYWJzKGd5MCk7ICAgdmVjNCBzejAgPSBzdGVwKGd6MCwgdmVjNCgwLjApKTsgICBneDAgLT0gc3owICogKHN0ZXAoMC4wLCBneDApIC0gMC41KTsgICBneTAgLT0gc3owICogKHN0ZXAoMC4wLCBneTApIC0gMC41KTsgICAgdmVjNCBneDEgPSBpeHkxICogKDEuMCAvIDcuMCk7ICAgdmVjNCBneTEgPSBmcmFjdChmbG9vcihneDEpICogKDEuMCAvIDcuMCkpIC0gMC41OyAgIGd4MSA9IGZyYWN0KGd4MSk7ICAgdmVjNCBnejEgPSB2ZWM0KDAuNSkgLSBhYnMoZ3gxKSAtIGFicyhneTEpOyAgIHZlYzQgc3oxID0gc3RlcChnejEsIHZlYzQoMC4wKSk7ICAgZ3gxIC09IHN6MSAqIChzdGVwKDAuMCwgZ3gxKSAtIDAuNSk7ICAgZ3kxIC09IHN6MSAqIChzdGVwKDAuMCwgZ3kxKSAtIDAuNSk7ICAgIHZlYzMgZzAwMCA9IHZlYzMoZ3gwLngsZ3kwLngsZ3owLngpOyAgIHZlYzMgZzEwMCA9IHZlYzMoZ3gwLnksZ3kwLnksZ3owLnkpOyAgIHZlYzMgZzAxMCA9IHZlYzMoZ3gwLnosZ3kwLnosZ3owLnopOyAgIHZlYzMgZzExMCA9IHZlYzMoZ3gwLncsZ3kwLncsZ3owLncpOyAgIHZlYzMgZzAwMSA9IHZlYzMoZ3gxLngsZ3kxLngsZ3oxLngpOyAgIHZlYzMgZzEwMSA9IHZlYzMoZ3gxLnksZ3kxLnksZ3oxLnkpOyAgIHZlYzMgZzAxMSA9IHZlYzMoZ3gxLnosZ3kxLnosZ3oxLnopOyAgIHZlYzMgZzExMSA9IHZlYzMoZ3gxLncsZ3kxLncsZ3oxLncpOyAgICB2ZWM0IG5vcm0wID0gdGF5bG9ySW52U3FydCh2ZWM0KGRvdChnMDAwLCBnMDAwKSwgZG90KGcwMTAsIGcwMTApLCBkb3QoZzEwMCwgZzEwMCksIGRvdChnMTEwLCBnMTEwKSkpOyAgIGcwMDAgKj0gbm9ybTAueDsgICBnMDEwICo9IG5vcm0wLnk7ICAgZzEwMCAqPSBub3JtMC56OyAgIGcxMTAgKj0gbm9ybTAudzsgICB2ZWM0IG5vcm0xID0gdGF5bG9ySW52U3FydCh2ZWM0KGRvdChnMDAxLCBnMDAxKSwgZG90KGcwMTEsIGcwMTEpLCBkb3QoZzEwMSwgZzEwMSksIGRvdChnMTExLCBnMTExKSkpOyAgIGcwMDEgKj0gbm9ybTEueDsgICBnMDExICo9IG5vcm0xLnk7ICAgZzEwMSAqPSBub3JtMS56OyAgIGcxMTEgKj0gbm9ybTEudzsgICAgZmxvYXQgbjAwMCA9IGRvdChnMDAwLCBQZjApOyAgIGZsb2F0IG4xMDAgPSBkb3QoZzEwMCwgdmVjMyhQZjEueCwgUGYwLnl6KSk7ICAgZmxvYXQgbjAxMCA9IGRvdChnMDEwLCB2ZWMzKFBmMC54LCBQZjEueSwgUGYwLnopKTsgICBmbG9hdCBuMTEwID0gZG90KGcxMTAsIHZlYzMoUGYxLnh5LCBQZjAueikpOyAgIGZsb2F0IG4wMDEgPSBkb3QoZzAwMSwgdmVjMyhQZjAueHksIFBmMS56KSk7ICAgZmxvYXQgbjEwMSA9IGRvdChnMTAxLCB2ZWMzKFBmMS54LCBQZjAueSwgUGYxLnopKTsgICBmbG9hdCBuMDExID0gZG90KGcwMTEsIHZlYzMoUGYwLngsIFBmMS55eikpOyAgIGZsb2F0IG4xMTEgPSBkb3QoZzExMSwgUGYxKTsgICAgdmVjMyBmYWRlX3h5eiA9IGZhZGUoUGYwKTsgICB2ZWM0IG5feiA9IG1peCh2ZWM0KG4wMDAsIG4xMDAsIG4wMTAsIG4xMTApLCB2ZWM0KG4wMDEsIG4xMDEsIG4wMTEsIG4xMTEpLCBmYWRlX3h5ei56KTsgICB2ZWMyIG5feXogPSBtaXgobl96Lnh5LCBuX3ouencsIGZhZGVfeHl6LnkpOyAgIGZsb2F0IG5feHl6ID0gbWl4KG5feXoueCwgbl95ei55LCBmYWRlX3h5ei54KTsgICByZXR1cm4gMi4yICogbl94eXo7IH0gIGZsb2F0IHBub2lzZSh2ZWMzIFAsIHZlYzMgcmVwKSB7ICAgdmVjMyBQaTAgPSBtb2QoZmxvb3IoUCksIHJlcCk7ICAgdmVjMyBQaTEgPSBtb2QoUGkwICsgdmVjMygxLjApLCByZXApOyAgIFBpMCA9IG1vZDI4OShQaTApOyAgIFBpMSA9IG1vZDI4OShQaTEpOyAgIHZlYzMgUGYwID0gZnJhY3QoUCk7ICAgdmVjMyBQZjEgPSBQZjAgLSB2ZWMzKDEuMCk7ICAgdmVjNCBpeCA9IHZlYzQoUGkwLngsIFBpMS54LCBQaTAueCwgUGkxLngpOyAgIHZlYzQgaXkgPSB2ZWM0KFBpMC55eSwgUGkxLnl5KTsgICB2ZWM0IGl6MCA9IFBpMC56enp6OyAgIHZlYzQgaXoxID0gUGkxLnp6eno7ICAgIHZlYzQgaXh5ID0gcGVybXV0ZShwZXJtdXRlKGl4KSArIGl5KTsgICB2ZWM0IGl4eTAgPSBwZXJtdXRlKGl4eSArIGl6MCk7ICAgdmVjNCBpeHkxID0gcGVybXV0ZShpeHkgKyBpejEpOyAgICB2ZWM0IGd4MCA9IGl4eTAgKiAoMS4wIC8gNy4wKTsgICB2ZWM0IGd5MCA9IGZyYWN0KGZsb29yKGd4MCkgKiAoMS4wIC8gNy4wKSkgLSAwLjU7ICAgZ3gwID0gZnJhY3QoZ3gwKTsgICB2ZWM0IGd6MCA9IHZlYzQoMC41KSAtIGFicyhneDApIC0gYWJzKGd5MCk7ICAgdmVjNCBzejAgPSBzdGVwKGd6MCwgdmVjNCgwLjApKTsgICBneDAgLT0gc3owICogKHN0ZXAoMC4wLCBneDApIC0gMC41KTsgICBneTAgLT0gc3owICogKHN0ZXAoMC4wLCBneTApIC0gMC41KTsgICAgdmVjNCBneDEgPSBpeHkxICogKDEuMCAvIDcuMCk7ICAgdmVjNCBneTEgPSBmcmFjdChmbG9vcihneDEpICogKDEuMCAvIDcuMCkpIC0gMC41OyAgIGd4MSA9IGZyYWN0KGd4MSk7ICAgdmVjNCBnejEgPSB2ZWM0KDAuNSkgLSBhYnMoZ3gxKSAtIGFicyhneTEpOyAgIHZlYzQgc3oxID0gc3RlcChnejEsIHZlYzQoMC4wKSk7ICAgZ3gxIC09IHN6MSAqIChzdGVwKDAuMCwgZ3gxKSAtIDAuNSk7ICAgZ3kxIC09IHN6MSAqIChzdGVwKDAuMCwgZ3kxKSAtIDAuNSk7ICAgIHZlYzMgZzAwMCA9IHZlYzMoZ3gwLngsZ3kwLngsZ3owLngpOyAgIHZlYzMgZzEwMCA9IHZlYzMoZ3gwLnksZ3kwLnksZ3owLnkpOyAgIHZlYzMgZzAxMCA9IHZlYzMoZ3gwLnosZ3kwLnosZ3owLnopOyAgIHZlYzMgZzExMCA9IHZlYzMoZ3gwLncsZ3kwLncsZ3owLncpOyAgIHZlYzMgZzAwMSA9IHZlYzMoZ3gxLngsZ3kxLngsZ3oxLngpOyAgIHZlYzMgZzEwMSA9IHZlYzMoZ3gxLnksZ3kxLnksZ3oxLnkpOyAgIHZlYzMgZzAxMSA9IHZlYzMoZ3gxLnosZ3kxLnosZ3oxLnopOyAgIHZlYzMgZzExMSA9IHZlYzMoZ3gxLncsZ3kxLncsZ3oxLncpOyAgICB2ZWM0IG5vcm0wID0gdGF5bG9ySW52U3FydCh2ZWM0KGRvdChnMDAwLCBnMDAwKSwgZG90KGcwMTAsIGcwMTApLCBkb3QoZzEwMCwgZzEwMCksIGRvdChnMTEwLCBnMTEwKSkpOyAgIGcwMDAgKj0gbm9ybTAueDsgICBnMDEwICo9IG5vcm0wLnk7ICAgZzEwMCAqPSBub3JtMC56OyAgIGcxMTAgKj0gbm9ybTAudzsgICB2ZWM0IG5vcm0xID0gdGF5bG9ySW52U3FydCh2ZWM0KGRvdChnMDAxLCBnMDAxKSwgZG90KGcwMTEsIGcwMTEpLCBkb3QoZzEwMSwgZzEwMSksIGRvdChnMTExLCBnMTExKSkpOyAgIGcwMDEgKj0gbm9ybTEueDsgICBnMDExICo9IG5vcm0xLnk7ICAgZzEwMSAqPSBub3JtMS56OyAgIGcxMTEgKj0gbm9ybTEudzsgICAgZmxvYXQgbjAwMCA9IGRvdChnMDAwLCBQZjApOyAgIGZsb2F0IG4xMDAgPSBkb3QoZzEwMCwgdmVjMyhQZjEueCwgUGYwLnl6KSk7ICAgZmxvYXQgbjAxMCA9IGRvdChnMDEwLCB2ZWMzKFBmMC54LCBQZjEueSwgUGYwLnopKTsgICBmbG9hdCBuMTEwID0gZG90KGcxMTAsIHZlYzMoUGYxLnh5LCBQZjAueikpOyAgIGZsb2F0IG4wMDEgPSBkb3QoZzAwMSwgdmVjMyhQZjAueHksIFBmMS56KSk7ICAgZmxvYXQgbjEwMSA9IGRvdChnMTAxLCB2ZWMzKFBmMS54LCBQZjAueSwgUGYxLnopKTsgICBmbG9hdCBuMDExID0gZG90KGcwMTEsIHZlYzMoUGYwLngsIFBmMS55eikpOyAgIGZsb2F0IG4xMTEgPSBkb3QoZzExMSwgUGYxKTsgICAgdmVjMyBmYWRlX3h5eiA9IGZhZGUoUGYwKTsgICB2ZWM0IG5feiA9IG1peCh2ZWM0KG4wMDAsIG4xMDAsIG4wMTAsIG4xMTApLCB2ZWM0KG4wMDEsIG4xMDEsIG4wMTEsIG4xMTEpLCBmYWRlX3h5ei56KTsgICB2ZWMyIG5feXogPSBtaXgobl96Lnh5LCBuX3ouencsIGZhZGVfeHl6LnkpOyAgIGZsb2F0IG5feHl6ID0gbWl4KG5feXoueCwgbl95ei55LCBmYWRlX3h5ei54KTsgICByZXR1cm4gMi4yICogbl94eXo7IH0gIHZhcnlpbmcgZmxvYXQgbm9pc2U7IHVuaWZvcm0gZmxvYXQgdGltZTsgIGZsb2F0IHR1cmJ1bGVuY2UoIHZlYzMgcCApIHsgICBmbG9hdCB3ID0gMTAwLjA7ICAgZmxvYXQgdCA9IC0uNTsgICBmb3IgKGZsb2F0IGYgPSAxLjAgOyBmIDw9IDEwLjAgOyBmKysgKXsgICAgIGZsb2F0IHBvd2VyID0gcG93KCAyLjAsIGYgKTsgICAgIHQgKz0gYWJzKCBwbm9pc2UoIHZlYzMoIHBvd2VyICogcCApLCB2ZWMzKCAxMC4wLCAxMC4wLCAxMC4wICkgKSAvIHBvd2VyICk7ICAgfSAgIHJldHVybiB0OyB9ICB2b2lkIG1haW4oKSB7ICAgbm9pc2UgPSAxMC4wICogIC0uMTAgKiB0dXJidWxlbmNlKCAuNSAqIG5vcm1hbCArIHRpbWUgKTsgICBmbG9hdCBiID0gNS4wICogcG5vaXNlKCAwLjA1ICogcG9zaXRpb24gKyB2ZWMzKCAyLjAgKiB0aW1lICksIHZlYzMoIDEwMC4wICkgKTsgICBmbG9hdCBkaXNwbGFjZW1lbnQgPSAtIDEwLiAqIG5vaXNlICsgYjsgICAgdmVjMyBuZXdQb3NpdGlvbiA9IHBvc2l0aW9uICsgbm9ybWFsICogZGlzcGxhY2VtZW50OyAgIGdsX1Bvc2l0aW9uID0gcHJvamVjdGlvbk1hdHJpeCAqIG1vZGVsVmlld01hdHJpeCAqIHZlYzQoIG5ld1Bvc2l0aW9uLCAxLjAgKTsgIH1cIlxuICB9LFxuICBcImZsb2NrXCI6IHtcbiAgICBcImZyYWdtZW50XCI6IFwidW5pZm9ybSB2ZWMzIGNvbG9yOyAgdm9pZCBtYWluKCkgeyAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCggY29sb3IsIDAuMSApOyB9IFwiLFxuICAgIFwidmVydGV4XCI6IFwiYXR0cmlidXRlIHZlYzIgcmVmZXJlbmNlOyBhdHRyaWJ1dGUgZmxvYXQgdmVydGV4OyAgdW5pZm9ybSBzYW1wbGVyMkQgdGV4dHVyZVBvc2l0aW9uOyB1bmlmb3JtIHNhbXBsZXIyRCB0ZXh0dXJlVmVsb2NpdHk7ICB1bmlmb3JtIGZsb2F0IHRpbWU7ICB2b2lkIG1haW4oKSB7ICAgICAgdmVjNCB0bXBQb3MgPSB0ZXh0dXJlMkQoIHRleHR1cmVQb3NpdGlvbiwgcmVmZXJlbmNlICk7ICAgICB2ZWMzIHBvcyA9IHRtcFBvcy54eXo7ICAgICB2ZWMzIHZlbG9jaXR5ID0gbm9ybWFsaXplKHRleHR1cmUyRCggdGV4dHVyZVZlbG9jaXR5LCByZWZlcmVuY2UgKS54eXopOyAgICAgIHZlYzMgbmV3UG9zaXRpb24gPSBwb3NpdGlvbjsgICAgICBpZiAoIHZlcnRleCA9PSA0LjAgfHwgdmVydGV4ID09IDcuMCApIHsgICAgICAgICAgICAgICAgIG5ld1Bvc2l0aW9uLnkgPSBzaW4oIHRtcFBvcy53ICkgKiA1LjsgICAgIH0gICAgICBuZXdQb3NpdGlvbiA9IG1hdDMoIG1vZGVsTWF0cml4ICkgKiBuZXdQb3NpdGlvbjsgICAgICAgdmVsb2NpdHkueiAqPSAtMS47ICAgICBmbG9hdCB4eiA9IGxlbmd0aCggdmVsb2NpdHkueHogKTsgICAgIGZsb2F0IHh5eiA9IDEuOyAgICAgZmxvYXQgeCA9IHNxcnQoIDEuIC0gdmVsb2NpdHkueSAqIHZlbG9jaXR5LnkgKTsgICAgICBmbG9hdCBjb3NyeSA9IHZlbG9jaXR5LnggLyB4ejsgICAgIGZsb2F0IHNpbnJ5ID0gdmVsb2NpdHkueiAvIHh6OyAgICAgIGZsb2F0IGNvc3J6ID0geCAvIHh5ejsgICAgIGZsb2F0IHNpbnJ6ID0gdmVsb2NpdHkueSAvIHh5ejsgICAgICBtYXQzIG1hdHkgPSAgbWF0MyggICAgICAgICBjb3NyeSwgMCwgLXNpbnJ5LCAgICAgICAgIDAgICAgLCAxLCAwICAgICAsICAgICAgICAgc2lucnksIDAsIGNvc3J5ICAgICAgKTsgICAgICBtYXQzIG1hdHogPSAgbWF0MyggICAgICAgICBjb3NyeiAsIHNpbnJ6LCAwLCAgICAgICAgIC1zaW5yeiwgY29zcnosIDAsICAgICAgICAgMCAgICAgLCAwICAgICwgMSAgICAgKTsgICAgICBuZXdQb3NpdGlvbiA9ICBtYXR5ICogbWF0eiAqIG5ld1Bvc2l0aW9uOyAgICAgbmV3UG9zaXRpb24gKz0gcG9zOyAgICAgZ2xfUG9zaXRpb24gPSBwcm9qZWN0aW9uTWF0cml4ICogIHZpZXdNYXRyaXggICogdmVjNCggbmV3UG9zaXRpb24sIDEuMCApOyB9IFwiXG4gIH0sXG4gIFwiZmxvY2twb3NpdGlvblwiOiB7XG4gICAgXCJmcmFnbWVudFwiOiBcInVuaWZvcm0gZmxvYXQgdGltZTsgdW5pZm9ybSBmbG9hdCBkZWx0YTsgdW5pZm9ybSBmbG9hdCBkZXB0aDsgIHZvaWQgbWFpbigpIHsgICAgICB2ZWMyIHV2ID0gZ2xfRnJhZ0Nvb3JkLnh5IC8gcmVzb2x1dGlvbi54eTsgICAgIHZlYzQgdG1wUG9zID0gdGV4dHVyZTJEKCB0ZXh0dXJlUG9zaXRpb24sIHV2ICk7ICAgICB2ZWMzIHBvc2l0aW9uID0gdG1wUG9zLnh5ejsgICAgIHZlYzMgdmVsb2NpdHkgPSB0ZXh0dXJlMkQoIHRleHR1cmVWZWxvY2l0eSwgdXYgKS54eXo7ICAgICAgZmxvYXQgcGhhc2UgPSB0bXBQb3MudzsgICAgICBwaGFzZSA9IG1vZCggKCBwaGFzZSArIGRlbHRhICsgICAgICAgICBsZW5ndGgoIHZlbG9jaXR5Lnh6ICkgKiBkZWx0YSAqIDMuICsgICAgICAgICBtYXgoIHZlbG9jaXR5LnksIDAuMCApICogZGVsdGEgKiA2LiApLCA2Mi44MyApOyAgICAgIHZlYzMgY2FsY3VsYXRlZFBvcyA9IHZlYzMoIHBvc2l0aW9uICsgdmVsb2NpdHkgKiBkZWx0YSAqIDE1Lik7ICAgICBjYWxjdWxhdGVkUG9zLnkgPSBjbGFtcCggY2FsY3VsYXRlZFBvcy55LCAtMjAwMC4wLCBkZXB0aCk7ICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KCBjYWxjdWxhdGVkUG9zLCBwaGFzZSk7ICB9IFwiXG4gIH0sXG4gIFwiZmxvY2t2ZWxvY2l0eVwiOiB7XG4gICAgXCJmcmFnbWVudFwiOiBcInVuaWZvcm0gZmxvYXQgdGltZTsgdW5pZm9ybSBmbG9hdCB0ZXN0aW5nOyB1bmlmb3JtIGZsb2F0IGRlbHRhOyB1bmlmb3JtIGZsb2F0IHNlcGVyYXRpb25EaXN0YW5jZTsgdW5pZm9ybSBmbG9hdCBhbGlnbm1lbnREaXN0YW5jZTsgdW5pZm9ybSBmbG9hdCBjb2hlc2lvbkRpc3RhbmNlOyB1bmlmb3JtIGZsb2F0IGZyZWVkb21GYWN0b3I7ICBjb25zdCBmbG9hdCB3aWR0aCA9IHJlc29sdXRpb24ueDsgY29uc3QgZmxvYXQgaGVpZ2h0ID0gcmVzb2x1dGlvbi55OyAgY29uc3QgZmxvYXQgUEkgPSAzLjE0MTU5MjY1MzU4OTc5MzsgY29uc3QgZmxvYXQgUElfMiA9IFBJICogMi4wOyAgZmxvYXQgem9uZVJhZGl1cyA9IDE2MC4wOyBmbG9hdCB6b25lUmFkaXVzU3F1YXJlZCA9IDI1NjAwLjA7ICBmbG9hdCBzZXBhcmF0aW9uVGhyZXNoID0gMC40NTsgZmxvYXQgYWxpZ25tZW50VGhyZXNoID0gMC42NTsgIGNvbnN0IGZsb2F0IFVQUEVSX0JPVU5EUyA9IEJPVU5EUzsgY29uc3QgZmxvYXQgTE9XRVJfQk9VTkRTID0gLVVQUEVSX0JPVU5EUzsgIGNvbnN0IGZsb2F0IFNQRUVEX0xJTUlUID0gOS4wOyAgZmxvYXQgcmFuZCh2ZWMyIGNvKXsgICAgIHJldHVybiBmcmFjdChzaW4oZG90KGNvLnh5ICx2ZWMyKDEyLjk4OTgsNzguMjMzKSkpICogNDM3NTguNTQ1Myk7IH0gIHZvaWQgbWFpbigpIHsgICAgICB6b25lUmFkaXVzID0gc2VwZXJhdGlvbkRpc3RhbmNlICsgYWxpZ25tZW50RGlzdGFuY2UgKyBjb2hlc2lvbkRpc3RhbmNlOyAgICAgc2VwYXJhdGlvblRocmVzaCA9IHNlcGVyYXRpb25EaXN0YW5jZSAvIHpvbmVSYWRpdXM7ICAgICBhbGlnbm1lbnRUaHJlc2ggPSAoIHNlcGVyYXRpb25EaXN0YW5jZSArIGFsaWdubWVudERpc3RhbmNlICkgLyB6b25lUmFkaXVzOyAgICAgem9uZVJhZGl1c1NxdWFyZWQgPSB6b25lUmFkaXVzICogem9uZVJhZGl1czsgICAgICAgdmVjMiB1diA9IGdsX0ZyYWdDb29yZC54eSAvIHJlc29sdXRpb24ueHk7ICAgICB2ZWMzIGZsb2NrcG9zaXRpb24sIGZsb2NrdmVsb2NpdHk7ICAgICAgdmVjMyBzZWxmUG9zaXRpb24gPSB0ZXh0dXJlMkQoIHRleHR1cmVQb3NpdGlvbiwgdXYgKS54eXo7ICAgICB2ZWMzIHNlbGZWZWxvY2l0eSA9IHRleHR1cmUyRCggdGV4dHVyZVZlbG9jaXR5LCB1diApLnh5ejsgICAgICBmbG9hdCBkaXN0OyAgICAgdmVjMyBkaXI7ICAgICBmbG9hdCBkaXN0U3F1YXJlZDsgICAgICBmbG9hdCBzZXBlcmF0aW9uU3F1YXJlZCA9IHNlcGVyYXRpb25EaXN0YW5jZSAqIHNlcGVyYXRpb25EaXN0YW5jZTsgICAgIGZsb2F0IGNvaGVzaW9uU3F1YXJlZCA9IGNvaGVzaW9uRGlzdGFuY2UgKiBjb2hlc2lvbkRpc3RhbmNlOyAgICAgIGZsb2F0IGY7ICAgICBmbG9hdCBwZXJjZW50OyAgICAgIHZlYzMgdmVsb2NpdHkgPSBzZWxmVmVsb2NpdHk7ICAgICAgZmxvYXQgbGltaXQgPSBTUEVFRF9MSU1JVDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlYzMgY2VudHJhbCA9IHZlYzMoIDAuLCAwLiwgMC4gKTsgICAgIGRpciA9IHNlbGZQb3NpdGlvbiAtIGNlbnRyYWw7ICAgICBkaXN0ID0gbGVuZ3RoKCBkaXIgKTsgICAgICBkaXIueSAqPSAyLjU7ICAgICB2ZWxvY2l0eSAtPSBub3JtYWxpemUoIGRpciApICogZGVsdGEgKiA1LjsgICAgICBmb3IgKGZsb2F0IHk9MC4wO3k8aGVpZ2h0O3krKykgeyAgICAgICAgIGZvciAoZmxvYXQgeD0wLjA7eDx3aWR0aDt4KyspIHsgICAgICAgICAgICAgIHZlYzIgcmVmID0gdmVjMiggeCArIDAuNSwgeSArIDAuNSApIC8gcmVzb2x1dGlvbi54eTsgICAgICAgICAgICAgZmxvY2twb3NpdGlvbiA9IHRleHR1cmUyRCggdGV4dHVyZVBvc2l0aW9uLCByZWYgKS54eXo7ICAgICAgICAgICAgICBkaXIgPSBmbG9ja3Bvc2l0aW9uIC0gc2VsZlBvc2l0aW9uOyAgICAgICAgICAgICBkaXN0ID0gbGVuZ3RoKGRpcik7ICAgICAgICAgICAgICBpZiAoZGlzdCA8IDAuMDAwMSkgY29udGludWU7ICAgICAgICAgICAgICBkaXN0U3F1YXJlZCA9IGRpc3QgKiBkaXN0OyAgICAgICAgICAgICAgaWYgKGRpc3RTcXVhcmVkID4gem9uZVJhZGl1c1NxdWFyZWQgKSBjb250aW51ZTsgICAgICAgICAgICAgIHBlcmNlbnQgPSBkaXN0U3F1YXJlZCAvIHpvbmVSYWRpdXNTcXVhcmVkOyAgICAgICAgICAgICAgaWYgKCBwZXJjZW50IDwgc2VwYXJhdGlvblRocmVzaCApIHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZiA9IChzZXBhcmF0aW9uVGhyZXNoIC8gcGVyY2VudCAtIDEuMCkgKiBkZWx0YTsgICAgICAgICAgICAgICAgIHZlbG9jaXR5IC09IG5vcm1hbGl6ZShkaXIpICogZjsgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIHBlcmNlbnQgPCBhbGlnbm1lbnRUaHJlc2ggKSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsb2F0IHRocmVzaERlbHRhID0gYWxpZ25tZW50VGhyZXNoIC0gc2VwYXJhdGlvblRocmVzaDsgICAgICAgICAgICAgICAgIGZsb2F0IGFkanVzdGVkUGVyY2VudCA9ICggcGVyY2VudCAtIHNlcGFyYXRpb25UaHJlc2ggKSAvIHRocmVzaERlbHRhOyAgICAgICAgICAgICAgICAgIGZsb2NrdmVsb2NpdHkgPSB0ZXh0dXJlMkQoIHRleHR1cmVWZWxvY2l0eSwgcmVmICkueHl6OyAgICAgICAgICAgICAgICAgIGYgPSAoIDAuNSAtIGNvcyggYWRqdXN0ZWRQZXJjZW50ICogUElfMiApICogMC41ICsgMC41ICkgKiBkZWx0YTsgICAgICAgICAgICAgICAgIGZsb2NrdmVsb2NpdHkgKz0gbm9ybWFsaXplKGZsb2NrdmVsb2NpdHkpICogZjsgICAgICAgICAgICAgIH0gZWxzZSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsb2F0IHRocmVzaERlbHRhID0gMS4wIC0gYWxpZ25tZW50VGhyZXNoOyAgICAgICAgICAgICAgICAgZmxvYXQgYWRqdXN0ZWRQZXJjZW50ID0gKCBwZXJjZW50IC0gYWxpZ25tZW50VGhyZXNoICkgLyB0aHJlc2hEZWx0YTsgICAgICAgICAgICAgICAgICBmID0gKCAwLjUgLSAoIGNvcyggYWRqdXN0ZWRQZXJjZW50ICogUElfMiApICogLTAuNSArIDAuNSApICkgKiBkZWx0YTsgICAgICAgICAgICAgICAgICB2ZWxvY2l0eSArPSBub3JtYWxpemUoZGlyKSAqIGY7ICAgICAgICAgICAgICB9ICAgICAgICAgIH0gICAgICB9ICAgICAgICAgICAgICAgICAgICBpZiAoIGxlbmd0aCggdmVsb2NpdHkgKSA+IGxpbWl0ICkgeyAgICAgICAgIHZlbG9jaXR5ID0gbm9ybWFsaXplKCB2ZWxvY2l0eSApICogbGltaXQ7ICAgICB9ICAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCggdmVsb2NpdHksIDEuMCApOyAgfSBcIlxuICB9LFxuICBcImdsb3dcIjoge1xuICAgIFwiZnJhZ21lbnRcIjogXCJ1bmlmb3JtIHZlYzMgZ2xvd0NvbG9yOyB2YXJ5aW5nIGZsb2F0IGludGVuc2l0eTsgdm9pZCBtYWluKCkgIHsgIHZlYzMgZ2xvdyA9IGdsb3dDb2xvciAqIGludGVuc2l0eTsgICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoIGdsb3csIDEuMCApOyB9XCIsXG4gICAgXCJ2ZXJ0ZXhcIjogXCJ1bmlmb3JtIHZlYzMgdmlld1ZlY3RvcjsgdW5pZm9ybSBmbG9hdCBjOyB1bmlmb3JtIGZsb2F0IHA7IHZhcnlpbmcgZmxvYXQgaW50ZW5zaXR5OyB2b2lkIG1haW4oKSAgeyAgICAgdmVjMyB2Tm9ybWFsID0gbm9ybWFsaXplKCBub3JtYWxNYXRyaXggKiBub3JtYWwgKTsgIHZlYzMgdk5vcm1lbCA9IG5vcm1hbGl6ZSggbm9ybWFsTWF0cml4ICogdmlld1ZlY3RvciApOyAgaW50ZW5zaXR5ID0gcG93KCBjIC0gZG90KHZOb3JtYWwsIHZOb3JtZWwpLCBwICk7ICAgICAgIGdsX1Bvc2l0aW9uID0gcHJvamVjdGlvbk1hdHJpeCAqIG1vZGVsVmlld01hdHJpeCAqIHZlYzQoIHBvc2l0aW9uLCAxLjAgKTsgfVwiXG4gIH1cbn0iLCJleHBvcnQgZGVmYXVsdCB7XG4gICAgbmV1dHJhbDoge1xuICAgICAgICByZWQ6IDB4N0E2ODY5LFxuICAgICAgICBkYXJrcmVkOiAweDJkMjYyNyxcbiAgICAgICAgLy9ncmVlbjogMHg2NTg3NkUsXG5cbiAgICAgICAgZ3JlZW46IDB4YzBjNGI2LFxuICAgICAgICBsaWdodHJlZDogMHhlYWRmZGIsXG4gICAgICAgIGdyYXlibHVlOiAweGFkYWViMCxcbiAgICAgICAgYnJvd246IDB4ZDhjMmI1LFxuICAgICAgICBvcmFuZ2U6IDB4ZjJjZmIzXG4gICAgfSxcblxuICAgIG5lb246IHtcbiAgICAgICAgYmx1ZTogMHgwMGVjZmYsXG4gICAgICAgIGdyZWVuOiAweDdjZmYwMCxcbiAgICAgICAgeWVsbG93OiAweGUzZmYwMCxcbiAgICAgICAgb3JhbmdlOiAweGZmYjQwMCxcbiAgICAgICAgdmlvbGV0OiAweGZkMDBmZlxuICAgIH0sXG5cbiAgICBncmF5c2NhbGU6IFtcbiAgICAgICAgMHgwMDAwMDAsXG4gICAgICAgIDB4MmEyYTJhLFxuICAgICAgICAweDVhNWE1YSxcbiAgICAgICAgMHg4YThhOGEsXG4gICAgICAgIDB4YWFhYWFhLFxuICAgICAgICAweGZmZmZmZlxuICAgIF1cbn0iLCJpbXBvcnQgQ29sb3JzIGZyb20gJy4vY29sb3JzLmVzNic7XG5leHBvcnQgZGVmYXVsdCB7XG4gICAgY29sb3J3aGVlbDogWyAgICAgICAweGZmZmEwMCwgMHhmZmNmMDAsIDB4ZmZhNjAwLCAweGZmN2QwMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIDB4ZmYyMDAwLCAweGY0MjQ5NCwgMHg4YjIwYmIsIDB4MDAyNGJhLFxuICAgICAgICAgICAgICAgICAgICAgICAgMHgwMDdhYzcsIDB4MDBiMmQ2LCAweDAyYjgwMSwgMHg4NGNlMDAgXSxcblxuXG4gICAga2V5czoge1xuICAgICAgICBub3JtYWw6IHtcbiAgICAgICAgICAgIHdoaXRlOiB7XG4gICAgICAgICAgICAgICAgZW1pc3NpdmU6IENvbG9ycy5ncmF5c2NhbGVbM10sXG4gICAgICAgICAgICAgICAgY29sb3I6IENvbG9ycy5uZXV0cmFsLnJlZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJsYWNrOiB7XG4gICAgICAgICAgICAgICAgZW1pc3NpdmU6IENvbG9ycy5ncmF5c2NhbGVbMV0sXG4gICAgICAgICAgICAgICAgY29sb3I6IENvbG9ycy5uZXV0cmFsLnJlZFxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzdWdnZXN0ZWQ6IHtcbiAgICAgICAgICAgIHdoaXRlOiB7XG4gICAgICAgICAgICAgICAgZW1pc3NpdmU6IENvbG9ycy5ncmF5c2NhbGVbMl0sXG4gICAgICAgICAgICAgICAgY29sb3I6IENvbG9ycy5uZW9uLmdyZWVuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYmxhY2s6IHtcbiAgICAgICAgICAgICAgICBlbWlzc2l2ZTogQ29sb3JzLmdyYXlzY2FsZVsxXSxcbiAgICAgICAgICAgICAgICBjb2xvcjogQ29sb3JzLm5lb24uZ3JlZW5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgc3Ryb25nbHlTdWdnZXN0ZWQ6IHtcbiAgICAgICAgICAgIHdoaXRlOiB7XG4gICAgICAgICAgICAgICAgZW1pc3NpdmU6IENvbG9ycy5ncmF5c2NhbGVbMl0sXG4gICAgICAgICAgICAgICAgY29sb3I6IENvbG9ycy5uZW9uLm9yYW5nZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJsYWNrOiB7XG4gICAgICAgICAgICAgICAgZW1pc3NpdmU6IENvbG9ycy5ncmF5c2NhbGVbMV0sXG4gICAgICAgICAgICAgICAgY29sb3I6IENvbG9ycy5uZW9uLm9yYW5nZVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG5cbiAgICB9LFxuXG4gICAgbWV0cm9ub21lOiB7XG4gICAgICAgIGRydW06IHtcbiAgICAgICAgICAgIGJ1bXBtYXA6ICcuL2Fzc2V0cy9pbWFnZXMvcmlwcGxlbWFwLmpwZycsXG4gICAgICAgICAgICBjb2xvcjogQ29sb3JzLm5ldXRyYWwuZGFya3JlZCxcbiAgICAgICAgICAgIGhpdGNvbG9yOiBDb2xvcnMuZ3JheXNjYWxlWzBdLFxuICAgICAgICAgICAgZW1pc3NpdmU6IENvbG9ycy5ncmF5c2NhbGVbMF0sXG4gICAgICAgICAgICBzcGVjdWxhcjogQ29sb3JzLm5ldXRyYWwuZ3JheWJsdWVcbiAgICAgICAgfSxcblxuICAgICAgICBoYW1tZXI6IHtcbiAgICAgICAgICAgIHJlZnJhY3Rpb25jdWJlOiBbXG4gICAgICAgICAgICAgICAgJy4vYXNzZXRzL2ltYWdlcy9ueC5qcGcnLFxuICAgICAgICAgICAgICAgICcuL2Fzc2V0cy9pbWFnZXMvbnkuanBnJyxcbiAgICAgICAgICAgICAgICAnLi9hc3NldHMvaW1hZ2VzL256LmpwZycsXG4gICAgICAgICAgICAgICAgJy4vYXNzZXRzL2ltYWdlcy9ueC5qcGcnLFxuICAgICAgICAgICAgICAgICcuL2Fzc2V0cy9pbWFnZXMvbnkuanBnJyxcbiAgICAgICAgICAgICAgICAnLi9hc3NldHMvaW1hZ2VzL256LmpwZycgXSxcbiAgICAgICAgICAgIGNvbG9yOiBDb2xvcnMubmV1dHJhbC5yZWQsXG4gICAgICAgICAgICBoaXRjb2xvcjogQ29sb3JzLmdyYXlzY2FsZVswXVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGRvbWU6IHtcbiAgICAgICAgY29sb3I6IENvbG9ycy5uZXV0cmFsLmRhcmtyZWQsXG4gICAgICAgIGVtaXNzaXZlOiBDb2xvcnMubmV1dHJhbC5kYXJrcmVkLFxuICAgICAgICBzcGVjdWxhcjogQ29sb3JzLm5ldXRyYWwucmVkXG4gICAgfSxcblxuICAgIGZsb2F0aW5ncGFydGljbGVzOiB7XG4gICAgICAgIHNwcml0ZTogJy4vYXNzZXRzL2ltYWdlcy9zbm93Zmxha2UxLnBuZycsXG4gICAgICAgIGNvbG9yOiBDb2xvcnMuZ3JheXNjYWxlWzJdXG4gICAgfSxcblxuICAgIGxpZ2h0aW5nOiB7XG4gICAgICAgIGhlbWlzcGhlcmU6IHtcbiAgICAgICAgICAgIHRvcDogQ29sb3JzLm5ldXRyYWwuZGFya3JlZCxcbiAgICAgICAgICAgIGJvdHRvbTogQ29sb3JzLm5ldXRyYWwuZ3JlZW5cbiAgICAgICAgfSxcbiAgICAgICAgc3BvdGxpZ2h0OiBDb2xvcnMuZ3JheXNjYWxlWzFdXG4gICAgfVxufVxuIiwiaW1wb3J0IE5vdGUgZnJvbSAnLi9tdXNpY3RoZW9yeS9ub3RlLmVzNic7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBTWU5USERSVU06ICdzeW50aF9kcnVtJyxcbiAgICBQSUFOTzogICAgICdhY291c3RpY19ncmFuZF9waWFubycsXG5cbiAgICBwbGF5ZXJTdGF0ZTogJ3JlYWR5JyxcblxuICAgIC8qKlxuICAgICAqIGluc3RydW1lbnRzIGxvYWRlZFxuICAgICAqL1xuICAgIF9pbnN0cnVtZW50c0xvYWRlZDogW10sXG5cbiAgICAvKipcbiAgICAgKiBwbGF5IG1pZGkgZmlsZVxuICAgICAqIEBwYXJhbSB1cmkgb2YgbWlkaWUgZmlsZVxuICAgICAqL1xuICAgIHBsYXkodXJpKSB7XG4gICAgICAgIHRoaXMucGxheWVyU3RhdGUgPSAnbG9hZGluZyc7XG4gICAgICAgIE1JREkuUGxheWVyLnRpbWVXYXJwID0gMTsgLy8gc3BlZWQgdGhlIHNvbmcgaXMgcGxheWVkIGJhY2tcbiAgICAgICAgTUlESS5QbGF5ZXIubG9hZEZpbGUodXJpLFxuICAgICAgICAgICAgKCkgPT4gdGhpcy5vbkxvYWRlZCgpLFxuICAgICAgICAgICAgKCkgPT4gdGhpcy5vblByb2dyZXNzKCksXG4gICAgICAgICAgICAoZXJyKSA9PiB0aGlzLm9uRXJyb3IoZXJyKSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHBhdXNlIHBsYXlpbmcgbWlkaSBmaWxlXG4gICAgICovXG4gICAgcGF1c2UoKSB7XG4gICAgICAgIHRoaXMucGxheWVyU3RhdGUgPSAncGF1c2VkJztcbiAgICAgICAgTUlESS5QbGF5ZXIucGF1c2UoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogcmVzdW1lIHBsYXlpbmcgbWlkaSBmaWxlXG4gICAgICovXG4gICAgcmVzdW1lKCkge1xuICAgICAgICB0aGlzLnBsYXllclN0YXRlID0gJ3BsYXlpbmcnO1xuICAgICAgICBNSURJLlBsYXllci5yZXN1bWUoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogY2hlY2sgaWYgaW5zdHJ1bWVudCBpcyBsb2FkZWRcbiAgICAgKiBAcGFyYW0gaW5zdHJ1bWVudFxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGlzSW5zdHJ1bWVudExvYWRlZChpbnN0cnVtZW50KSB7XG4gICAgICAgIGlmICh0aGlzLl9pbnN0cnVtZW50c0xvYWRlZC5pbmRleE9mKGluc3RydW1lbnQpICE9PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogbG9hZCBpbnN0cnVtZW50XG4gICAgICogQHBhcmFtIGluc3RydW1lbnRcbiAgICAgKi9cbiAgICBsb2FkSW5zdHJ1bWVudChpbnN0cnVtZW50LCBwYXRoKSB7XG4gICAgICAgIE1JREkubG9hZFBsdWdpbih7XG4gICAgICAgICAgICBzb3VuZGZvbnRVcmw6IHBhdGgsXG4gICAgICAgICAgICBpbnN0cnVtZW50OiBpbnN0cnVtZW50LFxuICAgICAgICAgICAgb25wcm9ncmVzczogKHN0YXRlLCBwcm9ncmVzcywgaW5zdHJ1bWVudCkgPT4gdGhpcy5vbkluc3RydW1lbnRMb2FkUHJvZ3Jlc3Moc3RhdGUsIHByb2dyZXNzLCBpbnN0cnVtZW50KSxcbiAgICAgICAgICAgIG9uc3VjY2VzczogKGV2ZW50KSA9PiB0aGlzLm9uSW5zdHJ1bWVudExvYWRlZChldmVudCksXG4gICAgICAgICAgICBvbmVycm9yOiAoZXJyKSA9PiB0aGlzLm9uSW5zdHJ1bWVudExvYWRlZEVycm9yKGVyciksXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBwbGF5IGEgdG9uZVxuICAgICAqIEBwYXJhbSBpbnN0cnVtZW50XG4gICAgICogQHBhcmFtIG5vdGF0aW9uXG4gICAgICogQHBhcmFtIGR1cmF0aW9uXG4gICAgICovXG4gICAgcGxheVRvbmUoaW5zdHJ1bWVudCwgbm90YXRpb24sIG1pZGljaGFubmVsLCBkdXJhdGlvbikge1xuICAgICAgICBpZiAoIXRoaXMuaXNJbnN0cnVtZW50TG9hZGVkKGluc3RydW1lbnQpKSB7IHJldHVybjsgfVxuXG4gICAgICAgIE1JREkucHJvZ3JhbUNoYW5nZSgwLCBNSURJLkdNLmJ5TmFtZVtpbnN0cnVtZW50XS5udW1iZXIpO1xuICAgICAgICB2YXIgZGVsYXkgPSAwOyAvLyBwbGF5IG9uZSBub3RlIGV2ZXJ5IHF1YXJ0ZXIgc2Vjb25kXG4gICAgICAgIHZhciBub3RlID0gTm90ZS5ub3RhdGlvblRvTUlESShub3RhdGlvbik7IC8vIHRoZSBNSURJIG5vdGVcbiAgICAgICAgdmFyIHZlbG9jaXR5ID0gMTI3OyAvLyBob3cgaGFyZCB0aGUgbm90ZSBoaXRzXG4gICAgICAgIC8vIHBsYXkgdGhlIG5vdGVcbiAgICAgICAgTUlESS5zZXRWb2x1bWUoMCwgMTI3KTtcbiAgICAgICAgTUlESS5ub3RlT24oMCwgbm90ZSwgdmVsb2NpdHksIGRlbGF5KTtcblxuICAgICAgICBpZiAoZHVyYXRpb24pIHtcbiAgICAgICAgICAgIE1JREkubm90ZU9mZigwLCBub3RlLCBkZWxheSArIGR1cmF0aW9uKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBub3RlIG9uXG4gICAgICogQHBhcmFtIGluc3RydW1lbnRcbiAgICAgKiBAcGFyYW0gbm90YXRpb25cbiAgICAgKiBAcGFyYW0gbWlkaWNoYW5uZWxcbiAgICAgKi9cbiAgICBub3RlT24oaW5zdHJ1bWVudCwgbm90YXRpb24sIG1pZGljaGFubmVsLCBkdXJhdGlvbikge1xuICAgICAgICBpZiAoIXRoaXMuaXNJbnN0cnVtZW50TG9hZGVkKGluc3RydW1lbnQpKSB7IHJldHVybjsgfVxuICAgICAgICB2YXIgbm90ZSA9IE5vdGUubm90YXRpb25Ub01JREkobm90YXRpb24pO1xuICAgICAgICBNSURJLnByb2dyYW1DaGFuZ2UobWlkaWNoYW5uZWwsIE1JREkuR00uYnlOYW1lW2luc3RydW1lbnRdLm51bWJlcik7XG4gICAgICAgIHZhciB2ZWxvY2l0eSA9IDEyNzsgLy8gaG93IGhhcmQgdGhlIG5vdGUgaGl0c1xuICAgICAgICBNSURJLnNldFZvbHVtZSgwLCAxMjcpO1xuICAgICAgICBNSURJLm5vdGVPbihtaWRpY2hhbm5lbCwgbm90ZSwgdmVsb2NpdHksIDApO1xuXG4gICAgICAgIGlmIChkdXJhdGlvbikge1xuICAgICAgICAgICAgTUlESS5ub3RlT2ZmKG1pZGljaGFubmVsLCBub3RlLCBkdXJhdGlvbik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogbm90ZSBvZmZcbiAgICAgKiBAcGFyYW0gbm90YXRpb25cbiAgICAgKiBAcGFyYW0gbWlkaWNoYW5uZWxcbiAgICAgKiBAcGFyYW0gZGVsYXlcbiAgICAgKi9cbiAgICBub3RlT2ZmKG5vdGF0aW9uLCBtaWRpY2hhbm5lbCwgZGVsYXkpIHtcbiAgICAgICAgaWYgKCFkZWxheSkgeyBkZWxheSA9IDA7IH1cbiAgICAgICAgdmFyIG5vdGUgPSBOb3RlLm5vdGF0aW9uVG9NSURJKG5vdGF0aW9uKTtcbiAgICAgICAgTUlESS5ub3RlT2ZmKG1pZGljaGFubmVsLCBub3RlLCBkZWxheSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGFkZCBldmVudCBsaXN0ZW5lclxuICAgICAqIEBwYXJhbSBldmVudHR5cGVcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICAgKi9cbiAgICBhZGRFdmVudExpc3RlbmVyKGV2ZW50dHlwZSwgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKCF0aGlzLl9saXN0ZW5lcnMpIHsgdGhpcy5fbGlzdGVuZXJzID0gW107IH1cbiAgICAgICAgdGhpcy5fbGlzdGVuZXJzLnB1c2goIHsgdHlwZTogZXZlbnR0eXBlLCBjYWxsYmFjazogY2FsbGJhY2sgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIG9uIGluc3RydW1lbnQgbG9hZGVkXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICovXG4gICAgb25JbnN0cnVtZW50TG9hZGVkKCkge30sXG5cbiAgICAvKipcbiAgICAgKiBvbiBpbnN0cnVtZW50IGxvYWQgcHJvZ3Jlc3NcbiAgICAgKiBAcGFyYW0gc3RhdGVcbiAgICAgKiBAcGFyYW0gcHJvZ3Jlc3NcbiAgICAgKiBAcGFyYW0gaW5zdHJ1bWVudFxuICAgICAqL1xuICAgIG9uSW5zdHJ1bWVudExvYWRQcm9ncmVzcyhzdGF0ZSwgcHJvZ3Jlc3MsIGluc3RydW1lbnQpIHtcbiAgICAgICAgaWYgKGluc3RydW1lbnQgJiYgcHJvZ3Jlc3MgPT09IDEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGluc3RydW1lbnQgKyAnIGxvYWRlZCcpO1xuICAgICAgICAgICAgdGhpcy5faW5zdHJ1bWVudHNMb2FkZWQucHVzaChpbnN0cnVtZW50KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBvbiBpbnN0cnVtZW50IGxvYWRlZCBlcnJvclxuICAgICAqIEBwYXJhbSBlcnJcbiAgICAgKi9cbiAgICBvbkluc3RydW1lbnRMb2FkZWRFcnJvcihlcnIpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0luc3RydW1lbnQgbG9hZGluZyBlcnJvcicsIGVycik7XG4gICAgfSxcblxuICAgIG9uTG9hZGVkKCkge1xuICAgICAgICBNSURJLnByb2dyYW1DaGFuZ2UoMCwgTUlESS5HTS5ieU5hbWVbdGhpcy5QSUFOT10ubnVtYmVyKTtcbiAgICAgICAgTUlESS5QbGF5ZXIuc3RhcnQoKTtcbiAgICAgICAgdGhpcy5wbGF5ZXJTdGF0ZSA9ICdwbGF5aW5nJztcbiAgICAgICAgdGhpcy5pc1BsYXlpbmcgPSB0cnVlO1xuICAgICAgICBNSURJLlBsYXllci5hZGRMaXN0ZW5lcihkYXRhID0+IHRoaXMub25NSURJRGF0YShkYXRhKSk7XG4gICAgfSxcblxuICAgIG9uUHJvZ3Jlc3MoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdwcm9ncmVzcycpO1xuICAgIH0sXG5cbiAgICBvbkVycm9yKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZygnZXJyb3InLCBlcnIpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBvbiBtaWRpIGRhdGEgY2FsbGJhY2tcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqL1xuICAgIG9uTUlESURhdGEoZGF0YSkge1xuICAgICAgICBpZiAodGhpcy5fbGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IHRoaXMuX2xpc3RlbmVycy5sZW5ndGg7IGMrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9saXN0ZW5lcnNbY10udHlwZSA9PT0gJ21pZGlkYXRhJykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzW2NdLmNhbGxiYWNrLmFwcGx5KHRoaXMsIFt7IG5vdGU6IGRhdGEubm90ZSAtIDIxLCB2ZWxvY2l0eTogZGF0YS52ZWxvY2l0eSB9XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCBOb3RlIGZyb20gJy4vbXVzaWN0aGVvcnkvbm90ZS5lczYnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgLyoqXG4gICAgICogYXBwbHkgbiBudW1iZXIgb2YgcHJvcGVydGllcyB0byBhbiBvYmplY3RcbiAgICAgKiBAcGFyYW0gb2JqZWN0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IHByb3BzXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZSBvZiBwcm9wZXJ0eSAocHJlcGVuZCBrZXkgbmFtZSlcbiAgICAgKi9cbiAgICBjb3B5UHJvcHNUbyhvYmplY3QsIHByb3BzLCBuYW1lc3BhY2UpIHtcbiAgICAgICAgaWYgKCFuYW1lc3BhY2UpIHsgbmFtZXNwYWNlID0gJyc7IH1cbiAgICAgICAgZm9yICh2YXIgYyBpbiBwcm9wcykge1xuICAgICAgICAgICAgb2JqZWN0W2MgKyBuYW1lc3BhY2VdID0gcHJvcHNbY107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogdHVybiBkZWNpbWFsIGNvbG9yIHRvIFJHQlxuICAgICAqIEBwYXJhbSBkZWNcbiAgICAgKiBAcGFyYW0gbWF4XG4gICAgICogQHJldHVybnMge3tyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyfX1cbiAgICAgKi9cbiAgICBkZWNUb1JHQihkZWMsIG1heCkge1xuICAgICAgICBpZiAoIW1heCkgeyBtYXggPSAyNTU7IH1cbiAgICAgICAgbWF4ICs9IDE7IC8vIGFpZHMgd2l0aCByb3VuZGluZ1xuICAgICAgICB2YXIgciA9IE1hdGguZmxvb3IoZGVjIC8gKDI1NioyNTYpKTtcbiAgICAgICAgdmFyIGcgPSBNYXRoLmZsb29yKGRlYyAvIDI1NikgJSAyNTY7XG4gICAgICAgIHZhciBiID0gZGVjICUgMjU2O1xuICAgICAgICByZXR1cm4geyByOiByLzI1NSAqIG1heCwgZzogZy8yNTUgKiBtYXgsIGI6IGIvMjU1ICogbWF4IH07XG4gICAgfSxcblxuICAgIFJHQlRvRGVjKHJnYikge1xuICAgICAgICByZXR1cm4gcmdiLnIgPDwgMTYgKyByZ2IuZyA8PCAxNiArIHJnYi5iO1xuICAgIH1cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlR3JvdXAge1xuICAgIGNvbnN0cnVjdG9yKHBhcmFtcykge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBwYXJlbnQgZ3JvdXAgb2YgY2hpbGQgb2JqZWN0cyB3ZSB3aWxsIGNyZWF0ZVxuICAgICAgICAgKiBAdHlwZSB7VEhSRUUuT2JqZWN0M0R9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9ncm91cCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuXG4gICAgICAgIGlmIChwYXJhbXMgJiYgcGFyYW1zLmFzc2V0cykge1xuICAgICAgICAgICAgLy8gdG9kbzogZGV0ZXJtaW5lIHdoZW4gdG8gdXNlIEpTT04gTG9hZGVyLCBPQkogbG9hZGVyLCBvciB3aGF0ZXZlclxuICAgICAgICAgICAgdmFyIGxvYWRlciA9IG5ldyBUSFJFRS5KU09OTG9hZGVyKCk7XG4gICAgICAgICAgICBsb2FkZXIubG9hZChwYXJhbXMuYXNzZXRzLCAoZ2VvbWV0cnksIG1hdGVyaWFscykgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMub25Bc3NldHNMb2FkZWQoZ2VvbWV0cnksIG1hdGVyaWFscyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub25Jbml0aWFsaXplKHBhcmFtcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZ2V0IG5hbWUgb2YgZ3JvdXBcbiAgICAgKi9cbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IubmFtZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvdmVycmlkYWJsZSBtZXRob2RzXG4gICAgICogbGVhdmUgZW1wdHkgdG8gYmUgYSBzaW1wbGUgYWJzdHJhY3Rpb24gd2UgZG9uJ3QgaGF2ZSB0byBjYWxsIHN1cGVyIG9uXG4gICAgICogQHBhcmFtIHNjZW5lXG4gICAgICogQHBhcmFtIGN1c3RvbVxuICAgICAqL1xuICAgIG9uQ3JlYXRlKHNjZW5lLCBjdXN0b20pIHt9O1xuICAgIG9uUmVuZGVyKHNjZW5lLCBjdXN0b20pIHt9O1xuICAgIG9uSW5pdGlhbGl6ZShwYXJhbXMpIHt9O1xuICAgIG9uQXNzZXRzTG9hZGVkKGdlb21ldHJ5LCBtYXRlcmlhbCkge307XG5cbiAgICAvKipcbiAgICAgKiBvbiBjcmVhdGUgc2NlbmUgKG9yIGVhcmxpZXN0IHBvc3NpYmxlIG9wcG9ydHVuaXR5KVxuICAgICAqIEBwYXJhbSBzY2VuZVxuICAgICAqIEBwYXJhbSBjdXN0b21cbiAgICAgKi9cbiAgICBjcmVhdGUoc2NlbmUsIGN1c3RvbSkge1xuICAgICAgICB0aGlzLl9ncm91cC5uYW1lID0gdGhpcy5uYW1lO1xuICAgICAgICBzY2VuZS5zY2VuZS5hZGQodGhpcy5fZ3JvdXApO1xuICAgICAgICB0aGlzLm9uQ3JlYXRlKHNjZW5lLCBjdXN0b20pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFkZCBvYmplY3QgdG8gc2NlbmVcbiAgICAgKiBAcGFyYW0gb2JqZWN0XG4gICAgICovXG4gICAgYWRkKG9iamVjdCwgbmFtZSkge1xuICAgICAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgICAgIG5hbWUgPSB0aGlzLm5hbWUgKyAnLWNoaWxkJztcbiAgICAgICAgfVxuICAgICAgICBvYmplY3QubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuX2dyb3VwLmFkZChvYmplY3QpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdldCBwYXJlbnQgZ3JvdXAgb2JqZWN0XG4gICAgICogQHJldHVybnMge1RIUkVFLk9iamVjdDNEfVxuICAgICAqL1xuICAgIGdldCBncm91cCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dyb3VwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdldCBjaGlsZHJlbiBvZiB0aGlzIGdyb3VwXG4gICAgICogQHJldHVybnMge0FycmF5fVxuICAgICAqL1xuICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dyb3VwLmNoaWxkcmVuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG9uIHByZXJlbmRlciBzY2VuZVxuICAgICAqIEBwYXJhbSBzY2VuZVxuICAgICAqIEBwYXJhbSBjdXN0b21cbiAgICAgKi9cbiAgICBwcmVSZW5kZXIoc2NlbmUsIGN1c3RvbSkge31cblxuICAgIC8qKlxuICAgICAqIG9uIHJlbmRlciBzY2VuZVxuICAgICAqIEBwYXJhbSBzY2VuZVxuICAgICAqIEBwYXJhbSBjdXN0b21cbiAgICAgKi9cbiAgICByZW5kZXIoc2NlbmUsIGN1c3RvbSkge1xuICAgICAgICB0aGlzLm9uUmVuZGVyKHNjZW5lLCBjdXN0b20pO1xuICAgIH1cbn0iXX0=