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

var _floatingparticles = require('./objects/floatingparticles.es6');

var _floatingparticles2 = _interopRequireDefault(_floatingparticles);

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
                this._metronome.setHitColor(_style2.default.colorwheelHighSaturation[_note2.default.indexOfNotation(event.predictedKey[0].key)]);
                this._particles.setColor(_style2.default.colorwheelHighSaturation[_note2.default.indexOfNotation(event.predictedKey[0].key)]);
                //this._swarm.setColor(Style.colorwheel[Note.indexOfNotation(event.predictedKey[0].key)]);
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
            //this._swarm = new ParticleSwarm();
            this._particles = new _floatingparticles2.default();

            this._scene.addObjects([this._metronome, this._particles,
            //this._swarm,
            new _dome2.default(), this._keyboard, this._hudKeyboard, new _lighting2.default()]);

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

},{"./input.es6":2,"./musictheory/note.es6":5,"./objects/dome.es6":6,"./objects/floatingparticles.es6":7,"./objects/keyboards/circularkeyboard.es6":9,"./objects/keyboards/traditionalkeyboard.es6":10,"./objects/lighting.es6":11,"./objects/metronome.es6":12,"./objects/particleflock.es6":13,"./themeing/style.es6":17,"./toneplayback.es6":18}],2:[function(require,module,exports){
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

},{"./midikeymanager.es6":3,"./musictheory/keysignatureprediction.es6":4,"./qwertykeymanager.es6":14}],3:[function(require,module,exports){
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
            octave = Math.floor((key + 3) / _note2.default.sharpNotations.length);
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
            octave = Math.floor((key + 3) / _note2.default.sharpNotations.length);
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
            if (notation.length === 3) {
                note.notation = notation.charAt(0) + notation.charAt(1);
            } else {
                note.notation = notation.charAt(0);
            }
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

},{"../../node_modules/trivr/src/basegroup.es6":20,"../themeing/style.es6":17,"../toneplayback.es6":18}],7:[function(require,module,exports){
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FloatingParticles = function (_BaseGroup) {
    _inherits(FloatingParticles, _BaseGroup);

    function FloatingParticles() {
        _classCallCheck(this, FloatingParticles);

        return _possibleConstructorReturn(this, (FloatingParticles.__proto__ || Object.getPrototypeOf(FloatingParticles)).apply(this, arguments));
    }

    _createClass(FloatingParticles, [{
        key: 'onCreate',

        /**
         * on create scene
         * @param scene
         * @param custom
         */
        value: function onCreate(scene, custom) {
            var geometry = new THREE.Geometry();
            var textureLoader = new THREE.TextureLoader();
            var sprite = textureLoader.load(_style2.default.floatingparticles.sprite);

            for (var i = 0; i < 10000; i++) {
                var vertex = new THREE.Vector3();
                vertex.x = Math.random() * 2000 - 1000;
                vertex.y = Math.random() * 2000 - 1000;
                vertex.z = Math.random() * 2000 - 1000;
                geometry.vertices.push(vertex);
            }

            this.materials = [];
            for (var i = 0; i < 4; i++) {
                this.materials[i] = new THREE.PointsMaterial({
                    size: Math.random() * 2.0 + .75,
                    map: sprite,
                    blending: THREE.AdditiveBlending,
                    depthTest: false,
                    transparent: true });
                var particles = new THREE.Points(geometry, this.materials[i]);

                particles.rotation.x = Math.random() * 6;
                particles.rotation.y = Math.random() * 6;
                particles.rotation.z = Math.random() * 6;
                this.add(particles);
            }

            this.setColor();
        }

        /**
         * set drum hit/trigger color
         * @param hex
         */

    }, {
        key: 'setColor',
        value: function setColor(hex) {
            if (!hex) {
                this._color = _style2.default.floatingparticles.color;
            } else {
                this._color = hex;
            }

            for (var c = 0; c < this.materials.length; c++) {
                this.materials[c].color.set(this._color);
            }
        }
    }, {
        key: 'onRender',
        value: function onRender(time) {
            for (var i = 0; i < this.children.length; i++) {
                var object = this.children[i];
                if (object instanceof THREE.Points) {
                    object.rotation.y += .001;
                    object.rotation.z += .001;
                }
            }
        }
    }]);

    return FloatingParticles;
}(_basegroup2.default);

exports.default = FloatingParticles;

},{"../../node_modules/trivr/src/basegroup.es6":20,"../themeing/style.es6":17,"../utils.es6":19}],8:[function(require,module,exports){
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
             * ending note on keyboard
             * @type {string}
             * @private
             */
            this._endingNote = 'C';

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
            var endOffset = _note2.default.indexOfNotation(this._endingNote);
            var ntindex = 0;
            var octave = 0;
            var transformPosition = 0;
            var notes = [];
            for (var c = 0; c < this._numOctaves; c++) {
                notes = notes.concat(_note2.default.sharpNotations);
            }
            notes = notes.concat(_note2.default.sharpNotations.slice(0, endOffset + 1));

            for (var d = 0; d < notes.length; d++) {
                if (d >= startOffset) {
                    transformPosition = this.addKey(transformPosition, notes[d].indexOf('#') === -1, notes[d], octave, geometry, material);
                }
                ntindex++;
                if (ntindex >= _note2.default.sharpNotations.length) {
                    ntindex = 0;
                    octave++;
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
                    _toneplayback2.default.noteOff(k.notation + k.octave, key.midichannel, 1 / 8);
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
                    _toneplayback2.default.noteOn(_toneplayback2.default.PIANO, k.notation + k.octave, midichannel);
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
            var ntIndex = _note2.default.keys[keysignotation].indexOf(notation); // Note.indexOfNotation(keysignotation);
            var keySigIndex = _note2.default.indexOfNotation(keysignotation);
            var rootclrHS = _style2.default.colorwheelHighSaturation[keySigIndex];
            var rootclrLS = _style2.default.colorwheelLowSaturation[keySigIndex];

            var keys = this.findKeyObjectsForNotation(notation);
            for (var c = 0; c < keys.length; c++) {
                if (toggle) {
                    var clr;
                    if (ntIndex === 0 || ntIndex === 2 || ntIndex === 4 || ntIndex === 6) {
                        clr = _style2.default.keys.stronglySuggested[keys[c].type];
                        keys[c].suggested = 'stronglySuggested';
                        keys[c].object.material.color.setHex(rootclrHS);
                    } else {
                        clr = _style2.default.keys.suggested[keys[c].type];
                        keys[c].suggested = 'suggested';
                        keys[c].object.material.color.setHex(rootclrLS);
                    }
                } else {
                    keys[c].object.material.color.setHex(_style2.default.keys.normal[keys[c].type].color);
                    //keys[c].object.material.emissive.setHex(Style.keys.normal[keys[c].type].emissive);
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
            notationOffset += this._startingOctave * _note2.default.sharpNotations.length;
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

},{"../../../node_modules/trivr/src/basegroup.es6":20,"../../input.es6":2,"../../musictheory/note.es6":5,"../../themeing/style.es6":17,"../../toneplayback.es6":18,"../../utils.es6":19}],9:[function(require,module,exports){
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
            this.group.position.z = -600;
            this.group.scale.set(10, 10, 10);
        }
    }]);

    return CircularKeyboard;
}(_basekeyboard2.default);

exports.default = CircularKeyboard;

},{"../../input.es6":2,"../../musictheory/note.es6":5,"../../themeing/style.es6":17,"../../toneplayback.es6":18,"../../utils.es6":19,"./basekeyboard.es6":8}],10:[function(require,module,exports){
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
            this.group.position.z = -400;
            this.group.position.y = -200;
            this.group.rotation.x = -Math.PI / 2;
            this.group.scale.set(10, 10, 10);
        }
    }]);

    return TraditionalKeyboard;
}(_basekeyboard2.default);

exports.default = TraditionalKeyboard;

},{"../../input.es6":2,"../../musictheory/note.es6":5,"../../themeing/style.es6":17,"../../toneplayback.es6":18,"../../utils.es6":19,"./basekeyboard.es6":8}],11:[function(require,module,exports){
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

},{"../../node_modules/trivr/src/basegroup.es6":20,"../themeing/style.es6":17}],12:[function(require,module,exports){
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
            this.addHammer('up', Math.PI / 32, Math.PI / 2, 'C3');
            //this.addHammer('down', Math.PI/32, 0, 'F3');
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

},{"../../node_modules/trivr/src/basegroup.es6":20,"../themeing/style.es6":17,"../toneplayback.es6":18,"../utils.es6":19,"./../shaders.es6":15}],13:[function(require,module,exports){
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
            this.WIDTH = 32;

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
                this.flockGPURenderer.positionUniforms.depth.value += 0.5;
            }

            if (!this.immersed && this.flockGPURenderer.positionUniforms.depth.value > this.immersionLevels.min) {
                this.flockGPURenderer.positionUniforms.depth.value -= 0.5;
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
            geometry.scale(0.5, 0.5, 0.5);

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

},{"../../node_modules/trivr/src/basegroup.es6":20,"../shaders.es6":15,"../themeing/style.es6":17,"../utils.es6":19}],14:[function(require,module,exports){
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

},{"./musictheory/note.es6":5}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _colors = require('./colors.es6');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    colorwheelHighSaturation: [0xfffa00, 0xffcf00, 0xffa600, 0xff7d01, 0xff2000, 0xf42494, 0x8b20bb, 0x0024ba, 0x007ac7, 0x00b2d6, 0x02b801, 0x84ce00],

    colorwheelLowSaturation: [0xbfbd40, 0xbfa840, 0xbf9340, 0xbf7d40, 0xbf5140, 0xc65390, 0x8237a4, 0x2e408a, 0x326f95, 0x368fa1, 0x2e8a2e, 0x749933],

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

},{"./colors.es6":16}],18:[function(require,module,exports){
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

},{"./musictheory/note.es6":5}],19:[function(require,module,exports){
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

},{"./musictheory/note.es6":5}],20:[function(require,module,exports){
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW1wcm92LmVzNiIsInNyYy9pbnB1dC5lczYiLCJzcmMvbWlkaWtleW1hbmFnZXIuZXM2Iiwic3JjL211c2ljdGhlb3J5L2tleXNpZ25hdHVyZXByZWRpY3Rpb24uZXM2Iiwic3JjL211c2ljdGhlb3J5L25vdGUuZXM2Iiwic3JjL29iamVjdHMvZG9tZS5lczYiLCJzcmMvb2JqZWN0cy9mbG9hdGluZ3BhcnRpY2xlcy5lczYiLCJzcmMvb2JqZWN0cy9rZXlib2FyZHMvYmFzZWtleWJvYXJkLmVzNiIsInNyYy9vYmplY3RzL2tleWJvYXJkcy9jaXJjdWxhcmtleWJvYXJkLmVzNiIsInNyYy9vYmplY3RzL2tleWJvYXJkcy90cmFkaXRpb25hbGtleWJvYXJkLmVzNiIsInNyYy9vYmplY3RzL2xpZ2h0aW5nLmVzNiIsInNyYy9vYmplY3RzL21ldHJvbm9tZS5lczYiLCJzcmMvb2JqZWN0cy9wYXJ0aWNsZWZsb2NrLmVzNiIsInNyYy9xd2VydHlrZXltYW5hZ2VyLmVzNiIsInNyYy9zaGFkZXJzLmVzNiIsInNyYy90aGVtZWluZy9jb2xvcnMuZXM2Iiwic3JjL3RoZW1laW5nL3N0eWxlLmVzNiIsInNyYy90b25lcGxheWJhY2suZXM2Iiwic3JjL3V0aWxzLmVzNiIsIi4uL3RyaXZyL3NyYy9iYXNlZ3JvdXAuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztJQUVxQixNO0FBQ2pCLG9CQUFZLEtBQVosRUFBbUIsU0FBbkIsRUFBOEI7QUFBQTs7QUFBQTs7QUFDMUI7Ozs7QUFJQSxhQUFLLG1CQUFMLEdBQTJCLElBQTNCOztBQUVBOzs7OztBQUtBLGFBQUssZ0JBQUwsR0FBd0IsSUFBeEI7O0FB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Ozs7K0JBS08sSyxFQUFPLE0sRUFBUTtBQUNsQixpQkFBSyxRQUFMLENBQWMsS0FBZCxFQUFxQixNQUFyQjtBQUNIOzs7NEJBcEVVO0FBQ1AsbUJBQU8sS0FBSyxXQUFMLENBQWlCLElBQXhCO0FBQ0g7Ozs0QkF3Q1c7QUFDUixtQkFBTyxLQUFLLE1BQVo7QUFDSDs7QUFFRDs7Ozs7Ozs0QkFJZTtBQUNYLG1CQUFPLEtBQUssTUFBTCxDQUFZLFFBQW5CO0FBQ0g7Ozs7OztrQkE1RWdCLFMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IE1ldHJvbm9tZSBmcm9tICcuL29iamVjdHMvbWV0cm9ub21lLmVzNic7XG5pbXBvcnQgQ2lyY3VsYXJLZXlib2FyZCBmcm9tICcuL29iamVjdHMva2V5Ym9hcmRzL2NpcmN1bGFya2V5Ym9hcmQuZXM2JztcbmltcG9ydCBUcmFkaXRpb25hbEtleWJvYXJkIGZyb20gJy4vb2JqZWN0cy9rZXlib2FyZHMvdHJhZGl0aW9uYWxrZXlib2FyZC5lczYnO1xuaW1wb3J0IERvbWUgZnJvbSAnLi9vYmplY3RzL2RvbWUuZXM2JztcbmltcG9ydCBQYXJ0aWNsZVN3YXJtIGZyb20gJy4vb2JqZWN0cy9wYXJ0aWNsZWZsb2NrLmVzNic7XG5pbXBvcnQgUGFydGljbGVzRmxvYXRpbmcgZnJvbSAnLi9vYmplY3RzL2Zsb2F0aW5ncGFydGljbGVzLmVzNic7XG5pbXBvcnQgTGlnaHRpbmcgZnJvbSAnLi9vYmplY3RzL2xpZ2h0aW5nLmVzNic7XG5pbXBvcnQgVG9uZVBsYXliYWNrIGZyb20gJy4vdG9uZXBsYXliYWNrLmVzNic7XG5pbXBvcnQgSW5wdXQgZnJvbSAnLi9pbnB1dC5lczYnO1xuaW1wb3J0IFN0eWxlIGZyb20gJy4vdGhlbWVpbmcvc3R5bGUuZXM2JztcbmltcG9ydCBOb3RlIGZyb20gJy4vbXVzaWN0aGVvcnkvbm90ZS5lczYnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbXByb3Yge1xuICAgIGNvbnN0cnVjdG9yKHNjZW5lLCBjb25maWdVUkkpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGN1cnJlbnQga2V5IHNpZ25hdHVyZVxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jdXJyZW50S2V5U2lnbmF0dXJlID0gbnVsbDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogaW5hY3Rpdml0eSB0aW1lciBmb3Igc3VnZ2VzdGlvbnNcbiAgICAgICAgICogQHR5cGUge251bGx9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9pbmFjdGl2aXR5VGltZXIgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuX3NjZW5lID0gc2NlbmU7XG4gICAgICAgIHRoaXMuX3JlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgdGhpcy5fcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB0aGlzLm9uQ29uZmlnTG9hZGVkKCk7XG4gICAgICAgIHRoaXMuX3JlcXVlc3Qub3BlbignR0VUJywgY29uZmlnVVJJKTtcbiAgICAgICAgdGhpcy5fcmVxdWVzdC5zZW5kKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb24ga2V5IGNoYW5nZVxuICAgICAqIEBwYXJhbSBrZXlzXG4gICAgICovXG4gICAgb25LZXlJbnB1dENoYW5nZShldmVudCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5faW5hY3Rpdml0eVRpbWVyKTtcbiAgICAgICAgdGhpcy5faW5hY3Rpdml0eVRpbWVyID0gc2V0VGltZW91dCggKCkgPT4gdGhpcy5vbkluYWN0aXZpdHlUaW1lb3V0KCksIDUwMDApO1xuXG4gICAgICAgIHRoaXMuX2tleWJvYXJkLnRvZ2dsZUtleVByZXNzZWQoe1xuICAgICAgICAgICAgbm90YXRpb246IGV2ZW50LmNoYW5nZWQubm90YXRpb24sXG4gICAgICAgICAgICBvY3RhdmU6IGV2ZW50LmNoYW5nZWQub2N0YXZlLFxuICAgICAgICAgICAgdmVsb2NpdHk6IGV2ZW50LmNoYW5nZWQudmVsb2NpdHkgfSk7XG5cbiAgICAgICAgaWYgKGV2ZW50LnByZWRpY3RlZEtleS5sZW5ndGggPiAwICYmIHRoaXMuY3VycmVudEtleVNpZ25hdHVyZSAhPT0gZXZlbnQucHJlZGljdGVkS2V5WzBdLmtleSkge1xuICAgICAgICAgICAgdGhpcy5fa2V5Ym9hcmQuY2hhbmdlS2V5U2lnbmF0dXJlKGV2ZW50LnByZWRpY3RlZEtleVswXS5rZXkpO1xuICAgICAgICAgICAgdGhpcy5faHVkS2V5Ym9hcmQuY2hhbmdlS2V5U2lnbmF0dXJlKGV2ZW50LnByZWRpY3RlZEtleVswXS5rZXkpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50S2V5U2lnbmF0dXJlID0gZXZlbnQucHJlZGljdGVkS2V5WzBdLmtleTtcbiAgICAgICAgICAgIHRoaXMuX21ldHJvbm9tZS5zZXRIaXRDb2xvcihTdHlsZS5jb2xvcndoZWVsSGlnaFNhdHVyYXRpb25bTm90ZS5pbmRleE9mTm90YXRpb24oZXZlbnQucHJlZGljdGVkS2V5WzBdLmtleSldKTtcbiAgICAgICAgICAgIHRoaXMuX3BhcnRpY2xlcy5zZXRDb2xvcihTdHlsZS5jb2xvcndoZWVsSGlnaFNhdHVyYXRpb25bTm90ZS5pbmRleE9mTm90YXRpb24oZXZlbnQucHJlZGljdGVkS2V5WzBdLmtleSldKTtcbiAgICAgICAgICAgIC8vdGhpcy5fc3dhcm0uc2V0Q29sb3IoU3R5bGUuY29sb3J3aGVlbFtOb3RlLmluZGV4T2ZOb3RhdGlvbihldmVudC5wcmVkaWN0ZWRLZXlbMF0ua2V5KV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy90aGlzLl9rZXlib2FyZC50b2dnbGVLZXlQcmVzc2VkKGtleVtvY3RhdmVdLCBldmVudC5jaGFuZ2VkLnZlbG9jaXR5KTtcbiAgICAgICAgIC8qdmFyIGtleSA9IHRoaXMuZmluZEtleU9iamVjdHNGb3JOb3RhdGlvbihldmVudC5jaGFuZ2VkLm5vdGF0aW9uKTtcbiAgICAgICAgIHZhciBvY3RhdmU7XG4gICAgICAgICBpZiAoZXZlbnQuY2hhbmdlZC5vY3RhdmUgLyAyID09PSBNYXRoLmZsb29yKGV2ZW50LmNoYW5nZWQub2N0YXZlIC8gMikpIHtcbiAgICAgICAgICAgIG9jdGF2ZSA9IDE7XG4gICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb2N0YXZlID0gMDtcbiAgICAgICAgIH1cblxuICAgICAgICAgdGhpcy50b2dnbGVLZXlQcmVzc2VkKGtleVtvY3RhdmVdLCBldmVudC5jaGFuZ2VkLnZlbG9jaXR5KTtcblxuICAgICAgICAgaWYgKGV2ZW50LnByZWRpY3RlZEtleS5sZW5ndGggPiAwICYmIGV2ZW50LnByZWRpY3RlZEtleVswXSAhPT0gdGhpcy5jdXJyZW50S2V5U2lnbmF0dXJlKSB7XG4gICAgICAgICAgICB0aGlzLm9uS2V5U2lnbmF0dXJlQ2hhbmdlKGV2ZW50LnByZWRpY3RlZEtleVswXS5rZXkpO1xuICAgICAgICAgfSovXG4gICAgIH1cblxuICAgIC8qKlxuICAgICAqIGluYWN0aXZpdHkgdGltZW91dFxuICAgICAqL1xuICAgIG9uSW5hY3Rpdml0eVRpbWVvdXQoKSB7XG4gICAgICAgIHRoaXMuX2tleWJvYXJkLnJlc2V0S2V5cygpO1xuICAgICAgICB0aGlzLl9odWRLZXlib2FyZC5yZXNldEtleXMoKTtcbiAgICAgICAgdGhpcy5faW5wdXQuY2xlYXJQcmVkaWN0aW9uSGlzdG9yeSgpO1xuICAgICAgICB0aGlzLl9tZXRyb25vbWUuc2V0SGl0Q29sb3IoKTtcbiAgICAgICAgdGhpcy5fcGFydGljbGVzLnNldENvbG9yKCk7XG4gICAgIH1cblxuICAgIC8qKlxuICAgICAqIG9uIGNvbmZpZyBsb2FkZWRcbiAgICAgKi9cbiAgICBvbkNvbmZpZ0xvYWRlZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3JlcXVlc3QucmVhZHlTdGF0ZSA9PT0gWE1MSHR0cFJlcXVlc3QuRE9ORSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3JlcXVlc3Quc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICB2YXIgY29uZmlnID0gSlNPTi5wYXJzZSh0aGlzLl9yZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXR1cChjb25maWcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnVGhlcmUgd2FzIGEgcHJvYmxlbSB3aXRoIHRoZSByZXF1ZXN0LicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHNldHVwIGFwcFxuICAgICAqIEBwYXJhbSBjb25maWdcbiAgICAgKiBAcGFyYW0gY29uZmlnXG4gICAgICovXG4gICAgc2V0dXAoY29uZmlnKSB7XG4gICAgICAgIHRoaXMuX3NjZW5lLm9uQ3JlYXRlID0gdGhpcy5jcmVhdGU7XG5cbiAgICAgICAgdGhpcy5faW5wdXQgPSBuZXcgSW5wdXQoY29uZmlnLmlucHV0LCAoa2V5cykgPT4gdGhpcy5vbktleUlucHV0Q2hhbmdlKGtleXMpICk7XG4gICAgICAgIHRoaXMuX2tleWJvYXJkID0gbmV3IFRyYWRpdGlvbmFsS2V5Ym9hcmQoY29uZmlnLmtleWJvYXJkKTtcbiAgICAgICAgdGhpcy5faHVkS2V5Ym9hcmQgPSBuZXcgQ2lyY3VsYXJLZXlib2FyZChjb25maWcubm90YXRpb25kaXNwbGF5KTtcbiAgICAgICAgdGhpcy5fbWV0cm9ub21lID0gbmV3IE1ldHJvbm9tZSgpO1xuICAgICAgICAvL3RoaXMuX3N3YXJtID0gbmV3IFBhcnRpY2xlU3dhcm0oKTtcbiAgICAgICAgdGhpcy5fcGFydGljbGVzID0gbmV3IFBhcnRpY2xlc0Zsb2F0aW5nKCk7XG5cbiAgICAgICAgdGhpcy5fc2NlbmUuYWRkT2JqZWN0cyhbXG4gICAgICAgICAgICB0aGlzLl9tZXRyb25vbWUsXG4gICAgICAgICAgICB0aGlzLl9wYXJ0aWNsZXMsXG4gICAgICAgICAgICAvL3RoaXMuX3N3YXJtLFxuICAgICAgICAgICAgbmV3IERvbWUoKSxcbiAgICAgICAgICAgIHRoaXMuX2tleWJvYXJkLFxuICAgICAgICAgICAgdGhpcy5faHVkS2V5Ym9hcmQsXG4gICAgICAgICAgICBuZXcgTGlnaHRpbmcoKSBdKTtcblxuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IGNvbmZpZy5zb3VuZC5zb3VuZGZvbnRzLmxlbmd0aDsgYysrKSB7XG4gICAgICAgICAgICBUb25lUGxheWJhY2subG9hZEluc3RydW1lbnQoY29uZmlnLnNvdW5kLnNvdW5kZm9udHNbY10sIGNvbmZpZy5zb3VuZC5zb3VuZGZvbnRsb2NhdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZXZlbnQgPT4gdGhpcy5vbktleURvd24oZXZlbnQpICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb24ga2V5ZG93blxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqL1xuICAgIG9uS2V5RG93bihldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQuY29kZSA9PT0gJ1NwYWNlJykge1xuICAgICAgICAgICAgc3dpdGNoIChUb25lUGxheWJhY2sucGxheWVyU3RhdGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdyZWFkeSc6IFRvbmVQbGF5YmFjay5wbGF5KCcuL2Fzc2V0cy9hdWRpby9Cb25uaWVfVHlsZXJfLV9Ub3RhbF9FY2xpcHNlX29mX3RoZV9IZWFydC5taWQnKTsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAncGxheWluZyc6IFRvbmVQbGF5YmFjay5wYXVzZSgpOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdwYXVzZWQnOiBUb25lUGxheWJhY2sucmVzdW1lKCk7IGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlKHNjZW5lLCBjdXN0b20pIHtcbiAgICAgICAgc2NlbmUucmVuZGVyZXIuZ2FtbWFJbnB1dCA9IHRydWU7XG4gICAgICAgIHNjZW5lLnJlbmRlcmVyLmdhbW1hT3V0cHV0ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZW5kZXIoc2NlbmUsIGN1c3RvbSkge31cbn1cbiIsImltcG9ydCBRV0VSVFlLZXlNYW5hZ2VyIGZyb20gJy4vcXdlcnR5a2V5bWFuYWdlci5lczYnO1xuaW1wb3J0IE1JRElLZXlNYW5hZ2VyIGZyb20gJy4vbWlkaWtleW1hbmFnZXIuZXM2JztcbmltcG9ydCBLZXlTaWduYXR1cmVQcmVkaWN0aW9uIGZyb20gJy4vbXVzaWN0aGVvcnkva2V5c2lnbmF0dXJlcHJlZGljdGlvbi5lczYnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gICAgY29uc3RydWN0b3IocGFyYW1zLCBjYikge1xuICAgICAgICAvKipcbiAgICAgICAgICoga2V5IG1hbmFnZXJcbiAgICAgICAgICogQHR5cGUgeyRFUzZfQU5PTllNT1VTX0NMQVNTJH1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGlmIChwYXJhbXMuZGV2aWNlID09PSAnUVdFUlRZJykge1xuICAgICAgICAgICAgdGhpcy5fa2V5bWFuYWdlciA9IG5ldyBRV0VSVFlLZXlNYW5hZ2VyKHBhcmFtcywgY2hhbmdlZCA9PiB0aGlzLm9uS2V5Q2hhbmdlKGNoYW5nZWQpKTtcbiAgICAgICAgfSBlbHNlIGlmIChwYXJhbXMuZGV2aWNlID09PSAnTUlESScpIHtcbiAgICAgICAgICAgIHRoaXMuX2tleW1hbmFnZXIgPSBuZXcgTUlESUtleU1hbmFnZXIocGFyYW1zLCBjaGFuZ2VkID0+IHRoaXMub25LZXlDaGFuZ2UoY2hhbmdlZCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGtleSBzaWduYXR1cmUgcHJlZGljdGlvblxuICAgICAgICAgKiBAdHlwZSB7JEVTNl9BTk9OWU1PVVNfQ0xBU1MkfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fa2V5U2lnUHJlZGljdGlvbiA9IG5ldyBLZXlTaWduYXR1cmVQcmVkaWN0aW9uKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGtleSBjaGFuZ2UgY2FsbGJhY2tcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrID0gY2I7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY2xlYXIgcHJlZGljdGlvbiBoaXN0b3J5XG4gICAgICovXG4gICAgY2xlYXJQcmVkaWN0aW9uSGlzdG9yeSgpIHtcbiAgICAgICAgdGhpcy5fa2V5U2lnUHJlZGljdGlvbi5jbGVhckhpc3RvcnkoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvbiBrZXkgY2hhbmdlXG4gICAgICogQHBhcmFtIGNoYW5nZWRcbiAgICAgKi9cbiAgICBvbktleUNoYW5nZShjaGFuZ2VkKSB7XG4gICAgICAgIHZhciBrZCA9IHRoaXMuX2tleW1hbmFnZXIuZ2V0S2V5c0Rvd24oKTtcbiAgICAgICAgdmFyIHByZWRpY3RlZCA9IHRoaXMuX2tleVNpZ1ByZWRpY3Rpb24udXBkYXRlKGtkKTtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2suYXBwbHkodGhpcywgWyB7IGRvd246IGtkLCBwcmVkaWN0ZWRLZXk6IHByZWRpY3RlZCwgY2hhbmdlZDogY2hhbmdlZCB9XSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IE5vdGUgZnJvbSAnLi9tdXNpY3RoZW9yeS9ub3RlLmVzNic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXMsIGNiKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBldmVudCBjYWxsYmFja1xuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fY2FsbGJhY2sgPSBjYjtcblxuICAgICAgICAvKipcbiAgICAgICAgICoga2V5cyBkb3duXG4gICAgICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2tleXMgPSBbXTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTUlESSBrZXkgdG8gbm90YXRpb24gbWFwcGluZyAoY29taW5nIGZyb20gTUlESSwgc28gbm90IGN1c3RvbWl6YWJsZSlcbiAgICAgICAgICogdGhlIHNwbGljZSBoYXBwZW5zIGJlY2F1c2UgMCBpbmRleCBpbiBNSURJIHN0YXJ0cyB3aXRoIENcbiAgICAgICAgICogQHR5cGUge0FycmF5LjxzdHJpbmc+fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fbWFwcGluZyA9IE5vdGUuc2hhcnBOb3RhdGlvbnNcbiAgICAgICAgICAgIC5jb25jYXQoTm90ZS5zaGFycE5vdGF0aW9ucylcbiAgICAgICAgICAgIC5jb25jYXQoTm90ZS5zaGFycE5vdGF0aW9ucylcbiAgICAgICAgICAgIC5jb25jYXQoTm90ZS5zaGFycE5vdGF0aW9ucylcbiAgICAgICAgICAgIC5jb25jYXQoTm90ZS5zaGFycE5vdGF0aW9ucylcbiAgICAgICAgICAgIC5jb25jYXQoTm90ZS5zaGFycE5vdGF0aW9ucylcbiAgICAgICAgICAgIC5jb25jYXQoTm90ZS5zaGFycE5vdGF0aW9ucylcbiAgICAgICAgICAgIC5jb25jYXQoTm90ZS5zaGFycE5vdGF0aW9ucylcbiAgICAgICAgICAgIC5jb25jYXQoTm90ZS5zaGFycE5vdGF0aW9ucylcbiAgICAgICAgICAgIC5jb25jYXQoTm90ZS5zaGFycE5vdGF0aW9ucykuc3BsaWNlKDMsIE5vdGUuc2hhcnBOb3RhdGlvbnMubGVuZ3RoICoxMCk7XG5cbiAgICAgICAgdGhpcy5pbml0aWFsaXplRGV2aWNlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogaW5pdGlhbGl6ZSBtaWRpIGRldmljZVxuICAgICAqL1xuICAgIGluaXRpYWxpemVEZXZpY2UoKSB7XG4gICAgICAgIC8vIHJlcXVlc3QgTUlESSBhY2Nlc3NcbiAgICAgICAgaWYgKG5hdmlnYXRvci5yZXF1ZXN0TUlESUFjY2Vzcykge1xuICAgICAgICAgICAgbmF2aWdhdG9yLnJlcXVlc3RNSURJQWNjZXNzKCkudGhlbihcbiAgICAgICAgICAgICAgICAoZXZlbnQpID0+IHRoaXMub25NSURJU3VjY2VzcyhldmVudCksXG4gICAgICAgICAgICAgICAgKGV2ZW50KSA9PiB0aGlzLm9uTUlESUZhaWx1cmUoZXZlbnQpICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vIE1JREkgc3VwcG9ydCBpbiB5b3VyIGJyb3dzZXIuXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb24gbWlkaSBjb25uZWN0aW9uIHN1Y2Nlc3NcbiAgICAgKiBAcGFyYW0gbWlkaVxuICAgICAqL1xuICAgIG9uTUlESVN1Y2Nlc3MobWlkaSkge1xuICAgICAgICB2YXIgaW5wdXRzID0gbWlkaS5pbnB1dHM7XG4gICAgICAgIGZvciAobGV0IGlucHV0IG9mIGlucHV0cy52YWx1ZXMoKSkge1xuICAgICAgICAgICAgaW5wdXQub25taWRpbWVzc2FnZSA9IG1zZyA9PiB0aGlzLm9uTUlESU1lc3NhZ2UobXNnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG9uIG1pZGkgY29ubmVjdGlvbiBmYWlsdXJlXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICovXG4gICAgb25NSURJRmFpbHVyZShldmVudCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIk5vIGFjY2VzcyB0byBNSURJIGRldmljZXMgb3IgeW91ciBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCBXZWJNSURJIEFQSS4gUGxlYXNlIHVzZSBXZWJNSURJQVBJU2hpbSBcIiArIGV2ZW50KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvbiBtaWRpIG1lc3NhZ2VcbiAgICAgKiBAcGFyYW0gbXNnXG4gICAgICovXG4gICAgb25NSURJTWVzc2FnZShtc2cpIHtcbiAgICAgICAgdmFyIGNtZCA9IG1zZy5kYXRhWzBdID4+IDQ7XG4gICAgICAgIHZhciBjaGFubmVsID0gbXNnLmRhdGFbMF0gJiAweGY7XG4gICAgICAgIHZhciBub3RlTnVtYmVyID0gbXNnLmRhdGFbMV07XG4gICAgICAgIHZhciB2ZWxvY2l0eSA9IDA7XG4gICAgICAgIGlmIChtc2cuZGF0YS5sZW5ndGggPiAyKVxuICAgICAgICAgICAgdmVsb2NpdHkgPSBtc2cuZGF0YVsyXSAvIDEwMDtcblxuICAgICAgICAvLyBNSURJIG5vdGVvbiB3aXRoIHZlbG9jaXR5PTAgaXMgdGhlIHNhbWUgYXMgbm90ZW9mZlxuICAgICAgICBpZiAoIGNtZD09OCB8fCAoKGNtZD09OSkmJih2ZWxvY2l0eT09MCkpICkgeyAvLyBub3Rlb2ZmXG4gICAgICAgICAgICB0aGlzLm9uS2V5VXAobm90ZU51bWJlcik7XG4gICAgICAgIH0gZWxzZSBpZiAoY21kID09IDkpIHsgLy8gbm90ZSBvblxuICAgICAgICAgICAgdGhpcy5vbktleURvd24obm90ZU51bWJlciwgdmVsb2NpdHkpO1xuICAgICAgICB9IC8vZWxzZSBpZiAoY21kID09IDExKSB7IC8vIGNvbnRyb2xsZXIgbWVzc2FnZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdldCBrZXlzIGRvd25cbiAgICAgKi9cbiAgICBnZXRLZXlzRG93bigpIHtcbiAgICAgICAgdmFyIGRvd24gPSBbXTtcbiAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCB0aGlzLl9rZXlzLmxlbmd0aDsgYysrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fa2V5c1tjXSA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgb2N0YXZlID0gMDtcbiAgICAgICAgICAgICAgICBpZiAoYyA+PSB0aGlzLl9rZXlzLmxlbmd0aC8yKSB7IG9jdGF2ZSA9IDE7IH1cbiAgICAgICAgICAgICAgICBkb3duLnB1c2goIHsgbm90YXRpb246IHRoaXMuX21hcHBpbmdbY10sIG9jdGF2ZTogb2N0YXZlLCBpbmRleDogYywgdmVsb2NpdHk6IHRoaXMuX2tleXNbY119ICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRvd247XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb24ga2V5IGRvd25cbiAgICAgKiBAcGFyYW0ga2V5XG4gICAgICogQHBhcmFtIHZlbG9jaXR5XG4gICAgICovXG4gICAgb25LZXlEb3duKGtleSwgdmVsb2NpdHkpIHtcbiAgICAgICAgdGhpcy5fa2V5c1trZXldID0gdmVsb2NpdHk7XG4gICAgICAgIHZhciBvY3RhdmUgPSAwO1xuICAgICAgICBvY3RhdmUgPSBNYXRoLmZsb29yKChrZXkrMykgLyBOb3RlLnNoYXJwTm90YXRpb25zLmxlbmd0aCk7XG4gICAgICAgIHRoaXMuX2NhbGxiYWNrKHtcbiAgICAgICAgICAgIG5vdGF0aW9uOiB0aGlzLl9tYXBwaW5nW2tleV0sXG4gICAgICAgICAgICBvY3RhdmU6IG9jdGF2ZSxcbiAgICAgICAgICAgIGluZGV4OiBrZXksXG4gICAgICAgICAgICB2ZWxvY2l0eTogdmVsb2NpdHksXG4gICAgICAgICAgICBhY3Rpb246ICdwcmVzcycgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb24ga2V5IGRvd25cbiAgICAgKiBAcGFyYW0ga2V5XG4gICAgICovXG4gICAgb25LZXlVcChrZXkpIHtcbiAgICAgICAgdGhpcy5fa2V5c1trZXldID0gMC4wO1xuICAgICAgICB2YXIgb2N0YXZlID0gMDtcbiAgICAgICAgb2N0YXZlID0gTWF0aC5mbG9vcigoa2V5KzMpIC8gTm90ZS5zaGFycE5vdGF0aW9ucy5sZW5ndGgpO1xuICAgICAgICB0aGlzLl9jYWxsYmFjayh7XG4gICAgICAgICAgICBub3RhdGlvbjogdGhpcy5fbWFwcGluZ1trZXldLFxuICAgICAgICAgICAgb2N0YXZlOiBvY3RhdmUsXG4gICAgICAgICAgICBpbmRleDoga2V5LFxuICAgICAgICAgICAgdmVsb2NpdHk6IDAsXG4gICAgICAgICAgICBhY3Rpb246ICdyZWxlYXNlJyB9KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgTm90ZSBmcm9tICcuL25vdGUuZXM2JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvKipcbiAgICAgICAgICoga2V5IHNpZ25hdHVyZSBzY29yZSBoaXN0b3J5XG4gICAgICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2tleVNpZ25hdHVyZVNjb3JlSGlzdG9yeSA9IFtdO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBoaXN0b3J5IGRlY2F5IHJhdGVcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2tleVNpZ25hdHVyZURlY2F5UmF0ZSA9IDAuOTtcblxuICAgICAgICBOb3RlLmdlbmVyYXRlS2V5U2lnbmF0dXJlTG9va3VwKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdXBkYXRlIGtleXMgcHJlc3NlZFxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGtleXNcbiAgICAgKi9cbiAgICB1cGRhdGUoa2V5cykge1xuICAgICAgICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHsgcmV0dXJuIHRoaXMuX2tleVNpZ25hdHVyZVNjb3JlSGlzdG9yeTsgfVxuICAgICAgICB2YXIga2V5c2lnU2NvcmVzID0ge307XG4gICAgICAgIGZvciAodmFyIHNpZyBpbiBOb3RlLmtleXMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGQgPSAwOyBkIDwga2V5cy5sZW5ndGg7IGQrKykge1xuICAgICAgICAgICAgICAgIGlmIChOb3RlLmtleXNbc2lnXS5pbmRleE9mKGtleXNbZF0ubm90YXRpb24pICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWtleXNpZ1Njb3Jlc1tzaWddKSB7IGtleXNpZ1Njb3Jlc1tzaWddID0gMDsgfVxuICAgICAgICAgICAgICAgICAgICBrZXlzaWdTY29yZXNbc2lnXSArKztcblxuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5c1tkXS5ub3RhdGlvbiA9PT0gc2lnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXlzaWdTY29yZXNbc2lnXSArPSAuMDE7IC8vIHNtYWxsIHByaW9yaXR5IGJvb3N0IGZvciByb290IG5vdGVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzY29yZXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgc2NvcmUgaW4ga2V5c2lnU2NvcmVzKSB7XG4gICAgICAgICAgICBzY29yZXMucHVzaCggeyBzY29yZToga2V5c2lnU2NvcmVzW3Njb3JlXSwga2V5OiBzY29yZSwgdGltZXN0YW1wOiBEYXRlLm5vdygpIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kZWNheUhpc3RvcmljYWxTY29yZXMoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwbHlDdXJyZW50U2NvcmVUb0hpc3Rvcnkoc2NvcmVzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjbGVhciBoaXN0b3J5XG4gICAgICovXG4gICAgY2xlYXJIaXN0b3J5KCkge1xuICAgICAgICB0aGlzLl9rZXlTaWduYXR1cmVTY29yZUhpc3RvcnkgPSBbXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzbG93bHkgZGVjYXkgY3VycmVudCBoaXN0b3JpY2FsIHNjb3Jlc1xuICAgICAqL1xuICAgIGRlY2F5SGlzdG9yaWNhbFNjb3JlcygpIHtcbiAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCB0aGlzLl9rZXlTaWduYXR1cmVTY29yZUhpc3RvcnkubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgIHRoaXMuX2tleVNpZ25hdHVyZVNjb3JlSGlzdG9yeVtjXS5zY29yZSAqPSB0aGlzLl9rZXlTaWduYXR1cmVEZWNheVJhdGU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhcHBseSBzY29yZXMgdG8gaGlzdG9yeSAoYWdncmVnYXRlIGFsbCBzY29yZXM6IGN1cnJlbnQgYW5kIHBhc3QpXG4gICAgICogQHBhcmFtIHNjb3Jlc1xuICAgICAqL1xuICAgIGFwcGx5Q3VycmVudFNjb3JlVG9IaXN0b3J5KHNjb3Jlcykge1xuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IHNjb3Jlcy5sZW5ndGg7IGMrKykge1xuICAgICAgICAgICAgdmFyIGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKHZhciBkID0gMDsgZCA8IHRoaXMuX2tleVNpZ25hdHVyZVNjb3JlSGlzdG9yeS5sZW5ndGg7IGQrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9rZXlTaWduYXR1cmVTY29yZUhpc3RvcnlbZF0ua2V5ID09PSBzY29yZXNbY10ua2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fa2V5U2lnbmF0dXJlU2NvcmVIaXN0b3J5W2RdLnNjb3JlICs9IHNjb3Jlc1tjXS5zY29yZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fa2V5U2lnbmF0dXJlU2NvcmVIaXN0b3J5LnB1c2goc2NvcmVzW2NdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fa2V5U2lnbmF0dXJlU2NvcmVIaXN0b3J5LnNvcnQoZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gKGEuc2NvcmUgPCBiLnNjb3JlICkgPyAxIDogKChiLnNjb3JlIDwgYS5zY29yZSkgPyAtMSA6IDApOyB9KTtcbiAgICB9XG59XG4iLCIvKipcbiAqIE5vdGUgc3RhdGljIGNsYXNzXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuICAgIC8qKiBjYWNoZWQga2V5c2lnbmF0dXJlIGxvb2t1cCB0YWJsZSAqL1xuICAgIGtleXM6IHt9LFxuXG4gICAgLyoqXG4gICAgICogaW5jcmVtZW50YWwgdG9uZXMgYXMgc2hhcnAgbm90YXRpb25cbiAgICAgKiBAY29uc3RcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHR5cGUge0FycmF5LjxzdHJpbmc+fVxuICAgICAqKi9cbiAgICBzaGFycE5vdGF0aW9uczogW1wiQVwiLCBcIkEjXCIsIFwiQlwiLCBcIkNcIiwgXCJDI1wiLCBcIkRcIiwgXCJEI1wiLCBcIkVcIiwgXCJGXCIsIFwiRiNcIiwgXCJHXCIsIFwiRyNcIl0sXG5cbiAgICAvKipcbiAgICAgKiBpbmNyZW1lbnRhbCB0b25lcyBhcyBmbGF0IG5vdGF0aW9uXG4gICAgICogQGNvbnN0XG4gICAgICogQHN0YXRpY1xuICAgICAqIEB0eXBlIHtBcnJheS48c3RyaW5nPn1cbiAgICAgKiovXG4gICAgZmxhdE5vdGF0aW9uczogW1wiQVwiLCBcIkJiXCIsIFwiQlwiLCBcIkNcIiwgXCJEYlwiLCBcIkRcIiwgXCJFYlwiLCBcIkVcIiwgXCJGXCIsIFwiR2JcIiwgXCJHXCIsIFwiQWJcIl0sXG5cbiAgICAvKipcbiAgICAgKiBnZXQgbm90YXRpb24gaW5kZXggd2hlbiBub3RhdGlvbiBpcyBlaXRoZXIgZmxhdCBvciBzaGFycFxuICAgICAqIEBwYXJhbSBub3RhdGlvblxuICAgICAqL1xuICAgIGluZGV4T2ZOb3RhdGlvbihub3RhdGlvbikge1xuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnNoYXJwTm90YXRpb25zLmluZGV4T2Yobm90YXRpb24pO1xuICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICBpbmRleCA9IHRoaXMuZmxhdE5vdGF0aW9ucy5pbmRleE9mKG5vdGF0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGdldCBub3RhdGlvbiBnaXZlbiBhbiBpbmRleFxuICAgICAqIEBwYXJhbSBpbmRleFxuICAgICAqL1xuICAgIG5vdGF0aW9uQXRJbmRleChpbmRleCwgcHJlZmVyRmxhdCkge1xuICAgICAgICBpZiAoaW5kZXggPj0gdGhpcy5zaGFycE5vdGF0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGluZGV4ID0gaW5kZXggJSB0aGlzLnNoYXJwTm90YXRpb25zLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcmVmZXJGbGF0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mbGF0Tm90YXRpb25zW2luZGV4XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNoYXJwTm90YXRpb25zW2luZGV4XTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBvZGQgbm90YXRpb25zXG4gICAgICogQGNvbnN0XG4gICAgICogQHN0YXRpY1xuICAgICAqIEB0eXBlIHtBcnJheS48c3RyaW5nPn1cbiAgICAgKiovXG4gICAgIG9kZE5vdGF0aW9uczogW1wiQiNcIiwgXCJDYlwiLCBcIkUjXCIsIFwiRmJcIl0sXG5cbiAgICAvKipcbiAgICAgKiBjb3JyZWN0ZWQgbm90YXRpb25zXG4gICAgICogQGNvbnN0XG4gICAgICogQHN0YXRpY1xuICAgICAqIEB0eXBlIHtBcnJheS48c3RyaW5nPn1cbiAgICAgKiovXG4gICAgIGNvcnJlY3RlZE5vdGF0aW9uczogW1wiQ1wiLCBcIkNcIiwgXCJGXCIsIFwiRlwiXSxcblxuICAgIC8qKlxuICAgICAqIHRyYW5zbGF0ZSBpbmRleCBmcm9tIE1JREkgdG8gbm90YXRpb25cbiAgICAgKiBAcGFyYW0gaW5kZXhcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBNSURJdG9Ob3RhdGlvbihpbmRleCkge1xuICAgICAgICB2YXIgcG9zaXRpb24gPSBpbmRleCAlIHRoaXMuc2hhcnBOb3RhdGlvbnMubGVuZ3RoO1xuICAgICAgICByZXR1cm4gdGhpcy5zaGFycE5vdGF0aW9uc1twb3NpdGlvbl07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHRyYW5zbGF0ZSBub3RhdGlvbiBhbmQgb2N0YXZlIHRvIE1JREkgaW5kZXhcbiAgICAgKiBAcGFyYW0gbm90YXRpb25cbiAgICAgKi9cbiAgICBub3RhdGlvblRvTUlESShub3RhdGlvbikge1xuICAgICAgICB2YXIgbnRPYmogPSB0aGlzLnBhcnNlTm90YXRpb24obm90YXRpb24pO1xuICAgICAgICB2YXIgbnRpbmR4ID0gdGhpcy5zaGFycE5vdGF0aW9ucy5pbmRleE9mKG50T2JqLm5vdGF0aW9uKTtcbiAgICAgICAgaWYgKG50aW5keCA9PT0gLTEpIHtcbiAgICAgICAgICAgIG50aW5keCA9IHRoaXMuZmxhdE5vdGF0aW9ucy5pbmRleE9mKG50T2JqLm5vdGF0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnRPYmoub2N0YXZlICogdGhpcy5zaGFycE5vdGF0aW9ucy5sZW5ndGggKyBudGluZHg7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHBhcnNlIG5vdGF0aW9uIHRvIG5vdGF0aW9uIGFuZCBvY3RhdmVcbiAgICAgKiBAcGFyYW0gbm90YXRpb25cbiAgICAgKi9cbiAgICBwYXJzZU5vdGF0aW9uKG5vdGF0aW9uKSB7XG4gICAgICAgIHZhciBub3RlID0ge307XG4gICAgICAgIC8vIG9ubHkgc3VwcG9ydHMgb25lIGRpZ2l0IG9jdGF2ZXMgKGlmIHRoYXRzIGV2ZW4gYSByZWFsIGlzc3VlKVxuICAgICAgICB2YXIgb2N0YXZlID0gbm90YXRpb24uY2hhckF0KG5vdGF0aW9uLmxlbmd0aC0xKTtcbiAgICAgICAgaWYgKHBhcnNlSW50KG9jdGF2ZSkgPT0gb2N0YXZlKSB7XG4gICAgICAgICAgICBub3RlLm9jdGF2ZSA9IG9jdGF2ZTtcbiAgICAgICAgICAgIGlmIChub3RhdGlvbi5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgICAgICBub3RlLm5vdGF0aW9uID0gbm90YXRpb24uY2hhckF0KDApICsgbm90YXRpb24uY2hhckF0KDEpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5vdGUubm90YXRpb24gPSBub3RhdGlvbi5jaGFyQXQoMCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vdGUub2N0YXZlID0gNDsgLy8gZGVmYXVsdFxuICAgICAgICAgICAgbm90ZS5ub3RhdGlvbiA9IG5vdGF0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5vdGU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHR1cm4gYSBub3RhdGlvbiBpbnRvIGEgZnJlcXVlbmN5XG4gICAgICogQHN0YXRpY1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBub3RhdGlvblxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gZnJlcXVlbmN5XG4gICAgICovXG4gICAgZ2V0RnJlcXVlbmN5Rm9yTm90YXRpb24obnQpIHtcbiAgICAgICAgdmFyIG9jdGF2ZSA9IDQ7XG5cbiAgICAgICAgLy8gZG9lcyBub3RhdGlvbiBpbmNsdWRlIHRoZSBvY3RhdmU/XG4gICAgICAgIGlmICggIWlzTmFOKCBwYXJzZUludChudC5jaGFyQXQobnQubGVuZ3RoIC0xKSkgKSkge1xuICAgICAgICAgICAgb2N0YXZlID0gcGFyc2VJbnQobnQuY2hhckF0KG50Lmxlbmd0aCAtMSkpO1xuICAgICAgICAgICAgbnQgPSBudC5zdWJzdHIoMCwgbnQubGVuZ3RoLTEpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY29ycmVjdCBhbnkgZmxhdC9zaGFycHMgdGhhdCByZXNvbHZlIHRvIGEgbmF0dXJhbFxuICAgICAgICBpZiAodGhpcy5vZGROb3RhdGlvbnMuaW5kZXhPZihudCkgIT0gLTEpIHtcbiAgICAgICAgICAgIG50ID0gdGhpcy5jb3JyZWN0ZWROb3RhdGlvbnNbdGhpcy5vZGROb3RhdGlvbnMuaW5kZXhPZihudCldO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZyZXE7XG4gICAgICAgIHZhciBpbmR4ID0gdGhpcy5zaGFycE5vdGF0aW9ucy5pbmRleE9mKG50KTtcblxuICAgICAgICBpZiAoaW5keCA9PSAtMSkge1xuICAgICAgICAgICAgaW5keCA9IHRoaXMuZmxhdE5vdGF0aW9ucy5pbmRleE9mKG50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbmR4ICE9IC0xKSB7XG4gICAgICAgICAgICBpbmR4ICs9IChvY3RhdmUtNCkgKiB0aGlzLnNoYXJwTm90YXRpb25zLmxlbmd0aDtcbiAgICAgICAgICAgIGZyZXEgPSA0NDAgKiAoTWF0aC5wb3coMiwgaW5keC8xMikpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmcmVxO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBnZXQgbm90ZXMgaW4gYSBzcGVjaWZpYyBrZXkgc2lnbmF0dXJlXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSAocm9vdCBub3RlKVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gaWYgbWFqb3Iga2V5IHNpZ25hdHVyZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBvY3RhdmUgdG8gdXNlIChvcHRpb25hbClcbiAgICAgKiBAcmV0dXJuIHtBcnJheS48c3RyaW5nPn0ga2V5cyBpbiBrZXkgc2lnbmF0dXJlXG4gICAgICovXG4gICAgbm90ZXNJbktleVNpZ25hdHVyZShrZXksIG1ham9yLCBvY3RhdmUpIHtcbiAgICAgICAgdmFyIG5vdGVzVG9JbmRleDtcbiAgICAgICAgdmFyIG5vdGVzSW5LZXkgPSBbXTtcbiAgICAgICAgdmFyIHN0YXJ0UG9zO1xuXG4gICAgICAgIC8vIGNvcnJlY3QgYW55IGZsYXQvc2hhcnBzIHRoYXQgcmVzb2x2ZSB0byBhIG5hdHVyYWxcbiAgICAgICAgaWYgKHRoaXMub2RkTm90YXRpb25zLmluZGV4T2Yoa2V5KSAhPSAtMSkge1xuICAgICAgICAgICAga2V5ID0gdGhpcy5jb3JyZWN0ZWROb3RhdGlvbnNbdGhpcy5vZGROb3RhdGlvbnMuaW5kZXhPZihrZXkpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZpbmQgdGhlIGNvcnJlY3Qgbm90ZSBhbmQgbm90YXRpb25cbiAgICAgICAgaWYgKHRoaXMuc2hhcnBOb3RhdGlvbnMuaW5kZXhPZihrZXkpICE9IC0xKSB7XG4gICAgICAgICAgICBub3Rlc1RvSW5kZXggPSB0aGlzLnNoYXJwTm90YXRpb25zLnNsaWNlKCk7XG4gICAgICAgICAgICBzdGFydFBvcyA9IHRoaXMuc2hhcnBOb3RhdGlvbnMuaW5kZXhPZihrZXkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm90ZXNUb0luZGV4ID0gdGhpcy5mbGF0Tm90YXRpb25zLnNsaWNlKCk7XG4gICAgICAgICAgICBzdGFydFBvcyA9IHRoaXMuZmxhdE5vdGF0aW9ucy5pbmRleE9mKGtleSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkb3VibGUgdGhlIGFycmF5IGxlbmd0aFxuICAgICAgICB2YXIgbGVuID0gbm90ZXNUb0luZGV4Lmxlbmd0aDtcbiAgICAgICAgZm9yICggdmFyIGMgPSAwOyBjIDwgbGVuOyBjKysgKSB7XG4gICAgICAgICAgICBpZiAob2N0YXZlKSB7XG4gICAgICAgICAgICAgICAgbm90ZXNUb0luZGV4LnB1c2gobm90ZXNUb0luZGV4W2NdICsgKG9jdGF2ZSsxKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5vdGVzVG9JbmRleC5wdXNoKG5vdGVzVG9JbmRleFtjXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhZGQgb2N0YXZlIG5vdGF0aW9uIHRvIHRoZSBmaXJzdCBoYWxmIG9mIHRoZSBhcnJheVxuICAgICAgICBpZiAob2N0YXZlKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IHRoaXMuZmxhdE5vdGF0aW9ucy5sZW5ndGg7IGMrKykge1xuICAgICAgICAgICAgICAgIG5vdGVzVG9JbmRleFtjXSArPSBvY3RhdmU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2hvcCBvZmYgdGhlIGZyb250IG9mIHRoZSBhcnJheSB0byBzdGFydCBhdCB0aGUgcm9vdCBrZXkgaW4gdGhlIGtleSBzaWduYXR1cmVcbiAgICAgICAgbm90ZXNUb0luZGV4LnNwbGljZSgwLCBzdGFydFBvcyk7XG5cbiAgICAgICAgLy8gYnVpbGQgdGhlIGtleSBzaWduYXR1cmVcbiAgICAgICAgaWYgKG1ham9yKSB7XG4gICAgICAgICAgICAvLyBNQUpPUiBGcm9tIHJvb3Q6IHdob2xlIHN0ZXAsIHdob2xlIHN0ZXAsIGhhbGYgc3RlcCwgd2hvbGUgc3RlcCwgd2hvbGUgc3RlcCwgd2hvbGUgc3RlcCwgaGFsZiBzdGVwXG4gICAgICAgICAgICBub3Rlc0luS2V5LnB1c2goIG5vdGVzVG9JbmRleFswXSApO1xuICAgICAgICAgICAgbm90ZXNJbktleS5wdXNoKCBub3Rlc1RvSW5kZXhbMl0gKTtcbiAgICAgICAgICAgIG5vdGVzSW5LZXkucHVzaCggbm90ZXNUb0luZGV4WzRdICk7XG4gICAgICAgICAgICBub3Rlc0luS2V5LnB1c2goIG5vdGVzVG9JbmRleFs1XSApO1xuICAgICAgICAgICAgbm90ZXNJbktleS5wdXNoKCBub3Rlc1RvSW5kZXhbN10gKTtcbiAgICAgICAgICAgIG5vdGVzSW5LZXkucHVzaCggbm90ZXNUb0luZGV4WzldICk7XG4gICAgICAgICAgICBub3Rlc0luS2V5LnB1c2goIG5vdGVzVG9JbmRleFsxMV0gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE1JTk9SIEZyb20gcm9vdDogd2hvbGUgc3RlcCwgaGFsZiBzdGVwLCB3aG9sZSBzdGVwLCB3aG9sZSBzdGVwLCBoYWxmIHN0ZXAsIHdob2xlIHN0ZXAsIHdob2xlIHN0ZXBcbiAgICAgICAgICAgIG5vdGVzSW5LZXkucHVzaCggbm90ZXNUb0luZGV4WzBdICk7XG4gICAgICAgICAgICBub3Rlc0luS2V5LnB1c2goIG5vdGVzVG9JbmRleFsyXSApO1xuICAgICAgICAgICAgbm90ZXNJbktleS5wdXNoKCBub3Rlc1RvSW5kZXhbM10gKTtcbiAgICAgICAgICAgIG5vdGVzSW5LZXkucHVzaCggbm90ZXNUb0luZGV4WzVdICk7XG4gICAgICAgICAgICBub3Rlc0luS2V5LnB1c2goIG5vdGVzVG9JbmRleFs3XSApO1xuICAgICAgICAgICAgbm90ZXNJbktleS5wdXNoKCBub3Rlc1RvSW5kZXhbOF0gKTtcbiAgICAgICAgICAgIG5vdGVzSW5LZXkucHVzaCggbm90ZXNUb0luZGV4WzEwXSApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub3Rlc0luS2V5O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBwcmVnZW5lcmF0ZSBhIGtleSBzaWduYXR1cmUgbG9va3VwIHRhYmxlIGZvciBldmVyeSBub3RlXG4gICAgICovXG4gICAgZ2VuZXJhdGVLZXlTaWduYXR1cmVMb29rdXAoKSB7XG4gICAgICAgIHZhciBreXMgPSB0aGlzLnNoYXJwTm90YXRpb25zO1xuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IGt5cy5sZW5ndGg7IGMrKykge1xuICAgICAgICAgICAgdGhpcy5rZXlzW2t5c1tjXV0gPSB0aGlzLm5vdGVzSW5LZXlTaWduYXR1cmUoa3lzW2NdLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMua2V5c1treXNbY10gKyAnbSddID0gdGhpcy5ub3Rlc0luS2V5U2lnbmF0dXJlKGt5c1tjXSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgfVxuXG59O1xuIiwiaW1wb3J0IEJhc2VHcm91cCBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvdHJpdnIvc3JjL2Jhc2Vncm91cC5lczYnO1xuaW1wb3J0IFN0eWxlIGZyb20gJy4uL3RoZW1laW5nL3N0eWxlLmVzNic7XG5pbXBvcnQgVG9uZVBsYXliYWNrIGZyb20gJy4uL3RvbmVwbGF5YmFjay5lczYnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb21lIGV4dGVuZHMgQmFzZUdyb3VwIHtcbiAgICAvKipcbiAgICAgKiBvbiBjcmVhdGUgc2NlbmUgKG9yIGVhcmxpZXN0IHBvc3NpYmxlIG9wcG9ydHVuaXR5KVxuICAgICAqIEBwYXJhbSBzY2VuZVxuICAgICAqIEBwYXJhbSBjdXN0b21cbiAgICAgKi9cbiAgICBvbkNyZWF0ZShzY2VuZSwgY3VzdG9tKSB7XG4gICAgICAgIHZhciBtZXNoID0gbmV3IFRIUkVFLk1lc2godGhpcy5jcmVhdGVHZW9tZXRyeSgpLCB0aGlzLmNyZWF0ZU1hdGVyaWFsKCkpO1xuICAgICAgICBtZXNoLnBvc2l0aW9uLnogPSA1O1xuICAgICAgICB0aGlzLmFkZChtZXNoLCAnZG9tZScpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG9uIHJlbmRlclxuICAgICAqIEBwYXJhbSBzY2VuZWNvbGxlY3Rpb25cbiAgICAgKiBAcGFyYW0gbXljb2xsZWN0aW9uXG4gICAgICovXG4gICAgb25SZW5kZXIoc2NlbmVjb2xsZWN0aW9uLCBteWNvbGxlY3Rpb24pIHtcbiAgICAgICAgaWYgKFRvbmVQbGF5YmFjay5pc1BsYXlpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JvdXAucm90YXRpb24ueSArPSBNYXRoLlBJIC8gMTAyNDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNyZWF0ZSBnbG9iZSBnZW9tZXRyeVxuICAgICAqIEByZXR1cm5zIHtUSFJFRS5JY29zYWhlZHJvbkdlb21ldHJ5fVxuICAgICAqL1xuICAgIGNyZWF0ZUdlb21ldHJ5KCkge1xuICAgICAgICByZXR1cm4gbmV3IFRIUkVFLkljb3NhaGVkcm9uR2VvbWV0cnkoIDgwMCwgMiApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNyZWF0ZSBnbG9iZSBtYXRlcmlhbFxuICAgICAqL1xuICAgIGNyZWF0ZU1hdGVyaWFsKCkge1xuICAgICAgICByZXR1cm4gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHtcbiAgICAgICAgICAgIGNvbG9yICAgICAgOiAgU3R5bGUuZG9tZS5jb2xvcixcbiAgICAgICAgICAgIGVtaXNzaXZlICAgOiAgU3R5bGUuZG9tZS5lbWlzc2l2ZSxcbiAgICAgICAgICAgIHNwZWN1bGFyICAgOiAgU3R5bGUuZG9tZS5zcGVjdWxhcixcbiAgICAgICAgICAgIHNpZGUgICAgICAgOiAgVEhSRUUuQmFja1NpZGUsXG4gICAgICAgICAgICBzaGluaW5lc3MgIDogIDEwLFxuICAgICAgICAgICAgc2hhZGluZyAgICA6ICBUSFJFRS5GbGF0U2hhZGluZyxcbiAgICAgICAgICAgIHRyYW5zcGFyZW50OiAxLFxuICAgICAgICAgICAgb3BhY2l0eSAgICA6IDFcbiAgICAgICAgfSk7XG4gICAgfVxufSIsImltcG9ydCBCYXNlR3JvdXAgZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3RyaXZyL3NyYy9iYXNlZ3JvdXAuZXM2JztcbmltcG9ydCBTdHlsZSBmcm9tICcuLi90aGVtZWluZy9zdHlsZS5lczYnO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4uL3V0aWxzLmVzNic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZsb2F0aW5nUGFydGljbGVzIGV4dGVuZHMgQmFzZUdyb3VwIHtcbiAgICAvKipcbiAgICAgKiBvbiBjcmVhdGUgc2NlbmVcbiAgICAgKiBAcGFyYW0gc2NlbmVcbiAgICAgKiBAcGFyYW0gY3VzdG9tXG4gICAgICovXG4gICAgb25DcmVhdGUoc2NlbmUsIGN1c3RvbSkge1xuICAgICAgICB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKTtcbiAgICAgICAgdmFyIHRleHR1cmVMb2FkZXIgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcigpO1xuICAgICAgICB2YXIgc3ByaXRlID0gdGV4dHVyZUxvYWRlci5sb2FkKFN0eWxlLmZsb2F0aW5ncGFydGljbGVzLnNwcml0ZSk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxMDAwMDsgaSArKykge1xuICAgICAgICAgICAgdmFyIHZlcnRleCA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gICAgICAgICAgICB2ZXJ0ZXgueCA9IE1hdGgucmFuZG9tKCkgKiAyMDAwIC0gMTAwMDtcbiAgICAgICAgICAgIHZlcnRleC55ID0gTWF0aC5yYW5kb20oKSAqIDIwMDAgLSAxMDAwO1xuICAgICAgICAgICAgdmVydGV4LnogPSBNYXRoLnJhbmRvbSgpICogMjAwMCAtIDEwMDA7XG4gICAgICAgICAgICBnZW9tZXRyeS52ZXJ0aWNlcy5wdXNoKCB2ZXJ0ZXggKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubWF0ZXJpYWxzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNDsgaSArKyApIHtcbiAgICAgICAgICAgIHRoaXMubWF0ZXJpYWxzW2ldID0gbmV3IFRIUkVFLlBvaW50c01hdGVyaWFsKHtcbiAgICAgICAgICAgICAgICBzaXplOiBNYXRoLnJhbmRvbSgpKjIuMCArIC43NSxcbiAgICAgICAgICAgICAgICBtYXA6IHNwcml0ZSxcbiAgICAgICAgICAgICAgICBibGVuZGluZzogVEhSRUUuQWRkaXRpdmVCbGVuZGluZyxcbiAgICAgICAgICAgICAgICBkZXB0aFRlc3Q6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHRyYW5zcGFyZW50IDogdHJ1ZSB9KTtcbiAgICAgICAgICAgIHZhciBwYXJ0aWNsZXMgPSBuZXcgVEhSRUUuUG9pbnRzKCBnZW9tZXRyeSwgdGhpcy5tYXRlcmlhbHNbaV0gKTtcblxuICAgICAgICAgICAgcGFydGljbGVzLnJvdGF0aW9uLnggPSBNYXRoLnJhbmRvbSgpICogNjtcbiAgICAgICAgICAgIHBhcnRpY2xlcy5yb3RhdGlvbi55ID0gTWF0aC5yYW5kb20oKSAqIDY7XG4gICAgICAgICAgICBwYXJ0aWNsZXMucm90YXRpb24ueiA9IE1hdGgucmFuZG9tKCkgKiA2O1xuICAgICAgICAgICAgdGhpcy5hZGQocGFydGljbGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0Q29sb3IoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzZXQgZHJ1bSBoaXQvdHJpZ2dlciBjb2xvclxuICAgICAqIEBwYXJhbSBoZXhcbiAgICAgKi9cbiAgICBzZXRDb2xvcihoZXgpIHtcbiAgICAgICAgaWYgKCFoZXgpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbG9yID0gU3R5bGUuZmxvYXRpbmdwYXJ0aWNsZXMuY29sb3I7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9jb2xvciA9IGhleDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgdGhpcy5tYXRlcmlhbHMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgIHRoaXMubWF0ZXJpYWxzW2NdLmNvbG9yLnNldCh0aGlzLl9jb2xvcik7XG4gICAgICAgIH1cbiAgICAgfVxuXG4gICAgb25SZW5kZXIodGltZSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpICsrKSB7XG4gICAgICAgICAgICB2YXIgb2JqZWN0ID0gdGhpcy5jaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZiBUSFJFRS5Qb2ludHMpIHtcbiAgICAgICAgICAgICAgICBvYmplY3Qucm90YXRpb24ueSArPSAuMDAxO1xuICAgICAgICAgICAgICAgIG9iamVjdC5yb3RhdGlvbi56ICs9IC4wMDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiIsImltcG9ydCBCYXNlR3JvdXAgZnJvbSAnLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3RyaXZyL3NyYy9iYXNlZ3JvdXAuZXM2JztcbmltcG9ydCBJbnB1dCBmcm9tICcuLi8uLi9pbnB1dC5lczYnO1xuaW1wb3J0IE5vdGUgZnJvbSAnLi4vLi4vbXVzaWN0aGVvcnkvbm90ZS5lczYnO1xuaW1wb3J0IFN0eWxlIGZyb20gJy4uLy4uL3RoZW1laW5nL3N0eWxlLmVzNic7XG5pbXBvcnQgVXRpbHMgZnJvbSAnLi4vLi4vdXRpbHMuZXM2JztcbmltcG9ydCBUb25lUGxheWJhY2sgZnJvbSAnLi4vLi4vdG9uZXBsYXliYWNrLmVzNic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VLZXlib2FyZCBleHRlbmRzIEJhc2VHcm91cCB7XG4gICAgb25Jbml0aWFsaXplKHBhcmFtcykge1xuICAgICAgICAvKipcbiAgICAgICAgICogaG93IG11Y2ggcm90YXRpb24gb2NjdXJzIG9uIGtleXByZXNzXG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9yb3RhdGlvbk9uUHJlc3MgPSBNYXRoLlBJLzE2O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBudW1iZXIgb2Ygb2N0YXZlc1xuICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fbnVtT2N0YXZlcyA9IHBhcmFtcy5vY3RhdmVzID8gcGFyYW1zLm9jdGF2ZXMgOiAyO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBzdGFydGluZyBvY3RhdmUgKHRvIGJldHRlciBtYXRjaCB3aXRoIE1JREkgaW5wdXQpXG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9zdGFydGluZ09jdGF2ZSA9IHBhcmFtcy5zdGFydG9jdGF2ZSA/IHBhcmFtcy5zdGFydG9jdGF2ZSA6IDA7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIHN0YXJ0aW5nIG5vdGUgb24ga2V5Ym9hcmRcbiAgICAgICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3N0YXJ0aW5nTm90ZSA9ICdDJztcblxuICAgICAgICAvKipcbiAgICAgICAgICogZW5kaW5nIG5vdGUgb24ga2V5Ym9hcmRcbiAgICAgICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2VuZGluZ05vdGUgPSAnQyc7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGtleSB2aXN1YWxzXG4gICAgICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2tleXMgPSBbXTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogbWlkaSBjaGFubmVscyB1c2VkXG4gICAgICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX21pZGljaGFubmVscyA9IFtdO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBzdGFydGluZyBpbmRleCBhdCB3aGljaCBwb2ludCB0byBhbGxvY2F0ZSBNSURJIGNoYW5uZWxzXG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9taWRpQ2hhbm5lbFN0YXJ0SW5kZXggPSAxMTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogc3VnZ2VzdGVkIGtleXMgZnJvbSBrZXkgc2lnbmF0dXJlIHByZWRpY3Rpb25cbiAgICAgICAgICogQHR5cGUge0FycmF5fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5zdWdnZXN0ZWRLZXlzID0gW107XG4gICAgfVxuICAgIC8qKlxuICAgICAqIG9uIGNyZWF0ZSBzY2VuZSAob3IgZWFybGllc3QgcG9zc2libGUgb3Bwb3J0dW5pdHkpXG4gICAgICogQHBhcmFtIHNjZW5lXG4gICAgICogQHBhcmFtIGN1c3RvbVxuICAgICAqL1xuICAgIG9uQ3JlYXRlKHNjZW5lLCBjdXN0b20pIHtcbiAgICAgICAgLy9Ub25lUGxheWJhY2suYWRkRXZlbnRMaXN0ZW5lcignbWlkaWRhdGEnLCBkYXRhID0+IHRoaXMub25Tb25nRGF0YShkYXRhKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb24gcmVuZGVyIHNjZW5lXG4gICAgICogQHBhcmFtIHNjZW5lXG4gICAgICogQHBhcmFtIGN1c3RvbVxuICAgICAqL1xuICAgIG9uUmVuZGVyKHNjZW5lLCBjdXN0b20pIHtcbiAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCB0aGlzLl9rZXlzLmxlbmd0aDsgYysrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fa2V5c1tjXS5jb2xvcnR3ZWVuLmFuaW1hdGluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2tleXNbY10ub2JqZWN0Lm1hdGVyaWFsLmNvbG9yLnNldFJHQihcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fa2V5c1tjXS5jb2xvcnR3ZWVuLnJjb2xvci8xMDAsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2tleXNbY10uY29sb3J0d2Vlbi5nY29sb3IvMTAwLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9rZXlzW2NdLmNvbG9ydHdlZW4uYmNvbG9yLzEwMCApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb24gYXNzZXRzIGxvYWRlZFxuICAgICAqIEBwYXJhbSBnZW9tZXRyeVxuICAgICAqL1xuICAgIG9uQXNzZXRzTG9hZGVkKGdlb21ldHJ5KSB7XG4gICAgICAgIHZhciBtYXQgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoIHtcbiAgICAgICAgICAgIG1ldGFsbmVzczogMC43LFxuICAgICAgICAgICAgcm91Z2huZXNzOiAxLFxuICAgICAgICAgICAgc2lkZTogVEhSRUUuRnJvbnRTaWRlLFxuICAgICAgICAgICAgc2hhZGluZzogVEhSRUUuRmxhdFNoYWRpbmdcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc2V0dXBTY2VuZShnZW9tZXRyeSwgbWF0KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogZHluYW1pY2FsbHkgZ2VuZXJhdGUgY2lyY2xlIG9mIGtleXNcbiAgICAgKiBAcGFyYW0gZ2VvbWV0cnlcbiAgICAgKiBAcGFyYW0gbWF0ZXJpYWxcbiAgICAgKi9cbiAgICBzZXR1cFNjZW5lKGdlb21ldHJ5LCBtYXRlcmlhbCkge1xuICAgICAgICB2YXIgc3RhcnRPZmZzZXQgPSBOb3RlLmluZGV4T2ZOb3RhdGlvbih0aGlzLl9zdGFydGluZ05vdGUpO1xuICAgICAgICB2YXIgZW5kT2Zmc2V0ID0gTm90ZS5pbmRleE9mTm90YXRpb24odGhpcy5fZW5kaW5nTm90ZSk7XG4gICAgICAgIHZhciBudGluZGV4ID0gMDtcbiAgICAgICAgdmFyIG9jdGF2ZSA9IDA7XG4gICAgICAgIHZhciB0cmFuc2Zvcm1Qb3NpdGlvbiA9IDA7XG4gICAgICAgIHZhciBub3RlcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IHRoaXMuX251bU9jdGF2ZXM7IGMrKykge1xuICAgICAgICAgICAgbm90ZXMgPSBub3Rlcy5jb25jYXQoTm90ZS5zaGFycE5vdGF0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgbm90ZXMgPSBub3Rlcy5jb25jYXQoTm90ZS5zaGFycE5vdGF0aW9ucy5zbGljZSgwLCBlbmRPZmZzZXQrMSkpO1xuXG4gICAgICAgIGZvciAodmFyIGQgPSAwOyBkIDwgbm90ZXMubGVuZ3RoOyBkKyspIHtcbiAgICAgICAgICAgIGlmIChkID49IHN0YXJ0T2Zmc2V0KSB7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtUG9zaXRpb24gPSB0aGlzLmFkZEtleSh0cmFuc2Zvcm1Qb3NpdGlvbiwgbm90ZXNbZF0uaW5kZXhPZignIycpID09PSAtMSwgbm90ZXNbZF0sIG9jdGF2ZSwgZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG50aW5kZXggKys7XG4gICAgICAgICAgICBpZiAobnRpbmRleCA+PSBOb3RlLnNoYXJwTm90YXRpb25zLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIG50aW5kZXggPSAwO1xuICAgICAgICAgICAgICAgIG9jdGF2ZSArKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJhbnNmb3JtUG9zaXRpb247XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb24gaW5hY3Rpdml0eSAoZmFkZSBhd2F5IGtleXMgYW5kIGNsZWFyIGtleSBzaWcpXG4gICAgICovXG4gICAgcmVzZXRLZXlzKCkge1xuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IHRoaXMuX2tleXMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9rZXlzW2NdLnN1Z2dlc3RlZCkge1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50Q29sb3IgPSB0aGlzLl9rZXlzW2NdLm9iamVjdC5tYXRlcmlhbC5jb2xvci5nZXRIZXgoKTtcbiAgICAgICAgICAgICAgICBVdGlscy5jb3B5UHJvcHNUbyh0aGlzLl9rZXlzW2NdLmNvbG9ydHdlZW4sIFV0aWxzLmRlY1RvUkdCKGN1cnJlbnRDb2xvciwgMTAwKSwgJ2NvbG9yJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fa2V5c1tjXS5jb2xvcnR3ZWVuLmFuaW1hdGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IFV0aWxzLmNvcHlQcm9wc1RvKHt9LCBVdGlscy5kZWNUb1JHQihTdHlsZS5rZXlzLm5vcm1hbFt0aGlzLl9rZXlzW2NdLnR5cGVdLmNvbG9yLCAxMDApLCAnY29sb3InKTtcbiAgICAgICAgICAgICAgICBjcmVhdGVqcy5Ud2Vlbi5nZXQodGhpcy5fa2V5c1tjXS5jb2xvcnR3ZWVuKVxuICAgICAgICAgICAgICAgICAgICAudG8odGFyZ2V0LCAyMDAwKVxuICAgICAgICAgICAgICAgICAgICAud2FpdCgxMDApIC8vIHdhaXQgYSBmZXcgdGlja3MsIG9yIHRoZSByZW5kZXIgY3ljbGUgd29uJ3QgcGljayB1cCB0aGUgY2hhbmdlcyB3aXRoIHRoZSBmbGFnXG4gICAgICAgICAgICAgICAgICAgIC5jYWxsKCBmdW5jdGlvbigpIHsgdGhpcy5hbmltYXRpbmcgPSBmYWxzZTsgfSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY2hhbmdlIGtleSBzaWduYXR1cmUgdG8gbm90YXRpb24gZ2l2ZW5cbiAgICAgKiBAcGFyYW0gbm90YXRpb25cbiAgICAgKi9cbiAgICBjaGFuZ2VLZXlTaWduYXR1cmUobm90YXRpb24pIHtcbiAgICAgICAgdmFyIGM7XG4gICAgICAgIGZvciAoYyA9IDA7IGMgPCB0aGlzLnN1Z2dlc3RlZEtleXMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlS2V5U3VnZ2VzdGlvbih0aGlzLnN1Z2dlc3RlZEtleXNbY10sIG5vdGF0aW9uLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdWdnZXN0ZWRLZXlzID0gTm90ZS5rZXlzW25vdGF0aW9uXTtcblxuICAgICAgICBmb3IgKGMgPSAwOyBjIDwgdGhpcy5zdWdnZXN0ZWRLZXlzLmxlbmd0aDsgYysrKSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZUtleVN1Z2dlc3Rpb24odGhpcy5zdWdnZXN0ZWRLZXlzW2NdLCBub3RhdGlvbiwgdHJ1ZSwgYyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0b2dnbGUga2V5IHByZXNzZWRcbiAgICAgKiBAcGFyYW0ga2V5XG4gICAgICovXG4gICAgdG9nZ2xlS2V5UHJlc3NlZChrKSB7XG4gICAgICAgIHZhciBrZXkgPSB0aGlzLmZpbmRLZXlPYmplY3RGb3JOb3RhdGlvbihrLm5vdGF0aW9uLCBrLm9jdGF2ZSk7XG4gICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgIGlmIChrLnZlbG9jaXR5ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgVG9uZVBsYXliYWNrLm5vdGVPZmYoay5ub3RhdGlvbiArIGsub2N0YXZlLCBrZXkubWlkaWNoYW5uZWwsIDEvOCk7XG4gICAgICAgICAgICAgICAgdmFyIGNoYW5uZWxpbmRleCA9IHRoaXMuX21pZGljaGFubmVscy5pbmRleE9mKGtleS5taWRpY2hhbm5lbCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWlkaWNoYW5uZWxzLnNwbGljZShjaGFubmVsaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9pbmFjdGl2aXR5VGltZXIpO1xuICAgICAgICAgICAgICAgIGtleS5vYmplY3Qucm90YXRpb24uc2V0KGtleS5vcmlnaW5hbFJvdGF0aW9uLngsIGtleS5vcmlnaW5hbFJvdGF0aW9uLnksIGtleS5vcmlnaW5hbFJvdGF0aW9uLnopO1xuICAgICAgICAgICAgICAgIGtleS5jdXJyZW50Um90YXRpb24gPSAwO1xuICAgICAgICAgICAgICAgIGtleS5taWRpY2hhbm5lbCA9IC0xO1xuICAgICAgICAgICAgICAgIGtleS5kb3duID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX21pZGljaGFubmVscyA9IHRoaXMuX21pZGljaGFubmVscy5zb3J0KCk7XG4gICAgICAgICAgICAgICAgdmFyIG1pZGljaGFubmVsID0gdGhpcy5fbWlkaWNoYW5uZWxzW3RoaXMuX21pZGljaGFubmVscy5sZW5ndGgtMV0gKyAxO1xuICAgICAgICAgICAgICAgIGlmICghbWlkaWNoYW5uZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgbWlkaWNoYW5uZWwgPSB0aGlzLl9taWRpQ2hhbm5lbFN0YXJ0SW5kZXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFRvbmVQbGF5YmFjay5ub3RlT24oVG9uZVBsYXliYWNrLlBJQU5PLCBrLm5vdGF0aW9uICsgay5vY3RhdmUsIG1pZGljaGFubmVsKTtcbiAgICAgICAgICAgICAgICBrZXkuY3VycmVudFJvdGF0aW9uID0gay52ZWxvY2l0eSAqIHRoaXMuX3JvdGF0aW9uT25QcmVzcztcbiAgICAgICAgICAgICAgICBrZXkub2JqZWN0LnJvdGF0ZVgoa2V5LmN1cnJlbnRSb3RhdGlvbik7XG4gICAgICAgICAgICAgICAga2V5Lm1pZGljaGFubmVsID0gbWlkaWNoYW5uZWw7XG4gICAgICAgICAgICAgICAga2V5LmRvd24gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdG9nZ2xlIGtleSBzdWdnZXN0aW9uXG4gICAgICogQHBhcmFtIG5vdGF0aW9uXG4gICAgICogQHBhcmFtIGtleXNpZ25vdGF0aW9uXG4gICAgICogQHBhcmFtIHRvZ2dsZVxuICAgICAqL1xuICAgIHRvZ2dsZUtleVN1Z2dlc3Rpb24obm90YXRpb24sIGtleXNpZ25vdGF0aW9uLCB0b2dnbGUpIHtcbiAgICAgICAgdmFyIG50SW5kZXggPSBOb3RlLmtleXNba2V5c2lnbm90YXRpb25dLmluZGV4T2Yobm90YXRpb24pOy8vIE5vdGUuaW5kZXhPZk5vdGF0aW9uKGtleXNpZ25vdGF0aW9uKTtcbiAgICAgICAgdmFyIGtleVNpZ0luZGV4ID0gTm90ZS5pbmRleE9mTm90YXRpb24oa2V5c2lnbm90YXRpb24pO1xuICAgICAgICB2YXIgcm9vdGNsckhTID0gU3R5bGUuY29sb3J3aGVlbEhpZ2hTYXR1cmF0aW9uW2tleVNpZ0luZGV4XTtcbiAgICAgICAgdmFyIHJvb3RjbHJMUyA9IFN0eWxlLmNvbG9yd2hlZWxMb3dTYXR1cmF0aW9uW2tleVNpZ0luZGV4XTtcblxuICAgICAgICB2YXIga2V5cyA9IHRoaXMuZmluZEtleU9iamVjdHNGb3JOb3RhdGlvbihub3RhdGlvbik7XG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwga2V5cy5sZW5ndGg7IGMrKykge1xuICAgICAgICAgICAgaWYgKHRvZ2dsZSkge1xuICAgICAgICAgICAgICAgIHZhciBjbHI7XG4gICAgICAgICAgICAgICAgaWYgKCBudEluZGV4PT09MCB8fCBudEluZGV4PT09MiB8fCBudEluZGV4PT09NCB8fCBudEluZGV4PT09Nikge1xuICAgICAgICAgICAgICAgICAgICBjbHIgPSBTdHlsZS5rZXlzLnN0cm9uZ2x5U3VnZ2VzdGVkW2tleXNbY10udHlwZV07XG4gICAgICAgICAgICAgICAgICAgIGtleXNbY10uc3VnZ2VzdGVkID0gJ3N0cm9uZ2x5U3VnZ2VzdGVkJztcbiAgICAgICAgICAgICAgICAgICAga2V5c1tjXS5vYmplY3QubWF0ZXJpYWwuY29sb3Iuc2V0SGV4KHJvb3RjbHJIUyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2xyID0gU3R5bGUua2V5cy5zdWdnZXN0ZWRba2V5c1tjXS50eXBlXTtcbiAgICAgICAgICAgICAgICAgICAga2V5c1tjXS5zdWdnZXN0ZWQgPSAnc3VnZ2VzdGVkJztcbiAgICAgICAgICAgICAgICAgICAga2V5c1tjXS5vYmplY3QubWF0ZXJpYWwuY29sb3Iuc2V0SGV4KHJvb3RjbHJMUyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBrZXlzW2NdLm9iamVjdC5tYXRlcmlhbC5jb2xvci5zZXRIZXgoU3R5bGUua2V5cy5ub3JtYWxba2V5c1tjXS50eXBlXS5jb2xvcik7XG4gICAgICAgICAgICAgICAgLy9rZXlzW2NdLm9iamVjdC5tYXRlcmlhbC5lbWlzc2l2ZS5zZXRIZXgoU3R5bGUua2V5cy5ub3JtYWxba2V5c1tjXS50eXBlXS5lbWlzc2l2ZSk7XG4gICAgICAgICAgICAgICAga2V5c1tjXS5zdWdnZXN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNyZWF0ZSB3aGl0ZSBrZXkgZ2VvbWV0cnlcbiAgICAgKiBAcmV0dXJucyB7VEhSRUUuTWVzaH1cbiAgICAgKi9cbiAgICBjcmVhdGVXaGl0ZUtleShnZW9tZXRyeSwgbWF0ZXJpYWwpIHtcbiAgICAgICAgdmFyIGtleWdlb20gPSBnZW9tZXRyeS5jbG9uZSgpO1xuICAgICAgICB2YXIgbWF0ID0gbWF0ZXJpYWwuY2xvbmUoKTtcbiAgICAgICAgbWF0LmNvbG9yLnNldEhleChTdHlsZS5rZXlzLm5vcm1hbC53aGl0ZS5jb2xvcik7XG4gICAgICAgIG1hdC5lbWlzc2l2ZS5zZXRIZXgoU3R5bGUua2V5cy5ub3JtYWwud2hpdGUuZW1pc3NpdmUpO1xuICAgICAgICBrZXlnZW9tLnRyYW5zbGF0ZSggMCwgLTEwLCAwICk7XG4gICAgICAgIHZhciBrZXkgPSBuZXcgVEhSRUUuTWVzaCgga2V5Z2VvbSwgbWF0KTtcbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjcmVhdGUgYmxhY2sga2V5IGdlb21ldHJ5XG4gICAgICogQHJldHVybnMge1RIUkVFLk1lc2h9XG4gICAgICovXG4gICAgY3JlYXRlQmxhY2tLZXkoZ2VvbWV0cnksIG1hdGVyaWFsKSB7XG4gICAgICAgIHZhciBrZXlnZW9tID0gZ2VvbWV0cnkuY2xvbmUoKTtcbiAgICAgICAgdmFyIG1hdCA9IG1hdGVyaWFsLmNsb25lKCk7XG4gICAgICAgIG1hdC5jb2xvci5zZXRIZXgoU3R5bGUua2V5cy5ub3JtYWwuYmxhY2suY29sb3IpO1xuICAgICAgICBtYXQuZW1pc3NpdmUuc2V0SGV4KFN0eWxlLmtleXMubm9ybWFsLmJsYWNrLmVtaXNzaXZlKTtcbiAgICAgICAga2V5Z2VvbS50cmFuc2xhdGUoIDAsIC0yNSwgMCApO1xuICAgICAgICBrZXlnZW9tLnNjYWxlKDEsIC41LCAxKTtcbiAgICAgICAgdmFyIGtleSA9IG5ldyBUSFJFRS5NZXNoKCBrZXlnZW9tLCBtYXQpO1xuICAgICAgICByZXR1cm4ga2V5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNyZWF0ZSBhbmQgYWRkIGEga2V5XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHRyYW5zZm9ybVBvc2l0aW9uXG4gICAgICogQHBhcmFtIHtCb29sZWFufSB3aGl0ZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBub3RhdGlvblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBvY3RhdmVcbiAgICAgKiBAcGFyYW0ge1RIUkVFLkdlb21ldHJ5fSBnZW9tZXRyeVxuICAgICAqIEBwYXJhbSB7VEhSRUUuTWF0ZXJpYWx9IG1hdGVyaWFsXG4gICAgICogQHJldHVybiB7TnVtYmVyfSB0cmFuc2Zvcm0gcG9zaXRpb25cbiAgICAgKi9cbiAgICBhZGRLZXkodHJhbnNmb3JtUG9zaXRpb24sIHdoaXRlLCBub3RhdGlvbiwgb2N0YXZlLCBnZW9tZXRyeSwgbWF0ZXJpYWwpIHtcbiAgICAgICAgdmFyIGtleSwgY29sb3IsIHJvdGF0aW9uO1xuICAgICAgICBpZiAod2hpdGUpIHtcbiAgICAgICAgICAgIGNvbG9yID0gJ3doaXRlJztcbiAgICAgICAgICAgIGtleSA9IHRoaXMuY3JlYXRlV2hpdGVLZXkoZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbG9yID0gJ2JsYWNrJztcbiAgICAgICAgICAgIGtleSA9IHRoaXMuY3JlYXRlQmxhY2tLZXkoZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgICAgfVxuICAgICAgICB0cmFuc2Zvcm1Qb3NpdGlvbiA9IHRoaXMuYXBwbHlLZXlUcmFuc2Zvcm0oa2V5LCB0cmFuc2Zvcm1Qb3NpdGlvbiwgd2hpdGUpO1xuICAgICAgICB0aGlzLl9rZXlzLnB1c2goe1xuICAgICAgICAgICAgdHlwZTogY29sb3IsXG4gICAgICAgICAgICBvYmplY3Q6IGtleSxcbiAgICAgICAgICAgIG9jdGF2ZTogb2N0YXZlICsgdGhpcy5fc3RhcnRpbmdPY3RhdmUsXG4gICAgICAgICAgICBjb2xvcnR3ZWVuOiB7fSxcbiAgICAgICAgICAgIG5vdGF0aW9uOiBub3RhdGlvbixcbiAgICAgICAgICAgIG9yaWdpbmFsUm90YXRpb246IHtcbiAgICAgICAgICAgICAgICB4OiBrZXkucm90YXRpb24ueCxcbiAgICAgICAgICAgICAgICB5OiBrZXkucm90YXRpb24ueSxcbiAgICAgICAgICAgICAgICB6OiBrZXkucm90YXRpb24ueiB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuYWRkKGtleSwna2V5XycgKyBub3RhdGlvbik7XG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm1Qb3NpdGlvbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhcHBseSBrZXkgdHJhbnNmb3JtXG4gICAgICogQHBhcmFtIHtUSFJFRS5NZXNofSBrZXltZXNoXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHRyYW5zZm9ybVBvc2l0aW9uXG4gICAgICogQHBhcmFtIHtCb29sZWFufSB3aGl0ZWtleVxuICAgICAqL1xuICAgIGFwcGx5S2V5VHJhbnNmb3JtKGtleW1lc2gsIHRyYW5zZm9ybVBvc2l0aW9uLCB3aGl0ZWtleSkge31cblxuICAgIC8qKlxuICAgICAqIGZpbmQgdGhlIGtleSBmb3IgYSBzcGVjaWZpYyBub3RhdGlvblxuICAgICAqIEBwYXJhbSBub3RhdGlvblxuICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgKi9cbiAgICBmaW5kS2V5T2JqZWN0c0Zvck5vdGF0aW9uKG5vdGF0aW9uKSB7XG4gICAgICAgIHZhciBrZXlzID0gW107XG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgdGhpcy5fa2V5cy5sZW5ndGg7IGMrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2tleXNbY10ubm90YXRpb24gPT09IG5vdGF0aW9uKSB7XG4gICAgICAgICAgICAgICAga2V5cy5wdXNoKHRoaXMuX2tleXNbY10pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBrZXlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGZpbmQgc3BlY2lmaWMga2V5IG9iamVjdCBmb3Igbm90YXRpb24gYW5kIG9jdGF2ZVxuICAgICAqIEBwYXJhbSBub3RhdGlvblxuICAgICAqIEBwYXJhbSBvY3RhdmVcbiAgICAgKi9cbiAgICBmaW5kS2V5T2JqZWN0Rm9yTm90YXRpb24obm90YXRpb24sIG9jdGF2ZSkge1xuICAgICAgICB2YXIgbm90YXRpb25PZmZzZXQgPSBOb3RlLmluZGV4T2ZOb3RhdGlvbih0aGlzLl9zdGFydGluZ05vdGUpO1xuICAgICAgICBub3RhdGlvbk9mZnNldCArPSB0aGlzLl9zdGFydGluZ09jdGF2ZSAqIE5vdGUuc2hhcnBOb3RhdGlvbnMubGVuZ3RoO1xuICAgICAgICB2YXIgaW5keCA9IG9jdGF2ZSAqIE5vdGUuc2hhcnBOb3RhdGlvbnMubGVuZ3RoICsgTm90ZS5zaGFycE5vdGF0aW9ucy5pbmRleE9mKG5vdGF0aW9uKSAtIG5vdGF0aW9uT2Zmc2V0O1xuICAgICAgICByZXR1cm4gdGhpcy5fa2V5c1tpbmR4XTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvbiBzb25nIGRhdGFcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqL1xuICAgIG9uU29uZ0RhdGEoZGF0YSkge1xuICAgICAgICB2YXIgbm90YXRpb24gPSBOb3RlLk1JREl0b05vdGF0aW9uKGRhdGEubm90ZSk7XG4gICAgICAgIHZhciBrZXkgPSB0aGlzLmZpbmRLZXlPYmplY3RzRm9yTm90YXRpb24obm90YXRpb24pO1xuICAgICAgICB0aGlzLnRvZ2dsZUtleVByZXNzZWQoa2V5WzBdLCBkYXRhLnZlbG9jaXR5IC8gMTI3KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgQmFzZUtleWJvYXJkIGZyb20gJy4vYmFzZWtleWJvYXJkLmVzNic7XG5pbXBvcnQgSW5wdXQgZnJvbSAnLi4vLi4vaW5wdXQuZXM2JztcbmltcG9ydCBOb3RlIGZyb20gJy4uLy4uL211c2ljdGhlb3J5L25vdGUuZXM2JztcbmltcG9ydCBTdHlsZSBmcm9tICcuLi8uLi90aGVtZWluZy9zdHlsZS5lczYnO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4uLy4uL3V0aWxzLmVzNic7XG5pbXBvcnQgVG9uZVBsYXliYWNrIGZyb20gJy4uLy4uL3RvbmVwbGF5YmFjay5lczYnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaXJjdWxhcktleWJvYXJkIGV4dGVuZHMgQmFzZUtleWJvYXJkIHtcbiAgICAvKipcbiAgICAgKiBhcHBseSBrZXkgdHJhbnNmb3JtXG4gICAgICogQHBhcmFtIHtUSFJFRS5NZXNofSBrZXltZXNoXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc2l0aW9uIGluIGtleWJvYXJkXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGtleWluZGV4XG4gICAgICogQHBhcmFtIHtCb29sZWFufSB3aGl0ZWtleVxuICAgICAqL1xuICAgIGFwcGx5S2V5VHJhbnNmb3JtKGtleW1lc2gsIHRyYW5zZm9ybVBvc2l0aW9uLCB3aGl0ZWtleSkge1xuICAgICAgICB2YXIgcm90YXRlID0gMDtcbiAgICAgICAgdmFyIGV4dHJhUm90YXRlID0gMDtcbiAgICAgICAgaWYgKHdoaXRla2V5KSB7XG4gICAgICAgICAgICByb3RhdGUgPSAoTWF0aC5QSSAqIDIpIC8gMTQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBleHRyYVJvdGF0ZSA9IChNYXRoLlBJICogMikgLyAyODtcbiAgICAgICAgfVxuICAgICAgICBrZXltZXNoLnJvdGF0aW9uLnogPSB0cmFuc2Zvcm1Qb3NpdGlvbiArIHJvdGF0ZSArIGV4dHJhUm90YXRlO1xuXG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm1Qb3NpdGlvbiArIHJvdGF0ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzZXR1cCBzY2VuZVxuICAgICAqIEBwYXJhbSBnZW9tZXRyeVxuICAgICAqIEBwYXJhbSBtYXRlcmlhbFxuICAgICAqL1xuICAgIHNldHVwU2NlbmUoZ2VvbWV0cnksIG1hdGVyaWFsKSB7XG4gICAgICAgIHN1cGVyLnNldHVwU2NlbmUoZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgICAgdGhpcy5ncm91cC5wb3NpdGlvbi56ID0gLTYwMDtcbiAgICAgICAgdGhpcy5ncm91cC5zY2FsZS5zZXQoMTAsIDEwLCAxMCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IEJhc2VLZXlib2FyZCBmcm9tICcuL2Jhc2VrZXlib2FyZC5lczYnO1xuaW1wb3J0IElucHV0IGZyb20gJy4uLy4uL2lucHV0LmVzNic7XG5pbXBvcnQgTm90ZSBmcm9tICcuLi8uLi9tdXNpY3RoZW9yeS9ub3RlLmVzNic7XG5pbXBvcnQgU3R5bGUgZnJvbSAnLi4vLi4vdGhlbWVpbmcvc3R5bGUuZXM2JztcbmltcG9ydCBVdGlscyBmcm9tICcuLi8uLi91dGlscy5lczYnO1xuaW1wb3J0IFRvbmVQbGF5YmFjayBmcm9tICcuLi8uLi90b25lcGxheWJhY2suZXM2JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhZGl0aW9uYWxLZXlib2FyZCBleHRlbmRzIEJhc2VLZXlib2FyZCB7XG4gICAgb25Jbml0aWFsaXplKHBhcmFtcykge1xuICAgICAgICBzdXBlci5vbkluaXRpYWxpemUocGFyYW1zKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogaG93IG11Y2ggcm90YXRpb24gb2NjdXJzIG9uIGtleXByZXNzXG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9yb3RhdGlvbk9uUHJlc3MgPSBNYXRoLlBJLzY0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFwcGx5IGtleSB0cmFuc2Zvcm1cbiAgICAgKiBAcGFyYW0ge1RIUkVFLk1lc2h9IGtleW1lc2hcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcG9zaXRpb24gaW4ga2V5Ym9hcmRcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IHdoaXRla2V5XG4gICAgICogQHJldHVybiB7TnVtYmVyfSBjdXJyZW50IHBvc2l0aW9uXG4gICAgICovXG4gICAgYXBwbHlLZXlUcmFuc2Zvcm0oa2V5bWVzaCwgdHJhbnNmb3JtUG9zaXRpb24sIHdoaXRla2V5KSB7XG4gICAgICAgIHZhciB0cmFuc2xhdGUgPSAyO1xuICAgICAgICBpZiAoIXdoaXRla2V5KSB7XG4gICAgICAgICAgICBrZXltZXNoLnBvc2l0aW9uLnkgPSA1O1xuICAgICAgICAgICAga2V5bWVzaC5wb3NpdGlvbi56ID0gMTtcbiAgICAgICAgICAgIGtleW1lc2gucG9zaXRpb24ueCA9IHRyYW5zZm9ybVBvc2l0aW9uICsxO1xuICAgICAgICAgICAgdHJhbnNsYXRlID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGtleW1lc2gucG9zaXRpb24ueCA9IHRyYW5zZm9ybVBvc2l0aW9uICsyO1xuICAgICAgICB9XG4gICAgICAgIGtleW1lc2gucm90YXRpb24ueCA9IDA7XG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm1Qb3NpdGlvbiArIHRyYW5zbGF0ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzZXR1cCBzY2VuZVxuICAgICAqIEBwYXJhbSBnZW9tZXRyeVxuICAgICAqIEBwYXJhbSBtYXRlcmlhbFxuICAgICAqL1xuICAgIHNldHVwU2NlbmUoZ2VvbWV0cnksIG1hdGVyaWFsKSB7XG4gICAgICAgIHZhciBsYXN0VHJhbnNmb3JtUG9zaXRpb24gPSBzdXBlci5zZXR1cFNjZW5lKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgICAgIHRoaXMuZ3JvdXAucG9zaXRpb24ueCA9IC1sYXN0VHJhbnNmb3JtUG9zaXRpb24vMiAqIDEwO1xuICAgICAgICB0aGlzLmdyb3VwLnBvc2l0aW9uLnogPSAtNDAwO1xuICAgICAgICB0aGlzLmdyb3VwLnBvc2l0aW9uLnkgPSAtMjAwO1xuICAgICAgICB0aGlzLmdyb3VwLnJvdGF0aW9uLnggPSAtTWF0aC5QSS8yO1xuICAgICAgICB0aGlzLmdyb3VwLnNjYWxlLnNldCgxMCwgMTAsIDEwKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgQmFzZUdyb3VwIGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy90cml2ci9zcmMvYmFzZWdyb3VwLmVzNic7XG5pbXBvcnQgU3R5bGUgZnJvbSAnLi4vdGhlbWVpbmcvc3R5bGUuZXM2JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGlnaHRpbmcgZXh0ZW5kcyBCYXNlR3JvdXAge1xuICAgIC8qKlxuICAgICAqIG9uIGNyZWF0ZSBzY2VuZSAob3IgZWFybGllc3QgcG9zc2libGUgb3Bwb3J0dW5pdHkpXG4gICAgICogQHBhcmFtIHNjZW5lXG4gICAgICogQHBhcmFtIGN1c3RvbVxuICAgICAqL1xuICAgIG9uQ3JlYXRlKHNjZW5lLCBjdXN0b20pIHtcbiAgICAgICAgdmFyIGxpZ2h0ID0gbmV3IFRIUkVFLkhlbWlzcGhlcmVMaWdodCggU3R5bGUubGlnaHRpbmcuaGVtaXNwaGVyZS50b3AsIFN0eWxlLmxpZ2h0aW5nLmhlbWlzcGhlcmUuYm90dG9tLCA0ICk7XG4gICAgICAgIHZhciBzcG90TGlnaHQgPSBuZXcgVEhSRUUuU3BvdExpZ2h0KCBTdHlsZS5saWdodGluZy5zcG90bGlnaHQgKTtcbiAgICAgICAgc3BvdExpZ2h0LnBvc2l0aW9uLnNldCggMCwgMCwgNDAwICk7XG4gICAgICAgIHNwb3RMaWdodC5yb3RhdGlvbi54ID0gTWF0aC5QSSAvIDI7XG5cbiAgICAgICAgc3BvdExpZ2h0LnNoYWRvdy5tYXBTaXplLndpZHRoID0gMTAyNDtcbiAgICAgICAgc3BvdExpZ2h0LnNoYWRvdy5tYXBTaXplLmhlaWdodCA9IDEwMjQ7XG5cbiAgICAgICAgc3BvdExpZ2h0LnNoYWRvdy5jYW1lcmEubmVhciA9IDEwMDtcbiAgICAgICAgc3BvdExpZ2h0LnNoYWRvdy5jYW1lcmEuZmFyID0gNDAwO1xuICAgICAgICBzcG90TGlnaHQuc2hhZG93LmNhbWVyYS5mb3YgPSAzMDtcblxuICAgICAgICB0aGlzLmFkZChzcG90TGlnaHQpO1xuICAgICAgICB0aGlzLmFkZChsaWdodCk7XG4gICAgfVxufSIsImltcG9ydCBTaGFkZXJzIGZyb20gJy4vLi4vc2hhZGVycy5lczYnO1xuaW1wb3J0IEJhc2VHcm91cCBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvdHJpdnIvc3JjL2Jhc2Vncm91cC5lczYnO1xuaW1wb3J0IFN0eWxlIGZyb20gJy4uL3RoZW1laW5nL3N0eWxlLmVzNic7XG5pbXBvcnQgVXRpbHMgZnJvbSAnLi4vdXRpbHMuZXM2JztcbmltcG9ydCBUb25lUGxheWJhY2sgZnJvbSAnLi4vdG9uZXBsYXliYWNrLmVzNic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1ldHJvbm9tZSBleHRlbmRzIEJhc2VHcm91cCB7XG4gICAgb25Jbml0aWFsaXplKCkge1xuICAgICAgICAvKipcbiAgICAgICAgICogbWV0cm9ub21lIGhhbW1lcnMgaW4gc2NlbmVcbiAgICAgICAgICogQHR5cGUge0FycmF5fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5faGFtbWVycyA9IFtdO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBzeW50aFxuICAgICAgICAgKiBAdHlwZSB7VG9uZX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIC8vdGhpcy5fc3ludGggPSBuZXcgVG9uZS5EcnVtU3ludGgoKS50b01hc3RlcigpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiB0d2VlbiB0YXJnZXRzXG4gICAgICAgICAqIEB0eXBlIHt7ZHJ1bToge2FuaW1hdGluZzogYm9vbGVhbiwgcHJvcHM6IHt9fX19XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl90d2VlblRhcmdldHMgPSB7XG4gICAgICAgICAgICBkcnVtOiB7IGFuaW1hdGluZzogZmFsc2UsIHByb3BzOiB7fSB9LFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuc2V0SGl0Q29sb3IoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzZXQgZHJ1bSBoaXQvdHJpZ2dlciBjb2xvclxuICAgICAqIEBwYXJhbSBoZXhcbiAgICAgKi9cbiAgICBzZXRIaXRDb2xvcihoZXgpIHtcbiAgICAgICAgaWYgKGhleCkge1xuICAgICAgICAgICAgdGhpcy5faGl0Q29sb3IgPSBVdGlscy5kZWNUb1JHQihoZXgsIDEwMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9oaXRDb2xvciA9IFV0aWxzLmRlY1RvUkdCKFN0eWxlLm1ldHJvbm9tZS5oYW1tZXIuaGl0Y29sb3IsIDEwMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkNyZWF0ZShzY2VuZWNvbGxlY3Rpb24sIG15Y29sbGVjdGlvbikge1xuICAgICAgICAvL3RoaXMuYWRkSGFtbWVyKCdyaWdodCcsIE1hdGguUEkvNjQsIE1hdGguUEkgKiAyLCAnQzQnKTtcbiAgICAgICAgLy90aGlzLmFkZEhhbW1lcignbGVmdCcsIE1hdGguUEkvMTI4LCBNYXRoLlBJLzQsICdBNCcpO1xuICAgICAgICB0aGlzLmFkZEhhbW1lcigndXAnLCBNYXRoLlBJLzMyLCBNYXRoLlBJLzIsICdDMycpO1xuICAgICAgICAvL3RoaXMuYWRkSGFtbWVyKCdkb3duJywgTWF0aC5QSS8zMiwgMCwgJ0YzJyk7XG4gICAgICAgIHRoaXMuYWRkRHJ1bSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG9uIHJlbmRlclxuICAgICAqIEBwYXJhbSBzY2VuZWNvbGxlY3Rpb25cbiAgICAgKiBAcGFyYW0gbXljb2xsZWN0aW9uXG4gICAgICovXG4gICAgb25SZW5kZXIoc2NlbmVjb2xsZWN0aW9uLCBteWNvbGxlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5hbmltYXRlSGFtbWVycygpO1xuICAgICAgICB0aGlzLmFuaW1hdGVEcnVtKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmVuZGVyIGN5Y2xlIGZvciBkcnVtXG4gICAgICovXG4gICAgYW5pbWF0ZURydW0oKSB7XG4gICAgICAgIGlmICh0aGlzLl90d2VlblRhcmdldHMuZHJ1bS5hbmltYXRpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuZHJ1bS5wb3NpdGlvbi56ID0gdGhpcy5fdHdlZW5UYXJnZXRzLmRydW0ucHJvcHMuelBvc2l0aW9uO1xuICAgICAgICAgICAgdGhpcy5kcnVtLm1hdGVyaWFsLmJ1bXBTY2FsZSA9IHRoaXMuX3R3ZWVuVGFyZ2V0cy5kcnVtLnByb3BzLmJ1bXBzY2FsZTtcbiAgICAgICAgICAgIHRoaXMuZHJ1bS5tYXRlcmlhbC5jb2xvci5zZXRSR0IoXG4gICAgICAgICAgICAgICAgdGhpcy5fdHdlZW5UYXJnZXRzLmRydW0ucHJvcHMuci8xMDAsXG4gICAgICAgICAgICAgICAgdGhpcy5fdHdlZW5UYXJnZXRzLmRydW0ucHJvcHMuZy8xMDAsXG4gICAgICAgICAgICAgICAgdGhpcy5fdHdlZW5UYXJnZXRzLmRydW0ucHJvcHMuYi8xMDAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJlbmRlciBjeWNsZSBmb3IgaGFtbWVyc1xuICAgICAqL1xuICAgIGFuaW1hdGVIYW1tZXJzKCkge1xuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IHRoaXMuX2hhbW1lcnMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgIHZhciBoYW1tZXIgPSB0aGlzLl9oYW1tZXJzW2NdO1xuXG4gICAgICAgICAgICBpZiAoaGFtbWVyLmFuaW1hdGluZ0dsb3cpIHtcbiAgICAgICAgICAgICAgICBoYW1tZXIuZ2xvdy5tYXRlcmlhbC5jb2xvci5zZXRSR0IoXG4gICAgICAgICAgICAgICAgICAgIGhhbW1lci5nbG93Q29sb3Iuci8xMDAsXG4gICAgICAgICAgICAgICAgICAgIGhhbW1lci5nbG93Q29sb3IuZy8xMDAsXG4gICAgICAgICAgICAgICAgICAgIGhhbW1lci5nbG93Q29sb3IuYi8xMDAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG5ld3JvdGF0aW9uID0gaGFtbWVyLnBpdm90LnJvdGF0aW9uW2hhbW1lci5yb3RhdGlvbmF4aXNdICsgaGFtbWVyLmRpcmVjdGlvbiAqIGhhbW1lci5yYXRlO1xuXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMobmV3cm90YXRpb24pID4gTWF0aC5QSSAtIE1hdGguUEkvMTYpIHtcbiAgICAgICAgICAgICAgICBoYW1tZXIuZGlyZWN0aW9uICo9IC0xO1xuICAgICAgICAgICAgICAgIG5ld3JvdGF0aW9uID0gTWF0aC5hYnMobmV3cm90YXRpb24pL25ld3JvdGF0aW9uICogKE1hdGguUEkgLSBNYXRoLlBJLzE2KTtcbiAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXJEcnVtKGhhbW1lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBoYW1tZXIucGl2b3Qucm90YXRpb25baGFtbWVyLnJvdGF0aW9uYXhpc10gPSBuZXdyb3RhdGlvbjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNvdW5kIHRoZSBkcnVtLCB0aGUgaGFtbWVyIGhpdCBpdFxuICAgICAqIEBwYXJhbSBoYW1tZXJcbiAgICAgKi9cbiAgICB0cmlnZ2VyRHJ1bShoYW1tZXIpIHtcbiAgICAgICAgVG9uZVBsYXliYWNrLm5vdGVPbihUb25lUGxheWJhY2suU1lOVEhEUlVNLCBoYW1tZXIubm90ZSwgMTAsIDEvOCk7XG4gICAgICAgLy8gdGhpcy5fc3ludGgudHJpZ2dlckF0dGFja1JlbGVhc2UoaGFtbWVyLm5vdGUsIFwiMTZuXCIpO1xuICAgICAgICBoYW1tZXIuYW5pbWF0aW5nR2xvdyA9IHRydWU7XG4gICAgICAgIHZhciBzdGFydGNvbG9yID0gVXRpbHMuZGVjVG9SR0IoU3R5bGUubWV0cm9ub21lLmhhbW1lci5jb2xvciwgMTAwKTtcbiAgICAgICAgdmFyIGVuZGNvbG9yID0gdGhpcy5faGl0Q29sb3I7XG4gICAgICAgIGhhbW1lci5nbG93Q29sb3IuciA9IHN0YXJ0Y29sb3IucjtcbiAgICAgICAgaGFtbWVyLmdsb3dDb2xvci5nID0gc3RhcnRjb2xvci5nO1xuICAgICAgICBoYW1tZXIuZ2xvd0NvbG9yLmIgPSBzdGFydGNvbG9yLmI7XG4gICAgICAgIGNyZWF0ZWpzLlR3ZWVuLmdldChoYW1tZXIuZ2xvd0NvbG9yKVxuICAgICAgICAgICAgLnRvKHsgcjogZW5kY29sb3IuciwgZzogZW5kY29sb3IuZywgYjogZW5kY29sb3IuYiB9LCA1MDApXG4gICAgICAgICAgICAudG8oeyByOiBzdGFydGNvbG9yLnIsIGc6IHN0YXJ0Y29sb3IuZywgYjogc3RhcnRjb2xvci5iIH0sIDUwMClcbiAgICAgICAgICAgIC53YWl0KDEwMCkgLy8gd2FpdCBhIGZldyB0aWNrcywgb3IgdGhlIHJlbmRlciBjeWNsZSB3b24ndCBwaWNrIHVwIHRoZSBjaGFuZ2VzIHdpdGggdGhlIGZsYWdcbiAgICAgICAgICAgIC5jYWxsKCBmdW5jdGlvbiAoc2NvcGUpIHsgc2NvcGUuYW5pbWF0aW5nR2xvdyA9IGZhbHNlOyB9ICk7XG5cbiAgICAgICAgdmFyIHN0YXJ0Y29sb3IgPSBVdGlscy5kZWNUb1JHQihTdHlsZS5tZXRyb25vbWUuZHJ1bS5jb2xvciwgMTAwKTtcbiAgICAgICAgdmFyIGVuZGNvbG9yID0gdGhpcy5faGl0Q29sb3I7XG4gICAgICAgIHRoaXMuX3R3ZWVuVGFyZ2V0cy5kcnVtLnByb3BzLnIgPSBzdGFydGNvbG9yLnI7XG4gICAgICAgIHRoaXMuX3R3ZWVuVGFyZ2V0cy5kcnVtLnByb3BzLmcgPSBzdGFydGNvbG9yLmc7XG4gICAgICAgIHRoaXMuX3R3ZWVuVGFyZ2V0cy5kcnVtLnByb3BzLmIgPSBzdGFydGNvbG9yLmI7XG4gICAgICAgIHRoaXMuX3R3ZWVuVGFyZ2V0cy5kcnVtLnByb3BzLnpQb3NpdGlvbiA9IC00MDA7XG4gICAgICAgIHRoaXMuX3R3ZWVuVGFyZ2V0cy5kcnVtLnByb3BzLmJ1bXBzY2FsZSA9IDA7XG4gICAgICAgIHRoaXMuX3R3ZWVuVGFyZ2V0cy5kcnVtLmFuaW1hdGluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuX3R3ZWVuVGFyZ2V0cy5kcnVtLmN1cnJlbnRUd2VlbiA9IGNyZWF0ZWpzLlR3ZWVuLmdldCh0aGlzLl90d2VlblRhcmdldHMuZHJ1bS5wcm9wcylcbiAgICAgICAgICAgIC50byh7XG4gICAgICAgICAgICAgICAgcjogZW5kY29sb3IuciwgZzogZW5kY29sb3IuZywgYjogZW5kY29sb3IuYixcbiAgICAgICAgICAgICAgICBidW1wc2NhbGU6IDEuNSxcbiAgICAgICAgICAgICAgICB6UG9zaXRpb246IC00MDAgKyBoYW1tZXIuZGlyZWN0aW9uICogNTAgfSwgMTUwKVxuICAgICAgICAgICAgLnRvKHtcbiAgICAgICAgICAgICAgICByOiBzdGFydGNvbG9yLnIsIGc6IHN0YXJ0Y29sb3IuZywgYjogc3RhcnRjb2xvci5iLFxuICAgICAgICAgICAgICAgIGJ1bXBzY2FsZTogMCxcbiAgICAgICAgICAgICAgICB6UG9zaXRpb246IC00MDAgfSwgMTUwKVxuICAgICAgICAgICAgLndhaXQoMTAwKSAvLyB3YWl0IGEgZmV3IHRpY2tzLCBvciB0aGUgcmVuZGVyIGN5Y2xlIHdvbid0IHBpY2sgdXAgdGhlIGNoYW5nZXMgd2l0aCB0aGUgZmxhZ1xuICAgICAgICAgICAgLmNhbGwoICgpID0+IHsgdGhpcy5fdHdlZW5UYXJnZXRzLmRydW0uYW5pbWF0aW5nID0gZmFsc2U7IH0gKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGQgY2VudGVyIGRydW1cbiAgICAgKi9cbiAgICBhZGREcnVtKCkge1xuICAgICAgICB2YXIgZHJ1bWdlb20gPSBuZXcgVEhSRUUuQ2lyY2xlR2VvbWV0cnkoIDMwLCAyNCApO1xuICAgICAgICBkcnVtZ2VvbS5zY2FsZSgxLDEsIDAuNzUpO1xuICAgICAgICB2YXIgbWFwSGVpZ2h0ID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKS5sb2FkKFN0eWxlLm1ldHJvbm9tZS5kcnVtLmJ1bXBtYXApO1xuICAgICAgICBtYXBIZWlnaHQuYW5pc290cm9weSA9IDQ7XG4gICAgICAgIG1hcEhlaWdodC5yZXBlYXQuc2V0KDEsIDEpO1xuICAgICAgICBtYXBIZWlnaHQud3JhcFMgPSBtYXBIZWlnaHQud3JhcFQgPSBUSFJFRS5DbGFtcFRvRWRnZVdyYXBwaW5nO1xuICAgICAgICBtYXBIZWlnaHQuZm9ybWF0ID0gVEhSRUUuUkdCRm9ybWF0O1xuXG4gICAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCgge1xuICAgICAgICAgICAgY29sb3I6IFN0eWxlLm1ldHJvbm9tZS5kcnVtLmNvbG9yLFxuICAgICAgICAgICAgZW1pc3NpdmU6IFN0eWxlLm1ldHJvbm9tZS5kcnVtLmVtaXNzaXZlLFxuICAgICAgICAgICAgc3BlY3VsYXI6IFN0eWxlLm1ldHJvbm9tZS5kcnVtLnNwZWN1bGFyLFxuICAgICAgICAgICAgYnVtcE1hcDogbWFwSGVpZ2h0LFxuICAgICAgICAgICAgYnVtcFNjYWxlOiAwLFxuICAgICAgICB9ICk7XG5cbiAgICAgICAgdGhpcy5kcnVtID0gbmV3IFRIUkVFLk1lc2goIGRydW1nZW9tLCBtYXRlcmlhbCApO1xuICAgICAgICB0aGlzLmRydW0ucG9zaXRpb24ueiA9IC00MDA7XG4gICAgICAgIHRoaXMuYWRkKHRoaXMuZHJ1bSwgJ2RydW0nKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGQgbWV0cm9ub21lIGhhbW1lclxuICAgICAqIEBwYXJhbSBvcmlnaW5cbiAgICAgKiBAcGFyYW0gcmF0ZVxuICAgICAqIEBwYXJhbSBvZmZzZXRcbiAgICAgKi9cbiAgICBhZGRIYW1tZXIob3JpZ2luLCByYXRlLCBvZmZzZXQsIHRvbmUpIHtcbiAgICAgICAgdmFyIGhhbW1lcmdlb20gPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoNSk7XG4gICAgICAgIHZhciBjZW50ZXJwaXZvdCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuXG4gICAgICAgIHZhciB0ZXh0dXJlQ3ViZSA9IG5ldyBUSFJFRS5DdWJlVGV4dHVyZUxvYWRlcigpLmxvYWQoU3R5bGUubWV0cm9ub21lLmhhbW1lci5yZWZyYWN0aW9uY3ViZSk7XG4gICAgICAgIHRleHR1cmVDdWJlLm1hcHBpbmcgPSBUSFJFRS5DdWJlUmVmcmFjdGlvbk1hcHBpbmc7XG5cbiAgICAgICAgdmFyIGlubmVybWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoIHtcbiAgICAgICAgICAgIGVudk1hcDogdGV4dHVyZUN1YmUgfSApO1xuXG4gICAgICAgIHZhciBvdXRlcm1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCB7XG4gICAgICAgICAgICBjb2xvcjogU3R5bGUubWV0cm9ub21lLmhhbW1lci5jb2xvcixcbiAgICAgICAgICAgIHRyYW5zcGFyZW50OiB0cnVlLFxuICAgICAgICAgICAgd2lyZWZyYW1lOiB0cnVlLFxuICAgICAgICAgICAgb3BhY2l0eTogMC41IH0gKTtcblxuXG4gICAgICAgIHZhciBoYW1tZXIgPSBuZXcgVEhSRUUuTWVzaCggaGFtbWVyZ2VvbSwgaW5uZXJtYXRlcmlhbCApO1xuICAgICAgICBoYW1tZXIubmFtZSA9ICdiYWxsJztcbiAgICAgICAgY2VudGVycGl2b3QuYWRkKGhhbW1lcik7XG4gICAgICAgIGNlbnRlcnBpdm90LnBvc2l0aW9uLnogPSAtNDAwO1xuXG4gICAgICAgIHZhciBnbG93ID0gbmV3IFRIUkVFLk1lc2goIGhhbW1lcmdlb20uY2xvbmUoKSwgb3V0ZXJtYXRlcmlhbCApO1xuICAgICAgICBnbG93Lm5hbWUgPSAnZ2xvdyc7XG4gICAgICAgIGdsb3cuc2NhbGUubXVsdGlwbHlTY2FsYXIoMS4yKTtcbiAgICAgICAgY2VudGVycGl2b3QuYWRkKGdsb3cpO1xuXG4gICAgICAgIHZhciByb3RhdGlvbmF4aXM7XG4gICAgICAgIHN3aXRjaCAob3JpZ2luKSB7XG4gICAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICAgICAgZ2xvdy5wb3NpdGlvbi54ID0gLTEwMDtcbiAgICAgICAgICAgICAgICBjZW50ZXJwaXZvdC5wb3NpdGlvbi54ID0gLTEwMDtcbiAgICAgICAgICAgICAgICBoYW1tZXIucG9zaXRpb24ueCA9IC0xMDA7XG4gICAgICAgICAgICAgICAgcm90YXRpb25heGlzID0gJ3knO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgICAgICAgICBnbG93LnBvc2l0aW9uLnggPSAxMDA7XG4gICAgICAgICAgICAgICAgY2VudGVycGl2b3QucG9zaXRpb24ueCA9IDEwMDtcbiAgICAgICAgICAgICAgICBoYW1tZXIucG9zaXRpb24ueCA9IDEwMDtcbiAgICAgICAgICAgICAgICByb3RhdGlvbmF4aXMgPSAneSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2Rvd24nOlxuICAgICAgICAgICAgICAgIGdsb3cucG9zaXRpb24ueSA9IDEwMDtcbiAgICAgICAgICAgICAgICBjZW50ZXJwaXZvdC5wb3NpdGlvbi55ID0gMTAwO1xuICAgICAgICAgICAgICAgIGhhbW1lci5wb3NpdGlvbi55ID0gMTAwO1xuICAgICAgICAgICAgICAgIHJvdGF0aW9uYXhpcyA9ICd4JztcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAndXAnOlxuICAgICAgICAgICAgICAgIGdsb3cucG9zaXRpb24ueSA9IC0xMDA7XG4gICAgICAgICAgICAgICAgY2VudGVycGl2b3QucG9zaXRpb24ueSA9IC0xMDA7XG4gICAgICAgICAgICAgICAgaGFtbWVyLnBvc2l0aW9uLnkgPSAtMTAwO1xuICAgICAgICAgICAgICAgIHJvdGF0aW9uYXhpcyA9ICd4JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGNlbnRlcnBpdm90LnJvdGF0aW9uW3JvdGF0aW9uYXhpc10gKz0gb2Zmc2V0O1xuXG4gICAgICAgIHRoaXMuX2hhbW1lcnMucHVzaCgge1xuICAgICAgICAgICAgYW5pbWF0aW5nR2xvdzogZmFsc2UsXG4gICAgICAgICAgICBnbG93OiBnbG93LFxuICAgICAgICAgICAgZ2xvd0NvbG9yOiB7fSxcbiAgICAgICAgICAgIGhhbW1lcjogaGFtbWVyLFxuICAgICAgICAgICAgcGl2b3Q6IGNlbnRlcnBpdm90LFxuICAgICAgICAgICAgZGlyZWN0aW9uOiAxLFxuICAgICAgICAgICAgcmF0ZTogcmF0ZSxcbiAgICAgICAgICAgIHJvdGF0aW9uYXhpczogcm90YXRpb25heGlzLFxuICAgICAgICAgICAgbm90ZTogdG9uZSB9XG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5hZGQoY2VudGVycGl2b3QsICdoYW1tZXInKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgQmFzZUdyb3VwIGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy90cml2ci9zcmMvYmFzZWdyb3VwLmVzNic7XG5pbXBvcnQgU3R5bGUgZnJvbSAnLi4vdGhlbWVpbmcvc3R5bGUuZXM2JztcbmltcG9ydCBVdGlscyBmcm9tICcuLi91dGlscy5lczYnO1xuaW1wb3J0IFNoYWRlcnMgZnJvbSAnLi4vc2hhZGVycy5lczYnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXJ0aWNsZUZsb2NrIGV4dGVuZHMgQmFzZUdyb3VwIHtcbiAgICAvKipcbiAgICAgKiBvbiBjcmVhdGUgc2NlbmVcbiAgICAgKiBAcGFyYW0gc2NlbmVcbiAgICAgKiBAcGFyYW0gY3VzdG9tXG4gICAgICovXG4gICAgb25DcmVhdGUoc2NlbmUsIGN1c3RvbSkge1xuICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIgPSB7XG4gICAgICAgICAgICBncHVDb21wdXRlOiBudWxsLFxuICAgICAgICAgICAgdmVsb2NpdHlWYXJpYWJsZTogbnVsbCxcbiAgICAgICAgICAgIHBvc2l0aW9uVmFyaWFibGU6IG51bGwsXG4gICAgICAgICAgICBwb3NpdGlvblVuaWZvcm1zOiBudWxsLFxuICAgICAgICAgICAgdmVsb2NpdHlVbmlmb3JtczogbnVsbCxcbiAgICAgICAgICAgIHVuaWZvcm1zOiBudWxsXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fY29sb3I7XG5cbiAgICAgICAgLyogVEVYVFVSRSBXSURUSCBGT1IgU0lNVUxBVElPTiAqL1xuICAgICAgICB0aGlzLldJRFRIID0gMzI7XG5cbiAgICAgICAgdmFyIEJJUkRTID0gdGhpcy5XSURUSCAqIHRoaXMuV0lEVEg7XG5cbiAgICAgICAgdGhpcy5tb3VzZVggPSAwO1xuICAgICAgICB0aGlzLm1vdXNlWSA9IDA7XG4gICAgICAgIHRoaXMuQk9VTkRTID0gMTAwMDtcbiAgICAgICAgdGhpcy5CT1VORFNfSEFMRiA9IHRoaXMuQk9VTkRTIC8gMjtcblxuICAgICAgICB0aGlzLmltbWVyc2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaW1tZXJzaW9uTGV2ZWxzID0geyBtaW46IC0yMDAuMCwgbWF4OiAyMDAwLjAgfTtcbiAgICAgICAgdGhpcy5pbml0Q29tcHV0ZVJlbmRlcmVyKHNjZW5lLnJlbmRlcmVyKTtcblxuICAgICAgICAvKmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZW1vdmUnLCBlID0+IHRoaXMub25Eb2N1bWVudE1vdXNlTW92ZShlKSwgZmFsc2UgKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ3RvdWNoc3RhcnQnLCBlID0+IHRoaXMub25Eb2N1bWVudFRvdWNoU3RhcnQoZSksIGZhbHNlICk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICd0b3VjaG1vdmUnLCBlID0+IHRoaXMub25Eb2N1bWVudFRvdWNoTW92ZShlKSwgZmFsc2UgKTsqL1xuICAgICAgICB0aGlzLmluaXRCaXJkcygpO1xuICAgIH1cblxuICAgIG9uRG9jdW1lbnRNb3VzZU1vdmUoIGV2ZW50ICkge1xuICAgICAgICB0aGlzLm1vdXNlWCA9IGV2ZW50LmNsaWVudFggLSA2MDA7Ly8tIHdpbmRvd0hhbGZYO1xuICAgICAgICB0aGlzLm1vdXNlWSA9IGV2ZW50LmNsaWVudFkgLSA2MDA7Ly8tIHdpbmRvd0hhbGZZO1xuICAgIH1cblxuICAgIG9uRG9jdW1lbnRUb3VjaFN0YXJ0KCBldmVudCApIHtcbiAgICAgICAgaWYgKCBldmVudC50b3VjaGVzLmxlbmd0aCA9PT0gMSApIHtcblxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdGhpcy5tb3VzZVggPSBldmVudC50b3VjaGVzWyAwIF0ucGFnZVggLSA2MDA7Ly8tIHdpbmRvd0hhbGZYO1xuICAgICAgICAgICAgdGhpcy5tb3VzZVkgPSBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkgLSA2MDA7Ly8tIHdpbmRvd0hhbGZZO1xuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkRvY3VtZW50VG91Y2hNb3ZlKCBldmVudCApIHtcblxuICAgICAgICBpZiAoIGV2ZW50LnRvdWNoZXMubGVuZ3RoID09PSAxICkge1xuXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICB0aGlzLm1vdXNlWCA9IGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCAtIDYwMDsvL3dpbmRvd0hhbGZYO1xuICAgICAgICAgICAgdGhpcy5tb3VzZVkgPSBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkgLSA2MDA7Ly93aW5kb3dIYWxmWTtcblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2V0IGRydW0gaGl0L3RyaWdnZXIgY29sb3JcbiAgICAgKiBAcGFyYW0gaGV4XG4gICAgICovXG4gICAgc2V0Q29sb3IoaGV4KSB7XG4gICAgICAgIHZhciBjb2xvcjtcbiAgICAgICAgaWYgKGhleCkge1xuICAgICAgICAgICAgY29sb3IgPSBVdGlscy5kZWNUb1JHQihoZXgsIDEpO1xuICAgICAgICAgICAgdGhpcy5pbW1lcnNlZCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb2xvciA9IFV0aWxzLmRlY1RvUkdCKFN0eWxlLmZsb2F0aW5ncGFydGljbGVzLmNvbG9yLCAxKTtcbiAgICAgICAgICAgIHRoaXMuaW1tZXJzZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5fY29sb3IgKSB7XG4gICAgICAgICAgICB0aGlzLl9jb2xvciA9IGNvbG9yO1xuICAgICAgICAgICAgdGhpcy5tZXNoLm1hdGVyaWFsLnVuaWZvcm1zLmNvbG9yLnZhbHVlID0gWyB0aGlzLl9jb2xvci5yLCB0aGlzLl9jb2xvci5nLCB0aGlzLl9jb2xvci5iIF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9jb2xvci5hbmltYXRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgY3JlYXRlanMuVHdlZW4uZ2V0KHRoaXMuX2NvbG9yKVxuICAgICAgICAgICAgICAgIC50byhjb2xvciwgMjAwMClcbiAgICAgICAgICAgICAgICAud2FpdCgxMDApIC8vIHdhaXQgYSBmZXcgdGlja3MsIG9yIHRoZSByZW5kZXIgY3ljbGUgd29uJ3QgcGljayB1cCB0aGUgY2hhbmdlcyB3aXRoIHRoZSBmbGFnXG4gICAgICAgICAgICAgICAgLmNhbGwoIGZ1bmN0aW9uKCkgeyB0aGlzLmFuaW1hdGluZyA9IGZhbHNlOyB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uUmVuZGVyKHRpbWUpIHtcblxuICAgICAgICBpZiAodGhpcy5pbW1lcnNlZCAmJiB0aGlzLmZsb2NrR1BVUmVuZGVyZXIucG9zaXRpb25Vbmlmb3Jtcy5kZXB0aC52YWx1ZSA8IHRoaXMuaW1tZXJzaW9uTGV2ZWxzLm1heCkge1xuICAgICAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnBvc2l0aW9uVW5pZm9ybXMuZGVwdGgudmFsdWUgKz0gMC41O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmltbWVyc2VkICYmIHRoaXMuZmxvY2tHUFVSZW5kZXJlci5wb3NpdGlvblVuaWZvcm1zLmRlcHRoLnZhbHVlID4gdGhpcy5pbW1lcnNpb25MZXZlbHMubWluKSB7XG4gICAgICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIucG9zaXRpb25Vbmlmb3Jtcy5kZXB0aC52YWx1ZSAtPSAwLjU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZGVsdGEgPSB0aW1lLmRlbHRhIC8gMTAwMDtcbiAgICAgICAgaWYgKGRlbHRhID4gMSkgZGVsdGEgPSAxO1xuICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIucG9zaXRpb25Vbmlmb3Jtcy50aW1lLnZhbHVlID0gdGltZS5ub3c7XG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci5wb3NpdGlvblVuaWZvcm1zLmRlbHRhLnZhbHVlID0gZGVsdGE7XG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci52ZWxvY2l0eVVuaWZvcm1zLnRpbWUudmFsdWUgPSB0aW1lLm5vdztcbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnZlbG9jaXR5VW5pZm9ybXMuZGVsdGEudmFsdWUgPSBkZWx0YTtcbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnVuaWZvcm1zLnRpbWUudmFsdWUgPSB0aW1lLm5vdztcbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnVuaWZvcm1zLmRlbHRhLnZhbHVlID0gZGVsdGE7XG4gICAgICAgIC8vdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnVuaWZvcm1zLmRlcHRoLnZhbHVlID0gLTIwMC4wO1xuXG4gICAgICAgIC8vdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnZlbG9jaXR5VW5pZm9ybXMucHJlZGF0b3IudmFsdWUuc2V0KCAwLjUgKiB0aGlzLm1vdXNlWCAvIDYwMCwgLSAwLjUgKiB0aGlzLm1vdXNlWSAvIDYwMCwgMCApO1xuICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIuZ3B1Q29tcHV0ZS5jb21wdXRlKCk7XG5cbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnVuaWZvcm1zLnRleHR1cmVQb3NpdGlvbi52YWx1ZSA9IHRoaXMuZmxvY2tHUFVSZW5kZXJlci5ncHVDb21wdXRlLmdldEN1cnJlbnRSZW5kZXJUYXJnZXQoIHRoaXMuZmxvY2tHUFVSZW5kZXJlci5wb3NpdGlvblZhcmlhYmxlICkudGV4dHVyZTtcbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnVuaWZvcm1zLnRleHR1cmVWZWxvY2l0eS52YWx1ZSA9IHRoaXMuZmxvY2tHUFVSZW5kZXJlci5ncHVDb21wdXRlLmdldEN1cnJlbnRSZW5kZXJUYXJnZXQoIHRoaXMuZmxvY2tHUFVSZW5kZXJlci52ZWxvY2l0eVZhcmlhYmxlICkudGV4dHVyZTtcblxuICAgICAgICBpZiAodGhpcy5fY29sb3IuYW5pbWF0aW5nKSB7XG4gICAgICAgICAgICB0aGlzLm1lc2gubWF0ZXJpYWwudW5pZm9ybXMuY29sb3IudmFsdWUgPSBbIHRoaXMuX2NvbG9yLnIsIHRoaXMuX2NvbG9yLmcsIHRoaXMuX2NvbG9yLmIgXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGluaXRDb21wdXRlUmVuZGVyZXIocmVuZGVyZXIpIHtcbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLmdwdUNvbXB1dGUgPSBuZXcgR1BVQ29tcHV0YXRpb25SZW5kZXJlciggdGhpcy5XSURUSCwgdGhpcy5XSURUSCwgcmVuZGVyZXIgKTtcbiAgICAgICAgdmFyIGR0UG9zaXRpb24gPSB0aGlzLmZsb2NrR1BVUmVuZGVyZXIuZ3B1Q29tcHV0ZS5jcmVhdGVUZXh0dXJlKCk7XG4gICAgICAgIHZhciBkdFZlbG9jaXR5ID0gdGhpcy5mbG9ja0dQVVJlbmRlcmVyLmdwdUNvbXB1dGUuY3JlYXRlVGV4dHVyZSgpO1xuICAgICAgICB0aGlzLmZpbGxQb3NpdGlvblRleHR1cmUoIGR0UG9zaXRpb24gKTtcbiAgICAgICAgdGhpcy5maWxsVmVsb2NpdHlUZXh0dXJlKCBkdFZlbG9jaXR5ICk7XG5cbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnZlbG9jaXR5VmFyaWFibGUgPSB0aGlzLmZsb2NrR1BVUmVuZGVyZXIuZ3B1Q29tcHV0ZS5hZGRWYXJpYWJsZSggXCJ0ZXh0dXJlVmVsb2NpdHlcIiwgU2hhZGVycy5mbG9ja3ZlbG9jaXR5LmZyYWdtZW50LCBkdFZlbG9jaXR5ICk7XG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci5wb3NpdGlvblZhcmlhYmxlID0gdGhpcy5mbG9ja0dQVVJlbmRlcmVyLmdwdUNvbXB1dGUuYWRkVmFyaWFibGUoIFwidGV4dHVyZVBvc2l0aW9uXCIsIFNoYWRlcnMuZmxvY2twb3NpdGlvbi5mcmFnbWVudCwgZHRQb3NpdGlvbiApO1xuXG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci5ncHVDb21wdXRlLnNldFZhcmlhYmxlRGVwZW5kZW5jaWVzKCB0aGlzLmZsb2NrR1BVUmVuZGVyZXIudmVsb2NpdHlWYXJpYWJsZSwgWyB0aGlzLmZsb2NrR1BVUmVuZGVyZXIucG9zaXRpb25WYXJpYWJsZSwgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnZlbG9jaXR5VmFyaWFibGUgXSApO1xuICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIuZ3B1Q29tcHV0ZS5zZXRWYXJpYWJsZURlcGVuZGVuY2llcyggdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnBvc2l0aW9uVmFyaWFibGUsIFsgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnBvc2l0aW9uVmFyaWFibGUsIHRoaXMuZmxvY2tHUFVSZW5kZXJlci52ZWxvY2l0eVZhcmlhYmxlIF0gKTtcblxuICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIucG9zaXRpb25Vbmlmb3JtcyA9IHRoaXMuZmxvY2tHUFVSZW5kZXJlci5wb3NpdGlvblZhcmlhYmxlLm1hdGVyaWFsLnVuaWZvcm1zO1xuICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIudmVsb2NpdHlVbmlmb3JtcyA9IHRoaXMuZmxvY2tHUFVSZW5kZXJlci52ZWxvY2l0eVZhcmlhYmxlLm1hdGVyaWFsLnVuaWZvcm1zO1xuXG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci5wb3NpdGlvblVuaWZvcm1zLnRpbWUgPSB7IHZhbHVlOiAwLjAgfTtcbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnBvc2l0aW9uVW5pZm9ybXMuZGVsdGEgPSB7IHZhbHVlOiAwLjAgfTtcbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnBvc2l0aW9uVW5pZm9ybXMuZGVwdGggPSB7IHZhbHVlOiAtMjAwLjAgfTtcbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnZlbG9jaXR5VW5pZm9ybXMudGltZSA9IHsgdmFsdWU6IDEuMCB9O1xuICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIudmVsb2NpdHlVbmlmb3Jtcy5kZWx0YSA9IHsgdmFsdWU6IDAuMCB9O1xuICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIudmVsb2NpdHlVbmlmb3Jtcy50ZXN0aW5nID0geyB2YWx1ZTogMS4wIH07XG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci52ZWxvY2l0eVVuaWZvcm1zLnNlcGVyYXRpb25EaXN0YW5jZSA9IHsgdmFsdWU6IDEuMCB9O1xuICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIudmVsb2NpdHlVbmlmb3Jtcy5hbGlnbm1lbnREaXN0YW5jZSA9IHsgdmFsdWU6IDEuMCB9O1xuICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIudmVsb2NpdHlVbmlmb3Jtcy5jb2hlc2lvbkRpc3RhbmNlID0geyB2YWx1ZTogMS4wIH07XG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci52ZWxvY2l0eVVuaWZvcm1zLmZyZWVkb21GYWN0b3IgPSB7IHZhbHVlOiAxLjAgfTtcbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnZlbG9jaXR5VW5pZm9ybXMucHJlZGF0b3IgPSB7IHZhbHVlOiBuZXcgVEhSRUUuVmVjdG9yMygpIH07XG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci52ZWxvY2l0eVZhcmlhYmxlLm1hdGVyaWFsLmRlZmluZXMuQk9VTkRTID0gdGhpcy5CT1VORFMudG9GaXhlZCggMiApO1xuXG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci52ZWxvY2l0eVZhcmlhYmxlLndyYXBTID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci52ZWxvY2l0eVZhcmlhYmxlLndyYXBUID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci5wb3NpdGlvblZhcmlhYmxlLndyYXBTID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci5wb3NpdGlvblZhcmlhYmxlLndyYXBUID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG5cbiAgICAgICAgdmFyIGVycm9yID0gdGhpcy5mbG9ja0dQVVJlbmRlcmVyLmdwdUNvbXB1dGUuaW5pdCgpO1xuICAgICAgICBpZiAoIGVycm9yICE9PSBudWxsICkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvciggZXJyb3IgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGluaXRCaXJkcygpIHtcbiAgICAgICAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLlN3YXJtUGFydGljbGVHZW9tZXRyeSh0aGlzLldJRFRIKTtcbiAgICAgICAgZ2VvbWV0cnkuc2NhbGUoMC41LCAwLjUsIDAuNSk7XG5cbiAgICAgICAgLy8gRm9yIFZlcnRleCBhbmQgRnJhZ21lbnRcbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnVuaWZvcm1zID0ge1xuICAgICAgICAgICAgY29sb3I6IHsgdmFsdWU6IFswLjAsMC4wLDAuMF0gfSxcbiAgICAgICAgICAgIHRleHR1cmVQb3NpdGlvbjogeyB2YWx1ZTogbnVsbCB9LFxuICAgICAgICAgICAgdGV4dHVyZVZlbG9jaXR5OiB7IHZhbHVlOiBudWxsIH0sXG4gICAgICAgICAgICB0aW1lOiB7IHZhbHVlOiAxLjAgfSxcbiAgICAgICAgICAgIGRlbHRhOiB7IHZhbHVlOiAwLjAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFNoYWRlck1hdGVyaWFsXG4gICAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5TaGFkZXJNYXRlcmlhbCgge1xuICAgICAgICAgICAgdW5pZm9ybXM6ICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci51bmlmb3JtcyxcbiAgICAgICAgICAgIHZlcnRleFNoYWRlcjogICBTaGFkZXJzLmZsb2NrLnZlcnRleCxcbiAgICAgICAgICAgIGZyYWdtZW50U2hhZGVyOiBTaGFkZXJzLmZsb2NrLmZyYWdtZW50LFxuICAgICAgICAgICAgLy9zaWRlOiBUSFJFRS5Eb3VibGVTaWRlXG4gICAgICAgICAgICAvL3RyYW5zcGFyZW50OiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMubWVzaCA9IG5ldyBUSFJFRS5NZXNoKCBnZW9tZXRyeSwgbWF0ZXJpYWwgKTtcbiAgICAgICAgdGhpcy5tZXNoLnJvdGF0aW9uLnkgPSBNYXRoLlBJIC8gMjtcbiAgICAgICAgLy8gdGhpcy5tZXNoLnBvc2l0aW9uLnogPSAtMTAwO1xuICAgICAgICAvLyB0aGlzLm1lc2gucG9zaXRpb24ueSA9IC0xMDtcbiAgICAgICAgLyp0aGlzLm1lc2guc2NhbGUueCA9IC4yO1xuICAgICAgICB0aGlzLm1lc2guc2NhbGUueSA9IC4yO1xuICAgICAgICB0aGlzLm1lc2guc2NhbGUueiA9IC4yOyovXG4gICAgICAgIHRoaXMubWVzaC5tYXRyaXhBdXRvVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tZXNoLnVwZGF0ZU1hdHJpeCgpO1xuXG4gICAgICAgIHRoaXMuYWRkKHRoaXMubWVzaCk7XG4gICAgICAgIHRoaXMuc2V0Q29sb3IoKTtcblxuICAgIH1cblxuICAgIGZpbGxQb3NpdGlvblRleHR1cmUoIHRleHR1cmUgKSB7XG4gICAgICAgIHZhciB0aGVBcnJheSA9IHRleHR1cmUuaW1hZ2UuZGF0YTtcblxuICAgICAgICBmb3IgKCB2YXIgayA9IDAsIGtsID0gdGhlQXJyYXkubGVuZ3RoOyBrIDwga2w7IGsgKz0gNCApIHtcblxuICAgICAgICAgICAgdmFyIHggPSAoTWF0aC5yYW5kb20oKSAqIHRoaXMuQk9VTkRTIC0gdGhpcy5CT1VORFNfSEFMRikvMTtcbiAgICAgICAgICAgIHZhciB5ID0gKE1hdGgucmFuZG9tKCkgKiB0aGlzLkJPVU5EUyAtIHRoaXMuQk9VTkRTX0hBTEYpLzE7XG4gICAgICAgICAgICB2YXIgeiA9IChNYXRoLnJhbmRvbSgpICogdGhpcy5CT1VORFMgLSB0aGlzLkJPVU5EU19IQUxGKS8xO1xuXG4gICAgICAgICAgICB0aGVBcnJheVsgayArIDAgXSA9IHg7XG4gICAgICAgICAgICB0aGVBcnJheVsgayArIDEgXSA9IHk7XG4gICAgICAgICAgICB0aGVBcnJheVsgayArIDIgXSA9IHo7XG4gICAgICAgICAgICB0aGVBcnJheVsgayArIDMgXSA9IDE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaWxsVmVsb2NpdHlUZXh0dXJlKCB0ZXh0dXJlICkge1xuICAgICAgICB2YXIgdGhlQXJyYXkgPSB0ZXh0dXJlLmltYWdlLmRhdGE7XG5cbiAgICAgICAgZm9yICggdmFyIGsgPSAwLCBrbCA9IHRoZUFycmF5Lmxlbmd0aDsgayA8IGtsOyBrICs9IDQgKSB7XG4gICAgICAgICAgICB2YXIgeCA9IE1hdGgucmFuZG9tKCkgLSAwLjU7XG4gICAgICAgICAgICB2YXIgeSA9IE1hdGgucmFuZG9tKCkgLSAwLjU7XG4gICAgICAgICAgICB2YXIgeiA9IE1hdGgucmFuZG9tKCkgLSAwLjU7XG5cbiAgICAgICAgICAgIHRoZUFycmF5WyBrICsgMCBdID0geCAqIDEwO1xuICAgICAgICAgICAgdGhlQXJyYXlbIGsgKyAxIF0gPSB5ICogMTA7XG4gICAgICAgICAgICB0aGVBcnJheVsgayArIDIgXSA9IHogKiAxMDtcbiAgICAgICAgICAgIHRoZUFycmF5WyBrICsgMyBdID0gMTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuIiwiaW1wb3J0IE5vdGUgZnJvbSAnLi9tdXNpY3RoZW9yeS9ub3RlLmVzNic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXMsIGNiKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBldmVudCBjYWxsYmFja1xuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fY2FsbGJhY2sgPSBjYjtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSlNPTiBjb25maWdcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2NvbmZpZyA9IHBhcmFtcztcblxuICAgICAgICAvKipcbiAgICAgICAgICoga2V5cyBkb3duXG4gICAgICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2tleXMgPSBbXTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogcG90ZW50aWFsIGtleXMgcHJlc3NlZCBpbiBvcmRlclxuICAgICAgICAgKiBAdHlwZSB7c3RyaW5nW119XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9wb3RlbnRpYWxLZXlzID0gW1xuICAgICAgICAgICAgJ2AnLCAnMScsICcyJywgJzMnLCAnNCcsICc1JywgJzYnLCAnNycsICc4JywgJzknLCAnMCcsICctJywgJysnLFxuICAgICAgICAgICAgJ3EnLCAndycsICdlJywgJ3InLCAndCcsICd5JywgJ3UnLCAnaScsICdvJywgJ3AnLCAnWycsICddJywgJ1xcXFwnLFxuICAgICAgICAgICAgJ2EnLCAncycsICdkJywgJ2YnLCAnZycsICdoJywgJ2onLCAnaycsICdsJywgJzsnLCAnXFwnJ1xuICAgICAgICBdO1xuXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBldmVudCA9PiB0aGlzLm9uS2V5RG93bihldmVudCkpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGV2ZW50ID0+IHRoaXMub25LZXlVcChldmVudCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdldCBrZXlzIGRvd25cbiAgICAgKiBAcGFyYW0gbWFwcGluZ1xuICAgICAqL1xuICAgIGdldEtleXNEb3duKCkge1xuICAgICAgICB2YXIgZG93biA9IFtdO1xuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IHRoaXMuX2tleXMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9rZXlzW2NdID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBvY3RhdmUgPSAwO1xuICAgICAgICAgICAgICAgIGlmIChjID49IHRoaXMuX2tleXMubGVuZ3RoLzIpIHsgb2N0YXZlID0gMTsgfVxuICAgICAgICAgICAgICAgIGRvd24ucHVzaCggeyBub3RhdGlvbjogTm90ZS5ub3RhdGlvbkF0SW5kZXgoYyksIG9jdGF2ZTogb2N0YXZlICsgMiwgaW5kZXg6IGMsIHZlbG9jaXR5OiB0aGlzLl9rZXlzW2NdfSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkb3duO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG9uIGtleSBkb3duXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICovXG4gICAgb25LZXlEb3duKGV2ZW50KSB7XG4gICAgICAgIHZhciBrZXkgPSB0aGlzLl9wb3RlbnRpYWxLZXlzLmluZGV4T2YoZXZlbnQua2V5LnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICBpZiAoa2V5ICE9PSAtMSAmJiAodGhpcy5fa2V5c1trZXldID09PSAwIHx8ICF0aGlzLl9rZXlzW2tleV0pKSB7XG4gICAgICAgICAgICB0aGlzLl9rZXlzW2tleV0gPSAxLjA7IC8vIG9uIGFuIGFjdHVhbCBNSURJIGtleWJvYXJkLCB3ZSdkIGhhdmUgYSB2ZWxvY2l0eVxuICAgICAgICAgICAgdmFyIG9jdGF2ZSA9IE1hdGguZmxvb3Ioa2V5IC8gTm90ZS5zaGFycE5vdGF0aW9ucy5sZW5ndGgpO1xuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2soe1xuICAgICAgICAgICAgICAgIG5vdGF0aW9uOiBOb3RlLm5vdGF0aW9uQXRJbmRleChrZXkpLFxuICAgICAgICAgICAgICAgIG9jdGF2ZTogb2N0YXZlICsgdGhpcy5fY29uZmlnLnN0YXJ0b2N0YXZlLFxuICAgICAgICAgICAgICAgIC8vaW5kZXg6IGtleSxcbiAgICAgICAgICAgICAgICB2ZWxvY2l0eTogMS4wLFxuICAgICAgICAgICAgICAgIGFjdGlvbjogJ3ByZXNzJyB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG9uIGtleSBkb3duXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICovXG4gICAgb25LZXlVcChldmVudCkge1xuICAgICAgICB2YXIga2V5ID0gdGhpcy5fcG90ZW50aWFsS2V5cy5pbmRleE9mKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgaWYgKGtleSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuX2tleXNba2V5XSA9IDAuMDsgLy8gb24gYW4gYWN0dWFsIE1JREkga2V5Ym9hcmQsIHdlJ2QgaGF2ZSBhIHZlbG9jaXR5XG4gICAgICAgICAgICB2YXIgb2N0YXZlID0gTWF0aC5mbG9vcihrZXkgLyBOb3RlLnNoYXJwTm90YXRpb25zLmxlbmd0aCk7XG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFjayh7XG4gICAgICAgICAgICAgICAgbm90YXRpb246IE5vdGUubm90YXRpb25BdEluZGV4KGtleSksXG4gICAgICAgICAgICAgICAgb2N0YXZlOiBvY3RhdmUgKyB0aGlzLl9jb25maWcuc3RhcnRvY3RhdmUsXG4gICAgICAgICAgICAgICAgLy9pbmRleDoga2V5LFxuICAgICAgICAgICAgICAgIHZlbG9jaXR5OiAwLFxuICAgICAgICAgICAgICAgIGFjdGlvbjogJ3JlbGVhc2UnIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQge1xuICBcImV4cGxvc2lvblwiOiB7XG4gICAgXCJmcmFnbWVudFwiOiBcInZhcnlpbmcgZmxvYXQgbm9pc2U7IHVuaWZvcm0gc2FtcGxlcjJEIHRFeHBsb3Npb247ICBmbG9hdCByYW5kb20oIHZlYzMgc2NhbGUsIGZsb2F0IHNlZWQgKXsgICByZXR1cm4gZnJhY3QoIHNpbiggZG90KCBnbF9GcmFnQ29vcmQueHl6ICsgc2VlZCwgc2NhbGUgKSApICogNDM3NTguNTQ1MyArIHNlZWQgKSA7IH0gIHZvaWQgbWFpbigpIHsgICAgZmxvYXQgciA9IC4wMSAqIHJhbmRvbSggdmVjMyggMTIuOTg5OCwgNzguMjMzLCAxNTEuNzE4MiApLCAwLjAgKTsgICB2ZWMyIHRQb3MgPSB2ZWMyKCAwLCAxLjAgLSAxLjMgKiBub2lzZSArIHIgKTsgICB2ZWM0IGNvbG9yID0gdGV4dHVyZTJEKCB0RXhwbG9zaW9uLCB0UG9zICk7ICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCggY29sb3IucmdiLCAxLjAgKTsgIH1cIixcbiAgICBcInZlcnRleFwiOiBcIiAgdmVjMyBtb2QyODkodmVjMyB4KSB7ICAgcmV0dXJuIHggLSBmbG9vcih4ICogKDEuMCAvIDI4OS4wKSkgKiAyODkuMDsgfSAgdmVjNCBtb2QyODkodmVjNCB4KSB7ICAgcmV0dXJuIHggLSBmbG9vcih4ICogKDEuMCAvIDI4OS4wKSkgKiAyODkuMDsgfSAgdmVjNCBwZXJtdXRlKHZlYzQgeCkgeyAgIHJldHVybiBtb2QyODkoKCh4KjM0LjApKzEuMCkqeCk7IH0gIHZlYzQgdGF5bG9ySW52U3FydCh2ZWM0IHIpIHsgICByZXR1cm4gMS43OTI4NDI5MTQwMDE1OSAtIDAuODUzNzM0NzIwOTUzMTQgKiByOyB9ICB2ZWMzIGZhZGUodmVjMyB0KSB7ICAgcmV0dXJuIHQqdCp0Kih0Kih0KjYuMC0xNS4wKSsxMC4wKTsgfSAgZmxvYXQgY25vaXNlKHZlYzMgUCkgeyAgIHZlYzMgUGkwID0gZmxvb3IoUCk7ICAgdmVjMyBQaTEgPSBQaTAgKyB2ZWMzKDEuMCk7ICAgUGkwID0gbW9kMjg5KFBpMCk7ICAgUGkxID0gbW9kMjg5KFBpMSk7ICAgdmVjMyBQZjAgPSBmcmFjdChQKTsgICB2ZWMzIFBmMSA9IFBmMCAtIHZlYzMoMS4wKTsgICB2ZWM0IGl4ID0gdmVjNChQaTAueCwgUGkxLngsIFBpMC54LCBQaTEueCk7ICAgdmVjNCBpeSA9IHZlYzQoUGkwLnl5LCBQaTEueXkpOyAgIHZlYzQgaXowID0gUGkwLnp6eno7ICAgdmVjNCBpejEgPSBQaTEuenp6ejsgICAgdmVjNCBpeHkgPSBwZXJtdXRlKHBlcm11dGUoaXgpICsgaXkpOyAgIHZlYzQgaXh5MCA9IHBlcm11dGUoaXh5ICsgaXowKTsgICB2ZWM0IGl4eTEgPSBwZXJtdXRlKGl4eSArIGl6MSk7ICAgIHZlYzQgZ3gwID0gaXh5MCAqICgxLjAgLyA3LjApOyAgIHZlYzQgZ3kwID0gZnJhY3QoZmxvb3IoZ3gwKSAqICgxLjAgLyA3LjApKSAtIDAuNTsgICBneDAgPSBmcmFjdChneDApOyAgIHZlYzQgZ3owID0gdmVjNCgwLjUpIC0gYWJzKGd4MCkgLSBhYnMoZ3kwKTsgICB2ZWM0IHN6MCA9IHN0ZXAoZ3owLCB2ZWM0KDAuMCkpOyAgIGd4MCAtPSBzejAgKiAoc3RlcCgwLjAsIGd4MCkgLSAwLjUpOyAgIGd5MCAtPSBzejAgKiAoc3RlcCgwLjAsIGd5MCkgLSAwLjUpOyAgICB2ZWM0IGd4MSA9IGl4eTEgKiAoMS4wIC8gNy4wKTsgICB2ZWM0IGd5MSA9IGZyYWN0KGZsb29yKGd4MSkgKiAoMS4wIC8gNy4wKSkgLSAwLjU7ICAgZ3gxID0gZnJhY3QoZ3gxKTsgICB2ZWM0IGd6MSA9IHZlYzQoMC41KSAtIGFicyhneDEpIC0gYWJzKGd5MSk7ICAgdmVjNCBzejEgPSBzdGVwKGd6MSwgdmVjNCgwLjApKTsgICBneDEgLT0gc3oxICogKHN0ZXAoMC4wLCBneDEpIC0gMC41KTsgICBneTEgLT0gc3oxICogKHN0ZXAoMC4wLCBneTEpIC0gMC41KTsgICAgdmVjMyBnMDAwID0gdmVjMyhneDAueCxneTAueCxnejAueCk7ICAgdmVjMyBnMTAwID0gdmVjMyhneDAueSxneTAueSxnejAueSk7ICAgdmVjMyBnMDEwID0gdmVjMyhneDAueixneTAueixnejAueik7ICAgdmVjMyBnMTEwID0gdmVjMyhneDAudyxneTAudyxnejAudyk7ICAgdmVjMyBnMDAxID0gdmVjMyhneDEueCxneTEueCxnejEueCk7ICAgdmVjMyBnMTAxID0gdmVjMyhneDEueSxneTEueSxnejEueSk7ICAgdmVjMyBnMDExID0gdmVjMyhneDEueixneTEueixnejEueik7ICAgdmVjMyBnMTExID0gdmVjMyhneDEudyxneTEudyxnejEudyk7ICAgIHZlYzQgbm9ybTAgPSB0YXlsb3JJbnZTcXJ0KHZlYzQoZG90KGcwMDAsIGcwMDApLCBkb3QoZzAxMCwgZzAxMCksIGRvdChnMTAwLCBnMTAwKSwgZG90KGcxMTAsIGcxMTApKSk7ICAgZzAwMCAqPSBub3JtMC54OyAgIGcwMTAgKj0gbm9ybTAueTsgICBnMTAwICo9IG5vcm0wLno7ICAgZzExMCAqPSBub3JtMC53OyAgIHZlYzQgbm9ybTEgPSB0YXlsb3JJbnZTcXJ0KHZlYzQoZG90KGcwMDEsIGcwMDEpLCBkb3QoZzAxMSwgZzAxMSksIGRvdChnMTAxLCBnMTAxKSwgZG90KGcxMTEsIGcxMTEpKSk7ICAgZzAwMSAqPSBub3JtMS54OyAgIGcwMTEgKj0gbm9ybTEueTsgICBnMTAxICo9IG5vcm0xLno7ICAgZzExMSAqPSBub3JtMS53OyAgICBmbG9hdCBuMDAwID0gZG90KGcwMDAsIFBmMCk7ICAgZmxvYXQgbjEwMCA9IGRvdChnMTAwLCB2ZWMzKFBmMS54LCBQZjAueXopKTsgICBmbG9hdCBuMDEwID0gZG90KGcwMTAsIHZlYzMoUGYwLngsIFBmMS55LCBQZjAueikpOyAgIGZsb2F0IG4xMTAgPSBkb3QoZzExMCwgdmVjMyhQZjEueHksIFBmMC56KSk7ICAgZmxvYXQgbjAwMSA9IGRvdChnMDAxLCB2ZWMzKFBmMC54eSwgUGYxLnopKTsgICBmbG9hdCBuMTAxID0gZG90KGcxMDEsIHZlYzMoUGYxLngsIFBmMC55LCBQZjEueikpOyAgIGZsb2F0IG4wMTEgPSBkb3QoZzAxMSwgdmVjMyhQZjAueCwgUGYxLnl6KSk7ICAgZmxvYXQgbjExMSA9IGRvdChnMTExLCBQZjEpOyAgICB2ZWMzIGZhZGVfeHl6ID0gZmFkZShQZjApOyAgIHZlYzQgbl96ID0gbWl4KHZlYzQobjAwMCwgbjEwMCwgbjAxMCwgbjExMCksIHZlYzQobjAwMSwgbjEwMSwgbjAxMSwgbjExMSksIGZhZGVfeHl6LnopOyAgIHZlYzIgbl95eiA9IG1peChuX3oueHksIG5fei56dywgZmFkZV94eXoueSk7ICAgZmxvYXQgbl94eXogPSBtaXgobl95ei54LCBuX3l6LnksIGZhZGVfeHl6LngpOyAgIHJldHVybiAyLjIgKiBuX3h5ejsgfSAgZmxvYXQgcG5vaXNlKHZlYzMgUCwgdmVjMyByZXApIHsgICB2ZWMzIFBpMCA9IG1vZChmbG9vcihQKSwgcmVwKTsgICB2ZWMzIFBpMSA9IG1vZChQaTAgKyB2ZWMzKDEuMCksIHJlcCk7ICAgUGkwID0gbW9kMjg5KFBpMCk7ICAgUGkxID0gbW9kMjg5KFBpMSk7ICAgdmVjMyBQZjAgPSBmcmFjdChQKTsgICB2ZWMzIFBmMSA9IFBmMCAtIHZlYzMoMS4wKTsgICB2ZWM0IGl4ID0gdmVjNChQaTAueCwgUGkxLngsIFBpMC54LCBQaTEueCk7ICAgdmVjNCBpeSA9IHZlYzQoUGkwLnl5LCBQaTEueXkpOyAgIHZlYzQgaXowID0gUGkwLnp6eno7ICAgdmVjNCBpejEgPSBQaTEuenp6ejsgICAgdmVjNCBpeHkgPSBwZXJtdXRlKHBlcm11dGUoaXgpICsgaXkpOyAgIHZlYzQgaXh5MCA9IHBlcm11dGUoaXh5ICsgaXowKTsgICB2ZWM0IGl4eTEgPSBwZXJtdXRlKGl4eSArIGl6MSk7ICAgIHZlYzQgZ3gwID0gaXh5MCAqICgxLjAgLyA3LjApOyAgIHZlYzQgZ3kwID0gZnJhY3QoZmxvb3IoZ3gwKSAqICgxLjAgLyA3LjApKSAtIDAuNTsgICBneDAgPSBmcmFjdChneDApOyAgIHZlYzQgZ3owID0gdmVjNCgwLjUpIC0gYWJzKGd4MCkgLSBhYnMoZ3kwKTsgICB2ZWM0IHN6MCA9IHN0ZXAoZ3owLCB2ZWM0KDAuMCkpOyAgIGd4MCAtPSBzejAgKiAoc3RlcCgwLjAsIGd4MCkgLSAwLjUpOyAgIGd5MCAtPSBzejAgKiAoc3RlcCgwLjAsIGd5MCkgLSAwLjUpOyAgICB2ZWM0IGd4MSA9IGl4eTEgKiAoMS4wIC8gNy4wKTsgICB2ZWM0IGd5MSA9IGZyYWN0KGZsb29yKGd4MSkgKiAoMS4wIC8gNy4wKSkgLSAwLjU7ICAgZ3gxID0gZnJhY3QoZ3gxKTsgICB2ZWM0IGd6MSA9IHZlYzQoMC41KSAtIGFicyhneDEpIC0gYWJzKGd5MSk7ICAgdmVjNCBzejEgPSBzdGVwKGd6MSwgdmVjNCgwLjApKTsgICBneDEgLT0gc3oxICogKHN0ZXAoMC4wLCBneDEpIC0gMC41KTsgICBneTEgLT0gc3oxICogKHN0ZXAoMC4wLCBneTEpIC0gMC41KTsgICAgdmVjMyBnMDAwID0gdmVjMyhneDAueCxneTAueCxnejAueCk7ICAgdmVjMyBnMTAwID0gdmVjMyhneDAueSxneTAueSxnejAueSk7ICAgdmVjMyBnMDEwID0gdmVjMyhneDAueixneTAueixnejAueik7ICAgdmVjMyBnMTEwID0gdmVjMyhneDAudyxneTAudyxnejAudyk7ICAgdmVjMyBnMDAxID0gdmVjMyhneDEueCxneTEueCxnejEueCk7ICAgdmVjMyBnMTAxID0gdmVjMyhneDEueSxneTEueSxnejEueSk7ICAgdmVjMyBnMDExID0gdmVjMyhneDEueixneTEueixnejEueik7ICAgdmVjMyBnMTExID0gdmVjMyhneDEudyxneTEudyxnejEudyk7ICAgIHZlYzQgbm9ybTAgPSB0YXlsb3JJbnZTcXJ0KHZlYzQoZG90KGcwMDAsIGcwMDApLCBkb3QoZzAxMCwgZzAxMCksIGRvdChnMTAwLCBnMTAwKSwgZG90KGcxMTAsIGcxMTApKSk7ICAgZzAwMCAqPSBub3JtMC54OyAgIGcwMTAgKj0gbm9ybTAueTsgICBnMTAwICo9IG5vcm0wLno7ICAgZzExMCAqPSBub3JtMC53OyAgIHZlYzQgbm9ybTEgPSB0YXlsb3JJbnZTcXJ0KHZlYzQoZG90KGcwMDEsIGcwMDEpLCBkb3QoZzAxMSwgZzAxMSksIGRvdChnMTAxLCBnMTAxKSwgZG90KGcxMTEsIGcxMTEpKSk7ICAgZzAwMSAqPSBub3JtMS54OyAgIGcwMTEgKj0gbm9ybTEueTsgICBnMTAxICo9IG5vcm0xLno7ICAgZzExMSAqPSBub3JtMS53OyAgICBmbG9hdCBuMDAwID0gZG90KGcwMDAsIFBmMCk7ICAgZmxvYXQgbjEwMCA9IGRvdChnMTAwLCB2ZWMzKFBmMS54LCBQZjAueXopKTsgICBmbG9hdCBuMDEwID0gZG90KGcwMTAsIHZlYzMoUGYwLngsIFBmMS55LCBQZjAueikpOyAgIGZsb2F0IG4xMTAgPSBkb3QoZzExMCwgdmVjMyhQZjEueHksIFBmMC56KSk7ICAgZmxvYXQgbjAwMSA9IGRvdChnMDAxLCB2ZWMzKFBmMC54eSwgUGYxLnopKTsgICBmbG9hdCBuMTAxID0gZG90KGcxMDEsIHZlYzMoUGYxLngsIFBmMC55LCBQZjEueikpOyAgIGZsb2F0IG4wMTEgPSBkb3QoZzAxMSwgdmVjMyhQZjAueCwgUGYxLnl6KSk7ICAgZmxvYXQgbjExMSA9IGRvdChnMTExLCBQZjEpOyAgICB2ZWMzIGZhZGVfeHl6ID0gZmFkZShQZjApOyAgIHZlYzQgbl96ID0gbWl4KHZlYzQobjAwMCwgbjEwMCwgbjAxMCwgbjExMCksIHZlYzQobjAwMSwgbjEwMSwgbjAxMSwgbjExMSksIGZhZGVfeHl6LnopOyAgIHZlYzIgbl95eiA9IG1peChuX3oueHksIG5fei56dywgZmFkZV94eXoueSk7ICAgZmxvYXQgbl94eXogPSBtaXgobl95ei54LCBuX3l6LnksIGZhZGVfeHl6LngpOyAgIHJldHVybiAyLjIgKiBuX3h5ejsgfSAgdmFyeWluZyBmbG9hdCBub2lzZTsgdW5pZm9ybSBmbG9hdCB0aW1lOyAgZmxvYXQgdHVyYnVsZW5jZSggdmVjMyBwICkgeyAgIGZsb2F0IHcgPSAxMDAuMDsgICBmbG9hdCB0ID0gLS41OyAgIGZvciAoZmxvYXQgZiA9IDEuMCA7IGYgPD0gMTAuMCA7IGYrKyApeyAgICAgZmxvYXQgcG93ZXIgPSBwb3coIDIuMCwgZiApOyAgICAgdCArPSBhYnMoIHBub2lzZSggdmVjMyggcG93ZXIgKiBwICksIHZlYzMoIDEwLjAsIDEwLjAsIDEwLjAgKSApIC8gcG93ZXIgKTsgICB9ICAgcmV0dXJuIHQ7IH0gIHZvaWQgbWFpbigpIHsgICBub2lzZSA9IDEwLjAgKiAgLS4xMCAqIHR1cmJ1bGVuY2UoIC41ICogbm9ybWFsICsgdGltZSApOyAgIGZsb2F0IGIgPSA1LjAgKiBwbm9pc2UoIDAuMDUgKiBwb3NpdGlvbiArIHZlYzMoIDIuMCAqIHRpbWUgKSwgdmVjMyggMTAwLjAgKSApOyAgIGZsb2F0IGRpc3BsYWNlbWVudCA9IC0gMTAuICogbm9pc2UgKyBiOyAgICB2ZWMzIG5ld1Bvc2l0aW9uID0gcG9zaXRpb24gKyBub3JtYWwgKiBkaXNwbGFjZW1lbnQ7ICAgZ2xfUG9zaXRpb24gPSBwcm9qZWN0aW9uTWF0cml4ICogbW9kZWxWaWV3TWF0cml4ICogdmVjNCggbmV3UG9zaXRpb24sIDEuMCApOyAgfVwiXG4gIH0sXG4gIFwiZmxvY2tcIjoge1xuICAgIFwiZnJhZ21lbnRcIjogXCJ1bmlmb3JtIHZlYzMgY29sb3I7ICB2b2lkIG1haW4oKSB7ICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KCBjb2xvciwgMC4xICk7IH0gXCIsXG4gICAgXCJ2ZXJ0ZXhcIjogXCJhdHRyaWJ1dGUgdmVjMiByZWZlcmVuY2U7IGF0dHJpYnV0ZSBmbG9hdCB2ZXJ0ZXg7ICB1bmlmb3JtIHNhbXBsZXIyRCB0ZXh0dXJlUG9zaXRpb247IHVuaWZvcm0gc2FtcGxlcjJEIHRleHR1cmVWZWxvY2l0eTsgIHVuaWZvcm0gZmxvYXQgdGltZTsgIHZvaWQgbWFpbigpIHsgICAgICB2ZWM0IHRtcFBvcyA9IHRleHR1cmUyRCggdGV4dHVyZVBvc2l0aW9uLCByZWZlcmVuY2UgKTsgICAgIHZlYzMgcG9zID0gdG1wUG9zLnh5ejsgICAgIHZlYzMgdmVsb2NpdHkgPSBub3JtYWxpemUodGV4dHVyZTJEKCB0ZXh0dXJlVmVsb2NpdHksIHJlZmVyZW5jZSApLnh5eik7ICAgICAgdmVjMyBuZXdQb3NpdGlvbiA9IHBvc2l0aW9uOyAgICAgIGlmICggdmVydGV4ID09IDQuMCB8fCB2ZXJ0ZXggPT0gNy4wICkgeyAgICAgICAgICAgICAgICAgbmV3UG9zaXRpb24ueSA9IHNpbiggdG1wUG9zLncgKSAqIDUuOyAgICAgfSAgICAgIG5ld1Bvc2l0aW9uID0gbWF0MyggbW9kZWxNYXRyaXggKSAqIG5ld1Bvc2l0aW9uOyAgICAgICB2ZWxvY2l0eS56ICo9IC0xLjsgICAgIGZsb2F0IHh6ID0gbGVuZ3RoKCB2ZWxvY2l0eS54eiApOyAgICAgZmxvYXQgeHl6ID0gMS47ICAgICBmbG9hdCB4ID0gc3FydCggMS4gLSB2ZWxvY2l0eS55ICogdmVsb2NpdHkueSApOyAgICAgIGZsb2F0IGNvc3J5ID0gdmVsb2NpdHkueCAvIHh6OyAgICAgZmxvYXQgc2lucnkgPSB2ZWxvY2l0eS56IC8geHo7ICAgICAgZmxvYXQgY29zcnogPSB4IC8geHl6OyAgICAgZmxvYXQgc2lucnogPSB2ZWxvY2l0eS55IC8geHl6OyAgICAgIG1hdDMgbWF0eSA9ICBtYXQzKCAgICAgICAgIGNvc3J5LCAwLCAtc2lucnksICAgICAgICAgMCAgICAsIDEsIDAgICAgICwgICAgICAgICBzaW5yeSwgMCwgY29zcnkgICAgICApOyAgICAgIG1hdDMgbWF0eiA9ICBtYXQzKCAgICAgICAgIGNvc3J6ICwgc2lucnosIDAsICAgICAgICAgLXNpbnJ6LCBjb3NyeiwgMCwgICAgICAgICAwICAgICAsIDAgICAgLCAxICAgICApOyAgICAgIG5ld1Bvc2l0aW9uID0gIG1hdHkgKiBtYXR6ICogbmV3UG9zaXRpb247ICAgICBuZXdQb3NpdGlvbiArPSBwb3M7ICAgICBnbF9Qb3NpdGlvbiA9IHByb2plY3Rpb25NYXRyaXggKiAgdmlld01hdHJpeCAgKiB2ZWM0KCBuZXdQb3NpdGlvbiwgMS4wICk7IH0gXCJcbiAgfSxcbiAgXCJmbG9ja3Bvc2l0aW9uXCI6IHtcbiAgICBcImZyYWdtZW50XCI6IFwidW5pZm9ybSBmbG9hdCB0aW1lOyB1bmlmb3JtIGZsb2F0IGRlbHRhOyB1bmlmb3JtIGZsb2F0IGRlcHRoOyAgdm9pZCBtYWluKCkgeyAgICAgIHZlYzIgdXYgPSBnbF9GcmFnQ29vcmQueHkgLyByZXNvbHV0aW9uLnh5OyAgICAgdmVjNCB0bXBQb3MgPSB0ZXh0dXJlMkQoIHRleHR1cmVQb3NpdGlvbiwgdXYgKTsgICAgIHZlYzMgcG9zaXRpb24gPSB0bXBQb3MueHl6OyAgICAgdmVjMyB2ZWxvY2l0eSA9IHRleHR1cmUyRCggdGV4dHVyZVZlbG9jaXR5LCB1diApLnh5ejsgICAgICBmbG9hdCBwaGFzZSA9IHRtcFBvcy53OyAgICAgIHBoYXNlID0gbW9kKCAoIHBoYXNlICsgZGVsdGEgKyAgICAgICAgIGxlbmd0aCggdmVsb2NpdHkueHogKSAqIGRlbHRhICogMy4gKyAgICAgICAgIG1heCggdmVsb2NpdHkueSwgMC4wICkgKiBkZWx0YSAqIDYuICksIDYyLjgzICk7ICAgICAgdmVjMyBjYWxjdWxhdGVkUG9zID0gdmVjMyggcG9zaXRpb24gKyB2ZWxvY2l0eSAqIGRlbHRhICogMTUuKTsgICAgIGNhbGN1bGF0ZWRQb3MueSA9IGNsYW1wKCBjYWxjdWxhdGVkUG9zLnksIC0yMDAwLjAsIGRlcHRoKTsgICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoIGNhbGN1bGF0ZWRQb3MsIHBoYXNlKTsgIH0gXCJcbiAgfSxcbiAgXCJmbG9ja3ZlbG9jaXR5XCI6IHtcbiAgICBcImZyYWdtZW50XCI6IFwidW5pZm9ybSBmbG9hdCB0aW1lOyB1bmlmb3JtIGZsb2F0IHRlc3Rpbmc7IHVuaWZvcm0gZmxvYXQgZGVsdGE7IHVuaWZvcm0gZmxvYXQgc2VwZXJhdGlvbkRpc3RhbmNlOyB1bmlmb3JtIGZsb2F0IGFsaWdubWVudERpc3RhbmNlOyB1bmlmb3JtIGZsb2F0IGNvaGVzaW9uRGlzdGFuY2U7IHVuaWZvcm0gZmxvYXQgZnJlZWRvbUZhY3RvcjsgIGNvbnN0IGZsb2F0IHdpZHRoID0gcmVzb2x1dGlvbi54OyBjb25zdCBmbG9hdCBoZWlnaHQgPSByZXNvbHV0aW9uLnk7ICBjb25zdCBmbG9hdCBQSSA9IDMuMTQxNTkyNjUzNTg5NzkzOyBjb25zdCBmbG9hdCBQSV8yID0gUEkgKiAyLjA7ICBmbG9hdCB6b25lUmFkaXVzID0gMTYwLjA7IGZsb2F0IHpvbmVSYWRpdXNTcXVhcmVkID0gMjU2MDAuMDsgIGZsb2F0IHNlcGFyYXRpb25UaHJlc2ggPSAwLjQ1OyBmbG9hdCBhbGlnbm1lbnRUaHJlc2ggPSAwLjY1OyAgY29uc3QgZmxvYXQgVVBQRVJfQk9VTkRTID0gQk9VTkRTOyBjb25zdCBmbG9hdCBMT1dFUl9CT1VORFMgPSAtVVBQRVJfQk9VTkRTOyAgY29uc3QgZmxvYXQgU1BFRURfTElNSVQgPSA5LjA7ICBmbG9hdCByYW5kKHZlYzIgY28peyAgICAgcmV0dXJuIGZyYWN0KHNpbihkb3QoY28ueHkgLHZlYzIoMTIuOTg5OCw3OC4yMzMpKSkgKiA0Mzc1OC41NDUzKTsgfSAgdm9pZCBtYWluKCkgeyAgICAgIHpvbmVSYWRpdXMgPSBzZXBlcmF0aW9uRGlzdGFuY2UgKyBhbGlnbm1lbnREaXN0YW5jZSArIGNvaGVzaW9uRGlzdGFuY2U7ICAgICBzZXBhcmF0aW9uVGhyZXNoID0gc2VwZXJhdGlvbkRpc3RhbmNlIC8gem9uZVJhZGl1czsgICAgIGFsaWdubWVudFRocmVzaCA9ICggc2VwZXJhdGlvbkRpc3RhbmNlICsgYWxpZ25tZW50RGlzdGFuY2UgKSAvIHpvbmVSYWRpdXM7ICAgICB6b25lUmFkaXVzU3F1YXJlZCA9IHpvbmVSYWRpdXMgKiB6b25lUmFkaXVzOyAgICAgICB2ZWMyIHV2ID0gZ2xfRnJhZ0Nvb3JkLnh5IC8gcmVzb2x1dGlvbi54eTsgICAgIHZlYzMgZmxvY2twb3NpdGlvbiwgZmxvY2t2ZWxvY2l0eTsgICAgICB2ZWMzIHNlbGZQb3NpdGlvbiA9IHRleHR1cmUyRCggdGV4dHVyZVBvc2l0aW9uLCB1diApLnh5ejsgICAgIHZlYzMgc2VsZlZlbG9jaXR5ID0gdGV4dHVyZTJEKCB0ZXh0dXJlVmVsb2NpdHksIHV2ICkueHl6OyAgICAgIGZsb2F0IGRpc3Q7ICAgICB2ZWMzIGRpcjsgICAgIGZsb2F0IGRpc3RTcXVhcmVkOyAgICAgIGZsb2F0IHNlcGVyYXRpb25TcXVhcmVkID0gc2VwZXJhdGlvbkRpc3RhbmNlICogc2VwZXJhdGlvbkRpc3RhbmNlOyAgICAgZmxvYXQgY29oZXNpb25TcXVhcmVkID0gY29oZXNpb25EaXN0YW5jZSAqIGNvaGVzaW9uRGlzdGFuY2U7ICAgICAgZmxvYXQgZjsgICAgIGZsb2F0IHBlcmNlbnQ7ICAgICAgdmVjMyB2ZWxvY2l0eSA9IHNlbGZWZWxvY2l0eTsgICAgICBmbG9hdCBsaW1pdCA9IFNQRUVEX0xJTUlUOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVjMyBjZW50cmFsID0gdmVjMyggMC4sIDAuLCAwLiApOyAgICAgZGlyID0gc2VsZlBvc2l0aW9uIC0gY2VudHJhbDsgICAgIGRpc3QgPSBsZW5ndGgoIGRpciApOyAgICAgIGRpci55ICo9IDIuNTsgICAgIHZlbG9jaXR5IC09IG5vcm1hbGl6ZSggZGlyICkgKiBkZWx0YSAqIDUuOyAgICAgIGZvciAoZmxvYXQgeT0wLjA7eTxoZWlnaHQ7eSsrKSB7ICAgICAgICAgZm9yIChmbG9hdCB4PTAuMDt4PHdpZHRoO3grKykgeyAgICAgICAgICAgICAgdmVjMiByZWYgPSB2ZWMyKCB4ICsgMC41LCB5ICsgMC41ICkgLyByZXNvbHV0aW9uLnh5OyAgICAgICAgICAgICBmbG9ja3Bvc2l0aW9uID0gdGV4dHVyZTJEKCB0ZXh0dXJlUG9zaXRpb24sIHJlZiApLnh5ejsgICAgICAgICAgICAgIGRpciA9IGZsb2NrcG9zaXRpb24gLSBzZWxmUG9zaXRpb247ICAgICAgICAgICAgIGRpc3QgPSBsZW5ndGgoZGlyKTsgICAgICAgICAgICAgIGlmIChkaXN0IDwgMC4wMDAxKSBjb250aW51ZTsgICAgICAgICAgICAgIGRpc3RTcXVhcmVkID0gZGlzdCAqIGRpc3Q7ICAgICAgICAgICAgICBpZiAoZGlzdFNxdWFyZWQgPiB6b25lUmFkaXVzU3F1YXJlZCApIGNvbnRpbnVlOyAgICAgICAgICAgICAgcGVyY2VudCA9IGRpc3RTcXVhcmVkIC8gem9uZVJhZGl1c1NxdWFyZWQ7ICAgICAgICAgICAgICBpZiAoIHBlcmNlbnQgPCBzZXBhcmF0aW9uVGhyZXNoICkgeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmID0gKHNlcGFyYXRpb25UaHJlc2ggLyBwZXJjZW50IC0gMS4wKSAqIGRlbHRhOyAgICAgICAgICAgICAgICAgdmVsb2NpdHkgLT0gbm9ybWFsaXplKGRpcikgKiBmOyAgICAgICAgICAgICAgfSBlbHNlIGlmICggcGVyY2VudCA8IGFsaWdubWVudFRocmVzaCApIHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxvYXQgdGhyZXNoRGVsdGEgPSBhbGlnbm1lbnRUaHJlc2ggLSBzZXBhcmF0aW9uVGhyZXNoOyAgICAgICAgICAgICAgICAgZmxvYXQgYWRqdXN0ZWRQZXJjZW50ID0gKCBwZXJjZW50IC0gc2VwYXJhdGlvblRocmVzaCApIC8gdGhyZXNoRGVsdGE7ICAgICAgICAgICAgICAgICAgZmxvY2t2ZWxvY2l0eSA9IHRleHR1cmUyRCggdGV4dHVyZVZlbG9jaXR5LCByZWYgKS54eXo7ICAgICAgICAgICAgICAgICAgZiA9ICggMC41IC0gY29zKCBhZGp1c3RlZFBlcmNlbnQgKiBQSV8yICkgKiAwLjUgKyAwLjUgKSAqIGRlbHRhOyAgICAgICAgICAgICAgICAgZmxvY2t2ZWxvY2l0eSArPSBub3JtYWxpemUoZmxvY2t2ZWxvY2l0eSkgKiBmOyAgICAgICAgICAgICAgfSBlbHNlIHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxvYXQgdGhyZXNoRGVsdGEgPSAxLjAgLSBhbGlnbm1lbnRUaHJlc2g7ICAgICAgICAgICAgICAgICBmbG9hdCBhZGp1c3RlZFBlcmNlbnQgPSAoIHBlcmNlbnQgLSBhbGlnbm1lbnRUaHJlc2ggKSAvIHRocmVzaERlbHRhOyAgICAgICAgICAgICAgICAgIGYgPSAoIDAuNSAtICggY29zKCBhZGp1c3RlZFBlcmNlbnQgKiBQSV8yICkgKiAtMC41ICsgMC41ICkgKSAqIGRlbHRhOyAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ICs9IG5vcm1hbGl6ZShkaXIpICogZjsgICAgICAgICAgICAgIH0gICAgICAgICAgfSAgICAgIH0gICAgICAgICAgICAgICAgICAgIGlmICggbGVuZ3RoKCB2ZWxvY2l0eSApID4gbGltaXQgKSB7ICAgICAgICAgdmVsb2NpdHkgPSBub3JtYWxpemUoIHZlbG9jaXR5ICkgKiBsaW1pdDsgICAgIH0gICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KCB2ZWxvY2l0eSwgMS4wICk7ICB9IFwiXG4gIH0sXG4gIFwiZ2xvd1wiOiB7XG4gICAgXCJmcmFnbWVudFwiOiBcInVuaWZvcm0gdmVjMyBnbG93Q29sb3I7IHZhcnlpbmcgZmxvYXQgaW50ZW5zaXR5OyB2b2lkIG1haW4oKSAgeyAgdmVjMyBnbG93ID0gZ2xvd0NvbG9yICogaW50ZW5zaXR5OyAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCggZ2xvdywgMS4wICk7IH1cIixcbiAgICBcInZlcnRleFwiOiBcInVuaWZvcm0gdmVjMyB2aWV3VmVjdG9yOyB1bmlmb3JtIGZsb2F0IGM7IHVuaWZvcm0gZmxvYXQgcDsgdmFyeWluZyBmbG9hdCBpbnRlbnNpdHk7IHZvaWQgbWFpbigpICB7ICAgICB2ZWMzIHZOb3JtYWwgPSBub3JtYWxpemUoIG5vcm1hbE1hdHJpeCAqIG5vcm1hbCApOyAgdmVjMyB2Tm9ybWVsID0gbm9ybWFsaXplKCBub3JtYWxNYXRyaXggKiB2aWV3VmVjdG9yICk7ICBpbnRlbnNpdHkgPSBwb3coIGMgLSBkb3Qodk5vcm1hbCwgdk5vcm1lbCksIHAgKTsgICAgICAgZ2xfUG9zaXRpb24gPSBwcm9qZWN0aW9uTWF0cml4ICogbW9kZWxWaWV3TWF0cml4ICogdmVjNCggcG9zaXRpb24sIDEuMCApOyB9XCJcbiAgfVxufSIsImV4cG9ydCBkZWZhdWx0IHtcbiAgICBuZXV0cmFsOiB7XG4gICAgICAgIHJlZDogMHg3QTY4NjksXG4gICAgICAgIGRhcmtyZWQ6IDB4MmQyNjI3LFxuICAgICAgICAvL2dyZWVuOiAweDY1ODc2RSxcblxuICAgICAgICBncmVlbjogMHhjMGM0YjYsXG4gICAgICAgIGxpZ2h0cmVkOiAweGVhZGZkYixcbiAgICAgICAgZ3JheWJsdWU6IDB4YWRhZWIwLFxuICAgICAgICBicm93bjogMHhkOGMyYjUsXG4gICAgICAgIG9yYW5nZTogMHhmMmNmYjNcbiAgICB9LFxuXG4gICAgbmVvbjoge1xuICAgICAgICBibHVlOiAweDAwZWNmZixcbiAgICAgICAgZ3JlZW46IDB4N2NmZjAwLFxuICAgICAgICB5ZWxsb3c6IDB4ZTNmZjAwLFxuICAgICAgICBvcmFuZ2U6IDB4ZmZiNDAwLFxuICAgICAgICB2aW9sZXQ6IDB4ZmQwMGZmXG4gICAgfSxcblxuICAgIGdyYXlzY2FsZTogW1xuICAgICAgICAweDAwMDAwMCxcbiAgICAgICAgMHgyYTJhMmEsXG4gICAgICAgIDB4NWE1YTVhLFxuICAgICAgICAweDhhOGE4YSxcbiAgICAgICAgMHhhYWFhYWEsXG4gICAgICAgIDB4ZmZmZmZmXG4gICAgXVxufSIsImltcG9ydCBDb2xvcnMgZnJvbSAnLi9jb2xvcnMuZXM2JztcbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBjb2xvcndoZWVsSGlnaFNhdHVyYXRpb246IFtcbiAgICAgICAgMHhmZmZhMDAsIDB4ZmZjZjAwLCAweGZmYTYwMCwgMHhmZjdkMDEsXG4gICAgICAgIDB4ZmYyMDAwLCAweGY0MjQ5NCwgMHg4YjIwYmIsIDB4MDAyNGJhLFxuICAgICAgICAweDAwN2FjNywgMHgwMGIyZDYsIDB4MDJiODAxLCAweDg0Y2UwMCBdLFxuXG4gICAgY29sb3J3aGVlbExvd1NhdHVyYXRpb246IFtcbiAgICAgICAgMHhiZmJkNDAsIDB4YmZhODQwLCAweGJmOTM0MCwgMHhiZjdkNDAsXG4gICAgICAgIDB4YmY1MTQwLCAweGM2NTM5MCwgMHg4MjM3YTQsIDB4MmU0MDhhLFxuICAgICAgICAweDMyNmY5NSwgMHgzNjhmYTEsIDB4MmU4YTJlLCAweDc0OTkzMyBdLFxuXG5cbiAgICBrZXlzOiB7XG4gICAgICAgIG5vcm1hbDoge1xuICAgICAgICAgICAgd2hpdGU6IHtcbiAgICAgICAgICAgICAgICBlbWlzc2l2ZTogQ29sb3JzLmdyYXlzY2FsZVszXSxcbiAgICAgICAgICAgICAgICBjb2xvcjogQ29sb3JzLm5ldXRyYWwucmVkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYmxhY2s6IHtcbiAgICAgICAgICAgICAgICBlbWlzc2l2ZTogQ29sb3JzLmdyYXlzY2FsZVsxXSxcbiAgICAgICAgICAgICAgICBjb2xvcjogQ29sb3JzLm5ldXRyYWwucmVkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHN1Z2dlc3RlZDoge1xuICAgICAgICAgICAgd2hpdGU6IHtcbiAgICAgICAgICAgICAgICBlbWlzc2l2ZTogQ29sb3JzLmdyYXlzY2FsZVsyXSxcbiAgICAgICAgICAgICAgICBjb2xvcjogQ29sb3JzLm5lb24uZ3JlZW5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBibGFjazoge1xuICAgICAgICAgICAgICAgIGVtaXNzaXZlOiBDb2xvcnMuZ3JheXNjYWxlWzFdLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBDb2xvcnMubmVvbi5ncmVlblxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzdHJvbmdseVN1Z2dlc3RlZDoge1xuICAgICAgICAgICAgd2hpdGU6IHtcbiAgICAgICAgICAgICAgICBlbWlzc2l2ZTogQ29sb3JzLmdyYXlzY2FsZVsyXSxcbiAgICAgICAgICAgICAgICBjb2xvcjogQ29sb3JzLm5lb24ub3JhbmdlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYmxhY2s6IHtcbiAgICAgICAgICAgICAgICBlbWlzc2l2ZTogQ29sb3JzLmdyYXlzY2FsZVsxXSxcbiAgICAgICAgICAgICAgICBjb2xvcjogQ29sb3JzLm5lb24ub3JhbmdlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cblxuICAgIH0sXG5cbiAgICBtZXRyb25vbWU6IHtcbiAgICAgICAgZHJ1bToge1xuICAgICAgICAgICAgYnVtcG1hcDogJy4vYXNzZXRzL2ltYWdlcy9yaXBwbGVtYXAuanBnJyxcbiAgICAgICAgICAgIGNvbG9yOiBDb2xvcnMubmV1dHJhbC5kYXJrcmVkLFxuICAgICAgICAgICAgaGl0Y29sb3I6IENvbG9ycy5ncmF5c2NhbGVbMF0sXG4gICAgICAgICAgICBlbWlzc2l2ZTogQ29sb3JzLmdyYXlzY2FsZVswXSxcbiAgICAgICAgICAgIHNwZWN1bGFyOiBDb2xvcnMubmV1dHJhbC5ncmF5Ymx1ZVxuICAgICAgICB9LFxuXG4gICAgICAgIGhhbW1lcjoge1xuICAgICAgICAgICAgcmVmcmFjdGlvbmN1YmU6IFtcbiAgICAgICAgICAgICAgICAnLi9hc3NldHMvaW1hZ2VzL254LmpwZycsXG4gICAgICAgICAgICAgICAgJy4vYXNzZXRzL2ltYWdlcy9ueS5qcGcnLFxuICAgICAgICAgICAgICAgICcuL2Fzc2V0cy9pbWFnZXMvbnouanBnJyxcbiAgICAgICAgICAgICAgICAnLi9hc3NldHMvaW1hZ2VzL254LmpwZycsXG4gICAgICAgICAgICAgICAgJy4vYXNzZXRzL2ltYWdlcy9ueS5qcGcnLFxuICAgICAgICAgICAgICAgICcuL2Fzc2V0cy9pbWFnZXMvbnouanBnJyBdLFxuICAgICAgICAgICAgY29sb3I6IENvbG9ycy5uZXV0cmFsLnJlZCxcbiAgICAgICAgICAgIGhpdGNvbG9yOiBDb2xvcnMuZ3JheXNjYWxlWzBdXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZG9tZToge1xuICAgICAgICBjb2xvcjogQ29sb3JzLm5ldXRyYWwuZGFya3JlZCxcbiAgICAgICAgZW1pc3NpdmU6IENvbG9ycy5uZXV0cmFsLmRhcmtyZWQsXG4gICAgICAgIHNwZWN1bGFyOiBDb2xvcnMubmV1dHJhbC5yZWRcbiAgICB9LFxuXG4gICAgZmxvYXRpbmdwYXJ0aWNsZXM6IHtcbiAgICAgICAgc3ByaXRlOiAnLi9hc3NldHMvaW1hZ2VzL3Nub3dmbGFrZTEucG5nJyxcbiAgICAgICAgY29sb3I6IENvbG9ycy5ncmF5c2NhbGVbMl1cbiAgICB9LFxuXG4gICAgbGlnaHRpbmc6IHtcbiAgICAgICAgaGVtaXNwaGVyZToge1xuICAgICAgICAgICAgdG9wOiBDb2xvcnMubmV1dHJhbC5kYXJrcmVkLFxuICAgICAgICAgICAgYm90dG9tOiBDb2xvcnMubmV1dHJhbC5ncmVlblxuICAgICAgICB9LFxuICAgICAgICBzcG90bGlnaHQ6IENvbG9ycy5ncmF5c2NhbGVbMV1cbiAgICB9XG59XG4iLCJpbXBvcnQgTm90ZSBmcm9tICcuL211c2ljdGhlb3J5L25vdGUuZXM2JztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIFNZTlRIRFJVTTogJ3N5bnRoX2RydW0nLFxuICAgIFBJQU5POiAgICAgJ2Fjb3VzdGljX2dyYW5kX3BpYW5vJyxcblxuICAgIHBsYXllclN0YXRlOiAncmVhZHknLFxuXG4gICAgLyoqXG4gICAgICogaW5zdHJ1bWVudHMgbG9hZGVkXG4gICAgICovXG4gICAgX2luc3RydW1lbnRzTG9hZGVkOiBbXSxcblxuICAgIC8qKlxuICAgICAqIHBsYXkgbWlkaSBmaWxlXG4gICAgICogQHBhcmFtIHVyaSBvZiBtaWRpZSBmaWxlXG4gICAgICovXG4gICAgcGxheSh1cmkpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJTdGF0ZSA9ICdsb2FkaW5nJztcbiAgICAgICAgTUlESS5QbGF5ZXIudGltZVdhcnAgPSAxOyAvLyBzcGVlZCB0aGUgc29uZyBpcyBwbGF5ZWQgYmFja1xuICAgICAgICBNSURJLlBsYXllci5sb2FkRmlsZSh1cmksXG4gICAgICAgICAgICAoKSA9PiB0aGlzLm9uTG9hZGVkKCksXG4gICAgICAgICAgICAoKSA9PiB0aGlzLm9uUHJvZ3Jlc3MoKSxcbiAgICAgICAgICAgIChlcnIpID0+IHRoaXMub25FcnJvcihlcnIpKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogcGF1c2UgcGxheWluZyBtaWRpIGZpbGVcbiAgICAgKi9cbiAgICBwYXVzZSgpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJTdGF0ZSA9ICdwYXVzZWQnO1xuICAgICAgICBNSURJLlBsYXllci5wYXVzZSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiByZXN1bWUgcGxheWluZyBtaWRpIGZpbGVcbiAgICAgKi9cbiAgICByZXN1bWUoKSB7XG4gICAgICAgIHRoaXMucGxheWVyU3RhdGUgPSAncGxheWluZyc7XG4gICAgICAgIE1JREkuUGxheWVyLnJlc3VtZSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBjaGVjayBpZiBpbnN0cnVtZW50IGlzIGxvYWRlZFxuICAgICAqIEBwYXJhbSBpbnN0cnVtZW50XG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgaXNJbnN0cnVtZW50TG9hZGVkKGluc3RydW1lbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuX2luc3RydW1lbnRzTG9hZGVkLmluZGV4T2YoaW5zdHJ1bWVudCkgIT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBsb2FkIGluc3RydW1lbnRcbiAgICAgKiBAcGFyYW0gaW5zdHJ1bWVudFxuICAgICAqL1xuICAgIGxvYWRJbnN0cnVtZW50KGluc3RydW1lbnQsIHBhdGgpIHtcbiAgICAgICAgTUlESS5sb2FkUGx1Z2luKHtcbiAgICAgICAgICAgIHNvdW5kZm9udFVybDogcGF0aCxcbiAgICAgICAgICAgIGluc3RydW1lbnQ6IGluc3RydW1lbnQsXG4gICAgICAgICAgICBvbnByb2dyZXNzOiAoc3RhdGUsIHByb2dyZXNzLCBpbnN0cnVtZW50KSA9PiB0aGlzLm9uSW5zdHJ1bWVudExvYWRQcm9ncmVzcyhzdGF0ZSwgcHJvZ3Jlc3MsIGluc3RydW1lbnQpLFxuICAgICAgICAgICAgb25zdWNjZXNzOiAoZXZlbnQpID0+IHRoaXMub25JbnN0cnVtZW50TG9hZGVkKGV2ZW50KSxcbiAgICAgICAgICAgIG9uZXJyb3I6IChlcnIpID0+IHRoaXMub25JbnN0cnVtZW50TG9hZGVkRXJyb3IoZXJyKSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHBsYXkgYSB0b25lXG4gICAgICogQHBhcmFtIGluc3RydW1lbnRcbiAgICAgKiBAcGFyYW0gbm90YXRpb25cbiAgICAgKiBAcGFyYW0gZHVyYXRpb25cbiAgICAgKi9cbiAgICBwbGF5VG9uZShpbnN0cnVtZW50LCBub3RhdGlvbiwgbWlkaWNoYW5uZWwsIGR1cmF0aW9uKSB7XG4gICAgICAgIGlmICghdGhpcy5pc0luc3RydW1lbnRMb2FkZWQoaW5zdHJ1bWVudCkpIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgTUlESS5wcm9ncmFtQ2hhbmdlKDAsIE1JREkuR00uYnlOYW1lW2luc3RydW1lbnRdLm51bWJlcik7XG4gICAgICAgIHZhciBkZWxheSA9IDA7IC8vIHBsYXkgb25lIG5vdGUgZXZlcnkgcXVhcnRlciBzZWNvbmRcbiAgICAgICAgdmFyIG5vdGUgPSBOb3RlLm5vdGF0aW9uVG9NSURJKG5vdGF0aW9uKTsgLy8gdGhlIE1JREkgbm90ZVxuICAgICAgICB2YXIgdmVsb2NpdHkgPSAxMjc7IC8vIGhvdyBoYXJkIHRoZSBub3RlIGhpdHNcbiAgICAgICAgLy8gcGxheSB0aGUgbm90ZVxuICAgICAgICBNSURJLnNldFZvbHVtZSgwLCAxMjcpO1xuICAgICAgICBNSURJLm5vdGVPbigwLCBub3RlLCB2ZWxvY2l0eSwgZGVsYXkpO1xuXG4gICAgICAgIGlmIChkdXJhdGlvbikge1xuICAgICAgICAgICAgTUlESS5ub3RlT2ZmKDAsIG5vdGUsIGRlbGF5ICsgZHVyYXRpb24pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIG5vdGUgb25cbiAgICAgKiBAcGFyYW0gaW5zdHJ1bWVudFxuICAgICAqIEBwYXJhbSBub3RhdGlvblxuICAgICAqIEBwYXJhbSBtaWRpY2hhbm5lbFxuICAgICAqL1xuICAgIG5vdGVPbihpbnN0cnVtZW50LCBub3RhdGlvbiwgbWlkaWNoYW5uZWwsIGR1cmF0aW9uKSB7XG4gICAgICAgIGlmICghdGhpcy5pc0luc3RydW1lbnRMb2FkZWQoaW5zdHJ1bWVudCkpIHsgcmV0dXJuOyB9XG4gICAgICAgIHZhciBub3RlID0gTm90ZS5ub3RhdGlvblRvTUlESShub3RhdGlvbik7XG4gICAgICAgIE1JREkucHJvZ3JhbUNoYW5nZShtaWRpY2hhbm5lbCwgTUlESS5HTS5ieU5hbWVbaW5zdHJ1bWVudF0ubnVtYmVyKTtcbiAgICAgICAgdmFyIHZlbG9jaXR5ID0gMTI3OyAvLyBob3cgaGFyZCB0aGUgbm90ZSBoaXRzXG4gICAgICAgIE1JREkuc2V0Vm9sdW1lKDAsIDEyNyk7XG4gICAgICAgIE1JREkubm90ZU9uKG1pZGljaGFubmVsLCBub3RlLCB2ZWxvY2l0eSwgMCk7XG5cbiAgICAgICAgaWYgKGR1cmF0aW9uKSB7XG4gICAgICAgICAgICBNSURJLm5vdGVPZmYobWlkaWNoYW5uZWwsIG5vdGUsIGR1cmF0aW9uKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBub3RlIG9mZlxuICAgICAqIEBwYXJhbSBub3RhdGlvblxuICAgICAqIEBwYXJhbSBtaWRpY2hhbm5lbFxuICAgICAqIEBwYXJhbSBkZWxheVxuICAgICAqL1xuICAgIG5vdGVPZmYobm90YXRpb24sIG1pZGljaGFubmVsLCBkZWxheSkge1xuICAgICAgICBpZiAoIWRlbGF5KSB7IGRlbGF5ID0gMDsgfVxuICAgICAgICB2YXIgbm90ZSA9IE5vdGUubm90YXRpb25Ub01JREkobm90YXRpb24pO1xuICAgICAgICBNSURJLm5vdGVPZmYobWlkaWNoYW5uZWwsIG5vdGUsIGRlbGF5KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogYWRkIGV2ZW50IGxpc3RlbmVyXG4gICAgICogQHBhcmFtIGV2ZW50dHlwZVxuICAgICAqIEBwYXJhbSBjYWxsYmFja1xuICAgICAqL1xuICAgIGFkZEV2ZW50TGlzdGVuZXIoZXZlbnR0eXBlLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAoIXRoaXMuX2xpc3RlbmVycykgeyB0aGlzLl9saXN0ZW5lcnMgPSBbXTsgfVxuICAgICAgICB0aGlzLl9saXN0ZW5lcnMucHVzaCggeyB0eXBlOiBldmVudHR5cGUsIGNhbGxiYWNrOiBjYWxsYmFjayB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogb24gaW5zdHJ1bWVudCBsb2FkZWRcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKi9cbiAgICBvbkluc3RydW1lbnRMb2FkZWQoKSB7fSxcblxuICAgIC8qKlxuICAgICAqIG9uIGluc3RydW1lbnQgbG9hZCBwcm9ncmVzc1xuICAgICAqIEBwYXJhbSBzdGF0ZVxuICAgICAqIEBwYXJhbSBwcm9ncmVzc1xuICAgICAqIEBwYXJhbSBpbnN0cnVtZW50XG4gICAgICovXG4gICAgb25JbnN0cnVtZW50TG9hZFByb2dyZXNzKHN0YXRlLCBwcm9ncmVzcywgaW5zdHJ1bWVudCkge1xuICAgICAgICBpZiAoaW5zdHJ1bWVudCAmJiBwcm9ncmVzcyA9PT0gMSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coaW5zdHJ1bWVudCArICcgbG9hZGVkJyk7XG4gICAgICAgICAgICB0aGlzLl9pbnN0cnVtZW50c0xvYWRlZC5wdXNoKGluc3RydW1lbnQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIG9uIGluc3RydW1lbnQgbG9hZGVkIGVycm9yXG4gICAgICogQHBhcmFtIGVyclxuICAgICAqL1xuICAgIG9uSW5zdHJ1bWVudExvYWRlZEVycm9yKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZygnSW5zdHJ1bWVudCBsb2FkaW5nIGVycm9yJywgZXJyKTtcbiAgICB9LFxuXG4gICAgb25Mb2FkZWQoKSB7XG4gICAgICAgIE1JREkucHJvZ3JhbUNoYW5nZSgwLCBNSURJLkdNLmJ5TmFtZVt0aGlzLlBJQU5PXS5udW1iZXIpO1xuICAgICAgICBNSURJLlBsYXllci5zdGFydCgpO1xuICAgICAgICB0aGlzLnBsYXllclN0YXRlID0gJ3BsYXlpbmcnO1xuICAgICAgICB0aGlzLmlzUGxheWluZyA9IHRydWU7XG4gICAgICAgIE1JREkuUGxheWVyLmFkZExpc3RlbmVyKGRhdGEgPT4gdGhpcy5vbk1JRElEYXRhKGRhdGEpKTtcbiAgICB9LFxuXG4gICAgb25Qcm9ncmVzcygpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3Byb2dyZXNzJyk7XG4gICAgfSxcblxuICAgIG9uRXJyb3IoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcicsIGVycik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIG9uIG1pZGkgZGF0YSBjYWxsYmFja1xuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICovXG4gICAgb25NSURJRGF0YShkYXRhKSB7XG4gICAgICAgIGlmICh0aGlzLl9saXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgdGhpcy5fbGlzdGVuZXJzLmxlbmd0aDsgYysrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2xpc3RlbmVyc1tjXS50eXBlID09PSAnbWlkaWRhdGEnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnNbY10uY2FsbGJhY2suYXBwbHkodGhpcywgW3sgbm90ZTogZGF0YS5ub3RlIC0gMjEsIHZlbG9jaXR5OiBkYXRhLnZlbG9jaXR5IH1dKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgTm90ZSBmcm9tICcuL211c2ljdGhlb3J5L25vdGUuZXM2JztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIC8qKlxuICAgICAqIGFwcGx5IG4gbnVtYmVyIG9mIHByb3BlcnRpZXMgdG8gYW4gb2JqZWN0XG4gICAgICogQHBhcmFtIG9iamVjdFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wc1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2Ugb2YgcHJvcGVydHkgKHByZXBlbmQga2V5IG5hbWUpXG4gICAgICovXG4gICAgY29weVByb3BzVG8ob2JqZWN0LCBwcm9wcywgbmFtZXNwYWNlKSB7XG4gICAgICAgIGlmICghbmFtZXNwYWNlKSB7IG5hbWVzcGFjZSA9ICcnOyB9XG4gICAgICAgIGZvciAodmFyIGMgaW4gcHJvcHMpIHtcbiAgICAgICAgICAgIG9iamVjdFtjICsgbmFtZXNwYWNlXSA9IHByb3BzW2NdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHR1cm4gZGVjaW1hbCBjb2xvciB0byBSR0JcbiAgICAgKiBAcGFyYW0gZGVjXG4gICAgICogQHBhcmFtIG1heFxuICAgICAqIEByZXR1cm5zIHt7cjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlcn19XG4gICAgICovXG4gICAgZGVjVG9SR0IoZGVjLCBtYXgpIHtcbiAgICAgICAgaWYgKCFtYXgpIHsgbWF4ID0gMjU1OyB9XG4gICAgICAgIG1heCArPSAxOyAvLyBhaWRzIHdpdGggcm91bmRpbmdcbiAgICAgICAgdmFyIHIgPSBNYXRoLmZsb29yKGRlYyAvICgyNTYqMjU2KSk7XG4gICAgICAgIHZhciBnID0gTWF0aC5mbG9vcihkZWMgLyAyNTYpICUgMjU2O1xuICAgICAgICB2YXIgYiA9IGRlYyAlIDI1NjtcbiAgICAgICAgcmV0dXJuIHsgcjogci8yNTUgKiBtYXgsIGc6IGcvMjU1ICogbWF4LCBiOiBiLzI1NSAqIG1heCB9O1xuICAgIH0sXG5cbiAgICBSR0JUb0RlYyhyZ2IpIHtcbiAgICAgICAgcmV0dXJuIHJnYi5yIDw8IDE2ICsgcmdiLmcgPDwgMTYgKyByZ2IuYjtcbiAgICB9XG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUdyb3VwIHtcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXMpIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogcGFyZW50IGdyb3VwIG9mIGNoaWxkIG9iamVjdHMgd2Ugd2lsbCBjcmVhdGVcbiAgICAgICAgICogQHR5cGUge1RIUkVFLk9iamVjdDNEfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fZ3JvdXAgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcblxuICAgICAgICBpZiAocGFyYW1zICYmIHBhcmFtcy5hc3NldHMpIHtcbiAgICAgICAgICAgIC8vIHRvZG86IGRldGVybWluZSB3aGVuIHRvIHVzZSBKU09OIExvYWRlciwgT0JKIGxvYWRlciwgb3Igd2hhdGV2ZXJcbiAgICAgICAgICAgIHZhciBsb2FkZXIgPSBuZXcgVEhSRUUuSlNPTkxvYWRlcigpO1xuICAgICAgICAgICAgbG9hZGVyLmxvYWQocGFyYW1zLmFzc2V0cywgKGdlb21ldHJ5LCBtYXRlcmlhbHMpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uQXNzZXRzTG9hZGVkKGdlb21ldHJ5LCBtYXRlcmlhbHMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9uSW5pdGlhbGl6ZShwYXJhbXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdldCBuYW1lIG9mIGdyb3VwXG4gICAgICovXG4gICAgZ2V0IG5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb3ZlcnJpZGFibGUgbWV0aG9kc1xuICAgICAqIGxlYXZlIGVtcHR5IHRvIGJlIGEgc2ltcGxlIGFic3RyYWN0aW9uIHdlIGRvbid0IGhhdmUgdG8gY2FsbCBzdXBlciBvblxuICAgICAqIEBwYXJhbSBzY2VuZVxuICAgICAqIEBwYXJhbSBjdXN0b21cbiAgICAgKi9cbiAgICBvbkNyZWF0ZShzY2VuZSwgY3VzdG9tKSB7fTtcbiAgICBvblJlbmRlcihzY2VuZSwgY3VzdG9tKSB7fTtcbiAgICBvbkluaXRpYWxpemUocGFyYW1zKSB7fTtcbiAgICBvbkFzc2V0c0xvYWRlZChnZW9tZXRyeSwgbWF0ZXJpYWwpIHt9O1xuXG4gICAgLyoqXG4gICAgICogb24gY3JlYXRlIHNjZW5lIChvciBlYXJsaWVzdCBwb3NzaWJsZSBvcHBvcnR1bml0eSlcbiAgICAgKiBAcGFyYW0gc2NlbmVcbiAgICAgKiBAcGFyYW0gY3VzdG9tXG4gICAgICovXG4gICAgY3JlYXRlKHNjZW5lLCBjdXN0b20pIHtcbiAgICAgICAgdGhpcy5fZ3JvdXAubmFtZSA9IHRoaXMubmFtZTtcbiAgICAgICAgc2NlbmUuc2NlbmUuYWRkKHRoaXMuX2dyb3VwKTtcbiAgICAgICAgdGhpcy5vbkNyZWF0ZShzY2VuZSwgY3VzdG9tKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGQgb2JqZWN0IHRvIHNjZW5lXG4gICAgICogQHBhcmFtIG9iamVjdFxuICAgICAqL1xuICAgIGFkZChvYmplY3QsIG5hbWUpIHtcbiAgICAgICAgaWYgKCFuYW1lKSB7XG4gICAgICAgICAgICBuYW1lID0gdGhpcy5uYW1lICsgJy1jaGlsZCc7XG4gICAgICAgIH1cbiAgICAgICAgb2JqZWN0Lm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLl9ncm91cC5hZGQob2JqZWN0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBnZXQgcGFyZW50IGdyb3VwIG9iamVjdFxuICAgICAqIEByZXR1cm5zIHtUSFJFRS5PYmplY3QzRH1cbiAgICAgKi9cbiAgICBnZXQgZ3JvdXAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ncm91cDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBnZXQgY2hpbGRyZW4gb2YgdGhpcyBncm91cFxuICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgKi9cbiAgICBnZXQgY2hpbGRyZW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ncm91cC5jaGlsZHJlbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvbiBwcmVyZW5kZXIgc2NlbmVcbiAgICAgKiBAcGFyYW0gc2NlbmVcbiAgICAgKiBAcGFyYW0gY3VzdG9tXG4gICAgICovXG4gICAgcHJlUmVuZGVyKHNjZW5lLCBjdXN0b20pIHt9XG5cbiAgICAvKipcbiAgICAgKiBvbiByZW5kZXIgc2NlbmVcbiAgICAgKiBAcGFyYW0gc2NlbmVcbiAgICAgKiBAcGFyYW0gY3VzdG9tXG4gICAgICovXG4gICAgcmVuZGVyKHNjZW5lLCBjdXN0b20pIHtcbiAgICAgICAgdGhpcy5vblJlbmRlcihzY2VuZSwgY3VzdG9tKTtcbiAgICB9XG59Il19