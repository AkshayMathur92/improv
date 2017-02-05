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

var _notationtextdisplay = require('./objects/notationtextdisplay.es6');

var _notationtextdisplay2 = _interopRequireDefault(_notationtextdisplay);

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
        this._lastKey = { key: '', score: 0 };
    }

    /**
     * on key change
     * @param keys
     */


    _createClass(Improv, [{
        key: 'onKeyInputChange',
        value: function onKeyInputChange(event) {
            var _this2 = this;

            var newKey = event.predictedKey[0];
            for (var c = 0; c < event.predictedKey.length; c++) {
                if (event.predictedKey[c].key === this._lastKey.key) {
                    this._lastKey.score = event.predictedKey[c].score;
                }
            }
            if (this._lastKey.key !== newKey.key) {
                var delta = Math.abs(this._lastKey.score - event.predictedKey[0].score);
                if (delta < 1) {
                    newKey = this._lastKey;
                }
            }
            this._lastKey = newKey;

            clearTimeout(this._inactivityTimer);
            this._inactivityTimer = setTimeout(function () {
                return _this2.onInactivityTimeout();
            }, 5000);

            this._keyboard.toggleKeyPressed({
                notation: event.changed.notation,
                octave: event.changed.octave,
                velocity: event.changed.velocity });

            if (event.predictedKey.length > 0 && this.currentKeySignature !== event.predictedKey[0].key) {
                var minor = event.predictedKey[0].key.indexOf('m') > -1;
                this._notationtextdisplay.setText(event.predictedKey[0].key);
                this._keyboard.changeKeySignature(event.predictedKey[0].key);
                this._hudKeyboard.changeKeySignature(event.predictedKey[0].key);
                this.currentKeySignature = event.predictedKey[0].key;
                this._metronome.setHitColor(_style2.default.colorwheelHighSaturation[_note2.default.indexOfNotation(event.predictedKey[0].key)]);
                this._particles.setColor(_style2.default.colorwheelHighSaturation[_note2.default.indexOfNotation(event.predictedKey[0].key)]);
                //   this._dome.setEmissive(minor ? 0x1a1a1a : Style.dome.emissive);
                this._lights.setIntensity(minor ? 2 : 4);
                //this._swarm.setColor(Style.colorwheelHighSaturation[Note.indexOfNotation(newKey.key)]);
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
            this._notationtextdisplay.setText();
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
            this._metronome = new _metronome2.default(config.metronome);
            this._notationtextdisplay = new _notationtextdisplay2.default();
            this._dome = new _dome2.default();
            this._lights = new _lighting2.default();
            //this._swarm = new ParticleSwarm();
            this._particles = new _floatingparticles2.default();

            this._scene.addObjects([this._metronome,
            //this._swarm,
            this._dome, this._notationtextdisplay, this._keyboard, this._hudKeyboard, this._lights, this._particles]);

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

},{"./input.es6":2,"./musictheory/note.es6":5,"./objects/dome.es6":6,"./objects/floatingparticles.es6":7,"./objects/keyboards/circularkeyboard.es6":9,"./objects/keyboards/traditionalkeyboard.es6":10,"./objects/lighting.es6":11,"./objects/metronome.es6":12,"./objects/notationtextdisplay.es6":13,"./objects/particleflock.es6":14,"./themeing/style.es6":18,"./toneplayback.es6":19}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _qwertykeymanager = require('./qwertykeymanager.es6');

var _qwertykeymanager2 = _interopRequireDefault(_qwertykeymanager);

var _midikeymanager = require('./midikeymanager.es6');

var _midikeymanager2 = _interopRequireDefault(_midikeymanager);

var _websocketmidikeymanager = require('./websocketmidikeymanager.es6');

var _websocketmidikeymanager2 = _interopRequireDefault(_websocketmidikeymanager);

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
        } else if (params.device === 'WSMIDI') {
            this._keymanager = new _websocketmidikeymanager2.default(params, function (changed) {
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

},{"./midikeymanager.es6":3,"./musictheory/keysignatureprediction.es6":4,"./qwertykeymanager.es6":15,"./websocketmidikeymanager.es6":21}],3:[function(require,module,exports){
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
        this._keySignatureDecayRate = .9;

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
            var topscore = -1;
            for (var sig in _note2.default.keys) {
                var major = sig.indexOf('m') === -1;
                var signotation = sig;
                if (!major) {
                    signotation = signotation.slice(0, signotation.length - 1); // get rid of minor denotation in string
                }
                for (var d = 0; d < keys.length; d++) {
                    if (_note2.default.keys[sig].indexOf(keys[d].notation) !== -1) {
                        if (!keysigScores[sig]) {
                            keysigScores[sig] = 0;
                        }
                        var ksg = _note2.default.notesInKeySignature(signotation, major);
                        if (keys[d].notation === ksg[0]) {
                            keysigScores[sig] += 1.07; // root
                        } else if (keys[d].notation === ksg[2]) {
                            keysigScores[sig] += 1.06; // 3rd
                        } else if (keys[d].notation === ksg[4]) {
                            keysigScores[sig] += 1.05; // 5th
                        } else if (keys[d].notation === ksg[6]) {
                            keysigScores[sig] += 1.02; // seventh
                        } else {
                            keysigScores[sig] += 1.0;
                        }

                        if (keysigScores[sig] > topscore) {
                            topscore = keysigScores[sig];
                        }

                        if (major) {
                            keysigScores[sig] += .01;
                        }
                        /*if (keys[d].notation === sig) {
                            keysigScores[sig] += .01; // small priority boost for root note
                        }*/
                    }
                }
            }

            var scores = [];
            for (var score in keysigScores) {
                scores.push({ score: keysigScores[score], key: score, timestamp: Date.now() });
            }

            if (keys.length >= 3 && topscore >= keys.length * 1.0) {
                this.clearHistory(); // pretty clear we're holding a solid chord, and we should change entire history
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
            this._material = this.createMaterial();
            var mesh = new THREE.Mesh(this.createGeometry(), this._material);
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
    }, {
        key: 'setEmissive',
        value: function setEmissive(color) {
            this._material.emissive.setHex(color);
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

},{"../../node_modules/trivr/src/basegroup.es6":22,"../themeing/style.es6":18,"../toneplayback.es6":19}],7:[function(require,module,exports){
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
                vertex.x = Math.random() * 2000 - 500;
                vertex.y = Math.random() * 2000 - 500;
                vertex.z = Math.random() * 2000 - 500;
                geometry.vertices.push(vertex);
            }

            this.materials = [];
            for (var i = 0; i < 4; i++) {
                this.materials[i] = new THREE.PointsMaterial({
                    size: Math.random() * 2.0 + .75,
                    map: sprite,
                    blending: THREE.AdditiveBlending,
                    depthTest: true,
                    transparent: true });
                var particles = new THREE.Points(geometry, this.materials[i]);

                particles.rotation.x = Math.random() * 6;
                particles.rotation.y = Math.random() * 6;
                particles.rotation.z = Math.random() * 6;
                particles.renderOrder = 1;
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

},{"../../node_modules/trivr/src/basegroup.es6":22,"../themeing/style.es6":18,"../utils.es6":20}],8:[function(require,module,exports){
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
                    this._keys[c].colortween.steps = 1;
                    this._keys[c].colortween.animating = true;
                    var target = _utils2.default.copyPropsTo({}, _utils2.default.decToRGB(_style2.default.keys.normal[this._keys[c].type].color, 100), 'color');
                    target.steps = 0;
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

                    _toneplayback2.default.noteOn(_toneplayback2.default.PIANO, k.notation + k.octave, midichannel, null, k.velocity * 100);
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
            var ntIndex = _note2.default.keys[keysignotation].indexOf(notation);
            if (keysignotation.charAt(keysignotation.length - 1) === 'm') {
                keysignotation = keysignotation.slice(0, keysignotation.length - 1);
            }
            var keySigIndex = _note2.default.indexOfNotation(keysignotation);
            var rootclrHS = _style2.default.colorwheelHighSaturation[keySigIndex];
            var rootclrLS = _style2.default.colorwheelLowSaturation[keySigIndex];

            var keys = this.findKeyObjectsForNotation(notation);
            for (var c = 0; c < keys.length; c++) {
                if (toggle) {
                    var clr;
                    if (ntIndex === 0 || ntIndex === 2 || ntIndex === 4 || ntIndex === 6) {
                        clr = _style2.default.keys.stronglySuggested[keys[c].type];
                        keys[c].stronglySuggested = true;
                        keys[c].suggested = true;
                        keys[c].object.material.color.setHex(rootclrHS);
                    } else {
                        clr = _style2.default.keys.suggested[keys[c].type];
                        keys[c].suggested = true;
                        keys[c].stronglySuggested = false;
                        keys[c].object.material.color.setHex(rootclrLS);
                    }
                } else {
                    keys[c].object.material.color.setHex(_style2.default.keys.normal[keys[c].type].color);
                    //keys[c].object.material.emissive.setHex(Style.keys.normal[keys[c].type].emissive);
                    keys[c].suggested = false;
                    keys[c].stronglySuggested = false;
                }
            }
            return keys;
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

},{"../../../node_modules/trivr/src/basegroup.es6":22,"../../input.es6":2,"../../musictheory/note.es6":5,"../../themeing/style.es6":18,"../../toneplayback.es6":19,"../../utils.es6":20}],9:[function(require,module,exports){
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
            this.group.scale.set(8, 8, 8);
        }
    }]);

    return CircularKeyboard;
}(_basekeyboard2.default);

exports.default = CircularKeyboard;

},{"../../input.es6":2,"../../musictheory/note.es6":5,"../../themeing/style.es6":18,"../../toneplayback.es6":19,"../../utils.es6":20,"./basekeyboard.es6":8}],10:[function(require,module,exports){
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
         * on render scene
         * @param scene
         * @param custom
         */

    }, {
        key: 'onRender',
        value: function onRender(scene, custom) {
            _get(TraditionalKeyboard.prototype.__proto__ || Object.getPrototypeOf(TraditionalKeyboard.prototype), 'onRender', this).call(this, scene, custom);
            for (var c = 0; c < this._keys.length; c++) {
                if (this._keys[c].colortween.animating) {
                    var scale;
                    if (this._keys[c].stronglySuggested) {
                        scale = 0.01 + this._keys[c].colortween.steps * 1.0;
                    } else {
                        scale = 0.01 + this._keys[c].colortween.steps * 0.5;
                    }
                    this._keys[c].marker.scale.set(scale, scale, scale);
                    this._keys[c].marker.material.color.setRGB(this._keys[c].colortween.rcolor / 100, this._keys[c].colortween.gcolor / 100, this._keys[c].colortween.bcolor / 100);
                }
            }
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
            material = material.clone();
            var keymarker = new THREE.Mesh(new THREE.SphereGeometry(.25), material);
            keymarker.scale.set(.01, .01, .01);

            if (white) {
                keymarker.position.x = transformPosition + 2;
                keymarker.position.y = -11.5;
                keymarker.position.z = .75;
                material.emissive.setHex(_style2.default.keys.normal.white.emissive);
            } else {
                keymarker.position.x = transformPosition + 1;
                keymarker.position.y = -7;
                keymarker.position.z = 1.55;
                material.emissive.setHex(_style2.default.keys.normal.white.emissive);
            }

            this.add(keymarker, 'keymarker_' + notation);
            transformPosition = _get(TraditionalKeyboard.prototype.__proto__ || Object.getPrototypeOf(TraditionalKeyboard.prototype), 'addKey', this).call(this, transformPosition, white, notation, octave, geometry, material);
            this._keys[this._keys.length - 1].marker = keymarker;
            return transformPosition;
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
            var keys = _get(TraditionalKeyboard.prototype.__proto__ || Object.getPrototypeOf(TraditionalKeyboard.prototype), 'toggleKeySuggestion', this).call(this, notation, keysignotation, toggle);
            for (var c = 0; c < keys.length; c++) {
                if (toggle) {
                    if (keys[c].stronglySuggested) {
                        keys[c].marker.scale.set(1, 1, 1);
                    } else {
                        keys[c].marker.scale.set(.5, .5, .5);
                    }
                } else {
                    keys[c].marker.scale.set(.01, .01, .01);
                }
                keys[c].marker.material.color = keys[c].object.material.color;
            }
            return keys;
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
            this.group.position.z = -230;
            this.group.position.y = -200;
            this.group.rotation.x = -Math.PI / 2;
            this.group.scale.set(10, 10, 10);
        }
    }]);

    return TraditionalKeyboard;
}(_basekeyboard2.default);

exports.default = TraditionalKeyboard;

},{"../../input.es6":2,"../../musictheory/note.es6":5,"../../themeing/style.es6":18,"../../toneplayback.es6":19,"../../utils.es6":20,"./basekeyboard.es6":8}],11:[function(require,module,exports){
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
            this._light = new THREE.HemisphereLight(_style2.default.lighting.hemisphere.top, _style2.default.lighting.hemisphere.bottom, 4);
            var spotLight = new THREE.SpotLight(_style2.default.lighting.spotlight);
            spotLight.position.set(0, 0, 400);
            spotLight.rotation.x = Math.PI / 2;

            spotLight.shadow.mapSize.width = 1024;
            spotLight.shadow.mapSize.height = 1024;

            spotLight.shadow.camera.near = 100;
            spotLight.shadow.camera.far = 400;
            spotLight.shadow.camera.fov = 30;

            this.add(spotLight);
            this.add(this._light);

            this._animation = {};
        }

        /**
         * on render scene
         * @param scene
         * @param custom
         */

    }, {
        key: 'onRender',
        value: function onRender(scene, custom) {
            if (this._animation.animating) {
                this._light.intensity = this._animation.intensity;
            }
        }
    }, {
        key: 'setIntensity',
        value: function setIntensity(value) {
            this._animation = { animating: true, intensity: this._light.intensity };
            createjs.Tween.get(this._animation).to({ intensity: value }, 1000).wait(100) // wait a few ticks, or the render cycle won't pick up the changes with the flag
            .call(function () {
                this.animating = false;
            });
        }
    }]);

    return Lighting;
}(_basegroup2.default);

exports.default = Lighting;

},{"../../node_modules/trivr/src/basegroup.es6":22,"../themeing/style.es6":18}],12:[function(require,module,exports){
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
        value: function onInitialize(params) {
            this._config = params;

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
            for (var c = 0; c < this._config.hammers.length; c++) {
                this.addHammer(this._config.hammers[c].direction, Math.PI / this._config.hammers[c].rate, Math.PI / 16 * this._config.hammers[c].offset, this._config.hammers[c].notation);
            }
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

            _toneplayback2.default.noteOn(_toneplayback2.default.SYNTHDRUM, hammer.note, 10, 1 / 16, this._config.velocity);
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
                bumpscale: 0.35,
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
            this.drum.position.z = -600;
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

},{"../../node_modules/trivr/src/basegroup.es6":22,"../themeing/style.es6":18,"../toneplayback.es6":19,"../utils.es6":20,"./../shaders.es6":16}],13:[function(require,module,exports){
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
            var _this2 = this;

            var loader = new THREE.FontLoader();
            loader.load('assets/models/optimer_bold.typeface.json', function (response) {
                _this2.font = response;
            });
        }

        /**
         * on render
         * @param scenecollection
         * @param mycollection
         */

    }, {
        key: 'onRender',
        value: function onRender(scenecollection, mycollection) {}

        /**
         * set text
         * @param text
         */

    }, {
        key: 'setText',
        value: function setText(text) {
            this.createMesh(text);
        }

        /**
         * create mesh
         */

    }, {
        key: 'createMesh',
        value: function createMesh(text) {
            if (this.mesh) {
                this.group.remove(this.mesh);
            }

            if (!text) {
                return;
            }

            this.mesh = new THREE.Mesh(this.createGeometry(text), this.createMaterial(), text.length);
            this.mesh.position.z = -15;
            this.mesh.position.y = 1.20;
            if (text.length === 2) {
                this.mesh.position.x = -.65;
            } else if (text.length === 3) {
                this.mesh.position.x = -.85;
            } else {
                this.mesh.position.x = -.35;
            }
            this.mesh.name = 'notationtext';
            this.group.add(this.mesh);
        }

        /**
         * create globe geometry
         * @returns {THREE.IcosahedronGeometry}
         */

    }, {
        key: 'createGeometry',
        value: function createGeometry(text) {
            var size = .75;
            if (text.length === 3) {
                size = .55;
            }
            return new THREE.TextGeometry(text, {
                font: this.font,
                size: size,
                height: .5,
                curveSegments: 4,
                bevelThickness: 2,
                bevelSize: 1.5,
                bevelEnabled: false,
                material: 0,
                extrudeMaterial: 0
            });
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

},{"../../node_modules/trivr/src/basegroup.es6":22,"../themeing/style.es6":18}],14:[function(require,module,exports){
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

},{"../../node_modules/trivr/src/basegroup.es6":22,"../shaders.es6":16,"../themeing/style.es6":18,"../utils.es6":20}],15:[function(require,module,exports){
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

},{"./musictheory/note.es6":5}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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
        emissiveminor: _colors2.default.grayscale[1],
        specular: _colors2.default.neutral.red
    },

    floatingparticles: {
        sprite: './assets/images/particle.png',
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

},{"./colors.es6":17}],19:[function(require,module,exports){
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
    noteOn: function noteOn(instrument, notation, midichannel, duration, velocity) {
        if (!this.isInstrumentLoaded(instrument)) {
            return;
        }
        var note = _note2.default.notationToMIDI(notation);
        MIDI.programChange(midichannel, MIDI.GM.byName[instrument].number);
        if (!velocity) {
            velocity = 127;
        }
        MIDI.setVolume(0, velocity);
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

},{"./musictheory/note.es6":5}],20:[function(require,module,exports){
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

},{"./musictheory/note.es6":5}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _midikeymanager = require('./midikeymanager.es6');

var _midikeymanager2 = _interopRequireDefault(_midikeymanager);

var _note = require('./musictheory/note.es6');

var _note2 = _interopRequireDefault(_note);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_MidiKeyManager) {
    _inherits(_class, _MidiKeyManager);

    function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
        key: 'initializeDevice',

        /**
         * initialize midi device
         */
        value: function initializeDevice() {
            var _this2 = this;

            this.socket = new WebSocket('ws://localhost:8080');
            this.socket.onerror = function (error) {
                console.log('WebSocket Error ' + error);
            };

            this.socket.onmessage = function (e) {
                var msg = JSON.parse(e.data);
                _this2.onMIDIMessage(msg);
            };

            this.socket.onopen = function (e) {
                _this2.socket.send('connect');
            };
        }
    }]);

    return _class;
}(_midikeymanager2.default);

exports.default = _class;

},{"./midikeymanager.es6":3,"./musictheory/note.es6":5}],22:[function(require,module,exports){
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW1wcm92LmVzNiIsInNyYy9pbnB1dC5lczYiLCJzcmMvbWlkaWtleW1hbmFnZXIuZXM2Iiwic3JjL211c2ljdGhlb3J5L2tleXNpZ25hdHVyZXByZWRpY3Rpb24uZXM2Iiwic3JjL211c2ljdGhlb3J5L25vdGUuZXM2Iiwic3JjL29iamVjdHMvZG9tZS5lczYiLCJzcmMvb2JqZWN0cy9mbG9hdGluZ3BhcnRpY2xlcy5lczYiLCJzcmMvb2JqZWN0cy9rZXlib2FyZHMvYmFzZWtleWJvYXJkLmVzNiIsInNyYy9vYmplY3RzL2tleWJvYXJkcy9jaXJjdWxhcmtleWJvYXJkLmVzNiIsInNyYy9vYmplY3RzL2tleWJvYXJkcy90cmFkaXRpb25hbGtleWJvYXJkLmVzNiIsInNyYy9vYmplY3RzL2xpZ2h0aW5nLmVzNiIsInNyYy9vYmplY3RzL21ldHJvbm9tZS5lczYiLCJzcmMvb2JqZWN0cy9ub3RhdGlvbnRleHRkaXNwbGF5LmVzNiIsInNyYy9vYmplY3RzL3BhcnRpY2xlZmxvY2suZXM2Iiwic3JjL3F3ZXJ0eWtleW1hbmFnZXIuZXM2Iiwic3JjL3NoYWRlcnMuZXM2Iiwic3JjL3RoZW1laW5nL2NvbG9ycy5lczYiLCJzcmMvdGhlbWVpbmcvc3R5bGUuZXM2Iiwic3JjL3RvbmVwbGF5YmFjay5lczYiLCJzcmMvdXRpbHMuZXM2Iiwic3JjL3dlYnNvY2tldG1pZGlrZXltYW5hZ2VyLmVzNiIsIi4uL3RyaXZyL3NyYy9iYXNlZ3JvdXAuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0lBRXFCLE07QUFDakIsb0JBQVksS0FBWixFQUFtQixTQUFuQixFQUE4QjtBQUFBOztBQUFBOztBQUMxQjs7OztBQUlBLGFBQUssbUJBQUwsR0FBMkIsSUFBM0I7O0FBRUE7Ozs7O0FBS0EsYUFBSyxnQkFBTCxHQUF3QixJQUF4Qjs7QUFFQSxhQUFLLE1BQUwsR0FBYyxLQUFkO0FBQ0EsYUFBSyxRQUFMLEdBQWdCLElBQUksY0FBSixFQUFoQjtBQUNBLGFBQUssUUFBTCxDQUFjLGtCQUFkLEdBQW1DO0FBQUEsbUJBQU0sTUFBSyxjQUFMLEVBQU47QUFBQSxTQUFuQztBQUNBLGFBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsS0FBbkIsRUFBMEIsU0FBMUI7QUFDQSxhQUFLLFFBQUwsQ0FBYyxJQUFkO0FBQ0EsYUFBSyxRQUFMLEdBQWdCLEVBQUUsS0FBSyxFQUFQLEVBQVcsT0FBTyxDQUFsQixFQUFoQjtBQUNIOztBQUVEOzs7Ozs7Ozt5Q0FJaUIsSyxFQUFPO0FBQUE7O0FBQ3BCLGdCQUFJLFNBQVMsTUFBTSxZQUFOLENBQW1CLENBQW5CLENBQWI7QUFDQSxpQkFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE1BQU0sWUFBTixDQUFtQixNQUF2QyxFQUErQyxHQUEvQyxFQUFvRDtBQUNoRCxvQkFBSSxNQUFNLFlBQU4sQ0FBbUIsQ0FBbkIsRUFBc0IsR0FBdEIsS0FBOEIsS0FBSyxRQUFMLENBQWMsR0FBaEQsRUFBcUQ7QUFDakQseUJBQUssUUFBTCxDQUFjLEtBQWQsR0FBc0IsTUFBTSxZQUFOLENBQW1CLENBQW5CLEVBQXNCLEtBQTVDO0FBQ0g7QUFDSjtBQUNELGdCQUFJLEtBQUssUUFBTCxDQUFjLEdBQWQsS0FBc0IsT0FBTyxHQUFqQyxFQUFzQztBQUNsQyxvQkFBSSxRQUFRLEtBQUssR0FBTCxDQUFTLEtBQUssUUFBTCxDQUFjLEtBQWQsR0FBc0IsTUFBTSxZQUFOLENBQW1CLENBQW5CLEVBQXNCLEtBQXJELENBQVo7QUFDQSxvQkFBSSxRQUFRLENBQVosRUFBZTtBQUNYLDZCQUFTLEtBQUssUUFBZDtBQUNIO0FBQ0o7QUFDRCxpQkFBSyxRQUFMLEdBQWdCLE1BQWhCOztBQUVBLHlCQUFhLEtBQUssZ0JBQWxCO0FBQ0EsaUJBQUssZ0JBQUwsR0FBd0IsV0FBWTtBQUFBLHVCQUFNLE9BQUssbUJBQUwsRUFBTjtBQUFBLGFBQVosRUFBOEMsSUFBOUMsQ0FBeEI7O0FBRUEsaUJBQUssU0FBTCxDQUFlLGdCQUFmLENBQWdDO0FBQzVCLDBCQUFVLE1BQU0sT0FBTixDQUFjLFFBREk7QUFFNUIsd0JBQVEsTUFBTSxPQUFOLENBQWMsTUFGTTtBQUc1QiwwQkFBVSxNQUFNLE9BQU4sQ0FBYyxRQUhJLEVBQWhDOztBQUtBLGdCQUFJLE1BQU0sWUFBTixDQUFtQixNQUFuQixHQUE0QixDQUE1QixJQUFpQyxLQUFLLG1CQUFMLEtBQTZCLE1BQU0sWUFBTixDQUFtQixDQUFuQixFQUFzQixHQUF4RixFQUE2RjtBQUN6RixvQkFBSSxRQUFTLE1BQU0sWUFBTixDQUFtQixDQUFuQixFQUFzQixHQUF0QixDQUEwQixPQUExQixDQUFrQyxHQUFsQyxJQUF5QyxDQUFDLENBQXZEO0FBQ0EscUJBQUssb0JBQUwsQ0FBMEIsT0FBMUIsQ0FBa0MsTUFBTSxZQUFOLENBQW1CLENBQW5CLEVBQXNCLEdBQXhEO0FBQ0EscUJBQUssU0FBTCxDQUFlLGtCQUFmLENBQWtDLE1BQU0sWUFBTixDQUFtQixDQUFuQixFQUFzQixHQUF4RDtBQUNBLHFCQUFLLFlBQUwsQ0FBa0Isa0JBQWxCLENBQXFDLE1BQU0sWUFBTixDQUFtQixDQUFuQixFQUFzQixHQUEzRDtBQUNBLHFCQUFLLG1CQUFMLEdBQTJCLE1BQU0sWUFBTixDQUFtQixDQUFuQixFQUFzQixHQUFqRDtBQUNBLHFCQUFLLFVBQUwsQ0FBZ0IsV0FBaEIsQ0FBNEIsZ0JBQU0sd0JBQU4sQ0FBK0IsZUFBSyxlQUFMLENBQXFCLE1BQU0sWUFBTixDQUFtQixDQUFuQixFQUFzQixHQUEzQyxDQUEvQixDQUE1QjtBQUNBLHFCQUFLLFVBQUwsQ0FBZ0IsUUFBaEIsQ0FBeUIsZ0JBQU0sd0JBQU4sQ0FBK0IsZUFBSyxlQUFMLENBQXFCLE1BQU0sWUFBTixDQUFtQixDQUFuQixFQUFzQixHQUEzQyxDQUEvQixDQUF6QjtBQUNIO0FBQ0cscUJBQUssT0FBTCxDQUFhLFlBQWIsQ0FBMEIsUUFBUSxDQUFSLEdBQVksQ0FBdEM7QUFDQTtBQUNIOztBQUVEO0FBQ0M7Ozs7Ozs7Ozs7O0FBYUg7O0FBRUY7Ozs7Ozs4Q0FHc0I7QUFDbEIsaUJBQUssU0FBTCxDQUFlLFNBQWY7QUFDQSxpQkFBSyxZQUFMLENBQWtCLFNBQWxCO0FBQ0EsaUJBQUssTUFBTCxDQUFZLHNCQUFaO0FBQ0EsaUJBQUssVUFBTCxDQUFnQixXQUFoQjtBQUNBLGlCQUFLLFVBQUwsQ0FBZ0IsUUFBaEI7QUFDQSxpQkFBSyxvQkFBTCxDQUEwQixPQUExQjtBQUNGOztBQUVGOzs7Ozs7eUNBR2lCO0FBQ2IsZ0JBQUksS0FBSyxRQUFMLENBQWMsVUFBZCxLQUE2QixlQUFlLElBQWhELEVBQXNEO0FBQ2xELG9CQUFJLEtBQUssUUFBTCxDQUFjLE1BQWQsS0FBeUIsR0FBN0IsRUFBa0M7QUFDOUIsd0JBQUksU0FBUyxLQUFLLEtBQUwsQ0FBVyxLQUFLLFFBQUwsQ0FBYyxZQUF6QixDQUFiO0FBQ0EseUJBQUssS0FBTCxDQUFXLE1BQVg7QUFDSCxpQkFIRCxNQUdPO0FBQ0gsNEJBQVEsR0FBUixDQUFZLHVDQUFaO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7Ozs7Ozs7OzhCQUtNLE0sRUFBUTtBQUFBOztBQUNWLGlCQUFLLE1BQUwsQ0FBWSxRQUFaLEdBQXVCLEtBQUssTUFBNUI7O0FBRUEsaUJBQUssTUFBTCxHQUFjLG9CQUFVLE9BQU8sS0FBakIsRUFBd0IsVUFBQyxJQUFEO0FBQUEsdUJBQVUsT0FBSyxnQkFBTCxDQUFzQixJQUF0QixDQUFWO0FBQUEsYUFBeEIsQ0FBZDtBQUNBLGlCQUFLLFNBQUwsR0FBaUIsa0NBQXdCLE9BQU8sUUFBL0IsQ0FBakI7QUFDQSxpQkFBSyxZQUFMLEdBQW9CLCtCQUFxQixPQUFPLGVBQTVCLENBQXBCO0FBQ0EsaUJBQUssVUFBTCxHQUFrQix3QkFBYyxPQUFPLFNBQXJCLENBQWxCO0FBQ0EsaUJBQUssb0JBQUwsR0FBNEIsbUNBQTVCO0FBQ0EsaUJBQUssS0FBTCxHQUFhLG9CQUFiO0FBQ0EsaUJBQUssT0FBTCxHQUFlLHdCQUFmO0FBQ0E7QUFDQSxpQkFBSyxVQUFMLEdBQWtCLGlDQUFsQjs7QUFFQSxpQkFBSyxNQUFMLENBQVksVUFBWixDQUF1QixDQUNuQixLQUFLLFVBRGM7QUFFbkI7QUFDQSxpQkFBSyxLQUhjLEVBSW5CLEtBQUssb0JBSmMsRUFLbkIsS0FBSyxTQUxjLEVBTW5CLEtBQUssWUFOYyxFQU9uQixLQUFLLE9BUGMsRUFRbkIsS0FBSyxVQVJjLENBQXZCOztBQVVBLGlCQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksT0FBTyxLQUFQLENBQWEsVUFBYixDQUF3QixNQUE1QyxFQUFvRCxHQUFwRCxFQUF5RDtBQUNyRCx1Q0FBYSxjQUFiLENBQTRCLE9BQU8sS0FBUCxDQUFhLFVBQWIsQ0FBd0IsQ0FBeEIsQ0FBNUIsRUFBd0QsT0FBTyxLQUFQLENBQWEsaUJBQXJFO0FBQ0g7O0FBRUQscUJBQVMsZ0JBQVQsQ0FBMEIsU0FBMUIsRUFBcUM7QUFBQSx1QkFBUyxPQUFLLFNBQUwsQ0FBZSxLQUFmLENBQVQ7QUFBQSxhQUFyQztBQUNIOztBQUVEOzs7Ozs7O2tDQUlVLEssRUFBTztBQUNiLGdCQUFJLE1BQU0sSUFBTixLQUFlLE9BQW5CLEVBQTRCO0FBQ3hCLHdCQUFRLHVCQUFhLFdBQXJCO0FBQ0kseUJBQUssT0FBTDtBQUFjLCtDQUFhLElBQWIsQ0FBa0IsOERBQWxCLEVBQW1GO0FBQ2pHLHlCQUFLLFNBQUw7QUFBZ0IsK0NBQWEsS0FBYixHQUFzQjtBQUN0Qyx5QkFBSyxRQUFMO0FBQWUsK0NBQWEsTUFBYixHQUF1QjtBQUgxQztBQUtIO0FBQ0o7OzsrQkFFTSxLLEVBQU8sTSxFQUFRO0FBQ2xCLGtCQUFNLFFBQU4sQ0FBZSxVQUFmLEdBQTRCLElBQTVCO0FBQ0Esa0JBQU0sUUFBTixDQUFlLFdBQWYsR0FBNkIsSUFBN0I7QUFDSDs7OytCQUVNLEssRUFBTyxNLEVBQVEsQ0FBRTs7Ozs7O2tCQTlKUCxNOzs7Ozs7Ozs7OztBQ2JyQjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7O0FBR0ksb0JBQVksTUFBWixFQUFvQixFQUFwQixFQUF3QjtBQUFBOztBQUFBOztBQUNwQjs7Ozs7QUFLQSxZQUFJLE9BQU8sTUFBUCxLQUFrQixRQUF0QixFQUFnQztBQUM1QixpQkFBSyxXQUFMLEdBQW1CLCtCQUFxQixNQUFyQixFQUE2QjtBQUFBLHVCQUFXLE1BQUssV0FBTCxDQUFpQixPQUFqQixDQUFYO0FBQUEsYUFBN0IsQ0FBbkI7QUFDSCxTQUZELE1BRU8sSUFBSSxPQUFPLE1BQVAsS0FBa0IsTUFBdEIsRUFBOEI7QUFDakMsaUJBQUssV0FBTCxHQUFtQiw2QkFBbUIsTUFBbkIsRUFBMkI7QUFBQSx1QkFBVyxNQUFLLFdBQUwsQ0FBaUIsT0FBakIsQ0FBWDtBQUFBLGFBQTNCLENBQW5CO0FBQ0gsU0FGTSxNQUVBLElBQUksT0FBTyxNQUFQLEtBQWtCLFFBQXRCLEVBQWdDO0FBQ25DLGlCQUFLLFdBQUwsR0FBbUIsc0NBQTBCLE1BQTFCLEVBQWtDO0FBQUEsdUJBQVcsTUFBSyxXQUFMLENBQWlCLE9BQWpCLENBQVg7QUFBQSxhQUFsQyxDQUFuQjtBQUNIOztBQUVEOzs7OztBQUtBLGFBQUssaUJBQUwsR0FBeUIsc0NBQXpCOztBQUVBOzs7QUFHQSxhQUFLLFNBQUwsR0FBaUIsRUFBakI7QUFDSDs7QUFFRDs7Ozs7OztpREFHeUI7QUFDckIsaUJBQUssaUJBQUwsQ0FBdUIsWUFBdkI7QUFDSDs7QUFFRDs7Ozs7OztvQ0FJWSxPLEVBQVM7QUFDakIsZ0JBQUksS0FBSyxLQUFLLFdBQUwsQ0FBaUIsV0FBakIsRUFBVDtBQUNBLGdCQUFJLFlBQVksS0FBSyxpQkFBTCxDQUF1QixNQUF2QixDQUE4QixFQUE5QixDQUFoQjtBQUNBLGlCQUFLLFNBQUwsQ0FBZSxLQUFmLENBQXFCLElBQXJCLEVBQTJCLENBQUUsRUFBRSxNQUFNLEVBQVIsRUFBWSxjQUFjLFNBQTFCLEVBQXFDLFNBQVMsT0FBOUMsRUFBRixDQUEzQjtBQUNIOzs7Ozs7Ozs7Ozs7Ozs7OztBQ2hETDs7Ozs7Ozs7O0FBR0ksb0JBQVksTUFBWixFQUFvQixFQUFwQixFQUF3QjtBQUFBOztBQUNwQjs7O0FBR0EsYUFBSyxTQUFMLEdBQWlCLEVBQWpCOztBQUVBOzs7OztBQUtBLGFBQUssS0FBTCxHQUFhLEVBQWI7O0FBRUE7Ozs7OztBQU1BLGFBQUssUUFBTCxHQUFnQixlQUFLLGNBQUwsQ0FDWCxNQURXLENBQ0osZUFBSyxjQURELEVBRVgsTUFGVyxDQUVKLGVBQUssY0FGRCxFQUdYLE1BSFcsQ0FHSixlQUFLLGNBSEQsRUFJWCxNQUpXLENBSUosZUFBSyxjQUpELEVBS1gsTUFMVyxDQUtKLGVBQUssY0FMRCxFQU1YLE1BTlcsQ0FNSixlQUFLLGNBTkQsRUFPWCxNQVBXLENBT0osZUFBSyxjQVBELEVBUVgsTUFSVyxDQVFKLGVBQUssY0FSRCxFQVNYLE1BVFcsQ0FTSixlQUFLLGNBVEQsRUFTaUIsTUFUakIsQ0FTd0IsQ0FUeEIsRUFTMkIsZUFBSyxjQUFMLENBQW9CLE1BQXBCLEdBQTRCLEVBVHZELENBQWhCOztBQVdBLGFBQUssZ0JBQUw7QUFDSDs7QUFFRDs7Ozs7OzsyQ0FHbUI7QUFBQTs7QUFDZjtBQUNBLGdCQUFJLFVBQVUsaUJBQWQsRUFBaUM7QUFDN0IsMEJBQVUsaUJBQVYsR0FBOEIsSUFBOUIsQ0FDSSxVQUFDLEtBQUQ7QUFBQSwyQkFBVyxNQUFLLGFBQUwsQ0FBbUIsS0FBbkIsQ0FBWDtBQUFBLGlCQURKLEVBRUksVUFBQyxLQUFEO0FBQUEsMkJBQVcsTUFBSyxhQUFMLENBQW1CLEtBQW5CLENBQVg7QUFBQSxpQkFGSjtBQUdILGFBSkQsTUFJTztBQUNILHdCQUFRLEdBQVIsQ0FBWSxrQ0FBWjtBQUNIO0FBQ0o7O0FBRUQ7Ozs7Ozs7c0NBSWMsSSxFQUFNO0FBQUE7O0FBQ2hCLGdCQUFJLFNBQVMsS0FBSyxNQUFsQjtBQURnQjtBQUFBO0FBQUE7O0FBQUE7QUFFaEIscUNBQWtCLE9BQU8sTUFBUCxFQUFsQiw4SEFBbUM7QUFBQSx3QkFBMUIsS0FBMEI7O0FBQy9CLDBCQUFNLGFBQU4sR0FBc0I7QUFBQSwrQkFBTyxPQUFLLGFBQUwsQ0FBbUIsR0FBbkIsQ0FBUDtBQUFBLHFCQUF0QjtBQUNIO0FBSmU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtuQjs7QUFFRDs7Ozs7OztzQ0FJYyxLLEVBQU87QUFDakIsb0JBQVEsR0FBUixDQUFZLHNHQUFzRyxLQUFsSDtBQUNIOztBQUVEOzs7Ozs7O3NDQUljLEcsRUFBSztBQUNmLGdCQUFJLE1BQU0sSUFBSSxJQUFKLENBQVMsQ0FBVCxLQUFlLENBQXpCO0FBQ0EsZ0JBQUksVUFBVSxJQUFJLElBQUosQ0FBUyxDQUFULElBQWMsR0FBNUI7QUFDQSxnQkFBSSxhQUFhLElBQUksSUFBSixDQUFTLENBQVQsQ0FBakI7QUFDQSxnQkFBSSxXQUFXLENBQWY7QUFDQSxnQkFBSSxJQUFJLElBQUosQ0FBUyxNQUFULEdBQWtCLENBQXRCLEVBQ0ksV0FBVyxJQUFJLElBQUosQ0FBUyxDQUFULElBQWMsR0FBekI7O0FBRUo7QUFDQSxnQkFBSyxPQUFLLENBQUwsSUFBWSxPQUFLLENBQU4sSUFBVyxZQUFVLENBQXJDLEVBQTJDO0FBQUU7QUFDekMscUJBQUssT0FBTCxDQUFhLFVBQWI7QUFDSCxhQUZELE1BRU8sSUFBSSxPQUFPLENBQVgsRUFBYztBQUFFO0FBQ25CLHFCQUFLLFNBQUwsQ0FBZSxVQUFmLEVBQTJCLFFBQTNCO0FBQ0gsYUFiYyxDQWFiO0FBQ0w7O0FBRUQ7Ozs7OztzQ0FHYztBQUNWLGdCQUFJLE9BQU8sRUFBWDtBQUNBLGlCQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksS0FBSyxLQUFMLENBQVcsTUFBL0IsRUFBdUMsR0FBdkMsRUFBNEM7QUFDeEMsb0JBQUksS0FBSyxLQUFMLENBQVcsQ0FBWCxJQUFnQixDQUFwQixFQUF1QjtBQUNuQix3QkFBSSxTQUFTLENBQWI7QUFDQSx3QkFBSSxLQUFLLEtBQUssS0FBTCxDQUFXLE1BQVgsR0FBa0IsQ0FBM0IsRUFBOEI7QUFBRSxpQ0FBUyxDQUFUO0FBQWE7QUFDN0MseUJBQUssSUFBTCxDQUFXLEVBQUUsVUFBVSxLQUFLLFFBQUwsQ0FBYyxDQUFkLENBQVosRUFBOEIsUUFBUSxNQUF0QyxFQUE4QyxPQUFPLENBQXJELEVBQXdELFVBQVUsS0FBSyxLQUFMLENBQVcsQ0FBWCxDQUFsRSxFQUFYO0FBQ0g7QUFDSjtBQUNELG1CQUFPLElBQVA7QUFDSDs7QUFFRDs7Ozs7Ozs7a0NBS1UsRyxFQUFLLFEsRUFBVTtBQUNyQixpQkFBSyxLQUFMLENBQVcsR0FBWCxJQUFrQixRQUFsQjtBQUNBLGdCQUFJLFNBQVMsQ0FBYjtBQUNBLHFCQUFTLEtBQUssS0FBTCxDQUFXLENBQUMsTUFBSSxDQUFMLElBQVUsZUFBSyxjQUFMLENBQW9CLE1BQXpDLENBQVQ7QUFDQSxpQkFBSyxTQUFMLENBQWU7QUFDWCwwQkFBVSxLQUFLLFFBQUwsQ0FBYyxHQUFkLENBREM7QUFFWCx3QkFBUSxNQUZHO0FBR1gsdUJBQU8sR0FISTtBQUlYLDBCQUFVLFFBSkM7QUFLWCx3QkFBUSxPQUxHLEVBQWY7QUFNSDs7QUFFRDs7Ozs7OztnQ0FJUSxHLEVBQUs7QUFDVCxpQkFBSyxLQUFMLENBQVcsR0FBWCxJQUFrQixHQUFsQjtBQUNBLGdCQUFJLFNBQVMsQ0FBYjtBQUNBLHFCQUFTLEtBQUssS0FBTCxDQUFXLENBQUMsTUFBSSxDQUFMLElBQVUsZUFBSyxjQUFMLENBQW9CLE1BQXpDLENBQVQ7QUFDQSxpQkFBSyxTQUFMLENBQWU7QUFDWCwwQkFBVSxLQUFLLFFBQUwsQ0FBYyxHQUFkLENBREM7QUFFWCx3QkFBUSxNQUZHO0FBR1gsdUJBQU8sR0FISTtBQUlYLDBCQUFVLENBSkM7QUFLWCx3QkFBUSxTQUxHLEVBQWY7QUFNSDs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2SUw7Ozs7Ozs7OztBQUdJLHNCQUFjO0FBQUE7O0FBQ1Y7Ozs7O0FBS0EsYUFBSyx5QkFBTCxHQUFpQyxFQUFqQzs7QUFFQTs7Ozs7QUFLQSxhQUFLLHNCQUFMLEdBQThCLEVBQTlCOztBQUVBLHVCQUFLLDBCQUFMO0FBQ0g7O0FBRUQ7Ozs7Ozs7OytCQUlPLEksRUFBTTtBQUNULGdCQUFJLEtBQUssTUFBTCxLQUFnQixDQUFwQixFQUF1QjtBQUFFLHVCQUFPLEtBQUsseUJBQVo7QUFBd0M7QUFDakUsZ0JBQUksZUFBZSxFQUFuQjtBQUNBLGdCQUFJLFdBQVcsQ0FBQyxDQUFoQjtBQUNBLGlCQUFLLElBQUksR0FBVCxJQUFnQixlQUFLLElBQXJCLEVBQTJCO0FBQ3ZCLG9CQUFJLFFBQVMsSUFBSSxPQUFKLENBQVksR0FBWixNQUFxQixDQUFDLENBQW5DO0FBQ0Esb0JBQUksY0FBYyxHQUFsQjtBQUNBLG9CQUFJLENBQUMsS0FBTCxFQUFZO0FBQ1Isa0NBQWMsWUFBWSxLQUFaLENBQWtCLENBQWxCLEVBQXFCLFlBQVksTUFBWixHQUFtQixDQUF4QyxDQUFkLENBRFEsQ0FDa0Q7QUFDN0Q7QUFDRCxxQkFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssTUFBekIsRUFBaUMsR0FBakMsRUFBc0M7QUFDbEMsd0JBQUksZUFBSyxJQUFMLENBQVUsR0FBVixFQUFlLE9BQWYsQ0FBdUIsS0FBSyxDQUFMLEVBQVEsUUFBL0IsTUFBNkMsQ0FBQyxDQUFsRCxFQUFxRDtBQUNqRCw0QkFBSSxDQUFDLGFBQWEsR0FBYixDQUFMLEVBQXdCO0FBQUUseUNBQWEsR0FBYixJQUFvQixDQUFwQjtBQUF3QjtBQUNsRCw0QkFBSSxNQUFNLGVBQUssbUJBQUwsQ0FBeUIsV0FBekIsRUFBc0MsS0FBdEMsQ0FBVjtBQUNBLDRCQUFJLEtBQUssQ0FBTCxFQUFRLFFBQVIsS0FBcUIsSUFBSSxDQUFKLENBQXpCLEVBQWlDO0FBQzdCLHlDQUFhLEdBQWIsS0FBcUIsSUFBckIsQ0FENkIsQ0FDRjtBQUM5Qix5QkFGRCxNQUVPLElBQUksS0FBSyxDQUFMLEVBQVEsUUFBUixLQUFxQixJQUFJLENBQUosQ0FBekIsRUFBaUM7QUFDcEMseUNBQWEsR0FBYixLQUFxQixJQUFyQixDQURvQyxDQUNUO0FBQzlCLHlCQUZNLE1BRUEsSUFBSSxLQUFLLENBQUwsRUFBUSxRQUFSLEtBQXFCLElBQUksQ0FBSixDQUF6QixFQUFpQztBQUNwQyx5Q0FBYSxHQUFiLEtBQXFCLElBQXJCLENBRG9DLENBQ1Q7QUFDOUIseUJBRk0sTUFFQyxJQUFJLEtBQUssQ0FBTCxFQUFRLFFBQVIsS0FBcUIsSUFBSSxDQUFKLENBQXpCLEVBQWlDO0FBQ3JDLHlDQUFhLEdBQWIsS0FBcUIsSUFBckIsQ0FEcUMsQ0FDVjtBQUM5Qix5QkFGTyxNQUVEO0FBQ0gseUNBQWEsR0FBYixLQUFxQixHQUFyQjtBQUNIOztBQUVELDRCQUFJLGFBQWEsR0FBYixJQUFvQixRQUF4QixFQUFrQztBQUM5Qix1Q0FBVyxhQUFhLEdBQWIsQ0FBWDtBQUNIOztBQUVELDRCQUFJLEtBQUosRUFBVztBQUNQLHlDQUFhLEdBQWIsS0FBcUIsR0FBckI7QUFDSDtBQUNEOzs7QUFHSDtBQUNKO0FBQ0o7O0FBRUQsZ0JBQUksU0FBUyxFQUFiO0FBQ0EsaUJBQUssSUFBSSxLQUFULElBQWtCLFlBQWxCLEVBQWdDO0FBQzVCLHVCQUFPLElBQVAsQ0FBYSxFQUFFLE9BQU8sYUFBYSxLQUFiLENBQVQsRUFBOEIsS0FBSyxLQUFuQyxFQUEwQyxXQUFXLEtBQUssR0FBTCxFQUFyRCxFQUFiO0FBQ0g7O0FBRUQsZ0JBQUksS0FBSyxNQUFMLElBQWUsQ0FBZixJQUFvQixZQUFZLEtBQUssTUFBTCxHQUFjLEdBQWxELEVBQXVEO0FBQ25ELHFCQUFLLFlBQUwsR0FEbUQsQ0FDOUI7QUFDeEI7O0FBRUQsaUJBQUsscUJBQUw7QUFDQSxtQkFBTyxLQUFLLDBCQUFMLENBQWdDLE1BQWhDLENBQVA7QUFDSDs7QUFFRDs7Ozs7O3VDQUdlO0FBQ1gsaUJBQUsseUJBQUwsR0FBaUMsRUFBakM7QUFDSDs7QUFFRDs7Ozs7O2dEQUd3QjtBQUNwQixpQkFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUsseUJBQUwsQ0FBK0IsTUFBbkQsRUFBMkQsR0FBM0QsRUFBZ0U7QUFDNUQscUJBQUsseUJBQUwsQ0FBK0IsQ0FBL0IsRUFBa0MsS0FBbEMsSUFBMkMsS0FBSyxzQkFBaEQ7QUFDSDtBQUNKOztBQUVEOzs7Ozs7O21EQUkyQixNLEVBQVE7QUFDL0IsaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxPQUFPLE1BQTNCLEVBQW1DLEdBQW5DLEVBQXdDO0FBQ3BDLG9CQUFJLFFBQVEsS0FBWjtBQUNBLHFCQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksS0FBSyx5QkFBTCxDQUErQixNQUFuRCxFQUEyRCxHQUEzRCxFQUFnRTtBQUM1RCx3QkFBSSxLQUFLLHlCQUFMLENBQStCLENBQS9CLEVBQWtDLEdBQWxDLEtBQTBDLE9BQU8sQ0FBUCxFQUFVLEdBQXhELEVBQTZEO0FBQ3pELGdDQUFRLElBQVI7QUFDQSw2QkFBSyx5QkFBTCxDQUErQixDQUEvQixFQUFrQyxLQUFsQyxJQUEyQyxPQUFPLENBQVAsRUFBVSxLQUFyRDtBQUNIO0FBQ0o7QUFDRCxvQkFBSSxDQUFDLEtBQUwsRUFBWTtBQUNSLHlCQUFLLHlCQUFMLENBQStCLElBQS9CLENBQW9DLE9BQU8sQ0FBUCxDQUFwQztBQUNIO0FBQ0o7QUFDRCxtQkFBTyxLQUFLLHlCQUFMLENBQStCLElBQS9CLENBQW9DLFVBQVMsQ0FBVCxFQUFZLENBQVosRUFBZTtBQUFFLHVCQUFRLEVBQUUsS0FBRixHQUFVLEVBQUUsS0FBYixHQUF1QixDQUF2QixHQUE2QixFQUFFLEtBQUYsR0FBVSxFQUFFLEtBQWIsR0FBc0IsQ0FBQyxDQUF2QixHQUEyQixDQUE5RDtBQUFtRSxhQUF4SCxDQUFQO0FBQ0g7Ozs7Ozs7Ozs7Ozs7O0FDaEhMOzs7O2tCQUllO0FBQ1g7QUFDQSxVQUFNLEVBRks7O0FBSVg7Ozs7OztBQU1BLG9CQUFnQixDQUFDLEdBQUQsRUFBTSxJQUFOLEVBQVksR0FBWixFQUFpQixHQUFqQixFQUFzQixJQUF0QixFQUE0QixHQUE1QixFQUFpQyxJQUFqQyxFQUF1QyxHQUF2QyxFQUE0QyxHQUE1QyxFQUFpRCxJQUFqRCxFQUF1RCxHQUF2RCxFQUE0RCxJQUE1RCxDQVZMOztBQVlYOzs7Ozs7QUFNQSxtQkFBZSxDQUFDLEdBQUQsRUFBTSxJQUFOLEVBQVksR0FBWixFQUFpQixHQUFqQixFQUFzQixJQUF0QixFQUE0QixHQUE1QixFQUFpQyxJQUFqQyxFQUF1QyxHQUF2QyxFQUE0QyxHQUE1QyxFQUFpRCxJQUFqRCxFQUF1RCxHQUF2RCxFQUE0RCxJQUE1RCxDQWxCSjs7QUFvQlg7Ozs7QUFJQSxtQkF4QlcsMkJBd0JLLFFBeEJMLEVBd0JlO0FBQ3RCLFlBQUksUUFBUSxLQUFLLGNBQUwsQ0FBb0IsT0FBcEIsQ0FBNEIsUUFBNUIsQ0FBWjtBQUNBLFlBQUksVUFBVSxDQUFDLENBQWYsRUFBa0I7QUFDZCxvQkFBUSxLQUFLLGFBQUwsQ0FBbUIsT0FBbkIsQ0FBMkIsUUFBM0IsQ0FBUjtBQUNIO0FBQ0QsZUFBTyxLQUFQO0FBQ0gsS0E5QlU7OztBQWdDWDs7OztBQUlBLG1CQXBDVywyQkFvQ0ssS0FwQ0wsRUFvQ1ksVUFwQ1osRUFvQ3dCO0FBQy9CLFlBQUksU0FBUyxLQUFLLGNBQUwsQ0FBb0IsTUFBakMsRUFBeUM7QUFDckMsb0JBQVEsUUFBUSxLQUFLLGNBQUwsQ0FBb0IsTUFBcEM7QUFDSDs7QUFFRCxZQUFJLFVBQUosRUFBZ0I7QUFDWixtQkFBTyxLQUFLLGFBQUwsQ0FBbUIsS0FBbkIsQ0FBUDtBQUNILFNBRkQsTUFFTztBQUNILG1CQUFPLEtBQUssY0FBTCxDQUFvQixLQUFwQixDQUFQO0FBQ0g7QUFDSixLQTlDVTs7O0FBZ0RYOzs7Ozs7QUFNQyxrQkFBYyxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQXRESjs7QUF3RFg7Ozs7OztBQU1DLHdCQUFvQixDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxFQUFnQixHQUFoQixDQTlEVjs7QUFnRVg7Ozs7O0FBS0Esa0JBckVXLDBCQXFFSSxLQXJFSixFQXFFVztBQUNsQixZQUFJLFdBQVcsUUFBUSxLQUFLLGNBQUwsQ0FBb0IsTUFBM0M7QUFDQSxlQUFPLEtBQUssY0FBTCxDQUFvQixRQUFwQixDQUFQO0FBQ0gsS0F4RVU7OztBQTBFWDs7OztBQUlBLGtCQTlFVywwQkE4RUksUUE5RUosRUE4RWM7QUFDckIsWUFBSSxRQUFRLEtBQUssYUFBTCxDQUFtQixRQUFuQixDQUFaO0FBQ0EsWUFBSSxTQUFTLEtBQUssY0FBTCxDQUFvQixPQUFwQixDQUE0QixNQUFNLFFBQWxDLENBQWI7QUFDQSxZQUFJLFdBQVcsQ0FBQyxDQUFoQixFQUFtQjtBQUNmLHFCQUFTLEtBQUssYUFBTCxDQUFtQixPQUFuQixDQUEyQixNQUFNLFFBQWpDLENBQVQ7QUFDSDtBQUNELGVBQU8sTUFBTSxNQUFOLEdBQWUsS0FBSyxjQUFMLENBQW9CLE1BQW5DLEdBQTRDLE1BQW5EO0FBQ0gsS0FyRlU7OztBQXVGWDs7OztBQUlBLGlCQTNGVyx5QkEyRkcsUUEzRkgsRUEyRmE7QUFDcEIsWUFBSSxPQUFPLEVBQVg7QUFDQTtBQUNBLFlBQUksU0FBUyxTQUFTLE1BQVQsQ0FBZ0IsU0FBUyxNQUFULEdBQWdCLENBQWhDLENBQWI7QUFDQSxZQUFJLFNBQVMsTUFBVCxLQUFvQixNQUF4QixFQUFnQztBQUM1QixpQkFBSyxNQUFMLEdBQWMsTUFBZDtBQUNBLGdCQUFJLFNBQVMsTUFBVCxLQUFvQixDQUF4QixFQUEyQjtBQUN2QixxQkFBSyxRQUFMLEdBQWdCLFNBQVMsTUFBVCxDQUFnQixDQUFoQixJQUFxQixTQUFTLE1BQVQsQ0FBZ0IsQ0FBaEIsQ0FBckM7QUFDSCxhQUZELE1BRU87QUFDSCxxQkFBSyxRQUFMLEdBQWdCLFNBQVMsTUFBVCxDQUFnQixDQUFoQixDQUFoQjtBQUNIO0FBRUosU0FSRCxNQVFPO0FBQ0gsaUJBQUssTUFBTCxHQUFjLENBQWQsQ0FERyxDQUNjO0FBQ2pCLGlCQUFLLFFBQUwsR0FBZ0IsUUFBaEI7QUFDSDs7QUFFRCxlQUFPLElBQVA7QUFDSCxLQTdHVTs7O0FBK0dYOzs7Ozs7QUFNQSwyQkFySFcsbUNBcUhhLEVBckhiLEVBcUhpQjtBQUN4QixZQUFJLFNBQVMsQ0FBYjs7QUFFQTtBQUNBLFlBQUssQ0FBQyxNQUFPLFNBQVMsR0FBRyxNQUFILENBQVUsR0FBRyxNQUFILEdBQVcsQ0FBckIsQ0FBVCxDQUFQLENBQU4sRUFBa0Q7QUFDOUMscUJBQVMsU0FBUyxHQUFHLE1BQUgsQ0FBVSxHQUFHLE1BQUgsR0FBVyxDQUFyQixDQUFULENBQVQ7QUFDQSxpQkFBSyxHQUFHLE1BQUgsQ0FBVSxDQUFWLEVBQWEsR0FBRyxNQUFILEdBQVUsQ0FBdkIsQ0FBTDtBQUNIOztBQUVEO0FBQ0EsWUFBSSxLQUFLLFlBQUwsQ0FBa0IsT0FBbEIsQ0FBMEIsRUFBMUIsS0FBaUMsQ0FBQyxDQUF0QyxFQUF5QztBQUNyQyxpQkFBSyxLQUFLLGtCQUFMLENBQXdCLEtBQUssWUFBTCxDQUFrQixPQUFsQixDQUEwQixFQUExQixDQUF4QixDQUFMO0FBQ0g7O0FBRUQsWUFBSSxJQUFKO0FBQ0EsWUFBSSxPQUFPLEtBQUssY0FBTCxDQUFvQixPQUFwQixDQUE0QixFQUE1QixDQUFYOztBQUVBLFlBQUksUUFBUSxDQUFDLENBQWIsRUFBZ0I7QUFDWixtQkFBTyxLQUFLLGFBQUwsQ0FBbUIsT0FBbkIsQ0FBMkIsRUFBM0IsQ0FBUDtBQUNIOztBQUVELFlBQUksUUFBUSxDQUFDLENBQWIsRUFBZ0I7QUFDWixvQkFBUSxDQUFDLFNBQU8sQ0FBUixJQUFhLEtBQUssY0FBTCxDQUFvQixNQUF6QztBQUNBLG1CQUFPLE1BQU8sS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLE9BQUssRUFBakIsQ0FBZDtBQUNIO0FBQ0QsZUFBTyxJQUFQO0FBQ0gsS0EvSVU7OztBQWlKWDs7Ozs7Ozs7O0FBU0EsdUJBMUpXLCtCQTBKUyxHQTFKVCxFQTBKYyxLQTFKZCxFQTBKcUIsTUExSnJCLEVBMEo2QjtBQUNwQyxZQUFJLFlBQUo7QUFDQSxZQUFJLGFBQWEsRUFBakI7QUFDQSxZQUFJLFFBQUo7O0FBRUE7QUFDQSxZQUFJLEtBQUssWUFBTCxDQUFrQixPQUFsQixDQUEwQixHQUExQixLQUFrQyxDQUFDLENBQXZDLEVBQTBDO0FBQ3RDLGtCQUFNLEtBQUssa0JBQUwsQ0FBd0IsS0FBSyxZQUFMLENBQWtCLE9BQWxCLENBQTBCLEdBQTFCLENBQXhCLENBQU47QUFDSDs7QUFFRDtBQUNBLFlBQUksS0FBSyxjQUFMLENBQW9CLE9BQXBCLENBQTRCLEdBQTVCLEtBQW9DLENBQUMsQ0FBekMsRUFBNEM7QUFDeEMsMkJBQWUsS0FBSyxjQUFMLENBQW9CLEtBQXBCLEVBQWY7QUFDQSx1QkFBVyxLQUFLLGNBQUwsQ0FBb0IsT0FBcEIsQ0FBNEIsR0FBNUIsQ0FBWDtBQUNILFNBSEQsTUFHTztBQUNILDJCQUFlLEtBQUssYUFBTCxDQUFtQixLQUFuQixFQUFmO0FBQ0EsdUJBQVcsS0FBSyxhQUFMLENBQW1CLE9BQW5CLENBQTJCLEdBQTNCLENBQVg7QUFDSDs7QUFFRDtBQUNBLFlBQUksTUFBTSxhQUFhLE1BQXZCO0FBQ0EsYUFBTSxJQUFJLElBQUksQ0FBZCxFQUFpQixJQUFJLEdBQXJCLEVBQTBCLEdBQTFCLEVBQWdDO0FBQzVCLGdCQUFJLE1BQUosRUFBWTtBQUNSLDZCQUFhLElBQWIsQ0FBa0IsYUFBYSxDQUFiLEtBQW1CLFNBQU8sQ0FBMUIsQ0FBbEI7QUFDSCxhQUZELE1BRU87QUFDSCw2QkFBYSxJQUFiLENBQWtCLGFBQWEsQ0FBYixDQUFsQjtBQUNIO0FBQ0o7O0FBRUQ7QUFDQSxZQUFJLE1BQUosRUFBWTtBQUNSLGlCQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksS0FBSyxhQUFMLENBQW1CLE1BQXZDLEVBQStDLEdBQS9DLEVBQW9EO0FBQ2hELDZCQUFhLENBQWIsS0FBbUIsTUFBbkI7QUFDSDtBQUNKO0FBQ0Q7QUFDQSxxQkFBYSxNQUFiLENBQW9CLENBQXBCLEVBQXVCLFFBQXZCOztBQUVBO0FBQ0EsWUFBSSxLQUFKLEVBQVc7QUFDUDtBQUNBLHVCQUFXLElBQVgsQ0FBaUIsYUFBYSxDQUFiLENBQWpCO0FBQ0EsdUJBQVcsSUFBWCxDQUFpQixhQUFhLENBQWIsQ0FBakI7QUFDQSx1QkFBVyxJQUFYLENBQWlCLGFBQWEsQ0FBYixDQUFqQjtBQUNBLHVCQUFXLElBQVgsQ0FBaUIsYUFBYSxDQUFiLENBQWpCO0FBQ0EsdUJBQVcsSUFBWCxDQUFpQixhQUFhLENBQWIsQ0FBakI7QUFDQSx1QkFBVyxJQUFYLENBQWlCLGFBQWEsQ0FBYixDQUFqQjtBQUNBLHVCQUFXLElBQVgsQ0FBaUIsYUFBYSxFQUFiLENBQWpCO0FBQ0gsU0FURCxNQVNPO0FBQ0g7QUFDQSx1QkFBVyxJQUFYLENBQWlCLGFBQWEsQ0FBYixDQUFqQjtBQUNBLHVCQUFXLElBQVgsQ0FBaUIsYUFBYSxDQUFiLENBQWpCO0FBQ0EsdUJBQVcsSUFBWCxDQUFpQixhQUFhLENBQWIsQ0FBakI7QUFDQSx1QkFBVyxJQUFYLENBQWlCLGFBQWEsQ0FBYixDQUFqQjtBQUNBLHVCQUFXLElBQVgsQ0FBaUIsYUFBYSxDQUFiLENBQWpCO0FBQ0EsdUJBQVcsSUFBWCxDQUFpQixhQUFhLENBQWIsQ0FBakI7QUFDQSx1QkFBVyxJQUFYLENBQWlCLGFBQWEsRUFBYixDQUFqQjtBQUNIO0FBQ0QsZUFBTyxVQUFQO0FBQ0gsS0FyTlU7OztBQXVOWDs7O0FBR0EsOEJBMU5XLHdDQTBOa0I7QUFDekIsWUFBSSxNQUFNLEtBQUssY0FBZjtBQUNBLGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxJQUFJLE1BQXhCLEVBQWdDLEdBQWhDLEVBQXFDO0FBQ2pDLGlCQUFLLElBQUwsQ0FBVSxJQUFJLENBQUosQ0FBVixJQUFvQixLQUFLLG1CQUFMLENBQXlCLElBQUksQ0FBSixDQUF6QixFQUFpQyxJQUFqQyxDQUFwQjtBQUNBLGlCQUFLLElBQUwsQ0FBVSxJQUFJLENBQUosSUFBUyxHQUFuQixJQUEwQixLQUFLLG1CQUFMLENBQXlCLElBQUksQ0FBSixDQUF6QixFQUFpQyxLQUFqQyxDQUExQjtBQUNIO0FBQ0o7QUFoT1UsQzs7Ozs7Ozs7Ozs7QUNKZjs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVxQixJOzs7Ozs7Ozs7Ozs7QUFDakI7Ozs7O2lDQUtTLEssRUFBTyxNLEVBQVE7QUFDcEIsaUJBQUssU0FBTCxHQUFpQixLQUFLLGNBQUwsRUFBakI7QUFDQSxnQkFBSSxPQUFPLElBQUksTUFBTSxJQUFWLENBQWUsS0FBSyxjQUFMLEVBQWYsRUFBc0MsS0FBSyxTQUEzQyxDQUFYO0FBQ0EsaUJBQUssUUFBTCxDQUFjLENBQWQsR0FBa0IsQ0FBbEI7QUFDQSxpQkFBSyxHQUFMLENBQVMsSUFBVCxFQUFlLE1BQWY7QUFDSDs7QUFFRDs7Ozs7Ozs7aUNBS1MsZSxFQUFpQixZLEVBQWM7QUFDcEMsZ0JBQUksdUJBQWEsU0FBakIsRUFBNEI7QUFDeEIscUJBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsQ0FBcEIsSUFBeUIsS0FBSyxFQUFMLEdBQVUsSUFBbkM7QUFDSDtBQUNKOzs7b0NBRVcsSyxFQUFPO0FBQ2YsaUJBQUssU0FBTCxDQUFlLFFBQWYsQ0FBd0IsTUFBeEIsQ0FBK0IsS0FBL0I7QUFDSDs7QUFFRDs7Ozs7Ozt5Q0FJaUI7QUFDYixtQkFBTyxJQUFJLE1BQU0sbUJBQVYsQ0FBK0IsR0FBL0IsRUFBb0MsQ0FBcEMsQ0FBUDtBQUNIOztBQUVEOzs7Ozs7eUNBR2lCO0FBQ2IsbUJBQU8sSUFBSSxNQUFNLGlCQUFWLENBQTRCO0FBQy9CLHVCQUFjLGdCQUFNLElBQU4sQ0FBVyxLQURNO0FBRS9CLDBCQUFjLGdCQUFNLElBQU4sQ0FBVyxRQUZNO0FBRy9CLDBCQUFjLGdCQUFNLElBQU4sQ0FBVyxRQUhNO0FBSS9CLHNCQUFjLE1BQU0sUUFKVztBQUsvQiwyQkFBYyxFQUxpQjtBQU0vQix5QkFBYyxNQUFNLFdBTlc7QUFPL0IsNkJBQWEsQ0FQa0I7QUFRL0IseUJBQWE7QUFSa0IsYUFBNUIsQ0FBUDtBQVVIOzs7Ozs7a0JBbERnQixJOzs7Ozs7Ozs7OztBQ0pyQjs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVxQixpQjs7Ozs7Ozs7Ozs7O0FBQ2pCOzs7OztpQ0FLUyxLLEVBQU8sTSxFQUFRO0FBQ3BCLGdCQUFJLFdBQVcsSUFBSSxNQUFNLFFBQVYsRUFBZjtBQUNBLGdCQUFJLGdCQUFnQixJQUFJLE1BQU0sYUFBVixFQUFwQjtBQUNBLGdCQUFJLFNBQVMsY0FBYyxJQUFkLENBQW1CLGdCQUFNLGlCQUFOLENBQXdCLE1BQTNDLENBQWI7O0FBRUEsaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFwQixFQUEyQixHQUEzQixFQUFpQztBQUM3QixvQkFBSSxTQUFTLElBQUksTUFBTSxPQUFWLEVBQWI7QUFDQSx1QkFBTyxDQUFQLEdBQVcsS0FBSyxNQUFMLEtBQWdCLElBQWhCLEdBQXVCLEdBQWxDO0FBQ0EsdUJBQU8sQ0FBUCxHQUFXLEtBQUssTUFBTCxLQUFnQixJQUFoQixHQUF1QixHQUFsQztBQUNBLHVCQUFPLENBQVAsR0FBVyxLQUFLLE1BQUwsS0FBZ0IsSUFBaEIsR0FBdUIsR0FBbEM7QUFDQSx5QkFBUyxRQUFULENBQWtCLElBQWxCLENBQXdCLE1BQXhCO0FBQ0g7O0FBRUQsaUJBQUssU0FBTCxHQUFpQixFQUFqQjtBQUNBLGlCQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksQ0FBcEIsRUFBdUIsR0FBdkIsRUFBOEI7QUFDMUIscUJBQUssU0FBTCxDQUFlLENBQWYsSUFBb0IsSUFBSSxNQUFNLGNBQVYsQ0FBeUI7QUFDekMsMEJBQU0sS0FBSyxNQUFMLEtBQWMsR0FBZCxHQUFvQixHQURlO0FBRXpDLHlCQUFLLE1BRm9DO0FBR3pDLDhCQUFVLE1BQU0sZ0JBSHlCO0FBSXpDLCtCQUFXLElBSjhCO0FBS3pDLGlDQUFjLElBTDJCLEVBQXpCLENBQXBCO0FBTUEsb0JBQUksWUFBWSxJQUFJLE1BQU0sTUFBVixDQUFrQixRQUFsQixFQUE0QixLQUFLLFNBQUwsQ0FBZSxDQUFmLENBQTVCLENBQWhCOztBQUVBLDBCQUFVLFFBQVYsQ0FBbUIsQ0FBbkIsR0FBdUIsS0FBSyxNQUFMLEtBQWdCLENBQXZDO0FBQ0EsMEJBQVUsUUFBVixDQUFtQixDQUFuQixHQUF1QixLQUFLLE1BQUwsS0FBZ0IsQ0FBdkM7QUFDQSwwQkFBVSxRQUFWLENBQW1CLENBQW5CLEdBQXVCLEtBQUssTUFBTCxLQUFnQixDQUF2QztBQUNBLDBCQUFVLFdBQVYsR0FBd0IsQ0FBeEI7QUFDQSxxQkFBSyxHQUFMLENBQVMsU0FBVDtBQUNIOztBQUVELGlCQUFLLFFBQUw7QUFDSDs7QUFFRDs7Ozs7OztpQ0FJUyxHLEVBQUs7QUFDVixnQkFBSSxDQUFDLEdBQUwsRUFBVTtBQUNOLHFCQUFLLE1BQUwsR0FBYyxnQkFBTSxpQkFBTixDQUF3QixLQUF0QztBQUNILGFBRkQsTUFFTztBQUNILHFCQUFLLE1BQUwsR0FBYyxHQUFkO0FBQ0g7O0FBRUQsaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLFNBQUwsQ0FBZSxNQUFuQyxFQUEyQyxHQUEzQyxFQUFnRDtBQUM1QyxxQkFBSyxTQUFMLENBQWUsQ0FBZixFQUFrQixLQUFsQixDQUF3QixHQUF4QixDQUE0QixLQUFLLE1BQWpDO0FBQ0g7QUFDSDs7O2lDQUVPLEksRUFBTTtBQUNYLGlCQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksS0FBSyxRQUFMLENBQWMsTUFBbEMsRUFBMEMsR0FBMUMsRUFBZ0Q7QUFDNUMsb0JBQUksU0FBUyxLQUFLLFFBQUwsQ0FBYyxDQUFkLENBQWI7QUFDQSxvQkFBSSxrQkFBa0IsTUFBTSxNQUE1QixFQUFvQztBQUNoQywyQkFBTyxRQUFQLENBQWdCLENBQWhCLElBQXFCLElBQXJCO0FBQ0EsMkJBQU8sUUFBUCxDQUFnQixDQUFoQixJQUFxQixJQUFyQjtBQUNIO0FBQ0o7QUFDSjs7Ozs7O2tCQS9EZ0IsaUI7Ozs7Ozs7Ozs7O0FDSnJCOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRXFCLFk7Ozs7Ozs7Ozs7O3FDQUNKLE0sRUFBUTtBQUNqQjs7Ozs7QUFLQSxpQkFBSyxnQkFBTCxHQUF3QixLQUFLLEVBQUwsR0FBUSxFQUFoQzs7QUFFQTs7Ozs7QUFLQSxpQkFBSyxXQUFMLEdBQW1CLE9BQU8sT0FBUCxHQUFpQixPQUFPLE9BQXhCLEdBQWtDLENBQXJEOztBQUVBOzs7OztBQUtBLGlCQUFLLGVBQUwsR0FBdUIsT0FBTyxXQUFQLEdBQXFCLE9BQU8sV0FBNUIsR0FBMEMsQ0FBakU7O0FBRUE7Ozs7O0FBS0EsaUJBQUssYUFBTCxHQUFxQixHQUFyQjs7QUFFQTs7Ozs7QUFLQSxpQkFBSyxXQUFMLEdBQW1CLEdBQW5COztBQUVBOzs7OztBQUtBLGlCQUFLLEtBQUwsR0FBYSxFQUFiOztBQUVBOzs7OztBQUtBLGlCQUFLLGFBQUwsR0FBcUIsRUFBckI7O0FBRUE7Ozs7O0FBS0EsaUJBQUssc0JBQUwsR0FBOEIsRUFBOUI7O0FBRUE7Ozs7QUFJQSxpQkFBSyxhQUFMLEdBQXFCLEVBQXJCO0FBQ0g7QUFDRDs7Ozs7Ozs7aUNBS1MsSyxFQUFPLE0sRUFBUSxDQUV2QjtBQURHOzs7QUFHSjs7Ozs7Ozs7aUNBS1MsSyxFQUFPLE0sRUFBUTtBQUNwQixpQkFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssS0FBTCxDQUFXLE1BQS9CLEVBQXVDLEdBQXZDLEVBQTRDO0FBQ3hDLG9CQUFJLEtBQUssS0FBTCxDQUFXLENBQVgsRUFBYyxVQUFkLENBQXlCLFNBQTdCLEVBQXdDO0FBQ3BDLHlCQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWMsTUFBZCxDQUFxQixRQUFyQixDQUE4QixLQUE5QixDQUFvQyxNQUFwQyxDQUNJLEtBQUssS0FBTCxDQUFXLENBQVgsRUFBYyxVQUFkLENBQXlCLE1BQXpCLEdBQWdDLEdBRHBDLEVBRUksS0FBSyxLQUFMLENBQVcsQ0FBWCxFQUFjLFVBQWQsQ0FBeUIsTUFBekIsR0FBZ0MsR0FGcEMsRUFHSSxLQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWMsVUFBZCxDQUF5QixNQUF6QixHQUFnQyxHQUhwQztBQUlIO0FBQ0o7QUFDSjs7QUFFRDs7Ozs7Ozt1Q0FJZSxRLEVBQVU7QUFDckIsZ0JBQUksTUFBTSxJQUFJLE1BQU0sb0JBQVYsQ0FBZ0M7QUFDdEMsMkJBQVcsR0FEMkI7QUFFdEMsMkJBQVcsQ0FGMkI7QUFHdEMsc0JBQU0sTUFBTSxTQUgwQjtBQUl0Qyx5QkFBUyxNQUFNO0FBSnVCLGFBQWhDLENBQVY7QUFNQSxpQkFBSyxVQUFMLENBQWdCLFFBQWhCLEVBQTBCLEdBQTFCO0FBQ0g7Ozs7O0FBRUQ7Ozs7O21DQUtXLFEsRUFBVSxRLEVBQVU7QUFDM0IsZ0JBQUksY0FBYyxlQUFLLGVBQUwsQ0FBcUIsS0FBSyxhQUExQixDQUFsQjtBQUNBLGdCQUFJLFlBQVksZUFBSyxlQUFMLENBQXFCLEtBQUssV0FBMUIsQ0FBaEI7QUFDQSxnQkFBSSxVQUFVLENBQWQ7QUFDQSxnQkFBSSxTQUFTLENBQWI7QUFDQSxnQkFBSSxvQkFBb0IsQ0FBeEI7QUFDQSxnQkFBSSxRQUFRLEVBQVo7QUFDQSxpQkFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssV0FBekIsRUFBc0MsR0FBdEMsRUFBMkM7QUFDdkMsd0JBQVEsTUFBTSxNQUFOLENBQWEsZUFBSyxjQUFsQixDQUFSO0FBQ0g7QUFDRCxvQkFBUSxNQUFNLE1BQU4sQ0FBYSxlQUFLLGNBQUwsQ0FBb0IsS0FBcEIsQ0FBMEIsQ0FBMUIsRUFBNkIsWUFBVSxDQUF2QyxDQUFiLENBQVI7O0FBRUEsaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxNQUFNLE1BQTFCLEVBQWtDLEdBQWxDLEVBQXVDO0FBQ25DLG9CQUFJLEtBQUssV0FBVCxFQUFzQjtBQUNsQix3Q0FBb0IsS0FBSyxNQUFMLENBQVksaUJBQVosRUFBK0IsTUFBTSxDQUFOLEVBQVMsT0FBVCxDQUFpQixHQUFqQixNQUEwQixDQUFDLENBQTFELEVBQTZELE1BQU0sQ0FBTixDQUE3RCxFQUF1RSxNQUF2RSxFQUErRSxRQUEvRSxFQUF5RixRQUF6RixDQUFwQjtBQUNIO0FBQ0Q7QUFDQSxvQkFBSSxXQUFXLGVBQUssY0FBTCxDQUFvQixNQUFuQyxFQUEyQztBQUN2Qyw4QkFBVSxDQUFWO0FBQ0E7QUFDSDtBQUNKO0FBQ0QsbUJBQU8saUJBQVA7QUFDSDs7QUFFRDs7Ozs7O29DQUdZO0FBQ1IsaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLEtBQUwsQ0FBVyxNQUEvQixFQUF1QyxHQUF2QyxFQUE0QztBQUN4QyxvQkFBSSxLQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWMsU0FBbEIsRUFBNkI7QUFDekIsd0JBQUksZUFBZSxLQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWMsTUFBZCxDQUFxQixRQUFyQixDQUE4QixLQUE5QixDQUFvQyxNQUFwQyxFQUFuQjtBQUNBLG9DQUFNLFdBQU4sQ0FBa0IsS0FBSyxLQUFMLENBQVcsQ0FBWCxFQUFjLFVBQWhDLEVBQTRDLGdCQUFNLFFBQU4sQ0FBZSxZQUFmLEVBQTZCLEdBQTdCLENBQTVDLEVBQStFLE9BQS9FO0FBQ0EseUJBQUssS0FBTCxDQUFXLENBQVgsRUFBYyxVQUFkLENBQXlCLEtBQXpCLEdBQWlDLENBQWpDO0FBQ0EseUJBQUssS0FBTCxDQUFXLENBQVgsRUFBYyxVQUFkLENBQXlCLFNBQXpCLEdBQXFDLElBQXJDO0FBQ0Esd0JBQUksU0FBUyxnQkFBTSxXQUFOLENBQWtCLEVBQWxCLEVBQXNCLGdCQUFNLFFBQU4sQ0FBZSxnQkFBTSxJQUFOLENBQVcsTUFBWCxDQUFrQixLQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWMsSUFBaEMsRUFBc0MsS0FBckQsRUFBNEQsR0FBNUQsQ0FBdEIsRUFBd0YsT0FBeEYsQ0FBYjtBQUNBLDJCQUFPLEtBQVAsR0FBZSxDQUFmO0FBQ0EsNkJBQVMsS0FBVCxDQUFlLEdBQWYsQ0FBbUIsS0FBSyxLQUFMLENBQVcsQ0FBWCxFQUFjLFVBQWpDLEVBQ0ssRUFETCxDQUNRLE1BRFIsRUFDZ0IsSUFEaEIsRUFFSyxJQUZMLENBRVUsR0FGVixFQUVlO0FBRmYscUJBR0ssSUFITCxDQUdXLFlBQVc7QUFBRSw2QkFBSyxTQUFMLEdBQWlCLEtBQWpCO0FBQXlCLHFCQUhqRDtBQUlIO0FBQ0o7QUFDSjs7QUFFRDs7Ozs7OzsyQ0FJbUIsUSxFQUFVO0FBQ3pCLGdCQUFJLENBQUo7QUFDQSxpQkFBSyxJQUFJLENBQVQsRUFBWSxJQUFJLEtBQUssYUFBTCxDQUFtQixNQUFuQyxFQUEyQyxHQUEzQyxFQUFnRDtBQUM1QyxxQkFBSyxtQkFBTCxDQUF5QixLQUFLLGFBQUwsQ0FBbUIsQ0FBbkIsQ0FBekIsRUFBZ0QsUUFBaEQsRUFBMEQsS0FBMUQ7QUFDSDtBQUNELGlCQUFLLGFBQUwsR0FBcUIsZUFBSyxJQUFMLENBQVUsUUFBVixDQUFyQjs7QUFFQSxpQkFBSyxJQUFJLENBQVQsRUFBWSxJQUFJLEtBQUssYUFBTCxDQUFtQixNQUFuQyxFQUEyQyxHQUEzQyxFQUFnRDtBQUM1QyxxQkFBSyxtQkFBTCxDQUF5QixLQUFLLGFBQUwsQ0FBbUIsQ0FBbkIsQ0FBekIsRUFBZ0QsUUFBaEQsRUFBMEQsSUFBMUQsRUFBZ0UsQ0FBaEU7QUFDSDtBQUNKOztBQUVEOzs7Ozs7O3lDQUlpQixDLEVBQUc7QUFDaEIsZ0JBQUksTUFBTSxLQUFLLHdCQUFMLENBQThCLEVBQUUsUUFBaEMsRUFBMEMsRUFBRSxNQUE1QyxDQUFWO0FBQ0EsZ0JBQUksR0FBSixFQUFTO0FBQ0wsb0JBQUksRUFBRSxRQUFGLEtBQWUsQ0FBbkIsRUFBc0I7QUFDbEIsMkNBQWEsT0FBYixDQUFxQixFQUFFLFFBQUYsR0FBYSxFQUFFLE1BQXBDLEVBQTRDLElBQUksV0FBaEQsRUFBNkQsSUFBRSxDQUEvRDtBQUNBLHdCQUFJLGVBQWUsS0FBSyxhQUFMLENBQW1CLE9BQW5CLENBQTJCLElBQUksV0FBL0IsQ0FBbkI7QUFDQSx5QkFBSyxhQUFMLENBQW1CLE1BQW5CLENBQTBCLFlBQTFCLEVBQXdDLENBQXhDO0FBQ0EsaUNBQWEsS0FBSyxnQkFBbEI7QUFDQSx3QkFBSSxNQUFKLENBQVcsUUFBWCxDQUFvQixHQUFwQixDQUF3QixJQUFJLGdCQUFKLENBQXFCLENBQTdDLEVBQWdELElBQUksZ0JBQUosQ0FBcUIsQ0FBckUsRUFBd0UsSUFBSSxnQkFBSixDQUFxQixDQUE3RjtBQUNBLHdCQUFJLGVBQUosR0FBc0IsQ0FBdEI7QUFDQSx3QkFBSSxXQUFKLEdBQWtCLENBQUMsQ0FBbkI7QUFDQSx3QkFBSSxJQUFKLEdBQVcsS0FBWDtBQUNILGlCQVRELE1BU087QUFDSCx5QkFBSyxhQUFMLEdBQXFCLEtBQUssYUFBTCxDQUFtQixJQUFuQixFQUFyQjtBQUNBLHdCQUFJLGNBQWMsS0FBSyxhQUFMLENBQW1CLEtBQUssYUFBTCxDQUFtQixNQUFuQixHQUEwQixDQUE3QyxJQUFrRCxDQUFwRTtBQUNBLHdCQUFJLENBQUMsV0FBTCxFQUFrQjtBQUNkLHNDQUFjLEtBQUssc0JBQW5CO0FBQ0g7O0FBRUQsMkNBQWEsTUFBYixDQUFvQix1QkFBYSxLQUFqQyxFQUF3QyxFQUFFLFFBQUYsR0FBYSxFQUFFLE1BQXZELEVBQStELFdBQS9ELEVBQTRFLElBQTVFLEVBQWtGLEVBQUUsUUFBRixHQUFhLEdBQS9GO0FBQ0Esd0JBQUksZUFBSixHQUFzQixFQUFFLFFBQUYsR0FBYSxLQUFLLGdCQUF4QztBQUNBLHdCQUFJLE1BQUosQ0FBVyxPQUFYLENBQW1CLElBQUksZUFBdkI7QUFDQSx3QkFBSSxXQUFKLEdBQWtCLFdBQWxCO0FBQ0Esd0JBQUksSUFBSixHQUFXLElBQVg7QUFDSDtBQUNKO0FBQ0o7O0FBRUQ7Ozs7Ozs7Ozs0Q0FNb0IsUSxFQUFVLGMsRUFBZ0IsTSxFQUFRO0FBQ2xELGdCQUFJLFVBQVUsZUFBSyxJQUFMLENBQVUsY0FBVixFQUEwQixPQUExQixDQUFrQyxRQUFsQyxDQUFkO0FBQ0EsZ0JBQUksZUFBZSxNQUFmLENBQXNCLGVBQWUsTUFBZixHQUFzQixDQUE1QyxNQUFtRCxHQUF2RCxFQUE0RDtBQUN4RCxpQ0FBaUIsZUFBZSxLQUFmLENBQXFCLENBQXJCLEVBQXdCLGVBQWUsTUFBZixHQUFzQixDQUE5QyxDQUFqQjtBQUNIO0FBQ0QsZ0JBQUksY0FBYyxlQUFLLGVBQUwsQ0FBcUIsY0FBckIsQ0FBbEI7QUFDQSxnQkFBSSxZQUFZLGdCQUFNLHdCQUFOLENBQStCLFdBQS9CLENBQWhCO0FBQ0EsZ0JBQUksWUFBWSxnQkFBTSx1QkFBTixDQUE4QixXQUE5QixDQUFoQjs7QUFFQSxnQkFBSSxPQUFPLEtBQUsseUJBQUwsQ0FBK0IsUUFBL0IsQ0FBWDtBQUNBLGlCQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksS0FBSyxNQUF6QixFQUFpQyxHQUFqQyxFQUFzQztBQUNsQyxvQkFBSSxNQUFKLEVBQVk7QUFDUix3QkFBSSxHQUFKO0FBQ0Esd0JBQUksWUFBWSxDQUFaLElBQWlCLFlBQVksQ0FBN0IsSUFBa0MsWUFBWSxDQUE5QyxJQUFtRCxZQUFZLENBQW5FLEVBQXNFO0FBQ2xFLDhCQUFNLGdCQUFNLElBQU4sQ0FBVyxpQkFBWCxDQUE2QixLQUFLLENBQUwsRUFBUSxJQUFyQyxDQUFOO0FBQ0EsNkJBQUssQ0FBTCxFQUFRLGlCQUFSLEdBQTRCLElBQTVCO0FBQ0EsNkJBQUssQ0FBTCxFQUFRLFNBQVIsR0FBb0IsSUFBcEI7QUFDQSw2QkFBSyxDQUFMLEVBQVEsTUFBUixDQUFlLFFBQWYsQ0FBd0IsS0FBeEIsQ0FBOEIsTUFBOUIsQ0FBcUMsU0FBckM7QUFDSCxxQkFMRCxNQUtPO0FBQ0gsOEJBQU0sZ0JBQU0sSUFBTixDQUFXLFNBQVgsQ0FBcUIsS0FBSyxDQUFMLEVBQVEsSUFBN0IsQ0FBTjtBQUNBLDZCQUFLLENBQUwsRUFBUSxTQUFSLEdBQW9CLElBQXBCO0FBQ0EsNkJBQUssQ0FBTCxFQUFRLGlCQUFSLEdBQTRCLEtBQTVCO0FBQ0EsNkJBQUssQ0FBTCxFQUFRLE1BQVIsQ0FBZSxRQUFmLENBQXdCLEtBQXhCLENBQThCLE1BQTlCLENBQXFDLFNBQXJDO0FBQ0g7QUFDSixpQkFiRCxNQWFPO0FBQ0gseUJBQUssQ0FBTCxFQUFRLE1BQVIsQ0FBZSxRQUFmLENBQXdCLEtBQXhCLENBQThCLE1BQTlCLENBQXFDLGdCQUFNLElBQU4sQ0FBVyxNQUFYLENBQWtCLEtBQUssQ0FBTCxFQUFRLElBQTFCLEVBQWdDLEtBQXJFO0FBQ0E7QUFDQSx5QkFBSyxDQUFMLEVBQVEsU0FBUixHQUFvQixLQUFwQjtBQUNBLHlCQUFLLENBQUwsRUFBUSxpQkFBUixHQUE0QixLQUE1QjtBQUNIO0FBQ0o7QUFDRCxtQkFBTyxJQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7dUNBSWUsUSxFQUFVLFEsRUFBVTtBQUMvQixnQkFBSSxVQUFVLFNBQVMsS0FBVCxFQUFkO0FBQ0EsZ0JBQUksTUFBTSxTQUFTLEtBQVQsRUFBVjtBQUNBLGdCQUFJLEtBQUosQ0FBVSxNQUFWLENBQWlCLGdCQUFNLElBQU4sQ0FBVyxNQUFYLENBQWtCLEtBQWxCLENBQXdCLEtBQXpDO0FBQ0EsZ0JBQUksUUFBSixDQUFhLE1BQWIsQ0FBb0IsZ0JBQU0sSUFBTixDQUFXLE1BQVgsQ0FBa0IsS0FBbEIsQ0FBd0IsUUFBNUM7QUFDQSxvQkFBUSxTQUFSLENBQW1CLENBQW5CLEVBQXNCLENBQUMsRUFBdkIsRUFBMkIsQ0FBM0I7QUFDQSxnQkFBSSxNQUFNLElBQUksTUFBTSxJQUFWLENBQWdCLE9BQWhCLEVBQXlCLEdBQXpCLENBQVY7QUFDQSxtQkFBTyxHQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7dUNBSWUsUSxFQUFVLFEsRUFBVTtBQUMvQixnQkFBSSxVQUFVLFNBQVMsS0FBVCxFQUFkO0FBQ0EsZ0JBQUksTUFBTSxTQUFTLEtBQVQsRUFBVjtBQUNBLGdCQUFJLEtBQUosQ0FBVSxNQUFWLENBQWlCLGdCQUFNLElBQU4sQ0FBVyxNQUFYLENBQWtCLEtBQWxCLENBQXdCLEtBQXpDO0FBQ0EsZ0JBQUksUUFBSixDQUFhLE1BQWIsQ0FBb0IsZ0JBQU0sSUFBTixDQUFXLE1BQVgsQ0FBa0IsS0FBbEIsQ0FBd0IsUUFBNUM7QUFDQSxvQkFBUSxTQUFSLENBQW1CLENBQW5CLEVBQXNCLENBQUMsRUFBdkIsRUFBMkIsQ0FBM0I7QUFDQSxvQkFBUSxLQUFSLENBQWMsQ0FBZCxFQUFpQixFQUFqQixFQUFxQixDQUFyQjtBQUNBLGdCQUFJLE1BQU0sSUFBSSxNQUFNLElBQVYsQ0FBZ0IsT0FBaEIsRUFBeUIsR0FBekIsQ0FBVjtBQUNBLG1CQUFPLEdBQVA7QUFDSDs7QUFFRDs7Ozs7Ozs7Ozs7OzsrQkFVTyxpQixFQUFtQixLLEVBQU8sUSxFQUFVLE0sRUFBUSxRLEVBQVUsUSxFQUFVO0FBQ25FLGdCQUFJLEdBQUosRUFBUyxLQUFULEVBQWdCLFFBQWhCO0FBQ0EsZ0JBQUksS0FBSixFQUFXO0FBQ1Asd0JBQVEsT0FBUjtBQUNBLHNCQUFNLEtBQUssY0FBTCxDQUFvQixRQUFwQixFQUE4QixRQUE5QixDQUFOO0FBQ0gsYUFIRCxNQUdPO0FBQ0gsd0JBQVEsT0FBUjtBQUNBLHNCQUFNLEtBQUssY0FBTCxDQUFvQixRQUFwQixFQUE4QixRQUE5QixDQUFOO0FBQ0g7O0FBRUQsZ0NBQW9CLEtBQUssaUJBQUwsQ0FBdUIsR0FBdkIsRUFBNEIsaUJBQTVCLEVBQStDLEtBQS9DLENBQXBCO0FBQ0EsaUJBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0I7QUFDWixzQkFBTSxLQURNO0FBRVosd0JBQVEsR0FGSTtBQUdaLHdCQUFRLFNBQVMsS0FBSyxlQUhWO0FBSVosNEJBQVksRUFKQTtBQUtaLDBCQUFVLFFBTEU7QUFNWixrQ0FBa0I7QUFDZCx1QkFBRyxJQUFJLFFBQUosQ0FBYSxDQURGO0FBRWQsdUJBQUcsSUFBSSxRQUFKLENBQWEsQ0FGRjtBQUdkLHVCQUFHLElBQUksUUFBSixDQUFhLENBSEY7QUFOTixhQUFoQjs7QUFZQSxpQkFBSyxHQUFMLENBQVMsR0FBVCxFQUFhLFNBQVMsUUFBdEI7QUFDQSxtQkFBTyxpQkFBUDtBQUNIOztBQUVEOzs7Ozs7Ozs7MENBTWtCLE8sRUFBUyxpQixFQUFtQixRLEVBQVUsQ0FBRTs7QUFFMUQ7Ozs7Ozs7O2tEQUswQixRLEVBQVU7QUFDaEMsZ0JBQUksT0FBTyxFQUFYO0FBQ0EsaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLEtBQUwsQ0FBVyxNQUEvQixFQUF1QyxHQUF2QyxFQUE0QztBQUN4QyxvQkFBSSxLQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWMsUUFBZCxLQUEyQixRQUEvQixFQUF5QztBQUNyQyx5QkFBSyxJQUFMLENBQVUsS0FBSyxLQUFMLENBQVcsQ0FBWCxDQUFWO0FBQ0g7QUFDSjtBQUNELG1CQUFPLElBQVA7QUFDSDs7QUFFRDs7Ozs7Ozs7aURBS3lCLFEsRUFBVSxNLEVBQVE7QUFDdkMsZ0JBQUksaUJBQWlCLGVBQUssZUFBTCxDQUFxQixLQUFLLGFBQTFCLENBQXJCO0FBQ0EsOEJBQWtCLEtBQUssZUFBTCxHQUF1QixlQUFLLGNBQUwsQ0FBb0IsTUFBN0Q7QUFDQSxnQkFBSSxPQUFPLFNBQVMsZUFBSyxjQUFMLENBQW9CLE1BQTdCLEdBQXNDLGVBQUssY0FBTCxDQUFvQixPQUFwQixDQUE0QixRQUE1QixDQUF0QyxHQUE4RSxjQUF6RjtBQUNBLG1CQUFPLEtBQUssS0FBTCxDQUFXLElBQVgsQ0FBUDtBQUNIOztBQUVEOzs7Ozs7O21DQUlXLEksRUFBTTtBQUNiLGdCQUFJLFdBQVcsZUFBSyxjQUFMLENBQW9CLEtBQUssSUFBekIsQ0FBZjtBQUNBLGdCQUFJLE1BQU0sS0FBSyx5QkFBTCxDQUErQixRQUEvQixDQUFWO0FBQ0EsaUJBQUssZ0JBQUwsQ0FBc0IsSUFBSSxDQUFKLENBQXRCLEVBQThCLEtBQUssUUFBTCxHQUFnQixHQUE5QztBQUNIOzs7Ozs7a0JBOVZnQixZOzs7Ozs7Ozs7Ozs7O0FDUHJCOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRXFCLGdCOzs7Ozs7Ozs7Ozs7QUFDakI7Ozs7Ozs7MENBT2tCLE8sRUFBUyxpQixFQUFtQixRLEVBQVU7QUFDcEQsZ0JBQUksU0FBUyxDQUFiO0FBQ0EsZ0JBQUksY0FBYyxDQUFsQjtBQUNBLGdCQUFJLFFBQUosRUFBYztBQUNWLHlCQUFVLEtBQUssRUFBTCxHQUFVLENBQVgsR0FBZ0IsRUFBekI7QUFDSCxhQUZELE1BRU87QUFDSCw4QkFBZSxLQUFLLEVBQUwsR0FBVSxDQUFYLEdBQWdCLEVBQTlCO0FBQ0g7QUFDRCxvQkFBUSxRQUFSLENBQWlCLENBQWpCLEdBQXFCLG9CQUFvQixNQUFwQixHQUE2QixXQUFsRDs7QUFFQSxtQkFBTyxvQkFBb0IsTUFBM0I7QUFDSDs7QUFFRDs7Ozs7Ozs7bUNBS1csUSxFQUFVLFEsRUFBVTtBQUMzQiwySUFBaUIsUUFBakIsRUFBMkIsUUFBM0I7QUFDQSxpQkFBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixDQUFwQixHQUF3QixDQUFDLEdBQXpCO0FBQ0EsaUJBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsR0FBakIsQ0FBcUIsQ0FBckIsRUFBd0IsQ0FBeEIsRUFBMkIsQ0FBM0I7QUFDSDs7Ozs7O2tCQTlCZ0IsZ0I7Ozs7Ozs7Ozs7Ozs7QUNQckI7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFcUIsbUI7Ozs7Ozs7Ozs7O3FDQUNKLE0sRUFBUTtBQUNqQixtSkFBbUIsTUFBbkI7O0FBRUE7Ozs7O0FBS0EsaUJBQUssZ0JBQUwsR0FBd0IsS0FBSyxFQUFMLEdBQVEsRUFBaEM7QUFDSDs7QUFFRDs7Ozs7Ozs7aUNBS1MsSyxFQUFPLE0sRUFBUTtBQUNwQiwrSUFBZSxLQUFmLEVBQXNCLE1BQXRCO0FBQ0EsaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLEtBQUwsQ0FBVyxNQUEvQixFQUF1QyxHQUF2QyxFQUE0QztBQUN4QyxvQkFBSSxLQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWMsVUFBZCxDQUF5QixTQUE3QixFQUF3QztBQUNwQyx3QkFBSSxLQUFKO0FBQ0Esd0JBQUksS0FBSyxLQUFMLENBQVcsQ0FBWCxFQUFjLGlCQUFsQixFQUFxQztBQUNqQyxnQ0FBUSxPQUFPLEtBQUssS0FBTCxDQUFXLENBQVgsRUFBYyxVQUFkLENBQXlCLEtBQXpCLEdBQWlDLEdBQWhEO0FBQ0gscUJBRkQsTUFFTztBQUNILGdDQUFRLE9BQU8sS0FBSyxLQUFMLENBQVcsQ0FBWCxFQUFjLFVBQWQsQ0FBeUIsS0FBekIsR0FBaUMsR0FBaEQ7QUFDSDtBQUNELHlCQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWMsTUFBZCxDQUFxQixLQUFyQixDQUEyQixHQUEzQixDQUErQixLQUEvQixFQUFzQyxLQUF0QyxFQUE2QyxLQUE3QztBQUNBLHlCQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWMsTUFBZCxDQUFxQixRQUFyQixDQUE4QixLQUE5QixDQUFvQyxNQUFwQyxDQUNJLEtBQUssS0FBTCxDQUFXLENBQVgsRUFBYyxVQUFkLENBQXlCLE1BQXpCLEdBQWdDLEdBRHBDLEVBRUksS0FBSyxLQUFMLENBQVcsQ0FBWCxFQUFjLFVBQWQsQ0FBeUIsTUFBekIsR0FBZ0MsR0FGcEMsRUFHSSxLQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWMsVUFBZCxDQUF5QixNQUF6QixHQUFnQyxHQUhwQztBQUlIO0FBQ0o7QUFDSjs7QUFFRDs7Ozs7Ozs7Ozs7OzsrQkFVTyxpQixFQUFtQixLLEVBQU8sUSxFQUFVLE0sRUFBUSxRLEVBQVUsUSxFQUFVO0FBQ25FLHVCQUFXLFNBQVMsS0FBVCxFQUFYO0FBQ0EsZ0JBQUksWUFBWSxJQUFJLE1BQU0sSUFBVixDQUFlLElBQUksTUFBTSxjQUFWLENBQXlCLEdBQXpCLENBQWYsRUFBOEMsUUFBOUMsQ0FBaEI7QUFDQSxzQkFBVSxLQUFWLENBQWdCLEdBQWhCLENBQW9CLEdBQXBCLEVBQXlCLEdBQXpCLEVBQThCLEdBQTlCOztBQUVBLGdCQUFJLEtBQUosRUFBVztBQUNQLDBCQUFVLFFBQVYsQ0FBbUIsQ0FBbkIsR0FBdUIsb0JBQW1CLENBQTFDO0FBQ0EsMEJBQVUsUUFBVixDQUFtQixDQUFuQixHQUF1QixDQUFDLElBQXhCO0FBQ0EsMEJBQVUsUUFBVixDQUFtQixDQUFuQixHQUF1QixHQUF2QjtBQUNBLHlCQUFTLFFBQVQsQ0FBa0IsTUFBbEIsQ0FBeUIsZ0JBQU0sSUFBTixDQUFXLE1BQVgsQ0FBa0IsS0FBbEIsQ0FBd0IsUUFBakQ7QUFDSCxhQUxELE1BS087QUFDSCwwQkFBVSxRQUFWLENBQW1CLENBQW5CLEdBQXVCLG9CQUFtQixDQUExQztBQUNBLDBCQUFVLFFBQVYsQ0FBbUIsQ0FBbkIsR0FBdUIsQ0FBQyxDQUF4QjtBQUNBLDBCQUFVLFFBQVYsQ0FBbUIsQ0FBbkIsR0FBdUIsSUFBdkI7QUFDQSx5QkFBUyxRQUFULENBQWtCLE1BQWxCLENBQXlCLGdCQUFNLElBQU4sQ0FBVyxNQUFYLENBQWtCLEtBQWxCLENBQXdCLFFBQWpEO0FBQ0g7O0FBRUQsaUJBQUssR0FBTCxDQUFTLFNBQVQsRUFBb0IsZUFBZSxRQUFuQztBQUNBLGlLQUFpQyxpQkFBakMsRUFBb0QsS0FBcEQsRUFBMkQsUUFBM0QsRUFBcUUsTUFBckUsRUFBNkUsUUFBN0UsRUFBdUYsUUFBdkY7QUFDQSxpQkFBSyxLQUFMLENBQVcsS0FBSyxLQUFMLENBQVcsTUFBWCxHQUFrQixDQUE3QixFQUFnQyxNQUFoQyxHQUF5QyxTQUF6QztBQUNBLG1CQUFPLGlCQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7Ozs0Q0FNb0IsUSxFQUFVLGMsRUFBZ0IsTSxFQUFRO0FBQ2xELGdCQUFJLHFKQUFpQyxRQUFqQyxFQUEyQyxjQUEzQyxFQUEyRCxNQUEzRCxDQUFKO0FBQ0EsaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLE1BQXpCLEVBQWlDLEdBQWpDLEVBQXNDO0FBQ2xDLG9CQUFJLE1BQUosRUFBWTtBQUNSLHdCQUFJLEtBQUssQ0FBTCxFQUFRLGlCQUFaLEVBQStCO0FBQzNCLDZCQUFLLENBQUwsRUFBUSxNQUFSLENBQWUsS0FBZixDQUFxQixHQUFyQixDQUF5QixDQUF6QixFQUE0QixDQUE1QixFQUErQixDQUEvQjtBQUNILHFCQUZELE1BRU87QUFDSCw2QkFBSyxDQUFMLEVBQVEsTUFBUixDQUFlLEtBQWYsQ0FBcUIsR0FBckIsQ0FBeUIsRUFBekIsRUFBNkIsRUFBN0IsRUFBaUMsRUFBakM7QUFDSDtBQUNKLGlCQU5ELE1BTU87QUFDSCx5QkFBSyxDQUFMLEVBQVEsTUFBUixDQUFlLEtBQWYsQ0FBcUIsR0FBckIsQ0FBeUIsR0FBekIsRUFBOEIsR0FBOUIsRUFBbUMsR0FBbkM7QUFDSDtBQUNELHFCQUFLLENBQUwsRUFBUSxNQUFSLENBQWUsUUFBZixDQUF3QixLQUF4QixHQUFnQyxLQUFLLENBQUwsRUFBUSxNQUFSLENBQWUsUUFBZixDQUF3QixLQUF4RDtBQUNIO0FBQ0QsbUJBQU8sSUFBUDtBQUNIOztBQUVEOzs7Ozs7Ozs7OzBDQU9rQixPLEVBQVMsaUIsRUFBbUIsUSxFQUFVO0FBQ3BELGdCQUFJLFlBQVksQ0FBaEI7QUFDQSxnQkFBSSxDQUFDLFFBQUwsRUFBZTtBQUNYLHdCQUFRLFFBQVIsQ0FBaUIsQ0FBakIsR0FBcUIsQ0FBckI7QUFDQSx3QkFBUSxRQUFSLENBQWlCLENBQWpCLEdBQXFCLENBQXJCO0FBQ0Esd0JBQVEsUUFBUixDQUFpQixDQUFqQixHQUFxQixvQkFBbUIsQ0FBeEM7QUFDQSw0QkFBWSxDQUFaO0FBQ0gsYUFMRCxNQUtPO0FBQ0gsd0JBQVEsUUFBUixDQUFpQixDQUFqQixHQUFxQixvQkFBbUIsQ0FBeEM7QUFDSDtBQUNELG9CQUFRLFFBQVIsQ0FBaUIsQ0FBakIsR0FBcUIsQ0FBckI7QUFDQSxtQkFBTyxvQkFBb0IsU0FBM0I7QUFDSDs7QUFFRDs7Ozs7Ozs7bUNBS1csUSxFQUFVLFEsRUFBVTtBQUMzQixnQkFBSSw2SkFBeUMsUUFBekMsRUFBbUQsUUFBbkQsQ0FBSjtBQUNBLGlCQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLENBQXBCLEdBQXdCLENBQUMscUJBQUQsR0FBdUIsQ0FBdkIsR0FBMkIsRUFBbkQ7QUFDQSxpQkFBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixDQUFwQixHQUF3QixDQUFDLEdBQXpCO0FBQ0EsaUJBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsQ0FBcEIsR0FBd0IsQ0FBQyxHQUF6QjtBQUNBLGlCQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLENBQXBCLEdBQXdCLENBQUMsS0FBSyxFQUFOLEdBQVMsQ0FBakM7QUFDQSxpQkFBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixHQUFqQixDQUFxQixFQUFyQixFQUF5QixFQUF6QixFQUE2QixFQUE3QjtBQUNIOzs7Ozs7a0JBN0hnQixtQjs7Ozs7Ozs7Ozs7QUNQckI7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRXFCLFE7Ozs7Ozs7Ozs7OztBQUNqQjs7Ozs7aUNBS1MsSyxFQUFPLE0sRUFBUTtBQUNwQixpQkFBSyxNQUFMLEdBQWMsSUFBSSxNQUFNLGVBQVYsQ0FBMkIsZ0JBQU0sUUFBTixDQUFlLFVBQWYsQ0FBMEIsR0FBckQsRUFBMEQsZ0JBQU0sUUFBTixDQUFlLFVBQWYsQ0FBMEIsTUFBcEYsRUFBNEYsQ0FBNUYsQ0FBZDtBQUNBLGdCQUFJLFlBQVksSUFBSSxNQUFNLFNBQVYsQ0FBcUIsZ0JBQU0sUUFBTixDQUFlLFNBQXBDLENBQWhCO0FBQ0Esc0JBQVUsUUFBVixDQUFtQixHQUFuQixDQUF3QixDQUF4QixFQUEyQixDQUEzQixFQUE4QixHQUE5QjtBQUNBLHNCQUFVLFFBQVYsQ0FBbUIsQ0FBbkIsR0FBdUIsS0FBSyxFQUFMLEdBQVUsQ0FBakM7O0FBRUEsc0JBQVUsTUFBVixDQUFpQixPQUFqQixDQUF5QixLQUF6QixHQUFpQyxJQUFqQztBQUNBLHNCQUFVLE1BQVYsQ0FBaUIsT0FBakIsQ0FBeUIsTUFBekIsR0FBa0MsSUFBbEM7O0FBRUEsc0JBQVUsTUFBVixDQUFpQixNQUFqQixDQUF3QixJQUF4QixHQUErQixHQUEvQjtBQUNBLHNCQUFVLE1BQVYsQ0FBaUIsTUFBakIsQ0FBd0IsR0FBeEIsR0FBOEIsR0FBOUI7QUFDQSxzQkFBVSxNQUFWLENBQWlCLE1BQWpCLENBQXdCLEdBQXhCLEdBQThCLEVBQTlCOztBQUVBLGlCQUFLLEdBQUwsQ0FBUyxTQUFUO0FBQ0EsaUJBQUssR0FBTCxDQUFTLEtBQUssTUFBZDs7QUFFQSxpQkFBSyxVQUFMLEdBQWtCLEVBQWxCO0FBQ0g7O0FBRUQ7Ozs7Ozs7O2lDQUtTLEssRUFBTyxNLEVBQVE7QUFDcEIsZ0JBQUksS0FBSyxVQUFMLENBQWdCLFNBQXBCLEVBQStCO0FBQzNCLHFCQUFLLE1BQUwsQ0FBWSxTQUFaLEdBQXdCLEtBQUssVUFBTCxDQUFnQixTQUF4QztBQUNIO0FBQ0o7OztxQ0FFWSxLLEVBQU87QUFDaEIsaUJBQUssVUFBTCxHQUFrQixFQUFFLFdBQVcsSUFBYixFQUFtQixXQUFXLEtBQUssTUFBTCxDQUFZLFNBQTFDLEVBQWxCO0FBQ0EscUJBQVMsS0FBVCxDQUFlLEdBQWYsQ0FBbUIsS0FBSyxVQUF4QixFQUNLLEVBREwsQ0FDUSxFQUFFLFdBQVcsS0FBYixFQURSLEVBQzhCLElBRDlCLEVBRUssSUFGTCxDQUVVLEdBRlYsRUFFZTtBQUZmLGFBR0ssSUFITCxDQUdXLFlBQVc7QUFBRSxxQkFBSyxTQUFMLEdBQWlCLEtBQWpCO0FBQXlCLGFBSGpEO0FBSUg7Ozs7OztrQkExQ2dCLFE7Ozs7Ozs7Ozs7O0FDSHJCOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVxQixTOzs7Ozs7Ozs7OztxQ0FDSixNLEVBQVE7QUFDakIsaUJBQUssT0FBTCxHQUFlLE1BQWY7O0FBRUE7Ozs7O0FBS0EsaUJBQUssUUFBTCxHQUFnQixFQUFoQjs7QUFFQTs7Ozs7QUFLQTs7QUFFQTs7Ozs7QUFLQSxpQkFBSyxhQUFMLEdBQXFCO0FBQ2pCLHNCQUFNLEVBQUUsV0FBVyxLQUFiLEVBQW9CLE9BQU8sRUFBM0I7QUFEVyxhQUFyQjs7QUFJQSxpQkFBSyxXQUFMO0FBQ0g7O0FBRUQ7Ozs7Ozs7b0NBSVksRyxFQUFLO0FBQ2IsZ0JBQUksR0FBSixFQUFTO0FBQ0wscUJBQUssU0FBTCxHQUFpQixnQkFBTSxRQUFOLENBQWUsR0FBZixFQUFvQixHQUFwQixDQUFqQjtBQUNILGFBRkQsTUFFTztBQUNILHFCQUFLLFNBQUwsR0FBaUIsZ0JBQU0sUUFBTixDQUFlLGdCQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsUUFBdEMsRUFBZ0QsR0FBaEQsQ0FBakI7QUFDSDtBQUNKOzs7aUNBRVEsZSxFQUFpQixZLEVBQWM7QUFDcEMsaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLE1BQXpDLEVBQWlELEdBQWpELEVBQXNEO0FBQ2xELHFCQUFLLFNBQUwsQ0FBZSxLQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLENBQXJCLEVBQXdCLFNBQXZDLEVBQWtELEtBQUssRUFBTCxHQUFRLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsQ0FBckIsRUFBd0IsSUFBbEYsRUFBd0YsS0FBSyxFQUFMLEdBQVEsRUFBUixHQUFhLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsQ0FBckIsRUFBd0IsTUFBN0gsRUFBcUksS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixDQUFyQixFQUF3QixRQUE3SjtBQUNIO0FBQ0QsaUJBQUssT0FBTDtBQUNIOztBQUVEOzs7Ozs7OztpQ0FLUyxlLEVBQWlCLFksRUFBYztBQUNwQyxpQkFBSyxjQUFMO0FBQ0EsaUJBQUssV0FBTDtBQUNIOztBQUVEOzs7Ozs7c0NBR2M7QUFDVixnQkFBSSxLQUFLLGFBQUwsQ0FBbUIsSUFBbkIsQ0FBd0IsU0FBNUIsRUFBdUM7QUFDbkMscUJBQUssSUFBTCxDQUFVLFFBQVYsQ0FBbUIsQ0FBbkIsR0FBdUIsS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLEtBQXhCLENBQThCLFNBQXJEO0FBQ0EscUJBQUssSUFBTCxDQUFVLFFBQVYsQ0FBbUIsU0FBbkIsR0FBK0IsS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLEtBQXhCLENBQThCLFNBQTdEO0FBQ0EscUJBQUssSUFBTCxDQUFVLFFBQVYsQ0FBbUIsS0FBbkIsQ0FBeUIsTUFBekIsQ0FDSSxLQUFLLGFBQUwsQ0FBbUIsSUFBbkIsQ0FBd0IsS0FBeEIsQ0FBOEIsQ0FBOUIsR0FBZ0MsR0FEcEMsRUFFSSxLQUFLLGFBQUwsQ0FBbUIsSUFBbkIsQ0FBd0IsS0FBeEIsQ0FBOEIsQ0FBOUIsR0FBZ0MsR0FGcEMsRUFHSSxLQUFLLGFBQUwsQ0FBbUIsSUFBbkIsQ0FBd0IsS0FBeEIsQ0FBOEIsQ0FBOUIsR0FBZ0MsR0FIcEM7QUFJSDtBQUNKOztBQUVEOzs7Ozs7eUNBR2lCO0FBQ2IsaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLFFBQUwsQ0FBYyxNQUFsQyxFQUEwQyxHQUExQyxFQUErQztBQUMzQyxvQkFBSSxTQUFTLEtBQUssUUFBTCxDQUFjLENBQWQsQ0FBYjs7QUFFQSxvQkFBSSxPQUFPLGFBQVgsRUFBMEI7QUFDdEIsMkJBQU8sSUFBUCxDQUFZLFFBQVosQ0FBcUIsS0FBckIsQ0FBMkIsTUFBM0IsQ0FDSSxPQUFPLFNBQVAsQ0FBaUIsQ0FBakIsR0FBbUIsR0FEdkIsRUFFSSxPQUFPLFNBQVAsQ0FBaUIsQ0FBakIsR0FBbUIsR0FGdkIsRUFHSSxPQUFPLFNBQVAsQ0FBaUIsQ0FBakIsR0FBbUIsR0FIdkI7QUFJSDs7QUFFRCxvQkFBSSxjQUFjLE9BQU8sS0FBUCxDQUFhLFFBQWIsQ0FBc0IsT0FBTyxZQUE3QixJQUE2QyxPQUFPLFNBQVAsR0FBbUIsT0FBTyxJQUF6Rjs7QUFFQSxvQkFBSSxLQUFLLEdBQUwsQ0FBUyxXQUFULElBQXdCLEtBQUssRUFBTCxHQUFVLEtBQUssRUFBTCxHQUFRLEVBQTlDLEVBQWtEO0FBQzlDLDJCQUFPLFNBQVAsSUFBb0IsQ0FBQyxDQUFyQjtBQUNBLGtDQUFjLEtBQUssR0FBTCxDQUFTLFdBQVQsSUFBc0IsV0FBdEIsSUFBcUMsS0FBSyxFQUFMLEdBQVUsS0FBSyxFQUFMLEdBQVEsRUFBdkQsQ0FBZDtBQUNBLHlCQUFLLFdBQUwsQ0FBaUIsTUFBakI7QUFDSDtBQUNELHVCQUFPLEtBQVAsQ0FBYSxRQUFiLENBQXNCLE9BQU8sWUFBN0IsSUFBNkMsV0FBN0M7QUFDSDtBQUNKOztBQUVEOzs7Ozs7O29DQUlZLE0sRUFBUTtBQUFBOztBQUNoQixtQ0FBYSxNQUFiLENBQW9CLHVCQUFhLFNBQWpDLEVBQTRDLE9BQU8sSUFBbkQsRUFBeUQsRUFBekQsRUFBNkQsSUFBRSxFQUEvRCxFQUFtRSxLQUFLLE9BQUwsQ0FBYSxRQUFoRjtBQUNEO0FBQ0MsbUJBQU8sYUFBUCxHQUF1QixJQUF2QjtBQUNBLGdCQUFJLGFBQWEsZ0JBQU0sUUFBTixDQUFlLGdCQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsS0FBdEMsRUFBNkMsR0FBN0MsQ0FBakI7QUFDQSxnQkFBSSxXQUFXLEtBQUssU0FBcEI7QUFDQSxtQkFBTyxTQUFQLENBQWlCLENBQWpCLEdBQXFCLFdBQVcsQ0FBaEM7QUFDQSxtQkFBTyxTQUFQLENBQWlCLENBQWpCLEdBQXFCLFdBQVcsQ0FBaEM7QUFDQSxtQkFBTyxTQUFQLENBQWlCLENBQWpCLEdBQXFCLFdBQVcsQ0FBaEM7QUFDQSxxQkFBUyxLQUFULENBQWUsR0FBZixDQUFtQixPQUFPLFNBQTFCLEVBQ0ssRUFETCxDQUNRLEVBQUUsR0FBRyxTQUFTLENBQWQsRUFBaUIsR0FBRyxTQUFTLENBQTdCLEVBQWdDLEdBQUcsU0FBUyxDQUE1QyxFQURSLEVBQ3lELEdBRHpELEVBRUssRUFGTCxDQUVRLEVBQUUsR0FBRyxXQUFXLENBQWhCLEVBQW1CLEdBQUcsV0FBVyxDQUFqQyxFQUFvQyxHQUFHLFdBQVcsQ0FBbEQsRUFGUixFQUUrRCxHQUYvRCxFQUdLLElBSEwsQ0FHVSxHQUhWLEVBR2U7QUFIZixhQUlLLElBSkwsQ0FJVyxVQUFVLEtBQVYsRUFBaUI7QUFBRSxzQkFBTSxhQUFOLEdBQXNCLEtBQXRCO0FBQThCLGFBSjVEOztBQU1BLGdCQUFJLGFBQWEsZ0JBQU0sUUFBTixDQUFlLGdCQUFNLFNBQU4sQ0FBZ0IsSUFBaEIsQ0FBcUIsS0FBcEMsRUFBMkMsR0FBM0MsQ0FBakI7QUFDQSxnQkFBSSxXQUFXLEtBQUssU0FBcEI7QUFDQSxpQkFBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLEtBQXhCLENBQThCLENBQTlCLEdBQWtDLFdBQVcsQ0FBN0M7QUFDQSxpQkFBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLEtBQXhCLENBQThCLENBQTlCLEdBQWtDLFdBQVcsQ0FBN0M7QUFDQSxpQkFBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLEtBQXhCLENBQThCLENBQTlCLEdBQWtDLFdBQVcsQ0FBN0M7QUFDQSxpQkFBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLEtBQXhCLENBQThCLFNBQTlCLEdBQTBDLENBQUMsR0FBM0M7QUFDQSxpQkFBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLEtBQXhCLENBQThCLFNBQTlCLEdBQTBDLENBQTFDO0FBQ0EsaUJBQUssYUFBTCxDQUFtQixJQUFuQixDQUF3QixTQUF4QixHQUFvQyxJQUFwQztBQUNBLGlCQUFLLGFBQUwsQ0FBbUIsSUFBbkIsQ0FBd0IsWUFBeEIsR0FBdUMsU0FBUyxLQUFULENBQWUsR0FBZixDQUFtQixLQUFLLGFBQUwsQ0FBbUIsSUFBbkIsQ0FBd0IsS0FBM0MsRUFDbEMsRUFEa0MsQ0FDL0I7QUFDQSxtQkFBRyxTQUFTLENBRFosRUFDZSxHQUFHLFNBQVMsQ0FEM0IsRUFDOEIsR0FBRyxTQUFTLENBRDFDO0FBRUEsMkJBQVcsSUFGWDtBQUdBLDJCQUFXLENBQUMsR0FBRCxHQUFPLE9BQU8sU0FBUCxHQUFtQixFQUhyQyxFQUQrQixFQUlZLEdBSlosRUFLbEMsRUFMa0MsQ0FLL0I7QUFDQSxtQkFBRyxXQUFXLENBRGQsRUFDaUIsR0FBRyxXQUFXLENBRC9CLEVBQ2tDLEdBQUcsV0FBVyxDQURoRDtBQUVBLDJCQUFXLENBRlg7QUFHQSwyQkFBVyxDQUFDLEdBSFosRUFMK0IsRUFRWixHQVJZLEVBU2xDLElBVGtDLENBUzdCLEdBVDZCLEVBU3hCO0FBVHdCLGFBVWxDLElBVmtDLENBVTVCLFlBQU07QUFBRSx1QkFBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLFNBQXhCLEdBQW9DLEtBQXBDO0FBQTRDLGFBVnhCLENBQXZDO0FBV0g7O0FBRUQ7Ozs7OztrQ0FHVTtBQUNOLGdCQUFJLFdBQVcsSUFBSSxNQUFNLGNBQVYsQ0FBMEIsRUFBMUIsRUFBOEIsRUFBOUIsQ0FBZjtBQUNBLHFCQUFTLEtBQVQsQ0FBZSxDQUFmLEVBQWlCLENBQWpCLEVBQW9CLElBQXBCO0FBQ0EsZ0JBQUksWUFBWSxJQUFJLE1BQU0sYUFBVixHQUEwQixJQUExQixDQUErQixnQkFBTSxTQUFOLENBQWdCLElBQWhCLENBQXFCLE9BQXBELENBQWhCO0FBQ0Esc0JBQVUsVUFBVixHQUF1QixDQUF2QjtBQUNBLHNCQUFVLE1BQVYsQ0FBaUIsR0FBakIsQ0FBcUIsQ0FBckIsRUFBd0IsQ0FBeEI7QUFDQSxzQkFBVSxLQUFWLEdBQWtCLFVBQVUsS0FBVixHQUFrQixNQUFNLG1CQUExQztBQUNBLHNCQUFVLE1BQVYsR0FBbUIsTUFBTSxTQUF6Qjs7QUFFQSxnQkFBSSxXQUFXLElBQUksTUFBTSxpQkFBVixDQUE2QjtBQUN4Qyx1QkFBTyxnQkFBTSxTQUFOLENBQWdCLElBQWhCLENBQXFCLEtBRFk7QUFFeEMsMEJBQVUsZ0JBQU0sU0FBTixDQUFnQixJQUFoQixDQUFxQixRQUZTO0FBR3hDLDBCQUFVLGdCQUFNLFNBQU4sQ0FBZ0IsSUFBaEIsQ0FBcUIsUUFIUztBQUl4Qyx5QkFBUyxTQUorQjtBQUt4QywyQkFBVztBQUw2QixhQUE3QixDQUFmOztBQVFBLGlCQUFLLElBQUwsR0FBWSxJQUFJLE1BQU0sSUFBVixDQUFnQixRQUFoQixFQUEwQixRQUExQixDQUFaO0FBQ0EsaUJBQUssSUFBTCxDQUFVLFFBQVYsQ0FBbUIsQ0FBbkIsR0FBdUIsQ0FBQyxHQUF4QjtBQUNBLGlCQUFLLEdBQUwsQ0FBUyxLQUFLLElBQWQsRUFBb0IsTUFBcEI7QUFDSDs7QUFFRDs7Ozs7Ozs7O2tDQU1VLE0sRUFBUSxJLEVBQU0sTSxFQUFRLEksRUFBTTtBQUNsQyxnQkFBSSxhQUFhLElBQUksTUFBTSxjQUFWLENBQXlCLENBQXpCLENBQWpCO0FBQ0EsZ0JBQUksY0FBYyxJQUFJLE1BQU0sUUFBVixFQUFsQjs7QUFFQSxnQkFBSSxjQUFjLElBQUksTUFBTSxpQkFBVixHQUE4QixJQUE5QixDQUFtQyxnQkFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLGNBQTFELENBQWxCO0FBQ0Esd0JBQVksT0FBWixHQUFzQixNQUFNLHFCQUE1Qjs7QUFFQSxnQkFBSSxnQkFBZ0IsSUFBSSxNQUFNLGlCQUFWLENBQTZCO0FBQzdDLHdCQUFRLFdBRHFDLEVBQTdCLENBQXBCOztBQUdBLGdCQUFJLGdCQUFnQixJQUFJLE1BQU0saUJBQVYsQ0FBNkI7QUFDN0MsdUJBQU8sZ0JBQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QixLQURlO0FBRTdDLDZCQUFhLElBRmdDO0FBRzdDLDJCQUFXLElBSGtDO0FBSTdDLHlCQUFTLEdBSm9DLEVBQTdCLENBQXBCOztBQU9BLGdCQUFJLFNBQVMsSUFBSSxNQUFNLElBQVYsQ0FBZ0IsVUFBaEIsRUFBNEIsYUFBNUIsQ0FBYjtBQUNBLG1CQUFPLElBQVAsR0FBYyxNQUFkO0FBQ0Esd0JBQVksR0FBWixDQUFnQixNQUFoQjtBQUNBLHdCQUFZLFFBQVosQ0FBcUIsQ0FBckIsR0FBeUIsQ0FBQyxHQUExQjs7QUFFQSxnQkFBSSxPQUFPLElBQUksTUFBTSxJQUFWLENBQWdCLFdBQVcsS0FBWCxFQUFoQixFQUFvQyxhQUFwQyxDQUFYO0FBQ0EsaUJBQUssSUFBTCxHQUFZLE1BQVo7QUFDQSxpQkFBSyxLQUFMLENBQVcsY0FBWCxDQUEwQixHQUExQjtBQUNBLHdCQUFZLEdBQVosQ0FBZ0IsSUFBaEI7O0FBRUEsZ0JBQUksWUFBSjtBQUNBLG9CQUFRLE1BQVI7QUFDSSxxQkFBSyxPQUFMO0FBQ0kseUJBQUssUUFBTCxDQUFjLENBQWQsR0FBa0IsQ0FBQyxHQUFuQjtBQUNBLGdDQUFZLFFBQVosQ0FBcUIsQ0FBckIsR0FBeUIsQ0FBQyxHQUExQjtBQUNBLDJCQUFPLFFBQVAsQ0FBZ0IsQ0FBaEIsR0FBb0IsQ0FBQyxHQUFyQjtBQUNBLG1DQUFlLEdBQWY7QUFDQTs7QUFFSixxQkFBSyxNQUFMO0FBQ0kseUJBQUssUUFBTCxDQUFjLENBQWQsR0FBa0IsR0FBbEI7QUFDQSxnQ0FBWSxRQUFaLENBQXFCLENBQXJCLEdBQXlCLEdBQXpCO0FBQ0EsMkJBQU8sUUFBUCxDQUFnQixDQUFoQixHQUFvQixHQUFwQjtBQUNBLG1DQUFlLEdBQWY7QUFDQTs7QUFFSixxQkFBSyxNQUFMO0FBQ0kseUJBQUssUUFBTCxDQUFjLENBQWQsR0FBa0IsR0FBbEI7QUFDQSxnQ0FBWSxRQUFaLENBQXFCLENBQXJCLEdBQXlCLEdBQXpCO0FBQ0EsMkJBQU8sUUFBUCxDQUFnQixDQUFoQixHQUFvQixHQUFwQjtBQUNBLG1DQUFlLEdBQWY7QUFDQTs7QUFFSixxQkFBSyxJQUFMO0FBQ0kseUJBQUssUUFBTCxDQUFjLENBQWQsR0FBa0IsQ0FBQyxHQUFuQjtBQUNBLGdDQUFZLFFBQVosQ0FBcUIsQ0FBckIsR0FBeUIsQ0FBQyxHQUExQjtBQUNBLDJCQUFPLFFBQVAsQ0FBZ0IsQ0FBaEIsR0FBb0IsQ0FBQyxHQUFyQjtBQUNBLG1DQUFlLEdBQWY7QUFDQTtBQTNCUjs7QUE4QkEsd0JBQVksUUFBWixDQUFxQixZQUFyQixLQUFzQyxNQUF0Qzs7QUFFQSxpQkFBSyxRQUFMLENBQWMsSUFBZCxDQUFvQjtBQUNoQiwrQkFBZSxLQURDO0FBRWhCLHNCQUFNLElBRlU7QUFHaEIsMkJBQVcsRUFISztBQUloQix3QkFBUSxNQUpRO0FBS2hCLHVCQUFPLFdBTFM7QUFNaEIsMkJBQVcsQ0FOSztBQU9oQixzQkFBTSxJQVBVO0FBUWhCLDhCQUFjLFlBUkU7QUFTaEIsc0JBQU0sSUFUVSxFQUFwQjs7QUFZQSxpQkFBSyxHQUFMLENBQVMsV0FBVCxFQUFzQixRQUF0QjtBQUNIOzs7Ozs7a0JBbFBnQixTOzs7Ozs7Ozs7OztBQ05yQjs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFcUIsSTs7Ozs7Ozs7Ozs7O0FBQ2pCOzs7OztpQ0FLUyxLLEVBQU8sTSxFQUFRO0FBQUE7O0FBQ3BCLGdCQUFJLFNBQVMsSUFBSSxNQUFNLFVBQVYsRUFBYjtBQUNBLG1CQUFPLElBQVAsQ0FBYSwwQ0FBYixFQUF5RCxVQUFFLFFBQUYsRUFBZ0I7QUFDckUsdUJBQUssSUFBTCxHQUFZLFFBQVo7QUFDSCxhQUZEO0FBR0g7O0FBRUQ7Ozs7Ozs7O2lDQUtTLGUsRUFBaUIsWSxFQUFjLENBQUU7O0FBRTFDOzs7Ozs7O2dDQUlRLEksRUFBTTtBQUNWLGlCQUFLLFVBQUwsQ0FBZ0IsSUFBaEI7QUFDSDs7QUFFRDs7Ozs7O21DQUdXLEksRUFBTTtBQUNiLGdCQUFJLEtBQUssSUFBVCxFQUFlO0FBQ1gscUJBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsS0FBSyxJQUF2QjtBQUNIOztBQUVELGdCQUFJLENBQUMsSUFBTCxFQUFXO0FBQ1A7QUFDSDs7QUFFRCxpQkFBSyxJQUFMLEdBQVksSUFBSSxNQUFNLElBQVYsQ0FBZSxLQUFLLGNBQUwsQ0FBb0IsSUFBcEIsQ0FBZixFQUEwQyxLQUFLLGNBQUwsRUFBMUMsRUFBaUUsS0FBSyxNQUF0RSxDQUFaO0FBQ0EsaUJBQUssSUFBTCxDQUFVLFFBQVYsQ0FBbUIsQ0FBbkIsR0FBdUIsQ0FBQyxFQUF4QjtBQUNBLGlCQUFLLElBQUwsQ0FBVSxRQUFWLENBQW1CLENBQW5CLEdBQXVCLElBQXZCO0FBQ0EsZ0JBQUksS0FBSyxNQUFMLEtBQWdCLENBQXBCLEVBQXVCO0FBQ25CLHFCQUFLLElBQUwsQ0FBVSxRQUFWLENBQW1CLENBQW5CLEdBQXVCLENBQUMsR0FBeEI7QUFDSCxhQUZELE1BRU8sSUFBSSxLQUFLLE1BQUwsS0FBZ0IsQ0FBcEIsRUFBdUI7QUFDMUIscUJBQUssSUFBTCxDQUFVLFFBQVYsQ0FBbUIsQ0FBbkIsR0FBdUIsQ0FBQyxHQUF4QjtBQUNILGFBRk0sTUFFQTtBQUNILHFCQUFLLElBQUwsQ0FBVSxRQUFWLENBQW1CLENBQW5CLEdBQXVCLENBQUMsR0FBeEI7QUFDSDtBQUNELGlCQUFLLElBQUwsQ0FBVSxJQUFWLEdBQWlCLGNBQWpCO0FBQ0EsaUJBQUssS0FBTCxDQUFXLEdBQVgsQ0FBZSxLQUFLLElBQXBCO0FBQ0g7O0FBRUQ7Ozs7Ozs7dUNBSWUsSSxFQUFNO0FBQ2pCLGdCQUFJLE9BQU8sR0FBWDtBQUNBLGdCQUFJLEtBQUssTUFBTCxLQUFnQixDQUFwQixFQUF1QjtBQUNuQix1QkFBTyxHQUFQO0FBQ0g7QUFDRCxtQkFBTyxJQUFJLE1BQU0sWUFBVixDQUF3QixJQUF4QixFQUE4QjtBQUNqQyxzQkFBTSxLQUFLLElBRHNCO0FBRWpDLHNCQUFNLElBRjJCO0FBR2pDLHdCQUFRLEVBSHlCO0FBSWpDLCtCQUFlLENBSmtCO0FBS2pDLGdDQUFnQixDQUxpQjtBQU1qQywyQkFBVyxHQU5zQjtBQU9qQyw4QkFBYyxLQVBtQjtBQVFqQywwQkFBVSxDQVJ1QjtBQVNqQyxpQ0FBaUI7QUFUZ0IsYUFBOUIsQ0FBUDtBQVdIOztBQUVEOzs7Ozs7eUNBR2lCO0FBQ2IsbUJBQU8sSUFBSSxNQUFNLGlCQUFWLENBQTRCO0FBQy9CLHVCQUFjLGdCQUFNLElBQU4sQ0FBVyxLQURNO0FBRS9CLDBCQUFjLGdCQUFNLElBQU4sQ0FBVyxRQUZNO0FBRy9CLDBCQUFjLGdCQUFNLElBQU4sQ0FBVyxRQUhNO0FBSS9CLHNCQUFjLE1BQU0sUUFKVztBQUsvQiwyQkFBYyxFQUxpQjtBQU0vQix5QkFBYyxNQUFNLFdBTlc7QUFPL0IsNkJBQWEsQ0FQa0I7QUFRL0IseUJBQWE7QUFSa0IsYUFBNUIsQ0FBUDtBQVVIOzs7Ozs7a0JBMUZnQixJOzs7Ozs7Ozs7OztBQ0hyQjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRXFCLGE7Ozs7Ozs7Ozs7OztBQUNqQjs7Ozs7aUNBS1MsSyxFQUFPLE0sRUFBUTtBQUNwQixpQkFBSyxnQkFBTCxHQUF3QjtBQUNwQiw0QkFBWSxJQURRO0FBRXBCLGtDQUFrQixJQUZFO0FBR3BCLGtDQUFrQixJQUhFO0FBSXBCLGtDQUFrQixJQUpFO0FBS3BCLGtDQUFrQixJQUxFO0FBTXBCLDBCQUFVO0FBTlUsYUFBeEI7O0FBU0EsaUJBQUssTUFBTDs7QUFFQTtBQUNBLGlCQUFLLEtBQUwsR0FBYSxFQUFiOztBQUVBLGdCQUFJLFFBQVEsS0FBSyxLQUFMLEdBQWEsS0FBSyxLQUE5Qjs7QUFFQSxpQkFBSyxNQUFMLEdBQWMsQ0FBZDtBQUNBLGlCQUFLLE1BQUwsR0FBYyxDQUFkO0FBQ0EsaUJBQUssTUFBTCxHQUFjLElBQWQ7QUFDQSxpQkFBSyxXQUFMLEdBQW1CLEtBQUssTUFBTCxHQUFjLENBQWpDOztBQUVBLGlCQUFLLFFBQUwsR0FBZ0IsS0FBaEI7QUFDQSxpQkFBSyxlQUFMLEdBQXVCLEVBQUUsS0FBSyxDQUFDLEtBQVIsRUFBZSxLQUFLLE1BQXBCLEVBQXZCO0FBQ0EsaUJBQUssbUJBQUwsQ0FBeUIsTUFBTSxRQUEvQjs7QUFFQTs7O0FBR0EsaUJBQUssU0FBTDtBQUNIOzs7NENBRW9CLEssRUFBUTtBQUN6QixpQkFBSyxNQUFMLEdBQWMsTUFBTSxPQUFOLEdBQWdCLEdBQTlCLENBRHlCLENBQ1M7QUFDbEMsaUJBQUssTUFBTCxHQUFjLE1BQU0sT0FBTixHQUFnQixHQUE5QixDQUZ5QixDQUVTO0FBQ3JDOzs7NkNBRXFCLEssRUFBUTtBQUMxQixnQkFBSyxNQUFNLE9BQU4sQ0FBYyxNQUFkLEtBQXlCLENBQTlCLEVBQWtDOztBQUU5QixzQkFBTSxjQUFOOztBQUVBLHFCQUFLLE1BQUwsR0FBYyxNQUFNLE9BQU4sQ0FBZSxDQUFmLEVBQW1CLEtBQW5CLEdBQTJCLEdBQXpDLENBSjhCLENBSWU7QUFDN0MscUJBQUssTUFBTCxHQUFjLE1BQU0sT0FBTixDQUFlLENBQWYsRUFBbUIsS0FBbkIsR0FBMkIsR0FBekMsQ0FMOEIsQ0FLZTtBQUVoRDtBQUNKOzs7NENBRW9CLEssRUFBUTs7QUFFekIsZ0JBQUssTUFBTSxPQUFOLENBQWMsTUFBZCxLQUF5QixDQUE5QixFQUFrQzs7QUFFOUIsc0JBQU0sY0FBTjs7QUFFQSxxQkFBSyxNQUFMLEdBQWMsTUFBTSxPQUFOLENBQWUsQ0FBZixFQUFtQixLQUFuQixHQUEyQixHQUF6QyxDQUo4QixDQUllO0FBQzdDLHFCQUFLLE1BQUwsR0FBYyxNQUFNLE9BQU4sQ0FBZSxDQUFmLEVBQW1CLEtBQW5CLEdBQTJCLEdBQXpDLENBTDhCLENBS2U7QUFFaEQ7QUFDSjs7QUFFRDs7Ozs7OztpQ0FJUyxHLEVBQUs7QUFDVixnQkFBSSxLQUFKO0FBQ0EsZ0JBQUksR0FBSixFQUFTO0FBQ0wsd0JBQVEsZ0JBQU0sUUFBTixDQUFlLEdBQWYsRUFBb0IsQ0FBcEIsQ0FBUjtBQUNBLHFCQUFLLFFBQUwsR0FBZ0IsSUFBaEI7QUFDSCxhQUhELE1BR087QUFDSCx3QkFBUSxnQkFBTSxRQUFOLENBQWUsZ0JBQU0saUJBQU4sQ0FBd0IsS0FBdkMsRUFBOEMsQ0FBOUMsQ0FBUjtBQUNBLHFCQUFLLFFBQUwsR0FBZ0IsS0FBaEI7QUFDSDs7QUFFRCxnQkFBSSxDQUFDLEtBQUssTUFBVixFQUFtQjtBQUNmLHFCQUFLLE1BQUwsR0FBYyxLQUFkO0FBQ0EscUJBQUssSUFBTCxDQUFVLFFBQVYsQ0FBbUIsUUFBbkIsQ0FBNEIsS0FBNUIsQ0FBa0MsS0FBbEMsR0FBMEMsQ0FBRSxLQUFLLE1BQUwsQ0FBWSxDQUFkLEVBQWlCLEtBQUssTUFBTCxDQUFZLENBQTdCLEVBQWdDLEtBQUssTUFBTCxDQUFZLENBQTVDLENBQTFDO0FBQ0gsYUFIRCxNQUdPO0FBQ0gscUJBQUssTUFBTCxDQUFZLFNBQVosR0FBd0IsSUFBeEI7QUFDQSx5QkFBUyxLQUFULENBQWUsR0FBZixDQUFtQixLQUFLLE1BQXhCLEVBQ0ssRUFETCxDQUNRLEtBRFIsRUFDZSxJQURmLEVBRUssSUFGTCxDQUVVLEdBRlYsRUFFZTtBQUZmLGlCQUdLLElBSEwsQ0FHVyxZQUFXO0FBQUUseUJBQUssU0FBTCxHQUFpQixLQUFqQjtBQUF5QixpQkFIakQ7QUFJSDtBQUNKOzs7aUNBRVEsSSxFQUFNOztBQUVYLGdCQUFJLEtBQUssUUFBTCxJQUFpQixLQUFLLGdCQUFMLENBQXNCLGdCQUF0QixDQUF1QyxLQUF2QyxDQUE2QyxLQUE3QyxHQUFxRCxLQUFLLGVBQUwsQ0FBcUIsR0FBL0YsRUFBb0c7QUFDaEcscUJBQUssZ0JBQUwsQ0FBc0IsZ0JBQXRCLENBQXVDLEtBQXZDLENBQTZDLEtBQTdDLElBQXNELEdBQXREO0FBQ0g7O0FBRUQsZ0JBQUksQ0FBQyxLQUFLLFFBQU4sSUFBa0IsS0FBSyxnQkFBTCxDQUFzQixnQkFBdEIsQ0FBdUMsS0FBdkMsQ0FBNkMsS0FBN0MsR0FBcUQsS0FBSyxlQUFMLENBQXFCLEdBQWhHLEVBQXFHO0FBQ2pHLHFCQUFLLGdCQUFMLENBQXNCLGdCQUF0QixDQUF1QyxLQUF2QyxDQUE2QyxLQUE3QyxJQUFzRCxHQUF0RDtBQUNIOztBQUVELGdCQUFJLFFBQVEsS0FBSyxLQUFMLEdBQWEsSUFBekI7QUFDQSxnQkFBSSxRQUFRLENBQVosRUFBZSxRQUFRLENBQVI7QUFDZixpQkFBSyxnQkFBTCxDQUFzQixnQkFBdEIsQ0FBdUMsSUFBdkMsQ0FBNEMsS0FBNUMsR0FBb0QsS0FBSyxHQUF6RDtBQUNBLGlCQUFLLGdCQUFMLENBQXNCLGdCQUF0QixDQUF1QyxLQUF2QyxDQUE2QyxLQUE3QyxHQUFxRCxLQUFyRDtBQUNBLGlCQUFLLGdCQUFMLENBQXNCLGdCQUF0QixDQUF1QyxJQUF2QyxDQUE0QyxLQUE1QyxHQUFvRCxLQUFLLEdBQXpEO0FBQ0EsaUJBQUssZ0JBQUwsQ0FBc0IsZ0JBQXRCLENBQXVDLEtBQXZDLENBQTZDLEtBQTdDLEdBQXFELEtBQXJEO0FBQ0EsaUJBQUssZ0JBQUwsQ0FBc0IsUUFBdEIsQ0FBK0IsSUFBL0IsQ0FBb0MsS0FBcEMsR0FBNEMsS0FBSyxHQUFqRDtBQUNBLGlCQUFLLGdCQUFMLENBQXNCLFFBQXRCLENBQStCLEtBQS9CLENBQXFDLEtBQXJDLEdBQTZDLEtBQTdDO0FBQ0E7O0FBRUE7QUFDQSxpQkFBSyxnQkFBTCxDQUFzQixVQUF0QixDQUFpQyxPQUFqQzs7QUFFQSxpQkFBSyxnQkFBTCxDQUFzQixRQUF0QixDQUErQixlQUEvQixDQUErQyxLQUEvQyxHQUF1RCxLQUFLLGdCQUFMLENBQXNCLFVBQXRCLENBQWlDLHNCQUFqQyxDQUF5RCxLQUFLLGdCQUFMLENBQXNCLGdCQUEvRSxFQUFrRyxPQUF6SjtBQUNBLGlCQUFLLGdCQUFMLENBQXNCLFFBQXRCLENBQStCLGVBQS9CLENBQStDLEtBQS9DLEdBQXVELEtBQUssZ0JBQUwsQ0FBc0IsVUFBdEIsQ0FBaUMsc0JBQWpDLENBQXlELEtBQUssZ0JBQUwsQ0FBc0IsZ0JBQS9FLEVBQWtHLE9BQXpKOztBQUVBLGdCQUFJLEtBQUssTUFBTCxDQUFZLFNBQWhCLEVBQTJCO0FBQ3ZCLHFCQUFLLElBQUwsQ0FBVSxRQUFWLENBQW1CLFFBQW5CLENBQTRCLEtBQTVCLENBQWtDLEtBQWxDLEdBQTBDLENBQUUsS0FBSyxNQUFMLENBQVksQ0FBZCxFQUFpQixLQUFLLE1BQUwsQ0FBWSxDQUE3QixFQUFnQyxLQUFLLE1BQUwsQ0FBWSxDQUE1QyxDQUExQztBQUNIO0FBQ0o7Ozs0Q0FFbUIsUSxFQUFVO0FBQzFCLGlCQUFLLGdCQUFMLENBQXNCLFVBQXRCLEdBQW1DLElBQUksc0JBQUosQ0FBNEIsS0FBSyxLQUFqQyxFQUF3QyxLQUFLLEtBQTdDLEVBQW9ELFFBQXBELENBQW5DO0FBQ0EsZ0JBQUksYUFBYSxLQUFLLGdCQUFMLENBQXNCLFVBQXRCLENBQWlDLGFBQWpDLEVBQWpCO0FBQ0EsZ0JBQUksYUFBYSxLQUFLLGdCQUFMLENBQXNCLFVBQXRCLENBQWlDLGFBQWpDLEVBQWpCO0FBQ0EsaUJBQUssbUJBQUwsQ0FBMEIsVUFBMUI7QUFDQSxpQkFBSyxtQkFBTCxDQUEwQixVQUExQjs7QUFFQSxpQkFBSyxnQkFBTCxDQUFzQixnQkFBdEIsR0FBeUMsS0FBSyxnQkFBTCxDQUFzQixVQUF0QixDQUFpQyxXQUFqQyxDQUE4QyxpQkFBOUMsRUFBaUUsa0JBQVEsYUFBUixDQUFzQixRQUF2RixFQUFpRyxVQUFqRyxDQUF6QztBQUNBLGlCQUFLLGdCQUFMLENBQXNCLGdCQUF0QixHQUF5QyxLQUFLLGdCQUFMLENBQXNCLFVBQXRCLENBQWlDLFdBQWpDLENBQThDLGlCQUE5QyxFQUFpRSxrQkFBUSxhQUFSLENBQXNCLFFBQXZGLEVBQWlHLFVBQWpHLENBQXpDOztBQUVBLGlCQUFLLGdCQUFMLENBQXNCLFVBQXRCLENBQWlDLHVCQUFqQyxDQUEwRCxLQUFLLGdCQUFMLENBQXNCLGdCQUFoRixFQUFrRyxDQUFFLEtBQUssZ0JBQUwsQ0FBc0IsZ0JBQXhCLEVBQTBDLEtBQUssZ0JBQUwsQ0FBc0IsZ0JBQWhFLENBQWxHO0FBQ0EsaUJBQUssZ0JBQUwsQ0FBc0IsVUFBdEIsQ0FBaUMsdUJBQWpDLENBQTBELEtBQUssZ0JBQUwsQ0FBc0IsZ0JBQWhGLEVBQWtHLENBQUUsS0FBSyxnQkFBTCxDQUFzQixnQkFBeEIsRUFBMEMsS0FBSyxnQkFBTCxDQUFzQixnQkFBaEUsQ0FBbEc7O0FBRUEsaUJBQUssZ0JBQUwsQ0FBc0IsZ0JBQXRCLEdBQXlDLEtBQUssZ0JBQUwsQ0FBc0IsZ0JBQXRCLENBQXVDLFFBQXZDLENBQWdELFFBQXpGO0FBQ0EsaUJBQUssZ0JBQUwsQ0FBc0IsZ0JBQXRCLEdBQXlDLEtBQUssZ0JBQUwsQ0FBc0IsZ0JBQXRCLENBQXVDLFFBQXZDLENBQWdELFFBQXpGOztBQUVBLGlCQUFLLGdCQUFMLENBQXNCLGdCQUF0QixDQUF1QyxJQUF2QyxHQUE4QyxFQUFFLE9BQU8sR0FBVCxFQUE5QztBQUNBLGlCQUFLLGdCQUFMLENBQXNCLGdCQUF0QixDQUF1QyxLQUF2QyxHQUErQyxFQUFFLE9BQU8sR0FBVCxFQUEvQztBQUNBLGlCQUFLLGdCQUFMLENBQXNCLGdCQUF0QixDQUF1QyxLQUF2QyxHQUErQyxFQUFFLE9BQU8sQ0FBQyxLQUFWLEVBQS9DO0FBQ0EsaUJBQUssZ0JBQUwsQ0FBc0IsZ0JBQXRCLENBQXVDLElBQXZDLEdBQThDLEVBQUUsT0FBTyxHQUFULEVBQTlDO0FBQ0EsaUJBQUssZ0JBQUwsQ0FBc0IsZ0JBQXRCLENBQXVDLEtBQXZDLEdBQStDLEVBQUUsT0FBTyxHQUFULEVBQS9DO0FBQ0EsaUJBQUssZ0JBQUwsQ0FBc0IsZ0JBQXRCLENBQXVDLE9BQXZDLEdBQWlELEVBQUUsT0FBTyxHQUFULEVBQWpEO0FBQ0EsaUJBQUssZ0JBQUwsQ0FBc0IsZ0JBQXRCLENBQXVDLGtCQUF2QyxHQUE0RCxFQUFFLE9BQU8sR0FBVCxFQUE1RDtBQUNBLGlCQUFLLGdCQUFMLENBQXNCLGdCQUF0QixDQUF1QyxpQkFBdkMsR0FBMkQsRUFBRSxPQUFPLEdBQVQsRUFBM0Q7QUFDQSxpQkFBSyxnQkFBTCxDQUFzQixnQkFBdEIsQ0FBdUMsZ0JBQXZDLEdBQTBELEVBQUUsT0FBTyxHQUFULEVBQTFEO0FBQ0EsaUJBQUssZ0JBQUwsQ0FBc0IsZ0JBQXRCLENBQXVDLGFBQXZDLEdBQXVELEVBQUUsT0FBTyxHQUFULEVBQXZEO0FBQ0EsaUJBQUssZ0JBQUwsQ0FBc0IsZ0JBQXRCLENBQXVDLFFBQXZDLEdBQWtELEVBQUUsT0FBTyxJQUFJLE1BQU0sT0FBVixFQUFULEVBQWxEO0FBQ0EsaUJBQUssZ0JBQUwsQ0FBc0IsZ0JBQXRCLENBQXVDLFFBQXZDLENBQWdELE9BQWhELENBQXdELE1BQXhELEdBQWlFLEtBQUssTUFBTCxDQUFZLE9BQVosQ0FBcUIsQ0FBckIsQ0FBakU7O0FBRUEsaUJBQUssZ0JBQUwsQ0FBc0IsZ0JBQXRCLENBQXVDLEtBQXZDLEdBQStDLE1BQU0sY0FBckQ7QUFDQSxpQkFBSyxnQkFBTCxDQUFzQixnQkFBdEIsQ0FBdUMsS0FBdkMsR0FBK0MsTUFBTSxjQUFyRDtBQUNBLGlCQUFLLGdCQUFMLENBQXNCLGdCQUF0QixDQUF1QyxLQUF2QyxHQUErQyxNQUFNLGNBQXJEO0FBQ0EsaUJBQUssZ0JBQUwsQ0FBc0IsZ0JBQXRCLENBQXVDLEtBQXZDLEdBQStDLE1BQU0sY0FBckQ7O0FBRUEsZ0JBQUksUUFBUSxLQUFLLGdCQUFMLENBQXNCLFVBQXRCLENBQWlDLElBQWpDLEVBQVo7QUFDQSxnQkFBSyxVQUFVLElBQWYsRUFBc0I7QUFDbEIsd0JBQVEsS0FBUixDQUFlLEtBQWY7QUFDSDtBQUNKOzs7b0NBRVc7QUFDUixnQkFBSSxXQUFXLElBQUksTUFBTSxxQkFBVixDQUFnQyxLQUFLLEtBQXJDLENBQWY7QUFDQSxxQkFBUyxLQUFULENBQWUsR0FBZixFQUFvQixHQUFwQixFQUF5QixHQUF6Qjs7QUFFQTtBQUNBLGlCQUFLLGdCQUFMLENBQXNCLFFBQXRCLEdBQWlDO0FBQzdCLHVCQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUQsRUFBSyxHQUFMLEVBQVMsR0FBVCxDQUFULEVBRHNCO0FBRTdCLGlDQUFpQixFQUFFLE9BQU8sSUFBVCxFQUZZO0FBRzdCLGlDQUFpQixFQUFFLE9BQU8sSUFBVCxFQUhZO0FBSTdCLHNCQUFNLEVBQUUsT0FBTyxHQUFULEVBSnVCO0FBSzdCLHVCQUFPLEVBQUUsT0FBTyxHQUFUO0FBTHNCLGFBQWpDOztBQVFBO0FBQ0EsZ0JBQUksV0FBVyxJQUFJLE1BQU0sY0FBVixDQUEwQjtBQUNyQywwQkFBZ0IsS0FBSyxnQkFBTCxDQUFzQixRQUREO0FBRXJDLDhCQUFnQixrQkFBUSxLQUFSLENBQWMsTUFGTztBQUdyQyxnQ0FBZ0Isa0JBQVEsS0FBUixDQUFjO0FBSE8sYUFBMUIsQ0FBZjs7QUFRQSxpQkFBSyxJQUFMLEdBQVksSUFBSSxNQUFNLElBQVYsQ0FBZ0IsUUFBaEIsRUFBMEIsUUFBMUIsQ0FBWjtBQUNBLGlCQUFLLElBQUwsQ0FBVSxRQUFWLENBQW1CLENBQW5CLEdBQXVCLEtBQUssRUFBTCxHQUFVLENBQWpDO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQSxpQkFBSyxJQUFMLENBQVUsZ0JBQVYsR0FBNkIsSUFBN0I7QUFDQSxpQkFBSyxJQUFMLENBQVUsWUFBVjs7QUFFQSxpQkFBSyxHQUFMLENBQVMsS0FBSyxJQUFkO0FBQ0EsaUJBQUssUUFBTDtBQUVIOzs7NENBRW9CLE8sRUFBVTtBQUMzQixnQkFBSSxXQUFXLFFBQVEsS0FBUixDQUFjLElBQTdCOztBQUVBLGlCQUFNLElBQUksSUFBSSxDQUFSLEVBQVcsS0FBSyxTQUFTLE1BQS9CLEVBQXVDLElBQUksRUFBM0MsRUFBK0MsS0FBSyxDQUFwRCxFQUF3RDs7QUFFcEQsb0JBQUksSUFBSSxDQUFDLEtBQUssTUFBTCxLQUFnQixLQUFLLE1BQXJCLEdBQThCLEtBQUssV0FBcEMsSUFBaUQsQ0FBekQ7QUFDQSxvQkFBSSxJQUFJLENBQUMsS0FBSyxNQUFMLEtBQWdCLEtBQUssTUFBckIsR0FBOEIsS0FBSyxXQUFwQyxJQUFpRCxDQUF6RDtBQUNBLG9CQUFJLElBQUksQ0FBQyxLQUFLLE1BQUwsS0FBZ0IsS0FBSyxNQUFyQixHQUE4QixLQUFLLFdBQXBDLElBQWlELENBQXpEOztBQUVBLHlCQUFVLElBQUksQ0FBZCxJQUFvQixDQUFwQjtBQUNBLHlCQUFVLElBQUksQ0FBZCxJQUFvQixDQUFwQjtBQUNBLHlCQUFVLElBQUksQ0FBZCxJQUFvQixDQUFwQjtBQUNBLHlCQUFVLElBQUksQ0FBZCxJQUFvQixDQUFwQjtBQUNIO0FBQ0o7Ozs0Q0FFb0IsTyxFQUFVO0FBQzNCLGdCQUFJLFdBQVcsUUFBUSxLQUFSLENBQWMsSUFBN0I7O0FBRUEsaUJBQU0sSUFBSSxJQUFJLENBQVIsRUFBVyxLQUFLLFNBQVMsTUFBL0IsRUFBdUMsSUFBSSxFQUEzQyxFQUErQyxLQUFLLENBQXBELEVBQXdEO0FBQ3BELG9CQUFJLElBQUksS0FBSyxNQUFMLEtBQWdCLEdBQXhCO0FBQ0Esb0JBQUksSUFBSSxLQUFLLE1BQUwsS0FBZ0IsR0FBeEI7QUFDQSxvQkFBSSxJQUFJLEtBQUssTUFBTCxLQUFnQixHQUF4Qjs7QUFFQSx5QkFBVSxJQUFJLENBQWQsSUFBb0IsSUFBSSxFQUF4QjtBQUNBLHlCQUFVLElBQUksQ0FBZCxJQUFvQixJQUFJLEVBQXhCO0FBQ0EseUJBQVUsSUFBSSxDQUFkLElBQW9CLElBQUksRUFBeEI7QUFDQSx5QkFBVSxJQUFJLENBQWQsSUFBb0IsQ0FBcEI7QUFDSDtBQUNKOzs7Ozs7a0JBck9nQixhOzs7Ozs7Ozs7OztBQ0xyQjs7Ozs7Ozs7O0FBR0ksb0JBQVksTUFBWixFQUFvQixFQUFwQixFQUF3QjtBQUFBOztBQUFBOztBQUNwQjs7O0FBR0EsYUFBSyxTQUFMLEdBQWlCLEVBQWpCOztBQUVBOzs7QUFHQSxhQUFLLE9BQUwsR0FBZSxNQUFmOztBQUVBOzs7OztBQUtBLGFBQUssS0FBTCxHQUFhLEVBQWI7O0FBRUE7Ozs7O0FBS0EsYUFBSyxjQUFMLEdBQXNCLENBQ2xCLEdBRGtCLEVBQ2IsR0FEYSxFQUNSLEdBRFEsRUFDSCxHQURHLEVBQ0UsR0FERixFQUNPLEdBRFAsRUFDWSxHQURaLEVBQ2lCLEdBRGpCLEVBQ3NCLEdBRHRCLEVBQzJCLEdBRDNCLEVBQ2dDLEdBRGhDLEVBQ3FDLEdBRHJDLEVBQzBDLEdBRDFDLEVBRWxCLEdBRmtCLEVBRWIsR0FGYSxFQUVSLEdBRlEsRUFFSCxHQUZHLEVBRUUsR0FGRixFQUVPLEdBRlAsRUFFWSxHQUZaLEVBRWlCLEdBRmpCLEVBRXNCLEdBRnRCLEVBRTJCLEdBRjNCLEVBRWdDLEdBRmhDLEVBRXFDLEdBRnJDLEVBRTBDLElBRjFDLEVBR2xCLEdBSGtCLEVBR2IsR0FIYSxFQUdSLEdBSFEsRUFHSCxHQUhHLEVBR0UsR0FIRixFQUdPLEdBSFAsRUFHWSxHQUhaLEVBR2lCLEdBSGpCLEVBR3NCLEdBSHRCLEVBRzJCLEdBSDNCLEVBR2dDLElBSGhDLENBQXRCOztBQU1BLGlCQUFTLGdCQUFULENBQTBCLFNBQTFCLEVBQXFDO0FBQUEsbUJBQVMsTUFBSyxTQUFMLENBQWUsS0FBZixDQUFUO0FBQUEsU0FBckM7QUFDQSxpQkFBUyxnQkFBVCxDQUEwQixPQUExQixFQUFtQztBQUFBLG1CQUFTLE1BQUssT0FBTCxDQUFhLEtBQWIsQ0FBVDtBQUFBLFNBQW5DO0FBQ0g7O0FBRUQ7Ozs7Ozs7O3NDQUljO0FBQ1YsZ0JBQUksT0FBTyxFQUFYO0FBQ0EsaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLEtBQUwsQ0FBVyxNQUEvQixFQUF1QyxHQUF2QyxFQUE0QztBQUN4QyxvQkFBSSxLQUFLLEtBQUwsQ0FBVyxDQUFYLElBQWdCLENBQXBCLEVBQXVCO0FBQ25CLHdCQUFJLFNBQVMsQ0FBYjtBQUNBLHdCQUFJLEtBQUssS0FBSyxLQUFMLENBQVcsTUFBWCxHQUFrQixDQUEzQixFQUE4QjtBQUFFLGlDQUFTLENBQVQ7QUFBYTtBQUM3Qyx5QkFBSyxJQUFMLENBQVcsRUFBRSxVQUFVLGVBQUssZUFBTCxDQUFxQixDQUFyQixDQUFaLEVBQXFDLFFBQVEsU0FBUyxDQUF0RCxFQUF5RCxPQUFPLENBQWhFLEVBQW1FLFVBQVUsS0FBSyxLQUFMLENBQVcsQ0FBWCxDQUE3RSxFQUFYO0FBQ0g7QUFDSjtBQUNELG1CQUFPLElBQVA7QUFDSDs7QUFFRDs7Ozs7OztrQ0FJVSxLLEVBQU87QUFDYixnQkFBSSxNQUFNLEtBQUssY0FBTCxDQUFvQixPQUFwQixDQUE0QixNQUFNLEdBQU4sQ0FBVSxXQUFWLEVBQTVCLENBQVY7QUFDQSxnQkFBSSxRQUFRLENBQUMsQ0FBVCxLQUFlLEtBQUssS0FBTCxDQUFXLEdBQVgsTUFBb0IsQ0FBcEIsSUFBeUIsQ0FBQyxLQUFLLEtBQUwsQ0FBVyxHQUFYLENBQXpDLENBQUosRUFBK0Q7QUFDM0QscUJBQUssS0FBTCxDQUFXLEdBQVgsSUFBa0IsR0FBbEIsQ0FEMkQsQ0FDcEM7QUFDdkIsb0JBQUksU0FBUyxLQUFLLEtBQUwsQ0FBVyxNQUFNLGVBQUssY0FBTCxDQUFvQixNQUFyQyxDQUFiO0FBQ0EscUJBQUssU0FBTCxDQUFlO0FBQ1gsOEJBQVUsZUFBSyxlQUFMLENBQXFCLEdBQXJCLENBREM7QUFFWCw0QkFBUSxTQUFTLEtBQUssT0FBTCxDQUFhLFdBRm5CO0FBR1g7QUFDQSw4QkFBVSxHQUpDO0FBS1gsNEJBQVEsT0FMRyxFQUFmO0FBTUg7QUFDSjs7QUFFRDs7Ozs7OztnQ0FJUSxLLEVBQU87QUFDWCxnQkFBSSxNQUFNLEtBQUssY0FBTCxDQUFvQixPQUFwQixDQUE0QixNQUFNLEdBQU4sQ0FBVSxXQUFWLEVBQTVCLENBQVY7QUFDQSxnQkFBSSxRQUFRLENBQUMsQ0FBYixFQUFnQjtBQUNaLHFCQUFLLEtBQUwsQ0FBVyxHQUFYLElBQWtCLEdBQWxCLENBRFksQ0FDVztBQUN2QixvQkFBSSxTQUFTLEtBQUssS0FBTCxDQUFXLE1BQU0sZUFBSyxjQUFMLENBQW9CLE1BQXJDLENBQWI7QUFDQSxxQkFBSyxTQUFMLENBQWU7QUFDWCw4QkFBVSxlQUFLLGVBQUwsQ0FBcUIsR0FBckIsQ0FEQztBQUVYLDRCQUFRLFNBQVMsS0FBSyxPQUFMLENBQWEsV0FGbkI7QUFHWDtBQUNBLDhCQUFVLENBSkM7QUFLWCw0QkFBUSxTQUxHLEVBQWY7QUFNSDtBQUNKOzs7Ozs7Ozs7Ozs7OztrQkN0RlU7QUFDYixlQUFhO0FBQ1gsZ0JBQVksa1pBREQ7QUFFWCxjQUFVO0FBRkMsR0FEQTtBQUtiLFdBQVM7QUFDUCxnQkFBWSw4RUFETDtBQUVQLGNBQVU7QUFGSCxHQUxJO0FBU2IsbUJBQWlCO0FBQ2YsZ0JBQVk7QUFERyxHQVRKO0FBWWIsbUJBQWlCO0FBQ2YsZ0JBQVk7QUFERyxHQVpKO0FBZWIsVUFBUTtBQUNOLGdCQUFZLDZJQUROO0FBRU4sY0FBVTtBQUZKO0FBZkssQzs7Ozs7Ozs7a0JDQUE7QUFDWCxhQUFTO0FBQ0wsYUFBSyxRQURBO0FBRUwsaUJBQVMsUUFGSjtBQUdMOztBQUVBLGVBQU8sUUFMRjtBQU1MLGtCQUFVLFFBTkw7QUFPTCxrQkFBVSxRQVBMO0FBUUwsZUFBTyxRQVJGO0FBU0wsZ0JBQVE7QUFUSCxLQURFOztBQWFYLFVBQU07QUFDRixjQUFNLFFBREo7QUFFRixlQUFPLFFBRkw7QUFHRixnQkFBUSxRQUhOO0FBSUYsZ0JBQVEsUUFKTjtBQUtGLGdCQUFRO0FBTE4sS0FiSzs7QUFxQlgsZUFBVyxDQUNQLFFBRE8sRUFFUCxRQUZPLEVBR1AsUUFITyxFQUlQLFFBSk8sRUFLUCxRQUxPLEVBTVAsUUFOTztBQXJCQSxDOzs7Ozs7Ozs7QUNBZjs7Ozs7O2tCQUNlO0FBQ1gsOEJBQTBCLENBQ3RCLFFBRHNCLEVBQ1osUUFEWSxFQUNGLFFBREUsRUFDUSxRQURSLEVBRXRCLFFBRnNCLEVBRVosUUFGWSxFQUVGLFFBRkUsRUFFUSxRQUZSLEVBR3RCLFFBSHNCLEVBR1osUUFIWSxFQUdGLFFBSEUsRUFHUSxRQUhSLENBRGY7O0FBTVgsNkJBQXlCLENBQ3JCLFFBRHFCLEVBQ1gsUUFEVyxFQUNELFFBREMsRUFDUyxRQURULEVBRXJCLFFBRnFCLEVBRVgsUUFGVyxFQUVELFFBRkMsRUFFUyxRQUZULEVBR3JCLFFBSHFCLEVBR1gsUUFIVyxFQUdELFFBSEMsRUFHUyxRQUhULENBTmQ7O0FBWVgsVUFBTTtBQUNGLGdCQUFRO0FBQ0osbUJBQU87QUFDSCwwQkFBVSxpQkFBTyxTQUFQLENBQWlCLENBQWpCLENBRFA7QUFFSCx1QkFBTyxpQkFBTyxPQUFQLENBQWU7QUFGbkIsYUFESDtBQUtKLG1CQUFPO0FBQ0gsMEJBQVUsaUJBQU8sU0FBUCxDQUFpQixDQUFqQixDQURQO0FBRUgsdUJBQU8saUJBQU8sT0FBUCxDQUFlO0FBRm5CO0FBTEgsU0FETjtBQVdGLG1CQUFXO0FBQ1AsbUJBQU87QUFDSCwwQkFBVSxpQkFBTyxTQUFQLENBQWlCLENBQWpCLENBRFA7QUFFSCx1QkFBTyxpQkFBTyxJQUFQLENBQVk7QUFGaEIsYUFEQTtBQUtQLG1CQUFPO0FBQ0gsMEJBQVUsaUJBQU8sU0FBUCxDQUFpQixDQUFqQixDQURQO0FBRUgsdUJBQU8saUJBQU8sSUFBUCxDQUFZO0FBRmhCO0FBTEEsU0FYVDtBQXFCRiwyQkFBbUI7QUFDZixtQkFBTztBQUNILDBCQUFVLGlCQUFPLFNBQVAsQ0FBaUIsQ0FBakIsQ0FEUDtBQUVILHVCQUFPLGlCQUFPLElBQVAsQ0FBWTtBQUZoQixhQURRO0FBS2YsbUJBQU87QUFDSCwwQkFBVSxpQkFBTyxTQUFQLENBQWlCLENBQWpCLENBRFA7QUFFSCx1QkFBTyxpQkFBTyxJQUFQLENBQVk7QUFGaEI7QUFMUTs7QUFyQmpCLEtBWks7O0FBK0NYLGVBQVc7QUFDUCxjQUFNO0FBQ0YscUJBQVMsK0JBRFA7QUFFRixtQkFBTyxpQkFBTyxPQUFQLENBQWUsT0FGcEI7QUFHRixzQkFBVSxpQkFBTyxTQUFQLENBQWlCLENBQWpCLENBSFI7QUFJRixzQkFBVSxpQkFBTyxPQUFQLENBQWU7QUFKdkIsU0FEQzs7QUFRUCxnQkFBUTtBQUNKLDRCQUFnQixDQUNaLHdCQURZLEVBRVosd0JBRlksRUFHWix3QkFIWSxFQUlaLHdCQUpZLEVBS1osd0JBTFksRUFNWix3QkFOWSxDQURaO0FBUUosbUJBQU8saUJBQU8sT0FBUCxDQUFlLEdBUmxCO0FBU0osc0JBQVUsaUJBQU8sU0FBUCxDQUFpQixDQUFqQjtBQVROO0FBUkQsS0EvQ0E7O0FBb0VYLFVBQU07QUFDRixlQUFPLGlCQUFPLE9BQVAsQ0FBZSxPQURwQjtBQUVGLGtCQUFVLGlCQUFPLE9BQVAsQ0FBZSxPQUZ2QjtBQUdGLHVCQUFlLGlCQUFPLFNBQVAsQ0FBaUIsQ0FBakIsQ0FIYjtBQUlGLGtCQUFVLGlCQUFPLE9BQVAsQ0FBZTtBQUp2QixLQXBFSzs7QUEyRVgsdUJBQW1CO0FBQ2YsZ0JBQVEsOEJBRE87QUFFZixlQUFPLGlCQUFPLFNBQVAsQ0FBaUIsQ0FBakI7QUFGUSxLQTNFUjs7QUFnRlgsY0FBVTtBQUNOLG9CQUFZO0FBQ1IsaUJBQUssaUJBQU8sT0FBUCxDQUFlLE9BRFo7QUFFUixvQkFBUSxpQkFBTyxPQUFQLENBQWU7QUFGZixTQUROO0FBS04sbUJBQVcsaUJBQU8sU0FBUCxDQUFpQixDQUFqQjtBQUxMO0FBaEZDLEM7Ozs7Ozs7OztBQ0RmOzs7Ozs7a0JBRWU7QUFDWCxlQUFXLFlBREE7QUFFWCxXQUFXLHNCQUZBOztBQUlYLGlCQUFhLE9BSkY7O0FBTVg7OztBQUdBLHdCQUFvQixFQVRUOztBQVdYOzs7O0FBSUEsUUFmVyxnQkFlTixHQWZNLEVBZUQ7QUFBQTs7QUFDTixhQUFLLFdBQUwsR0FBbUIsU0FBbkI7QUFDQSxhQUFLLE1BQUwsQ0FBWSxRQUFaLEdBQXVCLENBQXZCLENBRk0sQ0FFb0I7QUFDMUIsYUFBSyxNQUFMLENBQVksUUFBWixDQUFxQixHQUFyQixFQUNJO0FBQUEsbUJBQU0sTUFBSyxRQUFMLEVBQU47QUFBQSxTQURKLEVBRUk7QUFBQSxtQkFBTSxNQUFLLFVBQUwsRUFBTjtBQUFBLFNBRkosRUFHSSxVQUFDLEdBQUQ7QUFBQSxtQkFBUyxNQUFLLE9BQUwsQ0FBYSxHQUFiLENBQVQ7QUFBQSxTQUhKO0FBSUgsS0F0QlU7OztBQXdCWDs7O0FBR0EsU0EzQlcsbUJBMkJIO0FBQ0osYUFBSyxXQUFMLEdBQW1CLFFBQW5CO0FBQ0EsYUFBSyxNQUFMLENBQVksS0FBWjtBQUNILEtBOUJVOzs7QUFnQ1g7OztBQUdBLFVBbkNXLG9CQW1DRjtBQUNMLGFBQUssV0FBTCxHQUFtQixTQUFuQjtBQUNBLGFBQUssTUFBTCxDQUFZLE1BQVo7QUFDSCxLQXRDVTs7O0FBd0NYOzs7OztBQUtBLHNCQTdDVyw4QkE2Q1EsVUE3Q1IsRUE2Q29CO0FBQzNCLFlBQUksS0FBSyxrQkFBTCxDQUF3QixPQUF4QixDQUFnQyxVQUFoQyxNQUFnRCxDQUFDLENBQXJELEVBQXdEO0FBQ3BELG1CQUFPLElBQVA7QUFDSCxTQUZELE1BRU87QUFDSCxtQkFBTyxLQUFQO0FBQ0g7QUFDSixLQW5EVTs7O0FBcURYOzs7O0FBSUEsa0JBekRXLDBCQXlESSxVQXpESixFQXlEZ0IsSUF6RGhCLEVBeURzQjtBQUFBOztBQUM3QixhQUFLLFVBQUwsQ0FBZ0I7QUFDWiwwQkFBYyxJQURGO0FBRVosd0JBQVksVUFGQTtBQUdaLHdCQUFZLG9CQUFDLEtBQUQsRUFBUSxRQUFSLEVBQWtCLFVBQWxCO0FBQUEsdUJBQWlDLE9BQUssd0JBQUwsQ0FBOEIsS0FBOUIsRUFBcUMsUUFBckMsRUFBK0MsVUFBL0MsQ0FBakM7QUFBQSxhQUhBO0FBSVosdUJBQVcsbUJBQUMsS0FBRDtBQUFBLHVCQUFXLE9BQUssa0JBQUwsQ0FBd0IsS0FBeEIsQ0FBWDtBQUFBLGFBSkM7QUFLWixxQkFBUyxpQkFBQyxHQUFEO0FBQUEsdUJBQVMsT0FBSyx1QkFBTCxDQUE2QixHQUE3QixDQUFUO0FBQUE7QUFMRyxTQUFoQjtBQU9ILEtBakVVOzs7QUFtRVg7Ozs7OztBQU1BLFlBekVXLG9CQXlFRixVQXpFRSxFQXlFVSxRQXpFVixFQXlFb0IsV0F6RXBCLEVBeUVpQyxRQXpFakMsRUF5RTJDO0FBQ2xELFlBQUksQ0FBQyxLQUFLLGtCQUFMLENBQXdCLFVBQXhCLENBQUwsRUFBMEM7QUFBRTtBQUFTOztBQUVyRCxhQUFLLGFBQUwsQ0FBbUIsQ0FBbkIsRUFBc0IsS0FBSyxFQUFMLENBQVEsTUFBUixDQUFlLFVBQWYsRUFBMkIsTUFBakQ7QUFDQSxZQUFJLFFBQVEsQ0FBWixDQUprRCxDQUluQztBQUNmLFlBQUksT0FBTyxlQUFLLGNBQUwsQ0FBb0IsUUFBcEIsQ0FBWCxDQUxrRCxDQUtSO0FBQzFDLFlBQUksV0FBVyxHQUFmLENBTmtELENBTTlCO0FBQ3BCO0FBQ0EsYUFBSyxTQUFMLENBQWUsQ0FBZixFQUFrQixHQUFsQjtBQUNBLGFBQUssTUFBTCxDQUFZLENBQVosRUFBZSxJQUFmLEVBQXFCLFFBQXJCLEVBQStCLEtBQS9COztBQUVBLFlBQUksUUFBSixFQUFjO0FBQ1YsaUJBQUssT0FBTCxDQUFhLENBQWIsRUFBZ0IsSUFBaEIsRUFBc0IsUUFBUSxRQUE5QjtBQUNIO0FBQ0osS0F2RlU7OztBQXlGWDs7Ozs7O0FBTUEsVUEvRlcsa0JBK0ZKLFVBL0ZJLEVBK0ZRLFFBL0ZSLEVBK0ZrQixXQS9GbEIsRUErRitCLFFBL0YvQixFQStGeUMsUUEvRnpDLEVBK0ZtRDtBQUMxRCxZQUFJLENBQUMsS0FBSyxrQkFBTCxDQUF3QixVQUF4QixDQUFMLEVBQTBDO0FBQUU7QUFBUztBQUNyRCxZQUFJLE9BQU8sZUFBSyxjQUFMLENBQW9CLFFBQXBCLENBQVg7QUFDQSxhQUFLLGFBQUwsQ0FBbUIsV0FBbkIsRUFBZ0MsS0FBSyxFQUFMLENBQVEsTUFBUixDQUFlLFVBQWYsRUFBMkIsTUFBM0Q7QUFDQSxZQUFJLENBQUMsUUFBTCxFQUFlO0FBQUUsdUJBQVcsR0FBWDtBQUFpQjtBQUNsQyxhQUFLLFNBQUwsQ0FBZSxDQUFmLEVBQWtCLFFBQWxCO0FBQ0EsYUFBSyxNQUFMLENBQVksV0FBWixFQUF5QixJQUF6QixFQUErQixRQUEvQixFQUF5QyxDQUF6Qzs7QUFFQSxZQUFJLFFBQUosRUFBYztBQUNWLGlCQUFLLE9BQUwsQ0FBYSxXQUFiLEVBQTBCLElBQTFCLEVBQWdDLFFBQWhDO0FBQ0g7QUFDSixLQTFHVTs7O0FBNEdYOzs7Ozs7QUFNQSxXQWxIVyxtQkFrSEgsUUFsSEcsRUFrSE8sV0FsSFAsRUFrSG9CLEtBbEhwQixFQWtIMkI7QUFDbEMsWUFBSSxDQUFDLEtBQUwsRUFBWTtBQUFFLG9CQUFRLENBQVI7QUFBWTtBQUMxQixZQUFJLE9BQU8sZUFBSyxjQUFMLENBQW9CLFFBQXBCLENBQVg7QUFDQSxhQUFLLE9BQUwsQ0FBYSxXQUFiLEVBQTBCLElBQTFCLEVBQWdDLEtBQWhDO0FBQ0gsS0F0SFU7OztBQXdIWDs7Ozs7QUFLQSxvQkE3SFcsNEJBNkhNLFNBN0hOLEVBNkhpQixRQTdIakIsRUE2SDJCO0FBQ2xDLFlBQUksQ0FBQyxLQUFLLFVBQVYsRUFBc0I7QUFBRSxpQkFBSyxVQUFMLEdBQWtCLEVBQWxCO0FBQXVCO0FBQy9DLGFBQUssVUFBTCxDQUFnQixJQUFoQixDQUFzQixFQUFFLE1BQU0sU0FBUixFQUFtQixVQUFVLFFBQTdCLEVBQXRCO0FBQ0gsS0FoSVU7OztBQWtJWDs7OztBQUlBLHNCQXRJVyxnQ0FzSVUsQ0FBRSxDQXRJWjs7O0FBd0lYOzs7Ozs7QUFNQSw0QkE5SVcsb0NBOEljLEtBOUlkLEVBOElxQixRQTlJckIsRUE4SStCLFVBOUkvQixFQThJMkM7QUFDbEQsWUFBSSxjQUFjLGFBQWEsQ0FBL0IsRUFBa0M7QUFDOUIsb0JBQVEsR0FBUixDQUFZLGFBQWEsU0FBekI7QUFDQSxpQkFBSyxrQkFBTCxDQUF3QixJQUF4QixDQUE2QixVQUE3QjtBQUNIO0FBQ0osS0FuSlU7OztBQXFKWDs7OztBQUlBLDJCQXpKVyxtQ0F5SmEsR0F6SmIsRUF5SmtCO0FBQ3pCLGdCQUFRLEdBQVIsQ0FBWSwwQkFBWixFQUF3QyxHQUF4QztBQUNILEtBM0pVO0FBNkpYLFlBN0pXLHNCQTZKQTtBQUFBOztBQUNQLGFBQUssYUFBTCxDQUFtQixDQUFuQixFQUFzQixLQUFLLEVBQUwsQ0FBUSxNQUFSLENBQWUsS0FBSyxLQUFwQixFQUEyQixNQUFqRDtBQUNBLGFBQUssTUFBTCxDQUFZLEtBQVo7QUFDQSxhQUFLLFdBQUwsR0FBbUIsU0FBbkI7QUFDQSxhQUFLLFNBQUwsR0FBaUIsSUFBakI7QUFDQSxhQUFLLE1BQUwsQ0FBWSxXQUFaLENBQXdCO0FBQUEsbUJBQVEsT0FBSyxVQUFMLENBQWdCLElBQWhCLENBQVI7QUFBQSxTQUF4QjtBQUNILEtBbktVO0FBcUtYLGNBcktXLHdCQXFLRTtBQUNULGdCQUFRLEdBQVIsQ0FBWSxVQUFaO0FBQ0gsS0F2S1U7QUF5S1gsV0F6S1csbUJBeUtILEdBektHLEVBeUtFO0FBQ1QsZ0JBQVEsR0FBUixDQUFZLE9BQVosRUFBcUIsR0FBckI7QUFDSCxLQTNLVTs7O0FBNktYOzs7O0FBSUEsY0FqTFcsc0JBaUxBLElBakxBLEVBaUxNO0FBQ2IsWUFBSSxLQUFLLFVBQVQsRUFBcUI7QUFDakIsaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLFVBQUwsQ0FBZ0IsTUFBcEMsRUFBNEMsR0FBNUMsRUFBaUQ7QUFDN0Msb0JBQUksS0FBSyxVQUFMLENBQWdCLENBQWhCLEVBQW1CLElBQW5CLEtBQTRCLFVBQWhDLEVBQTRDO0FBQ3hDLDRCQUFRLEdBQVIsQ0FBWSxJQUFaO0FBQ0EseUJBQUssVUFBTCxDQUFnQixDQUFoQixFQUFtQixRQUFuQixDQUE0QixLQUE1QixDQUFrQyxJQUFsQyxFQUF3QyxDQUFDLEVBQUUsTUFBTSxLQUFLLElBQUwsR0FBWSxFQUFwQixFQUF3QixVQUFVLEtBQUssUUFBdkMsRUFBRCxDQUF4QztBQUNIO0FBQ0o7QUFDSjtBQUNKO0FBMUxVLEM7Ozs7Ozs7OztBQ0ZmOzs7Ozs7a0JBRWU7QUFDWDs7Ozs7O0FBTUEsZUFQVyx1QkFPQyxNQVBELEVBT1MsS0FQVCxFQU9nQixTQVBoQixFQU8yQjtBQUNsQyxZQUFJLENBQUMsU0FBTCxFQUFnQjtBQUFFLHdCQUFZLEVBQVo7QUFBaUI7QUFDbkMsYUFBSyxJQUFJLENBQVQsSUFBYyxLQUFkLEVBQXFCO0FBQ2pCLG1CQUFPLElBQUksU0FBWCxJQUF3QixNQUFNLENBQU4sQ0FBeEI7QUFDSDtBQUNELGVBQU8sTUFBUDtBQUNILEtBYlU7OztBQWVYOzs7Ozs7QUFNQSxZQXJCVyxvQkFxQkYsR0FyQkUsRUFxQkcsR0FyQkgsRUFxQlE7QUFDZixZQUFJLENBQUMsR0FBTCxFQUFVO0FBQUUsa0JBQU0sR0FBTjtBQUFZO0FBQ3hCLGVBQU8sQ0FBUCxDQUZlLENBRUw7QUFDVixZQUFJLElBQUksS0FBSyxLQUFMLENBQVcsT0FBTyxNQUFJLEdBQVgsQ0FBWCxDQUFSO0FBQ0EsWUFBSSxJQUFJLEtBQUssS0FBTCxDQUFXLE1BQU0sR0FBakIsSUFBd0IsR0FBaEM7QUFDQSxZQUFJLElBQUksTUFBTSxHQUFkO0FBQ0EsZUFBTyxFQUFFLEdBQUcsSUFBRSxHQUFGLEdBQVEsR0FBYixFQUFrQixHQUFHLElBQUUsR0FBRixHQUFRLEdBQTdCLEVBQWtDLEdBQUcsSUFBRSxHQUFGLEdBQVEsR0FBN0MsRUFBUDtBQUNILEtBNUJVO0FBOEJYLFlBOUJXLG9CQThCRixHQTlCRSxFQThCRztBQUNWLGVBQU8sSUFBSSxDQUFKLElBQVMsS0FBSyxJQUFJLENBQWxCLElBQXVCLEtBQUssSUFBSSxDQUF2QztBQUNIO0FBaENVLEM7Ozs7Ozs7Ozs7O0FDRmY7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0k7OzsyQ0FHbUI7QUFBQTs7QUFDZixpQkFBSyxNQUFMLEdBQWMsSUFBSSxTQUFKLENBQWMscUJBQWQsQ0FBZDtBQUNBLGlCQUFLLE1BQUwsQ0FBWSxPQUFaLEdBQXNCLFVBQVUsS0FBVixFQUFpQjtBQUFFLHdCQUFRLEdBQVIsQ0FBWSxxQkFBcUIsS0FBakM7QUFBMEMsYUFBbkY7O0FBRUEsaUJBQUssTUFBTCxDQUFZLFNBQVosR0FBd0IsVUFBQyxDQUFELEVBQU87QUFDM0Isb0JBQUksTUFBTSxLQUFLLEtBQUwsQ0FBVyxFQUFFLElBQWIsQ0FBVjtBQUNBLHVCQUFLLGFBQUwsQ0FBbUIsR0FBbkI7QUFDSCxhQUhEOztBQUtBLGlCQUFLLE1BQUwsQ0FBWSxNQUFaLEdBQXFCLFVBQUMsQ0FBRCxFQUFPO0FBQ3hCLHVCQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLFNBQWpCO0FBQ0gsYUFGRDtBQUdIOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDbkJnQixTO0FBQ2pCLHVCQUFZLE1BQVosRUFBb0I7QUFBQTs7QUFBQTs7QUFFaEI7Ozs7O0FBS0EsYUFBSyxNQUFMLEdBQWMsSUFBSSxNQUFNLFFBQVYsRUFBZDs7QUFFQSxZQUFJLFVBQVUsT0FBTyxNQUFyQixFQUE2QjtBQUN6QjtBQUNBLGdCQUFJLFNBQVMsSUFBSSxNQUFNLFVBQVYsRUFBYjtBQUNBLG1CQUFPLElBQVAsQ0FBWSxPQUFPLE1BQW5CLEVBQTJCLFVBQUMsUUFBRCxFQUFXLFNBQVgsRUFBeUI7QUFDaEQsc0JBQUssY0FBTCxDQUFvQixRQUFwQixFQUE4QixTQUE5QjtBQUNILGFBRkQ7QUFHSDs7QUFFRCxhQUFLLFlBQUwsQ0FBa0IsTUFBbEI7QUFDSDs7QUFFRDs7Ozs7Ozs7O0FBT0E7Ozs7OztpQ0FNUyxLLEVBQU8sTSxFQUFRLENBQUU7OztpQ0FDakIsSyxFQUFPLE0sRUFBUSxDQUFFOzs7cUNBQ2IsTSxFQUFRLENBQUU7Ozt1Q0FDUixRLEVBQVUsUSxFQUFVLENBQUU7Ozs7O0FBRXJDOzs7OzsrQkFLTyxLLEVBQU8sTSxFQUFRO0FBQ2xCLGlCQUFLLE1BQUwsQ0FBWSxJQUFaLEdBQW1CLEtBQUssSUFBeEI7QUFDQSxrQkFBTSxLQUFOLENBQVksR0FBWixDQUFnQixLQUFLLE1BQXJCO0FBQ0EsaUJBQUssUUFBTCxDQUFjLEtBQWQsRUFBcUIsTUFBckI7QUFDSDs7QUFFRDs7Ozs7Ozs0QkFJSSxNLEVBQVEsSSxFQUFNO0FBQ2QsZ0JBQUksQ0FBQyxJQUFMLEVBQVc7QUFDUCx1QkFBTyxLQUFLLElBQUwsR0FBWSxRQUFuQjtBQUNIO0FBQ0QsbUJBQU8sSUFBUCxHQUFjLElBQWQ7QUFDQSxpQkFBSyxNQUFMLENBQVksR0FBWixDQUFnQixNQUFoQjtBQUNIOztBQUVEOzs7Ozs7Ozs7QUFnQkE7Ozs7O2tDQUtVLEssRUFBTyxNLEVBQVEsQ0FBRTs7QUFFM0I7Ozs7Ozs7OytCQUtPLEssRUFBTyxNLEVBQVE7QUFDbEIsaUJBQUssUUFBTCxDQUFjLEtBQWQsRUFBcUIsTUFBckI7QUFDSDs7OzRCQXBFVTtBQUNQLG1CQUFPLEtBQUssV0FBTCxDQUFpQixJQUF4QjtBQUNIOzs7NEJBd0NXO0FBQ1IsbUJBQU8sS0FBSyxNQUFaO0FBQ0g7O0FBRUQ7Ozs7Ozs7NEJBSWU7QUFDWCxtQkFBTyxLQUFLLE1BQUwsQ0FBWSxRQUFuQjtBQUNIOzs7Ozs7a0JBNUVnQixTIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBNZXRyb25vbWUgZnJvbSAnLi9vYmplY3RzL21ldHJvbm9tZS5lczYnO1xuaW1wb3J0IENpcmN1bGFyS2V5Ym9hcmQgZnJvbSAnLi9vYmplY3RzL2tleWJvYXJkcy9jaXJjdWxhcmtleWJvYXJkLmVzNic7XG5pbXBvcnQgVHJhZGl0aW9uYWxLZXlib2FyZCBmcm9tICcuL29iamVjdHMva2V5Ym9hcmRzL3RyYWRpdGlvbmFsa2V5Ym9hcmQuZXM2JztcbmltcG9ydCBEb21lIGZyb20gJy4vb2JqZWN0cy9kb21lLmVzNic7XG5pbXBvcnQgUGFydGljbGVTd2FybSBmcm9tICcuL29iamVjdHMvcGFydGljbGVmbG9jay5lczYnO1xuaW1wb3J0IFBhcnRpY2xlc0Zsb2F0aW5nIGZyb20gJy4vb2JqZWN0cy9mbG9hdGluZ3BhcnRpY2xlcy5lczYnO1xuaW1wb3J0IExpZ2h0aW5nIGZyb20gJy4vb2JqZWN0cy9saWdodGluZy5lczYnO1xuaW1wb3J0IFRvbmVQbGF5YmFjayBmcm9tICcuL3RvbmVwbGF5YmFjay5lczYnO1xuaW1wb3J0IElucHV0IGZyb20gJy4vaW5wdXQuZXM2JztcbmltcG9ydCBTdHlsZSBmcm9tICcuL3RoZW1laW5nL3N0eWxlLmVzNic7XG5pbXBvcnQgTm90ZSBmcm9tICcuL211c2ljdGhlb3J5L25vdGUuZXM2JztcbmltcG9ydCBOb3RhdGlvblRleHREaXNwbGF5IGZyb20gJy4vb2JqZWN0cy9ub3RhdGlvbnRleHRkaXNwbGF5LmVzNic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEltcHJvdiB7XG4gICAgY29uc3RydWN0b3Ioc2NlbmUsIGNvbmZpZ1VSSSkge1xuICAgICAgICAvKipcbiAgICAgICAgICogY3VycmVudCBrZXkgc2lnbmF0dXJlXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmN1cnJlbnRLZXlTaWduYXR1cmUgPSBudWxsO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBpbmFjdGl2aXR5IHRpbWVyIGZvciBzdWdnZXN0aW9uc1xuICAgICAgICAgKiBAdHlwZSB7bnVsbH1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2luYWN0aXZpdHlUaW1lciA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5fc2NlbmUgPSBzY2VuZTtcbiAgICAgICAgdGhpcy5fcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB0aGlzLl9yZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHRoaXMub25Db25maWdMb2FkZWQoKTtcbiAgICAgICAgdGhpcy5fcmVxdWVzdC5vcGVuKCdHRVQnLCBjb25maWdVUkkpO1xuICAgICAgICB0aGlzLl9yZXF1ZXN0LnNlbmQoKTtcbiAgICAgICAgdGhpcy5fbGFzdEtleSA9IHsga2V5OiAnJywgc2NvcmU6IDAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvbiBrZXkgY2hhbmdlXG4gICAgICogQHBhcmFtIGtleXNcbiAgICAgKi9cbiAgICBvbktleUlucHV0Q2hhbmdlKGV2ZW50KSB7XG4gICAgICAgIHZhciBuZXdLZXkgPSBldmVudC5wcmVkaWN0ZWRLZXlbMF07XG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgZXZlbnQucHJlZGljdGVkS2V5Lmxlbmd0aDsgYysrKSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQucHJlZGljdGVkS2V5W2NdLmtleSA9PT0gdGhpcy5fbGFzdEtleS5rZXkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sYXN0S2V5LnNjb3JlID0gZXZlbnQucHJlZGljdGVkS2V5W2NdLnNjb3JlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9sYXN0S2V5LmtleSAhPT0gbmV3S2V5LmtleSkge1xuICAgICAgICAgICAgdmFyIGRlbHRhID0gTWF0aC5hYnModGhpcy5fbGFzdEtleS5zY29yZSAtIGV2ZW50LnByZWRpY3RlZEtleVswXS5zY29yZSk7XG4gICAgICAgICAgICBpZiAoZGVsdGEgPCAxKSB7XG4gICAgICAgICAgICAgICAgbmV3S2V5ID0gdGhpcy5fbGFzdEtleTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9sYXN0S2V5ID0gbmV3S2V5O1xuXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9pbmFjdGl2aXR5VGltZXIpO1xuICAgICAgICB0aGlzLl9pbmFjdGl2aXR5VGltZXIgPSBzZXRUaW1lb3V0KCAoKSA9PiB0aGlzLm9uSW5hY3Rpdml0eVRpbWVvdXQoKSwgNTAwMCk7XG5cbiAgICAgICAgdGhpcy5fa2V5Ym9hcmQudG9nZ2xlS2V5UHJlc3NlZCh7XG4gICAgICAgICAgICBub3RhdGlvbjogZXZlbnQuY2hhbmdlZC5ub3RhdGlvbixcbiAgICAgICAgICAgIG9jdGF2ZTogZXZlbnQuY2hhbmdlZC5vY3RhdmUsXG4gICAgICAgICAgICB2ZWxvY2l0eTogZXZlbnQuY2hhbmdlZC52ZWxvY2l0eSB9KTtcblxuICAgICAgICBpZiAoZXZlbnQucHJlZGljdGVkS2V5Lmxlbmd0aCA+IDAgJiYgdGhpcy5jdXJyZW50S2V5U2lnbmF0dXJlICE9PSBldmVudC5wcmVkaWN0ZWRLZXlbMF0ua2V5KSB7XG4gICAgICAgICAgICB2YXIgbWlub3IgPSAoZXZlbnQucHJlZGljdGVkS2V5WzBdLmtleS5pbmRleE9mKCdtJykgPiAtMSk7XG4gICAgICAgICAgICB0aGlzLl9ub3RhdGlvbnRleHRkaXNwbGF5LnNldFRleHQoZXZlbnQucHJlZGljdGVkS2V5WzBdLmtleSk7XG4gICAgICAgICAgICB0aGlzLl9rZXlib2FyZC5jaGFuZ2VLZXlTaWduYXR1cmUoZXZlbnQucHJlZGljdGVkS2V5WzBdLmtleSk7XG4gICAgICAgICAgICB0aGlzLl9odWRLZXlib2FyZC5jaGFuZ2VLZXlTaWduYXR1cmUoZXZlbnQucHJlZGljdGVkS2V5WzBdLmtleSk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRLZXlTaWduYXR1cmUgPSBldmVudC5wcmVkaWN0ZWRLZXlbMF0ua2V5O1xuICAgICAgICAgICAgdGhpcy5fbWV0cm9ub21lLnNldEhpdENvbG9yKFN0eWxlLmNvbG9yd2hlZWxIaWdoU2F0dXJhdGlvbltOb3RlLmluZGV4T2ZOb3RhdGlvbihldmVudC5wcmVkaWN0ZWRLZXlbMF0ua2V5KV0pO1xuICAgICAgICAgICAgdGhpcy5fcGFydGljbGVzLnNldENvbG9yKFN0eWxlLmNvbG9yd2hlZWxIaWdoU2F0dXJhdGlvbltOb3RlLmluZGV4T2ZOb3RhdGlvbihldmVudC5wcmVkaWN0ZWRLZXlbMF0ua2V5KV0pO1xuICAgICAgICAgLy8gICB0aGlzLl9kb21lLnNldEVtaXNzaXZlKG1pbm9yID8gMHgxYTFhMWEgOiBTdHlsZS5kb21lLmVtaXNzaXZlKTtcbiAgICAgICAgICAgIHRoaXMuX2xpZ2h0cy5zZXRJbnRlbnNpdHkobWlub3IgPyAyIDogNCk7XG4gICAgICAgICAgICAvL3RoaXMuX3N3YXJtLnNldENvbG9yKFN0eWxlLmNvbG9yd2hlZWxIaWdoU2F0dXJhdGlvbltOb3RlLmluZGV4T2ZOb3RhdGlvbihuZXdLZXkua2V5KV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy90aGlzLl9rZXlib2FyZC50b2dnbGVLZXlQcmVzc2VkKGtleVtvY3RhdmVdLCBldmVudC5jaGFuZ2VkLnZlbG9jaXR5KTtcbiAgICAgICAgIC8qdmFyIGtleSA9IHRoaXMuZmluZEtleU9iamVjdHNGb3JOb3RhdGlvbihldmVudC5jaGFuZ2VkLm5vdGF0aW9uKTtcbiAgICAgICAgIHZhciBvY3RhdmU7XG4gICAgICAgICBpZiAoZXZlbnQuY2hhbmdlZC5vY3RhdmUgLyAyID09PSBNYXRoLmZsb29yKGV2ZW50LmNoYW5nZWQub2N0YXZlIC8gMikpIHtcbiAgICAgICAgICAgIG9jdGF2ZSA9IDE7XG4gICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb2N0YXZlID0gMDtcbiAgICAgICAgIH1cblxuICAgICAgICAgdGhpcy50b2dnbGVLZXlQcmVzc2VkKGtleVtvY3RhdmVdLCBldmVudC5jaGFuZ2VkLnZlbG9jaXR5KTtcblxuICAgICAgICAgaWYgKGV2ZW50LnByZWRpY3RlZEtleS5sZW5ndGggPiAwICYmIGV2ZW50LnByZWRpY3RlZEtleVswXSAhPT0gdGhpcy5jdXJyZW50S2V5U2lnbmF0dXJlKSB7XG4gICAgICAgICAgICB0aGlzLm9uS2V5U2lnbmF0dXJlQ2hhbmdlKGV2ZW50LnByZWRpY3RlZEtleVswXS5rZXkpO1xuICAgICAgICAgfSovXG4gICAgIH1cblxuICAgIC8qKlxuICAgICAqIGluYWN0aXZpdHkgdGltZW91dFxuICAgICAqL1xuICAgIG9uSW5hY3Rpdml0eVRpbWVvdXQoKSB7XG4gICAgICAgIHRoaXMuX2tleWJvYXJkLnJlc2V0S2V5cygpO1xuICAgICAgICB0aGlzLl9odWRLZXlib2FyZC5yZXNldEtleXMoKTtcbiAgICAgICAgdGhpcy5faW5wdXQuY2xlYXJQcmVkaWN0aW9uSGlzdG9yeSgpO1xuICAgICAgICB0aGlzLl9tZXRyb25vbWUuc2V0SGl0Q29sb3IoKTtcbiAgICAgICAgdGhpcy5fcGFydGljbGVzLnNldENvbG9yKCk7XG4gICAgICAgIHRoaXMuX25vdGF0aW9udGV4dGRpc3BsYXkuc2V0VGV4dCgpO1xuICAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvbiBjb25maWcgbG9hZGVkXG4gICAgICovXG4gICAgb25Db25maWdMb2FkZWQoKSB7XG4gICAgICAgIGlmICh0aGlzLl9yZXF1ZXN0LnJlYWR5U3RhdGUgPT09IFhNTEh0dHBSZXF1ZXN0LkRPTkUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9yZXF1ZXN0LnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbmZpZyA9IEpTT04ucGFyc2UodGhpcy5fcmVxdWVzdC5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0dXAoY29uZmlnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1RoZXJlIHdhcyBhIHByb2JsZW0gd2l0aCB0aGUgcmVxdWVzdC4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBzZXR1cCBhcHBcbiAgICAgKiBAcGFyYW0gY29uZmlnXG4gICAgICogQHBhcmFtIGNvbmZpZ1xuICAgICAqL1xuICAgIHNldHVwKGNvbmZpZykge1xuICAgICAgICB0aGlzLl9zY2VuZS5vbkNyZWF0ZSA9IHRoaXMuY3JlYXRlO1xuXG4gICAgICAgIHRoaXMuX2lucHV0ID0gbmV3IElucHV0KGNvbmZpZy5pbnB1dCwgKGtleXMpID0+IHRoaXMub25LZXlJbnB1dENoYW5nZShrZXlzKSApO1xuICAgICAgICB0aGlzLl9rZXlib2FyZCA9IG5ldyBUcmFkaXRpb25hbEtleWJvYXJkKGNvbmZpZy5rZXlib2FyZCk7XG4gICAgICAgIHRoaXMuX2h1ZEtleWJvYXJkID0gbmV3IENpcmN1bGFyS2V5Ym9hcmQoY29uZmlnLm5vdGF0aW9uZGlzcGxheSk7XG4gICAgICAgIHRoaXMuX21ldHJvbm9tZSA9IG5ldyBNZXRyb25vbWUoY29uZmlnLm1ldHJvbm9tZSk7XG4gICAgICAgIHRoaXMuX25vdGF0aW9udGV4dGRpc3BsYXkgPSBuZXcgTm90YXRpb25UZXh0RGlzcGxheSgpO1xuICAgICAgICB0aGlzLl9kb21lID0gbmV3IERvbWUoKTtcbiAgICAgICAgdGhpcy5fbGlnaHRzID0gbmV3IExpZ2h0aW5nKCk7XG4gICAgICAgIC8vdGhpcy5fc3dhcm0gPSBuZXcgUGFydGljbGVTd2FybSgpO1xuICAgICAgICB0aGlzLl9wYXJ0aWNsZXMgPSBuZXcgUGFydGljbGVzRmxvYXRpbmcoKTtcblxuICAgICAgICB0aGlzLl9zY2VuZS5hZGRPYmplY3RzKFtcbiAgICAgICAgICAgIHRoaXMuX21ldHJvbm9tZSxcbiAgICAgICAgICAgIC8vdGhpcy5fc3dhcm0sXG4gICAgICAgICAgICB0aGlzLl9kb21lLFxuICAgICAgICAgICAgdGhpcy5fbm90YXRpb250ZXh0ZGlzcGxheSxcbiAgICAgICAgICAgIHRoaXMuX2tleWJvYXJkLFxuICAgICAgICAgICAgdGhpcy5faHVkS2V5Ym9hcmQsXG4gICAgICAgICAgICB0aGlzLl9saWdodHMsXG4gICAgICAgICAgICB0aGlzLl9wYXJ0aWNsZXNdKTtcblxuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IGNvbmZpZy5zb3VuZC5zb3VuZGZvbnRzLmxlbmd0aDsgYysrKSB7XG4gICAgICAgICAgICBUb25lUGxheWJhY2subG9hZEluc3RydW1lbnQoY29uZmlnLnNvdW5kLnNvdW5kZm9udHNbY10sIGNvbmZpZy5zb3VuZC5zb3VuZGZvbnRsb2NhdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZXZlbnQgPT4gdGhpcy5vbktleURvd24oZXZlbnQpICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb24ga2V5ZG93blxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqL1xuICAgIG9uS2V5RG93bihldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQuY29kZSA9PT0gJ1NwYWNlJykge1xuICAgICAgICAgICAgc3dpdGNoIChUb25lUGxheWJhY2sucGxheWVyU3RhdGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdyZWFkeSc6IFRvbmVQbGF5YmFjay5wbGF5KCcuL2Fzc2V0cy9hdWRpby9Cb25uaWVfVHlsZXJfLV9Ub3RhbF9FY2xpcHNlX29mX3RoZV9IZWFydC5taWQnKTsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAncGxheWluZyc6IFRvbmVQbGF5YmFjay5wYXVzZSgpOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdwYXVzZWQnOiBUb25lUGxheWJhY2sucmVzdW1lKCk7IGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlKHNjZW5lLCBjdXN0b20pIHtcbiAgICAgICAgc2NlbmUucmVuZGVyZXIuZ2FtbWFJbnB1dCA9IHRydWU7XG4gICAgICAgIHNjZW5lLnJlbmRlcmVyLmdhbW1hT3V0cHV0ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZW5kZXIoc2NlbmUsIGN1c3RvbSkge31cbn1cbiIsImltcG9ydCBRV0VSVFlLZXlNYW5hZ2VyIGZyb20gJy4vcXdlcnR5a2V5bWFuYWdlci5lczYnO1xuaW1wb3J0IE1JRElLZXlNYW5hZ2VyIGZyb20gJy4vbWlkaWtleW1hbmFnZXIuZXM2JztcbmltcG9ydCBXZWJTb2NrZXRzTUlESU1hbmFnZXIgZnJvbSAnLi93ZWJzb2NrZXRtaWRpa2V5bWFuYWdlci5lczYnO1xuaW1wb3J0IEtleVNpZ25hdHVyZVByZWRpY3Rpb24gZnJvbSAnLi9tdXNpY3RoZW9yeS9rZXlzaWduYXR1cmVwcmVkaWN0aW9uLmVzNic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXMsIGNiKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBrZXkgbWFuYWdlclxuICAgICAgICAgKiBAdHlwZSB7JEVTNl9BTk9OWU1PVVNfQ0xBU1MkfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKHBhcmFtcy5kZXZpY2UgPT09ICdRV0VSVFknKSB7XG4gICAgICAgICAgICB0aGlzLl9rZXltYW5hZ2VyID0gbmV3IFFXRVJUWUtleU1hbmFnZXIocGFyYW1zLCBjaGFuZ2VkID0+IHRoaXMub25LZXlDaGFuZ2UoY2hhbmdlZCkpO1xuICAgICAgICB9IGVsc2UgaWYgKHBhcmFtcy5kZXZpY2UgPT09ICdNSURJJykge1xuICAgICAgICAgICAgdGhpcy5fa2V5bWFuYWdlciA9IG5ldyBNSURJS2V5TWFuYWdlcihwYXJhbXMsIGNoYW5nZWQgPT4gdGhpcy5vbktleUNoYW5nZShjaGFuZ2VkKSk7XG4gICAgICAgIH0gZWxzZSBpZiAocGFyYW1zLmRldmljZSA9PT0gJ1dTTUlESScpIHtcbiAgICAgICAgICAgIHRoaXMuX2tleW1hbmFnZXIgPSBuZXcgV2ViU29ja2V0c01JRElNYW5hZ2VyKHBhcmFtcywgY2hhbmdlZCA9PiB0aGlzLm9uS2V5Q2hhbmdlKGNoYW5nZWQpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBrZXkgc2lnbmF0dXJlIHByZWRpY3Rpb25cbiAgICAgICAgICogQHR5cGUgeyRFUzZfQU5PTllNT1VTX0NMQVNTJH1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2tleVNpZ1ByZWRpY3Rpb24gPSBuZXcgS2V5U2lnbmF0dXJlUHJlZGljdGlvbigpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBrZXkgY2hhbmdlIGNhbGxiYWNrXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9jYWxsYmFjayA9IGNiO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNsZWFyIHByZWRpY3Rpb24gaGlzdG9yeVxuICAgICAqL1xuICAgIGNsZWFyUHJlZGljdGlvbkhpc3RvcnkoKSB7XG4gICAgICAgIHRoaXMuX2tleVNpZ1ByZWRpY3Rpb24uY2xlYXJIaXN0b3J5KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb24ga2V5IGNoYW5nZVxuICAgICAqIEBwYXJhbSBjaGFuZ2VkXG4gICAgICovXG4gICAgb25LZXlDaGFuZ2UoY2hhbmdlZCkge1xuICAgICAgICB2YXIga2QgPSB0aGlzLl9rZXltYW5hZ2VyLmdldEtleXNEb3duKCk7XG4gICAgICAgIHZhciBwcmVkaWN0ZWQgPSB0aGlzLl9rZXlTaWdQcmVkaWN0aW9uLnVwZGF0ZShrZCk7XG4gICAgICAgIHRoaXMuX2NhbGxiYWNrLmFwcGx5KHRoaXMsIFsgeyBkb3duOiBrZCwgcHJlZGljdGVkS2V5OiBwcmVkaWN0ZWQsIGNoYW5nZWQ6IGNoYW5nZWQgfV0pO1xuICAgIH1cbn1cbiIsImltcG9ydCBOb3RlIGZyb20gJy4vbXVzaWN0aGVvcnkvbm90ZS5lczYnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gICAgY29uc3RydWN0b3IocGFyYW1zLCBjYikge1xuICAgICAgICAvKipcbiAgICAgICAgICogZXZlbnQgY2FsbGJhY2tcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrID0gY2I7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGtleXMgZG93blxuICAgICAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9rZXlzID0gW107XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1JREkga2V5IHRvIG5vdGF0aW9uIG1hcHBpbmcgKGNvbWluZyBmcm9tIE1JREksIHNvIG5vdCBjdXN0b21pemFibGUpXG4gICAgICAgICAqIHRoZSBzcGxpY2UgaGFwcGVucyBiZWNhdXNlIDAgaW5kZXggaW4gTUlESSBzdGFydHMgd2l0aCBDXG4gICAgICAgICAqIEB0eXBlIHtBcnJheS48c3RyaW5nPn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX21hcHBpbmcgPSBOb3RlLnNoYXJwTm90YXRpb25zXG4gICAgICAgICAgICAuY29uY2F0KE5vdGUuc2hhcnBOb3RhdGlvbnMpXG4gICAgICAgICAgICAuY29uY2F0KE5vdGUuc2hhcnBOb3RhdGlvbnMpXG4gICAgICAgICAgICAuY29uY2F0KE5vdGUuc2hhcnBOb3RhdGlvbnMpXG4gICAgICAgICAgICAuY29uY2F0KE5vdGUuc2hhcnBOb3RhdGlvbnMpXG4gICAgICAgICAgICAuY29uY2F0KE5vdGUuc2hhcnBOb3RhdGlvbnMpXG4gICAgICAgICAgICAuY29uY2F0KE5vdGUuc2hhcnBOb3RhdGlvbnMpXG4gICAgICAgICAgICAuY29uY2F0KE5vdGUuc2hhcnBOb3RhdGlvbnMpXG4gICAgICAgICAgICAuY29uY2F0KE5vdGUuc2hhcnBOb3RhdGlvbnMpXG4gICAgICAgICAgICAuY29uY2F0KE5vdGUuc2hhcnBOb3RhdGlvbnMpLnNwbGljZSgzLCBOb3RlLnNoYXJwTm90YXRpb25zLmxlbmd0aCAqMTApO1xuXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZURldmljZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGluaXRpYWxpemUgbWlkaSBkZXZpY2VcbiAgICAgKi9cbiAgICBpbml0aWFsaXplRGV2aWNlKCkge1xuICAgICAgICAvLyByZXF1ZXN0IE1JREkgYWNjZXNzXG4gICAgICAgIGlmIChuYXZpZ2F0b3IucmVxdWVzdE1JRElBY2Nlc3MpIHtcbiAgICAgICAgICAgIG5hdmlnYXRvci5yZXF1ZXN0TUlESUFjY2VzcygpLnRoZW4oXG4gICAgICAgICAgICAgICAgKGV2ZW50KSA9PiB0aGlzLm9uTUlESVN1Y2Nlc3MoZXZlbnQpLFxuICAgICAgICAgICAgICAgIChldmVudCkgPT4gdGhpcy5vbk1JRElGYWlsdXJlKGV2ZW50KSApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJObyBNSURJIHN1cHBvcnQgaW4geW91ciBicm93c2VyLlwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG9uIG1pZGkgY29ubmVjdGlvbiBzdWNjZXNzXG4gICAgICogQHBhcmFtIG1pZGlcbiAgICAgKi9cbiAgICBvbk1JRElTdWNjZXNzKG1pZGkpIHtcbiAgICAgICAgdmFyIGlucHV0cyA9IG1pZGkuaW5wdXRzO1xuICAgICAgICBmb3IgKGxldCBpbnB1dCBvZiBpbnB1dHMudmFsdWVzKCkpIHtcbiAgICAgICAgICAgIGlucHV0Lm9ubWlkaW1lc3NhZ2UgPSBtc2cgPT4gdGhpcy5vbk1JRElNZXNzYWdlKG1zZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvbiBtaWRpIGNvbm5lY3Rpb24gZmFpbHVyZVxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqL1xuICAgIG9uTUlESUZhaWx1cmUoZXZlbnQpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJObyBhY2Nlc3MgdG8gTUlESSBkZXZpY2VzIG9yIHlvdXIgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgV2ViTUlESSBBUEkuIFBsZWFzZSB1c2UgV2ViTUlESUFQSVNoaW0gXCIgKyBldmVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb24gbWlkaSBtZXNzYWdlXG4gICAgICogQHBhcmFtIG1zZ1xuICAgICAqL1xuICAgIG9uTUlESU1lc3NhZ2UobXNnKSB7XG4gICAgICAgIHZhciBjbWQgPSBtc2cuZGF0YVswXSA+PiA0O1xuICAgICAgICB2YXIgY2hhbm5lbCA9IG1zZy5kYXRhWzBdICYgMHhmO1xuICAgICAgICB2YXIgbm90ZU51bWJlciA9IG1zZy5kYXRhWzFdO1xuICAgICAgICB2YXIgdmVsb2NpdHkgPSAwO1xuICAgICAgICBpZiAobXNnLmRhdGEubGVuZ3RoID4gMilcbiAgICAgICAgICAgIHZlbG9jaXR5ID0gbXNnLmRhdGFbMl0gLyAxMDA7XG5cbiAgICAgICAgLy8gTUlESSBub3Rlb24gd2l0aCB2ZWxvY2l0eT0wIGlzIHRoZSBzYW1lIGFzIG5vdGVvZmZcbiAgICAgICAgaWYgKCBjbWQ9PTggfHwgKChjbWQ9PTkpJiYodmVsb2NpdHk9PTApKSApIHsgLy8gbm90ZW9mZlxuICAgICAgICAgICAgdGhpcy5vbktleVVwKG5vdGVOdW1iZXIpO1xuICAgICAgICB9IGVsc2UgaWYgKGNtZCA9PSA5KSB7IC8vIG5vdGUgb25cbiAgICAgICAgICAgIHRoaXMub25LZXlEb3duKG5vdGVOdW1iZXIsIHZlbG9jaXR5KTtcbiAgICAgICAgfSAvL2Vsc2UgaWYgKGNtZCA9PSAxMSkgeyAvLyBjb250cm9sbGVyIG1lc3NhZ2VcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBnZXQga2V5cyBkb3duXG4gICAgICovXG4gICAgZ2V0S2V5c0Rvd24oKSB7XG4gICAgICAgIHZhciBkb3duID0gW107XG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgdGhpcy5fa2V5cy5sZW5ndGg7IGMrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2tleXNbY10gPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIG9jdGF2ZSA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKGMgPj0gdGhpcy5fa2V5cy5sZW5ndGgvMikgeyBvY3RhdmUgPSAxOyB9XG4gICAgICAgICAgICAgICAgZG93bi5wdXNoKCB7IG5vdGF0aW9uOiB0aGlzLl9tYXBwaW5nW2NdLCBvY3RhdmU6IG9jdGF2ZSwgaW5kZXg6IGMsIHZlbG9jaXR5OiB0aGlzLl9rZXlzW2NdfSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkb3duO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG9uIGtleSBkb3duXG4gICAgICogQHBhcmFtIGtleVxuICAgICAqIEBwYXJhbSB2ZWxvY2l0eVxuICAgICAqL1xuICAgIG9uS2V5RG93bihrZXksIHZlbG9jaXR5KSB7XG4gICAgICAgIHRoaXMuX2tleXNba2V5XSA9IHZlbG9jaXR5O1xuICAgICAgICB2YXIgb2N0YXZlID0gMDtcbiAgICAgICAgb2N0YXZlID0gTWF0aC5mbG9vcigoa2V5KzMpIC8gTm90ZS5zaGFycE5vdGF0aW9ucy5sZW5ndGgpO1xuICAgICAgICB0aGlzLl9jYWxsYmFjayh7XG4gICAgICAgICAgICBub3RhdGlvbjogdGhpcy5fbWFwcGluZ1trZXldLFxuICAgICAgICAgICAgb2N0YXZlOiBvY3RhdmUsXG4gICAgICAgICAgICBpbmRleDoga2V5LFxuICAgICAgICAgICAgdmVsb2NpdHk6IHZlbG9jaXR5LFxuICAgICAgICAgICAgYWN0aW9uOiAncHJlc3MnIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG9uIGtleSBkb3duXG4gICAgICogQHBhcmFtIGtleVxuICAgICAqL1xuICAgIG9uS2V5VXAoa2V5KSB7XG4gICAgICAgIHRoaXMuX2tleXNba2V5XSA9IDAuMDtcbiAgICAgICAgdmFyIG9jdGF2ZSA9IDA7XG4gICAgICAgIG9jdGF2ZSA9IE1hdGguZmxvb3IoKGtleSszKSAvIE5vdGUuc2hhcnBOb3RhdGlvbnMubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2soe1xuICAgICAgICAgICAgbm90YXRpb246IHRoaXMuX21hcHBpbmdba2V5XSxcbiAgICAgICAgICAgIG9jdGF2ZTogb2N0YXZlLFxuICAgICAgICAgICAgaW5kZXg6IGtleSxcbiAgICAgICAgICAgIHZlbG9jaXR5OiAwLFxuICAgICAgICAgICAgYWN0aW9uOiAncmVsZWFzZScgfSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IE5vdGUgZnJvbSAnLi9ub3RlLmVzNic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGtleSBzaWduYXR1cmUgc2NvcmUgaGlzdG9yeVxuICAgICAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9rZXlTaWduYXR1cmVTY29yZUhpc3RvcnkgPSBbXTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogaGlzdG9yeSBkZWNheSByYXRlXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9rZXlTaWduYXR1cmVEZWNheVJhdGUgPSAuOTtcblxuICAgICAgICBOb3RlLmdlbmVyYXRlS2V5U2lnbmF0dXJlTG9va3VwKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdXBkYXRlIGtleXMgcHJlc3NlZFxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGtleXNcbiAgICAgKi9cbiAgICB1cGRhdGUoa2V5cykge1xuICAgICAgICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHsgcmV0dXJuIHRoaXMuX2tleVNpZ25hdHVyZVNjb3JlSGlzdG9yeTsgfVxuICAgICAgICB2YXIga2V5c2lnU2NvcmVzID0ge307XG4gICAgICAgIHZhciB0b3BzY29yZSA9IC0xO1xuICAgICAgICBmb3IgKHZhciBzaWcgaW4gTm90ZS5rZXlzKSB7XG4gICAgICAgICAgICB2YXIgbWFqb3IgPSAoc2lnLmluZGV4T2YoJ20nKSA9PT0gLTEpO1xuICAgICAgICAgICAgdmFyIHNpZ25vdGF0aW9uID0gc2lnO1xuICAgICAgICAgICAgaWYgKCFtYWpvcikge1xuICAgICAgICAgICAgICAgIHNpZ25vdGF0aW9uID0gc2lnbm90YXRpb24uc2xpY2UoMCwgc2lnbm90YXRpb24ubGVuZ3RoLTEpOyAvLyBnZXQgcmlkIG9mIG1pbm9yIGRlbm90YXRpb24gaW4gc3RyaW5nXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKHZhciBkID0gMDsgZCA8IGtleXMubGVuZ3RoOyBkKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoTm90ZS5rZXlzW3NpZ10uaW5kZXhPZihrZXlzW2RdLm5vdGF0aW9uKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFrZXlzaWdTY29yZXNbc2lnXSkgeyBrZXlzaWdTY29yZXNbc2lnXSA9IDA7IH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIGtzZyA9IE5vdGUubm90ZXNJbktleVNpZ25hdHVyZShzaWdub3RhdGlvbiwgbWFqb3IpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5c1tkXS5ub3RhdGlvbiA9PT0ga3NnWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXlzaWdTY29yZXNbc2lnXSArPSAxLjA3OyAvLyByb290XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5c1tkXS5ub3RhdGlvbiA9PT0ga3NnWzJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXlzaWdTY29yZXNbc2lnXSArPSAxLjA2OyAvLyAzcmRcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChrZXlzW2RdLm5vdGF0aW9uID09PSBrc2dbNF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleXNpZ1Njb3Jlc1tzaWddICs9IDEuMDU7IC8vIDV0aFxuICAgICAgICAgICAgICAgICAgICB9ICBlbHNlIGlmIChrZXlzW2RdLm5vdGF0aW9uID09PSBrc2dbNl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleXNpZ1Njb3Jlc1tzaWddICs9IDEuMDI7IC8vIHNldmVudGhcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleXNpZ1Njb3Jlc1tzaWddICs9IDEuMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXlzaWdTY29yZXNbc2lnXSA+IHRvcHNjb3JlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3BzY29yZSA9IGtleXNpZ1Njb3Jlc1tzaWddO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG1ham9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXlzaWdTY29yZXNbc2lnXSArPSAuMDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLyppZiAoa2V5c1tkXS5ub3RhdGlvbiA9PT0gc2lnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXlzaWdTY29yZXNbc2lnXSArPSAuMDE7IC8vIHNtYWxsIHByaW9yaXR5IGJvb3N0IGZvciByb290IG5vdGVcbiAgICAgICAgICAgICAgICAgICAgfSovXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNjb3JlcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBzY29yZSBpbiBrZXlzaWdTY29yZXMpIHtcbiAgICAgICAgICAgIHNjb3Jlcy5wdXNoKCB7IHNjb3JlOiBrZXlzaWdTY29yZXNbc2NvcmVdLCBrZXk6IHNjb3JlLCB0aW1lc3RhbXA6IERhdGUubm93KCkgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoa2V5cy5sZW5ndGggPj0gMyAmJiB0b3BzY29yZSA+PSBrZXlzLmxlbmd0aCAqIDEuMCkge1xuICAgICAgICAgICAgdGhpcy5jbGVhckhpc3RvcnkoKTsgLy8gcHJldHR5IGNsZWFyIHdlJ3JlIGhvbGRpbmcgYSBzb2xpZCBjaG9yZCwgYW5kIHdlIHNob3VsZCBjaGFuZ2UgZW50aXJlIGhpc3RvcnlcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGVjYXlIaXN0b3JpY2FsU2NvcmVzKCk7XG4gICAgICAgIHJldHVybiB0aGlzLmFwcGx5Q3VycmVudFNjb3JlVG9IaXN0b3J5KHNjb3Jlcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY2xlYXIgaGlzdG9yeVxuICAgICAqL1xuICAgIGNsZWFySGlzdG9yeSgpIHtcbiAgICAgICAgdGhpcy5fa2V5U2lnbmF0dXJlU2NvcmVIaXN0b3J5ID0gW107XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2xvd2x5IGRlY2F5IGN1cnJlbnQgaGlzdG9yaWNhbCBzY29yZXNcbiAgICAgKi9cbiAgICBkZWNheUhpc3RvcmljYWxTY29yZXMoKSB7XG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgdGhpcy5fa2V5U2lnbmF0dXJlU2NvcmVIaXN0b3J5Lmxlbmd0aDsgYysrKSB7XG4gICAgICAgICAgICB0aGlzLl9rZXlTaWduYXR1cmVTY29yZUhpc3RvcnlbY10uc2NvcmUgKj0gdGhpcy5fa2V5U2lnbmF0dXJlRGVjYXlSYXRlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYXBwbHkgc2NvcmVzIHRvIGhpc3RvcnkgKGFnZ3JlZ2F0ZSBhbGwgc2NvcmVzOiBjdXJyZW50IGFuZCBwYXN0KVxuICAgICAqIEBwYXJhbSBzY29yZXNcbiAgICAgKi9cbiAgICBhcHBseUN1cnJlbnRTY29yZVRvSGlzdG9yeShzY29yZXMpIHtcbiAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCBzY29yZXMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgIHZhciBmb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgZm9yICh2YXIgZCA9IDA7IGQgPCB0aGlzLl9rZXlTaWduYXR1cmVTY29yZUhpc3RvcnkubGVuZ3RoOyBkKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fa2V5U2lnbmF0dXJlU2NvcmVIaXN0b3J5W2RdLmtleSA9PT0gc2NvcmVzW2NdLmtleSkge1xuICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2tleVNpZ25hdHVyZVNjb3JlSGlzdG9yeVtkXS5zY29yZSArPSBzY29yZXNbY10uc2NvcmU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2tleVNpZ25hdHVyZVNjb3JlSGlzdG9yeS5wdXNoKHNjb3Jlc1tjXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2tleVNpZ25hdHVyZVNjb3JlSGlzdG9yeS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIChhLnNjb3JlIDwgYi5zY29yZSApID8gMSA6ICgoYi5zY29yZSA8IGEuc2NvcmUpID8gLTEgOiAwKTsgfSk7XG4gICAgfVxufVxuIiwiLyoqXG4gKiBOb3RlIHN0YXRpYyBjbGFzc1xuICogQGNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICAvKiogY2FjaGVkIGtleXNpZ25hdHVyZSBsb29rdXAgdGFibGUgKi9cbiAgICBrZXlzOiB7fSxcblxuICAgIC8qKlxuICAgICAqIGluY3JlbWVudGFsIHRvbmVzIGFzIHNoYXJwIG5vdGF0aW9uXG4gICAgICogQGNvbnN0XG4gICAgICogQHN0YXRpY1xuICAgICAqIEB0eXBlIHtBcnJheS48c3RyaW5nPn1cbiAgICAgKiovXG4gICAgc2hhcnBOb3RhdGlvbnM6IFtcIkFcIiwgXCJBI1wiLCBcIkJcIiwgXCJDXCIsIFwiQyNcIiwgXCJEXCIsIFwiRCNcIiwgXCJFXCIsIFwiRlwiLCBcIkYjXCIsIFwiR1wiLCBcIkcjXCJdLFxuXG4gICAgLyoqXG4gICAgICogaW5jcmVtZW50YWwgdG9uZXMgYXMgZmxhdCBub3RhdGlvblxuICAgICAqIEBjb25zdFxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAdHlwZSB7QXJyYXkuPHN0cmluZz59XG4gICAgICoqL1xuICAgIGZsYXROb3RhdGlvbnM6IFtcIkFcIiwgXCJCYlwiLCBcIkJcIiwgXCJDXCIsIFwiRGJcIiwgXCJEXCIsIFwiRWJcIiwgXCJFXCIsIFwiRlwiLCBcIkdiXCIsIFwiR1wiLCBcIkFiXCJdLFxuXG4gICAgLyoqXG4gICAgICogZ2V0IG5vdGF0aW9uIGluZGV4IHdoZW4gbm90YXRpb24gaXMgZWl0aGVyIGZsYXQgb3Igc2hhcnBcbiAgICAgKiBAcGFyYW0gbm90YXRpb25cbiAgICAgKi9cbiAgICBpbmRleE9mTm90YXRpb24obm90YXRpb24pIHtcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5zaGFycE5vdGF0aW9ucy5pbmRleE9mKG5vdGF0aW9uKTtcbiAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgaW5kZXggPSB0aGlzLmZsYXROb3RhdGlvbnMuaW5kZXhPZihub3RhdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBnZXQgbm90YXRpb24gZ2l2ZW4gYW4gaW5kZXhcbiAgICAgKiBAcGFyYW0gaW5kZXhcbiAgICAgKi9cbiAgICBub3RhdGlvbkF0SW5kZXgoaW5kZXgsIHByZWZlckZsYXQpIHtcbiAgICAgICAgaWYgKGluZGV4ID49IHRoaXMuc2hhcnBOb3RhdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpbmRleCA9IGluZGV4ICUgdGhpcy5zaGFycE5vdGF0aW9ucy5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJlZmVyRmxhdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmxhdE5vdGF0aW9uc1tpbmRleF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zaGFycE5vdGF0aW9uc1tpbmRleF07XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogb2RkIG5vdGF0aW9uc1xuICAgICAqIEBjb25zdFxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAdHlwZSB7QXJyYXkuPHN0cmluZz59XG4gICAgICoqL1xuICAgICBvZGROb3RhdGlvbnM6IFtcIkIjXCIsIFwiQ2JcIiwgXCJFI1wiLCBcIkZiXCJdLFxuXG4gICAgLyoqXG4gICAgICogY29ycmVjdGVkIG5vdGF0aW9uc1xuICAgICAqIEBjb25zdFxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAdHlwZSB7QXJyYXkuPHN0cmluZz59XG4gICAgICoqL1xuICAgICBjb3JyZWN0ZWROb3RhdGlvbnM6IFtcIkNcIiwgXCJDXCIsIFwiRlwiLCBcIkZcIl0sXG5cbiAgICAvKipcbiAgICAgKiB0cmFuc2xhdGUgaW5kZXggZnJvbSBNSURJIHRvIG5vdGF0aW9uXG4gICAgICogQHBhcmFtIGluZGV4XG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgTUlESXRvTm90YXRpb24oaW5kZXgpIHtcbiAgICAgICAgdmFyIHBvc2l0aW9uID0gaW5kZXggJSB0aGlzLnNoYXJwTm90YXRpb25zLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2hhcnBOb3RhdGlvbnNbcG9zaXRpb25dO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiB0cmFuc2xhdGUgbm90YXRpb24gYW5kIG9jdGF2ZSB0byBNSURJIGluZGV4XG4gICAgICogQHBhcmFtIG5vdGF0aW9uXG4gICAgICovXG4gICAgbm90YXRpb25Ub01JREkobm90YXRpb24pIHtcbiAgICAgICAgdmFyIG50T2JqID0gdGhpcy5wYXJzZU5vdGF0aW9uKG5vdGF0aW9uKTtcbiAgICAgICAgdmFyIG50aW5keCA9IHRoaXMuc2hhcnBOb3RhdGlvbnMuaW5kZXhPZihudE9iai5ub3RhdGlvbik7XG4gICAgICAgIGlmIChudGluZHggPT09IC0xKSB7XG4gICAgICAgICAgICBudGluZHggPSB0aGlzLmZsYXROb3RhdGlvbnMuaW5kZXhPZihudE9iai5ub3RhdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG50T2JqLm9jdGF2ZSAqIHRoaXMuc2hhcnBOb3RhdGlvbnMubGVuZ3RoICsgbnRpbmR4O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBwYXJzZSBub3RhdGlvbiB0byBub3RhdGlvbiBhbmQgb2N0YXZlXG4gICAgICogQHBhcmFtIG5vdGF0aW9uXG4gICAgICovXG4gICAgcGFyc2VOb3RhdGlvbihub3RhdGlvbikge1xuICAgICAgICB2YXIgbm90ZSA9IHt9O1xuICAgICAgICAvLyBvbmx5IHN1cHBvcnRzIG9uZSBkaWdpdCBvY3RhdmVzIChpZiB0aGF0cyBldmVuIGEgcmVhbCBpc3N1ZSlcbiAgICAgICAgdmFyIG9jdGF2ZSA9IG5vdGF0aW9uLmNoYXJBdChub3RhdGlvbi5sZW5ndGgtMSk7XG4gICAgICAgIGlmIChwYXJzZUludChvY3RhdmUpID09IG9jdGF2ZSkge1xuICAgICAgICAgICAgbm90ZS5vY3RhdmUgPSBvY3RhdmU7XG4gICAgICAgICAgICBpZiAobm90YXRpb24ubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICAgICAgbm90ZS5ub3RhdGlvbiA9IG5vdGF0aW9uLmNoYXJBdCgwKSArIG5vdGF0aW9uLmNoYXJBdCgxKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBub3RlLm5vdGF0aW9uID0gbm90YXRpb24uY2hhckF0KDApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub3RlLm9jdGF2ZSA9IDQ7IC8vIGRlZmF1bHRcbiAgICAgICAgICAgIG5vdGUubm90YXRpb24gPSBub3RhdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub3RlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiB0dXJuIGEgbm90YXRpb24gaW50byBhIGZyZXF1ZW5jeVxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbm90YXRpb25cbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IGZyZXF1ZW5jeVxuICAgICAqL1xuICAgIGdldEZyZXF1ZW5jeUZvck5vdGF0aW9uKG50KSB7XG4gICAgICAgIHZhciBvY3RhdmUgPSA0O1xuXG4gICAgICAgIC8vIGRvZXMgbm90YXRpb24gaW5jbHVkZSB0aGUgb2N0YXZlP1xuICAgICAgICBpZiAoICFpc05hTiggcGFyc2VJbnQobnQuY2hhckF0KG50Lmxlbmd0aCAtMSkpICkpIHtcbiAgICAgICAgICAgIG9jdGF2ZSA9IHBhcnNlSW50KG50LmNoYXJBdChudC5sZW5ndGggLTEpKTtcbiAgICAgICAgICAgIG50ID0gbnQuc3Vic3RyKDAsIG50Lmxlbmd0aC0xKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNvcnJlY3QgYW55IGZsYXQvc2hhcnBzIHRoYXQgcmVzb2x2ZSB0byBhIG5hdHVyYWxcbiAgICAgICAgaWYgKHRoaXMub2RkTm90YXRpb25zLmluZGV4T2YobnQpICE9IC0xKSB7XG4gICAgICAgICAgICBudCA9IHRoaXMuY29ycmVjdGVkTm90YXRpb25zW3RoaXMub2RkTm90YXRpb25zLmluZGV4T2YobnQpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmcmVxO1xuICAgICAgICB2YXIgaW5keCA9IHRoaXMuc2hhcnBOb3RhdGlvbnMuaW5kZXhPZihudCk7XG5cbiAgICAgICAgaWYgKGluZHggPT0gLTEpIHtcbiAgICAgICAgICAgIGluZHggPSB0aGlzLmZsYXROb3RhdGlvbnMuaW5kZXhPZihudCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW5keCAhPSAtMSkge1xuICAgICAgICAgICAgaW5keCArPSAob2N0YXZlLTQpICogdGhpcy5zaGFycE5vdGF0aW9ucy5sZW5ndGg7XG4gICAgICAgICAgICBmcmVxID0gNDQwICogKE1hdGgucG93KDIsIGluZHgvMTIpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnJlcTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogZ2V0IG5vdGVzIGluIGEgc3BlY2lmaWMga2V5IHNpZ25hdHVyZVxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgKHJvb3Qgbm90ZSlcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlmIG1ham9yIGtleSBzaWduYXR1cmVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gb2N0YXZlIHRvIHVzZSAob3B0aW9uYWwpXG4gICAgICogQHJldHVybiB7QXJyYXkuPHN0cmluZz59IGtleXMgaW4ga2V5IHNpZ25hdHVyZVxuICAgICAqL1xuICAgIG5vdGVzSW5LZXlTaWduYXR1cmUoa2V5LCBtYWpvciwgb2N0YXZlKSB7XG4gICAgICAgIHZhciBub3Rlc1RvSW5kZXg7XG4gICAgICAgIHZhciBub3Rlc0luS2V5ID0gW107XG4gICAgICAgIHZhciBzdGFydFBvcztcblxuICAgICAgICAvLyBjb3JyZWN0IGFueSBmbGF0L3NoYXJwcyB0aGF0IHJlc29sdmUgdG8gYSBuYXR1cmFsXG4gICAgICAgIGlmICh0aGlzLm9kZE5vdGF0aW9ucy5pbmRleE9mKGtleSkgIT0gLTEpIHtcbiAgICAgICAgICAgIGtleSA9IHRoaXMuY29ycmVjdGVkTm90YXRpb25zW3RoaXMub2RkTm90YXRpb25zLmluZGV4T2Yoa2V5KV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmaW5kIHRoZSBjb3JyZWN0IG5vdGUgYW5kIG5vdGF0aW9uXG4gICAgICAgIGlmICh0aGlzLnNoYXJwTm90YXRpb25zLmluZGV4T2Yoa2V5KSAhPSAtMSkge1xuICAgICAgICAgICAgbm90ZXNUb0luZGV4ID0gdGhpcy5zaGFycE5vdGF0aW9ucy5zbGljZSgpO1xuICAgICAgICAgICAgc3RhcnRQb3MgPSB0aGlzLnNoYXJwTm90YXRpb25zLmluZGV4T2Yoa2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vdGVzVG9JbmRleCA9IHRoaXMuZmxhdE5vdGF0aW9ucy5zbGljZSgpO1xuICAgICAgICAgICAgc3RhcnRQb3MgPSB0aGlzLmZsYXROb3RhdGlvbnMuaW5kZXhPZihrZXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZG91YmxlIHRoZSBhcnJheSBsZW5ndGhcbiAgICAgICAgdmFyIGxlbiA9IG5vdGVzVG9JbmRleC5sZW5ndGg7XG4gICAgICAgIGZvciAoIHZhciBjID0gMDsgYyA8IGxlbjsgYysrICkge1xuICAgICAgICAgICAgaWYgKG9jdGF2ZSkge1xuICAgICAgICAgICAgICAgIG5vdGVzVG9JbmRleC5wdXNoKG5vdGVzVG9JbmRleFtjXSArIChvY3RhdmUrMSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBub3Rlc1RvSW5kZXgucHVzaChub3Rlc1RvSW5kZXhbY10pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWRkIG9jdGF2ZSBub3RhdGlvbiB0byB0aGUgZmlyc3QgaGFsZiBvZiB0aGUgYXJyYXlcbiAgICAgICAgaWYgKG9jdGF2ZSkge1xuICAgICAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCB0aGlzLmZsYXROb3RhdGlvbnMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgICAgICBub3Rlc1RvSW5kZXhbY10gKz0gb2N0YXZlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGNob3Agb2ZmIHRoZSBmcm9udCBvZiB0aGUgYXJyYXkgdG8gc3RhcnQgYXQgdGhlIHJvb3Qga2V5IGluIHRoZSBrZXkgc2lnbmF0dXJlXG4gICAgICAgIG5vdGVzVG9JbmRleC5zcGxpY2UoMCwgc3RhcnRQb3MpO1xuXG4gICAgICAgIC8vIGJ1aWxkIHRoZSBrZXkgc2lnbmF0dXJlXG4gICAgICAgIGlmIChtYWpvcikge1xuICAgICAgICAgICAgLy8gTUFKT1IgRnJvbSByb290OiB3aG9sZSBzdGVwLCB3aG9sZSBzdGVwLCBoYWxmIHN0ZXAsIHdob2xlIHN0ZXAsIHdob2xlIHN0ZXAsIHdob2xlIHN0ZXAsIGhhbGYgc3RlcFxuICAgICAgICAgICAgbm90ZXNJbktleS5wdXNoKCBub3Rlc1RvSW5kZXhbMF0gKTtcbiAgICAgICAgICAgIG5vdGVzSW5LZXkucHVzaCggbm90ZXNUb0luZGV4WzJdICk7XG4gICAgICAgICAgICBub3Rlc0luS2V5LnB1c2goIG5vdGVzVG9JbmRleFs0XSApO1xuICAgICAgICAgICAgbm90ZXNJbktleS5wdXNoKCBub3Rlc1RvSW5kZXhbNV0gKTtcbiAgICAgICAgICAgIG5vdGVzSW5LZXkucHVzaCggbm90ZXNUb0luZGV4WzddICk7XG4gICAgICAgICAgICBub3Rlc0luS2V5LnB1c2goIG5vdGVzVG9JbmRleFs5XSApO1xuICAgICAgICAgICAgbm90ZXNJbktleS5wdXNoKCBub3Rlc1RvSW5kZXhbMTFdICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBNSU5PUiBGcm9tIHJvb3Q6IHdob2xlIHN0ZXAsIGhhbGYgc3RlcCwgd2hvbGUgc3RlcCwgd2hvbGUgc3RlcCwgaGFsZiBzdGVwLCB3aG9sZSBzdGVwLCB3aG9sZSBzdGVwXG4gICAgICAgICAgICBub3Rlc0luS2V5LnB1c2goIG5vdGVzVG9JbmRleFswXSApO1xuICAgICAgICAgICAgbm90ZXNJbktleS5wdXNoKCBub3Rlc1RvSW5kZXhbMl0gKTtcbiAgICAgICAgICAgIG5vdGVzSW5LZXkucHVzaCggbm90ZXNUb0luZGV4WzNdICk7XG4gICAgICAgICAgICBub3Rlc0luS2V5LnB1c2goIG5vdGVzVG9JbmRleFs1XSApO1xuICAgICAgICAgICAgbm90ZXNJbktleS5wdXNoKCBub3Rlc1RvSW5kZXhbN10gKTtcbiAgICAgICAgICAgIG5vdGVzSW5LZXkucHVzaCggbm90ZXNUb0luZGV4WzhdICk7XG4gICAgICAgICAgICBub3Rlc0luS2V5LnB1c2goIG5vdGVzVG9JbmRleFsxMF0gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm90ZXNJbktleTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogcHJlZ2VuZXJhdGUgYSBrZXkgc2lnbmF0dXJlIGxvb2t1cCB0YWJsZSBmb3IgZXZlcnkgbm90ZVxuICAgICAqL1xuICAgIGdlbmVyYXRlS2V5U2lnbmF0dXJlTG9va3VwKCkge1xuICAgICAgICB2YXIga3lzID0gdGhpcy5zaGFycE5vdGF0aW9ucztcbiAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCBreXMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgIHRoaXMua2V5c1treXNbY11dID0gdGhpcy5ub3Rlc0luS2V5U2lnbmF0dXJlKGt5c1tjXSwgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLmtleXNba3lzW2NdICsgJ20nXSA9IHRoaXMubm90ZXNJbktleVNpZ25hdHVyZShreXNbY10sIGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cblxufTtcbiIsImltcG9ydCBCYXNlR3JvdXAgZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3RyaXZyL3NyYy9iYXNlZ3JvdXAuZXM2JztcbmltcG9ydCBTdHlsZSBmcm9tICcuLi90aGVtZWluZy9zdHlsZS5lczYnO1xuaW1wb3J0IFRvbmVQbGF5YmFjayBmcm9tICcuLi90b25lcGxheWJhY2suZXM2JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG9tZSBleHRlbmRzIEJhc2VHcm91cCB7XG4gICAgLyoqXG4gICAgICogb24gY3JlYXRlIHNjZW5lIChvciBlYXJsaWVzdCBwb3NzaWJsZSBvcHBvcnR1bml0eSlcbiAgICAgKiBAcGFyYW0gc2NlbmVcbiAgICAgKiBAcGFyYW0gY3VzdG9tXG4gICAgICovXG4gICAgb25DcmVhdGUoc2NlbmUsIGN1c3RvbSkge1xuICAgICAgICB0aGlzLl9tYXRlcmlhbCA9IHRoaXMuY3JlYXRlTWF0ZXJpYWwoKTtcbiAgICAgICAgdmFyIG1lc2ggPSBuZXcgVEhSRUUuTWVzaCh0aGlzLmNyZWF0ZUdlb21ldHJ5KCksIHRoaXMuX21hdGVyaWFsKTtcbiAgICAgICAgbWVzaC5wb3NpdGlvbi56ID0gNTtcbiAgICAgICAgdGhpcy5hZGQobWVzaCwgJ2RvbWUnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvbiByZW5kZXJcbiAgICAgKiBAcGFyYW0gc2NlbmVjb2xsZWN0aW9uXG4gICAgICogQHBhcmFtIG15Y29sbGVjdGlvblxuICAgICAqL1xuICAgIG9uUmVuZGVyKHNjZW5lY29sbGVjdGlvbiwgbXljb2xsZWN0aW9uKSB7XG4gICAgICAgIGlmIChUb25lUGxheWJhY2suaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICB0aGlzLmdyb3VwLnJvdGF0aW9uLnkgKz0gTWF0aC5QSSAvIDEwMjQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRFbWlzc2l2ZShjb2xvcikge1xuICAgICAgICB0aGlzLl9tYXRlcmlhbC5lbWlzc2l2ZS5zZXRIZXgoY29sb3IpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNyZWF0ZSBnbG9iZSBnZW9tZXRyeVxuICAgICAqIEByZXR1cm5zIHtUSFJFRS5JY29zYWhlZHJvbkdlb21ldHJ5fVxuICAgICAqL1xuICAgIGNyZWF0ZUdlb21ldHJ5KCkge1xuICAgICAgICByZXR1cm4gbmV3IFRIUkVFLkljb3NhaGVkcm9uR2VvbWV0cnkoIDgwMCwgMiApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNyZWF0ZSBnbG9iZSBtYXRlcmlhbFxuICAgICAqL1xuICAgIGNyZWF0ZU1hdGVyaWFsKCkge1xuICAgICAgICByZXR1cm4gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHtcbiAgICAgICAgICAgIGNvbG9yICAgICAgOiAgU3R5bGUuZG9tZS5jb2xvcixcbiAgICAgICAgICAgIGVtaXNzaXZlICAgOiAgU3R5bGUuZG9tZS5lbWlzc2l2ZSxcbiAgICAgICAgICAgIHNwZWN1bGFyICAgOiAgU3R5bGUuZG9tZS5zcGVjdWxhcixcbiAgICAgICAgICAgIHNpZGUgICAgICAgOiAgVEhSRUUuQmFja1NpZGUsXG4gICAgICAgICAgICBzaGluaW5lc3MgIDogIDEwLFxuICAgICAgICAgICAgc2hhZGluZyAgICA6ICBUSFJFRS5GbGF0U2hhZGluZyxcbiAgICAgICAgICAgIHRyYW5zcGFyZW50OiAxLFxuICAgICAgICAgICAgb3BhY2l0eSAgICA6IDFcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IEJhc2VHcm91cCBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvdHJpdnIvc3JjL2Jhc2Vncm91cC5lczYnO1xuaW1wb3J0IFN0eWxlIGZyb20gJy4uL3RoZW1laW5nL3N0eWxlLmVzNic7XG5pbXBvcnQgVXRpbHMgZnJvbSAnLi4vdXRpbHMuZXM2JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmxvYXRpbmdQYXJ0aWNsZXMgZXh0ZW5kcyBCYXNlR3JvdXAge1xuICAgIC8qKlxuICAgICAqIG9uIGNyZWF0ZSBzY2VuZVxuICAgICAqIEBwYXJhbSBzY2VuZVxuICAgICAqIEBwYXJhbSBjdXN0b21cbiAgICAgKi9cbiAgICBvbkNyZWF0ZShzY2VuZSwgY3VzdG9tKSB7XG4gICAgICAgIHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpO1xuICAgICAgICB2YXIgdGV4dHVyZUxvYWRlciA9IG5ldyBUSFJFRS5UZXh0dXJlTG9hZGVyKCk7XG4gICAgICAgIHZhciBzcHJpdGUgPSB0ZXh0dXJlTG9hZGVyLmxvYWQoU3R5bGUuZmxvYXRpbmdwYXJ0aWNsZXMuc3ByaXRlKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDEwMDAwOyBpICsrKSB7XG4gICAgICAgICAgICB2YXIgdmVydGV4ID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgICAgICAgICAgIHZlcnRleC54ID0gTWF0aC5yYW5kb20oKSAqIDIwMDAgLSA1MDA7XG4gICAgICAgICAgICB2ZXJ0ZXgueSA9IE1hdGgucmFuZG9tKCkgKiAyMDAwIC0gNTAwO1xuICAgICAgICAgICAgdmVydGV4LnogPSBNYXRoLnJhbmRvbSgpICogMjAwMCAtIDUwMDtcbiAgICAgICAgICAgIGdlb21ldHJ5LnZlcnRpY2VzLnB1c2goIHZlcnRleCApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5tYXRlcmlhbHMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpICsrICkge1xuICAgICAgICAgICAgdGhpcy5tYXRlcmlhbHNbaV0gPSBuZXcgVEhSRUUuUG9pbnRzTWF0ZXJpYWwoe1xuICAgICAgICAgICAgICAgIHNpemU6IE1hdGgucmFuZG9tKCkqMi4wICsgLjc1LFxuICAgICAgICAgICAgICAgIG1hcDogc3ByaXRlLFxuICAgICAgICAgICAgICAgIGJsZW5kaW5nOiBUSFJFRS5BZGRpdGl2ZUJsZW5kaW5nLFxuICAgICAgICAgICAgICAgIGRlcHRoVGVzdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0cmFuc3BhcmVudCA6IHRydWUgfSk7XG4gICAgICAgICAgICB2YXIgcGFydGljbGVzID0gbmV3IFRIUkVFLlBvaW50cyggZ2VvbWV0cnksIHRoaXMubWF0ZXJpYWxzW2ldICk7XG5cbiAgICAgICAgICAgIHBhcnRpY2xlcy5yb3RhdGlvbi54ID0gTWF0aC5yYW5kb20oKSAqIDY7XG4gICAgICAgICAgICBwYXJ0aWNsZXMucm90YXRpb24ueSA9IE1hdGgucmFuZG9tKCkgKiA2O1xuICAgICAgICAgICAgcGFydGljbGVzLnJvdGF0aW9uLnogPSBNYXRoLnJhbmRvbSgpICogNjtcbiAgICAgICAgICAgIHBhcnRpY2xlcy5yZW5kZXJPcmRlciA9IDE7XG4gICAgICAgICAgICB0aGlzLmFkZChwYXJ0aWNsZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRDb2xvcigpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNldCBkcnVtIGhpdC90cmlnZ2VyIGNvbG9yXG4gICAgICogQHBhcmFtIGhleFxuICAgICAqL1xuICAgIHNldENvbG9yKGhleCkge1xuICAgICAgICBpZiAoIWhleCkge1xuICAgICAgICAgICAgdGhpcy5fY29sb3IgPSBTdHlsZS5mbG9hdGluZ3BhcnRpY2xlcy5jb2xvcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbG9yID0gaGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCB0aGlzLm1hdGVyaWFscy5sZW5ndGg7IGMrKykge1xuICAgICAgICAgICAgdGhpcy5tYXRlcmlhbHNbY10uY29sb3Iuc2V0KHRoaXMuX2NvbG9yKTtcbiAgICAgICAgfVxuICAgICB9XG5cbiAgICBvblJlbmRlcih0aW1lKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgKyspIHtcbiAgICAgICAgICAgIHZhciBvYmplY3QgPSB0aGlzLmNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIFRIUkVFLlBvaW50cykge1xuICAgICAgICAgICAgICAgIG9iamVjdC5yb3RhdGlvbi55ICs9IC4wMDE7XG4gICAgICAgICAgICAgICAgb2JqZWN0LnJvdGF0aW9uLnogKz0gLjAwMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufVxuIiwiaW1wb3J0IEJhc2VHcm91cCBmcm9tICcuLi8uLi8uLi9ub2RlX21vZHVsZXMvdHJpdnIvc3JjL2Jhc2Vncm91cC5lczYnO1xuaW1wb3J0IElucHV0IGZyb20gJy4uLy4uL2lucHV0LmVzNic7XG5pbXBvcnQgTm90ZSBmcm9tICcuLi8uLi9tdXNpY3RoZW9yeS9ub3RlLmVzNic7XG5pbXBvcnQgU3R5bGUgZnJvbSAnLi4vLi4vdGhlbWVpbmcvc3R5bGUuZXM2JztcbmltcG9ydCBVdGlscyBmcm9tICcuLi8uLi91dGlscy5lczYnO1xuaW1wb3J0IFRvbmVQbGF5YmFjayBmcm9tICcuLi8uLi90b25lcGxheWJhY2suZXM2JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUtleWJvYXJkIGV4dGVuZHMgQmFzZUdyb3VwIHtcbiAgICBvbkluaXRpYWxpemUocGFyYW1zKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBob3cgbXVjaCByb3RhdGlvbiBvY2N1cnMgb24ga2V5cHJlc3NcbiAgICAgICAgICogQHR5cGUge251bWJlcn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3JvdGF0aW9uT25QcmVzcyA9IE1hdGguUEkvMTY7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIG51bWJlciBvZiBvY3RhdmVzXG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9udW1PY3RhdmVzID0gcGFyYW1zLm9jdGF2ZXMgPyBwYXJhbXMub2N0YXZlcyA6IDI7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIHN0YXJ0aW5nIG9jdGF2ZSAodG8gYmV0dGVyIG1hdGNoIHdpdGggTUlESSBpbnB1dClcbiAgICAgICAgICogQHR5cGUge251bWJlcn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3N0YXJ0aW5nT2N0YXZlID0gcGFyYW1zLnN0YXJ0b2N0YXZlID8gcGFyYW1zLnN0YXJ0b2N0YXZlIDogMDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogc3RhcnRpbmcgbm90ZSBvbiBrZXlib2FyZFxuICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fc3RhcnRpbmdOb3RlID0gJ0MnO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBlbmRpbmcgbm90ZSBvbiBrZXlib2FyZFxuICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fZW5kaW5nTm90ZSA9ICdDJztcblxuICAgICAgICAvKipcbiAgICAgICAgICoga2V5IHZpc3VhbHNcbiAgICAgICAgICogQHR5cGUge0FycmF5fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fa2V5cyA9IFtdO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBtaWRpIGNoYW5uZWxzIHVzZWRcbiAgICAgICAgICogQHR5cGUge0FycmF5fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fbWlkaWNoYW5uZWxzID0gW107XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIHN0YXJ0aW5nIGluZGV4IGF0IHdoaWNoIHBvaW50IHRvIGFsbG9jYXRlIE1JREkgY2hhbm5lbHNcbiAgICAgICAgICogQHR5cGUge251bWJlcn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX21pZGlDaGFubmVsU3RhcnRJbmRleCA9IDExO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBzdWdnZXN0ZWQga2V5cyBmcm9tIGtleSBzaWduYXR1cmUgcHJlZGljdGlvblxuICAgICAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnN1Z2dlc3RlZEtleXMgPSBbXTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogb24gY3JlYXRlIHNjZW5lIChvciBlYXJsaWVzdCBwb3NzaWJsZSBvcHBvcnR1bml0eSlcbiAgICAgKiBAcGFyYW0gc2NlbmVcbiAgICAgKiBAcGFyYW0gY3VzdG9tXG4gICAgICovXG4gICAgb25DcmVhdGUoc2NlbmUsIGN1c3RvbSkge1xuICAgICAgICAvL1RvbmVQbGF5YmFjay5hZGRFdmVudExpc3RlbmVyKCdtaWRpZGF0YScsIGRhdGEgPT4gdGhpcy5vblNvbmdEYXRhKGRhdGEpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvbiByZW5kZXIgc2NlbmVcbiAgICAgKiBAcGFyYW0gc2NlbmVcbiAgICAgKiBAcGFyYW0gY3VzdG9tXG4gICAgICovXG4gICAgb25SZW5kZXIoc2NlbmUsIGN1c3RvbSkge1xuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IHRoaXMuX2tleXMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9rZXlzW2NdLmNvbG9ydHdlZW4uYW5pbWF0aW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fa2V5c1tjXS5vYmplY3QubWF0ZXJpYWwuY29sb3Iuc2V0UkdCKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9rZXlzW2NdLmNvbG9ydHdlZW4ucmNvbG9yLzEwMCxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fa2V5c1tjXS5jb2xvcnR3ZWVuLmdjb2xvci8xMDAsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2tleXNbY10uY29sb3J0d2Vlbi5iY29sb3IvMTAwICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvbiBhc3NldHMgbG9hZGVkXG4gICAgICogQHBhcmFtIGdlb21ldHJ5XG4gICAgICovXG4gICAgb25Bc3NldHNMb2FkZWQoZ2VvbWV0cnkpIHtcbiAgICAgICAgdmFyIG1hdCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCgge1xuICAgICAgICAgICAgbWV0YWxuZXNzOiAwLjcsXG4gICAgICAgICAgICByb3VnaG5lc3M6IDEsXG4gICAgICAgICAgICBzaWRlOiBUSFJFRS5Gcm9udFNpZGUsXG4gICAgICAgICAgICBzaGFkaW5nOiBUSFJFRS5GbGF0U2hhZGluZ1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zZXR1cFNjZW5lKGdlb21ldHJ5LCBtYXQpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBkeW5hbWljYWxseSBnZW5lcmF0ZSBjaXJjbGUgb2Yga2V5c1xuICAgICAqIEBwYXJhbSBnZW9tZXRyeVxuICAgICAqIEBwYXJhbSBtYXRlcmlhbFxuICAgICAqL1xuICAgIHNldHVwU2NlbmUoZ2VvbWV0cnksIG1hdGVyaWFsKSB7XG4gICAgICAgIHZhciBzdGFydE9mZnNldCA9IE5vdGUuaW5kZXhPZk5vdGF0aW9uKHRoaXMuX3N0YXJ0aW5nTm90ZSk7XG4gICAgICAgIHZhciBlbmRPZmZzZXQgPSBOb3RlLmluZGV4T2ZOb3RhdGlvbih0aGlzLl9lbmRpbmdOb3RlKTtcbiAgICAgICAgdmFyIG50aW5kZXggPSAwO1xuICAgICAgICB2YXIgb2N0YXZlID0gMDtcbiAgICAgICAgdmFyIHRyYW5zZm9ybVBvc2l0aW9uID0gMDtcbiAgICAgICAgdmFyIG5vdGVzID0gW107XG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgdGhpcy5fbnVtT2N0YXZlczsgYysrKSB7XG4gICAgICAgICAgICBub3RlcyA9IG5vdGVzLmNvbmNhdChOb3RlLnNoYXJwTm90YXRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBub3RlcyA9IG5vdGVzLmNvbmNhdChOb3RlLnNoYXJwTm90YXRpb25zLnNsaWNlKDAsIGVuZE9mZnNldCsxKSk7XG5cbiAgICAgICAgZm9yICh2YXIgZCA9IDA7IGQgPCBub3Rlcy5sZW5ndGg7IGQrKykge1xuICAgICAgICAgICAgaWYgKGQgPj0gc3RhcnRPZmZzZXQpIHtcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm1Qb3NpdGlvbiA9IHRoaXMuYWRkS2V5KHRyYW5zZm9ybVBvc2l0aW9uLCBub3Rlc1tkXS5pbmRleE9mKCcjJykgPT09IC0xLCBub3Rlc1tkXSwgb2N0YXZlLCBnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbnRpbmRleCArKztcbiAgICAgICAgICAgIGlmIChudGluZGV4ID49IE5vdGUuc2hhcnBOb3RhdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgbnRpbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgb2N0YXZlICsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm1Qb3NpdGlvbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvbiBpbmFjdGl2aXR5IChmYWRlIGF3YXkga2V5cyBhbmQgY2xlYXIga2V5IHNpZylcbiAgICAgKi9cbiAgICByZXNldEtleXMoKSB7XG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgdGhpcy5fa2V5cy5sZW5ndGg7IGMrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2tleXNbY10uc3VnZ2VzdGVkKSB7XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRDb2xvciA9IHRoaXMuX2tleXNbY10ub2JqZWN0Lm1hdGVyaWFsLmNvbG9yLmdldEhleCgpO1xuICAgICAgICAgICAgICAgIFV0aWxzLmNvcHlQcm9wc1RvKHRoaXMuX2tleXNbY10uY29sb3J0d2VlbiwgVXRpbHMuZGVjVG9SR0IoY3VycmVudENvbG9yLCAxMDApLCAnY29sb3InKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9rZXlzW2NdLmNvbG9ydHdlZW4uc3RlcHMgPSAxO1xuICAgICAgICAgICAgICAgIHRoaXMuX2tleXNbY10uY29sb3J0d2Vlbi5hbmltYXRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBVdGlscy5jb3B5UHJvcHNUbyh7fSwgVXRpbHMuZGVjVG9SR0IoU3R5bGUua2V5cy5ub3JtYWxbdGhpcy5fa2V5c1tjXS50eXBlXS5jb2xvciwgMTAwKSwgJ2NvbG9yJyk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LnN0ZXBzID0gMDtcbiAgICAgICAgICAgICAgICBjcmVhdGVqcy5Ud2Vlbi5nZXQodGhpcy5fa2V5c1tjXS5jb2xvcnR3ZWVuKVxuICAgICAgICAgICAgICAgICAgICAudG8odGFyZ2V0LCAyMDAwKVxuICAgICAgICAgICAgICAgICAgICAud2FpdCgxMDApIC8vIHdhaXQgYSBmZXcgdGlja3MsIG9yIHRoZSByZW5kZXIgY3ljbGUgd29uJ3QgcGljayB1cCB0aGUgY2hhbmdlcyB3aXRoIHRoZSBmbGFnXG4gICAgICAgICAgICAgICAgICAgIC5jYWxsKCBmdW5jdGlvbigpIHsgdGhpcy5hbmltYXRpbmcgPSBmYWxzZTsgfSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY2hhbmdlIGtleSBzaWduYXR1cmUgdG8gbm90YXRpb24gZ2l2ZW5cbiAgICAgKiBAcGFyYW0gbm90YXRpb25cbiAgICAgKi9cbiAgICBjaGFuZ2VLZXlTaWduYXR1cmUobm90YXRpb24pIHtcbiAgICAgICAgdmFyIGM7XG4gICAgICAgIGZvciAoYyA9IDA7IGMgPCB0aGlzLnN1Z2dlc3RlZEtleXMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlS2V5U3VnZ2VzdGlvbih0aGlzLnN1Z2dlc3RlZEtleXNbY10sIG5vdGF0aW9uLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdWdnZXN0ZWRLZXlzID0gTm90ZS5rZXlzW25vdGF0aW9uXTtcblxuICAgICAgICBmb3IgKGMgPSAwOyBjIDwgdGhpcy5zdWdnZXN0ZWRLZXlzLmxlbmd0aDsgYysrKSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZUtleVN1Z2dlc3Rpb24odGhpcy5zdWdnZXN0ZWRLZXlzW2NdLCBub3RhdGlvbiwgdHJ1ZSwgYyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0b2dnbGUga2V5IHByZXNzZWRcbiAgICAgKiBAcGFyYW0ga2V5XG4gICAgICovXG4gICAgdG9nZ2xlS2V5UHJlc3NlZChrKSB7XG4gICAgICAgIHZhciBrZXkgPSB0aGlzLmZpbmRLZXlPYmplY3RGb3JOb3RhdGlvbihrLm5vdGF0aW9uLCBrLm9jdGF2ZSk7XG4gICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgIGlmIChrLnZlbG9jaXR5ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgVG9uZVBsYXliYWNrLm5vdGVPZmYoay5ub3RhdGlvbiArIGsub2N0YXZlLCBrZXkubWlkaWNoYW5uZWwsIDEvOCk7XG4gICAgICAgICAgICAgICAgdmFyIGNoYW5uZWxpbmRleCA9IHRoaXMuX21pZGljaGFubmVscy5pbmRleE9mKGtleS5taWRpY2hhbm5lbCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWlkaWNoYW5uZWxzLnNwbGljZShjaGFubmVsaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9pbmFjdGl2aXR5VGltZXIpO1xuICAgICAgICAgICAgICAgIGtleS5vYmplY3Qucm90YXRpb24uc2V0KGtleS5vcmlnaW5hbFJvdGF0aW9uLngsIGtleS5vcmlnaW5hbFJvdGF0aW9uLnksIGtleS5vcmlnaW5hbFJvdGF0aW9uLnopO1xuICAgICAgICAgICAgICAgIGtleS5jdXJyZW50Um90YXRpb24gPSAwO1xuICAgICAgICAgICAgICAgIGtleS5taWRpY2hhbm5lbCA9IC0xO1xuICAgICAgICAgICAgICAgIGtleS5kb3duID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX21pZGljaGFubmVscyA9IHRoaXMuX21pZGljaGFubmVscy5zb3J0KCk7XG4gICAgICAgICAgICAgICAgdmFyIG1pZGljaGFubmVsID0gdGhpcy5fbWlkaWNoYW5uZWxzW3RoaXMuX21pZGljaGFubmVscy5sZW5ndGgtMV0gKyAxO1xuICAgICAgICAgICAgICAgIGlmICghbWlkaWNoYW5uZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgbWlkaWNoYW5uZWwgPSB0aGlzLl9taWRpQ2hhbm5lbFN0YXJ0SW5kZXg7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgVG9uZVBsYXliYWNrLm5vdGVPbihUb25lUGxheWJhY2suUElBTk8sIGsubm90YXRpb24gKyBrLm9jdGF2ZSwgbWlkaWNoYW5uZWwsIG51bGwsIGsudmVsb2NpdHkgKiAxMDAgKTtcbiAgICAgICAgICAgICAgICBrZXkuY3VycmVudFJvdGF0aW9uID0gay52ZWxvY2l0eSAqIHRoaXMuX3JvdGF0aW9uT25QcmVzcztcbiAgICAgICAgICAgICAgICBrZXkub2JqZWN0LnJvdGF0ZVgoa2V5LmN1cnJlbnRSb3RhdGlvbik7XG4gICAgICAgICAgICAgICAga2V5Lm1pZGljaGFubmVsID0gbWlkaWNoYW5uZWw7XG4gICAgICAgICAgICAgICAga2V5LmRvd24gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdG9nZ2xlIGtleSBzdWdnZXN0aW9uXG4gICAgICogQHBhcmFtIG5vdGF0aW9uXG4gICAgICogQHBhcmFtIGtleXNpZ25vdGF0aW9uXG4gICAgICogQHBhcmFtIHRvZ2dsZVxuICAgICAqL1xuICAgIHRvZ2dsZUtleVN1Z2dlc3Rpb24obm90YXRpb24sIGtleXNpZ25vdGF0aW9uLCB0b2dnbGUpIHtcbiAgICAgICAgdmFyIG50SW5kZXggPSBOb3RlLmtleXNba2V5c2lnbm90YXRpb25dLmluZGV4T2Yobm90YXRpb24pO1xuICAgICAgICBpZiAoa2V5c2lnbm90YXRpb24uY2hhckF0KGtleXNpZ25vdGF0aW9uLmxlbmd0aC0xKSA9PT0gJ20nKSB7XG4gICAgICAgICAgICBrZXlzaWdub3RhdGlvbiA9IGtleXNpZ25vdGF0aW9uLnNsaWNlKDAsIGtleXNpZ25vdGF0aW9uLmxlbmd0aC0xKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIga2V5U2lnSW5kZXggPSBOb3RlLmluZGV4T2ZOb3RhdGlvbihrZXlzaWdub3RhdGlvbik7XG4gICAgICAgIHZhciByb290Y2xySFMgPSBTdHlsZS5jb2xvcndoZWVsSGlnaFNhdHVyYXRpb25ba2V5U2lnSW5kZXhdO1xuICAgICAgICB2YXIgcm9vdGNsckxTID0gU3R5bGUuY29sb3J3aGVlbExvd1NhdHVyYXRpb25ba2V5U2lnSW5kZXhdO1xuXG4gICAgICAgIHZhciBrZXlzID0gdGhpcy5maW5kS2V5T2JqZWN0c0Zvck5vdGF0aW9uKG5vdGF0aW9uKTtcbiAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCBrZXlzLmxlbmd0aDsgYysrKSB7XG4gICAgICAgICAgICBpZiAodG9nZ2xlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNscjtcbiAgICAgICAgICAgICAgICBpZiAobnRJbmRleCA9PT0gMCB8fCBudEluZGV4ID09PSAyIHx8IG50SW5kZXggPT09IDQgfHwgbnRJbmRleCA9PT0gNikge1xuICAgICAgICAgICAgICAgICAgICBjbHIgPSBTdHlsZS5rZXlzLnN0cm9uZ2x5U3VnZ2VzdGVkW2tleXNbY10udHlwZV07XG4gICAgICAgICAgICAgICAgICAgIGtleXNbY10uc3Ryb25nbHlTdWdnZXN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBrZXlzW2NdLnN1Z2dlc3RlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGtleXNbY10ub2JqZWN0Lm1hdGVyaWFsLmNvbG9yLnNldEhleChyb290Y2xySFMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNsciA9IFN0eWxlLmtleXMuc3VnZ2VzdGVkW2tleXNbY10udHlwZV07XG4gICAgICAgICAgICAgICAgICAgIGtleXNbY10uc3VnZ2VzdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAga2V5c1tjXS5zdHJvbmdseVN1Z2dlc3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBrZXlzW2NdLm9iamVjdC5tYXRlcmlhbC5jb2xvci5zZXRIZXgocm9vdGNsckxTKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGtleXNbY10ub2JqZWN0Lm1hdGVyaWFsLmNvbG9yLnNldEhleChTdHlsZS5rZXlzLm5vcm1hbFtrZXlzW2NdLnR5cGVdLmNvbG9yKTtcbiAgICAgICAgICAgICAgICAvL2tleXNbY10ub2JqZWN0Lm1hdGVyaWFsLmVtaXNzaXZlLnNldEhleChTdHlsZS5rZXlzLm5vcm1hbFtrZXlzW2NdLnR5cGVdLmVtaXNzaXZlKTtcbiAgICAgICAgICAgICAgICBrZXlzW2NdLnN1Z2dlc3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGtleXNbY10uc3Ryb25nbHlTdWdnZXN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ga2V5cztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjcmVhdGUgd2hpdGUga2V5IGdlb21ldHJ5XG4gICAgICogQHJldHVybnMge1RIUkVFLk1lc2h9XG4gICAgICovXG4gICAgY3JlYXRlV2hpdGVLZXkoZ2VvbWV0cnksIG1hdGVyaWFsKSB7XG4gICAgICAgIHZhciBrZXlnZW9tID0gZ2VvbWV0cnkuY2xvbmUoKTtcbiAgICAgICAgdmFyIG1hdCA9IG1hdGVyaWFsLmNsb25lKCk7XG4gICAgICAgIG1hdC5jb2xvci5zZXRIZXgoU3R5bGUua2V5cy5ub3JtYWwud2hpdGUuY29sb3IpO1xuICAgICAgICBtYXQuZW1pc3NpdmUuc2V0SGV4KFN0eWxlLmtleXMubm9ybWFsLndoaXRlLmVtaXNzaXZlKTtcbiAgICAgICAga2V5Z2VvbS50cmFuc2xhdGUoIDAsIC0xMCwgMCApO1xuICAgICAgICB2YXIga2V5ID0gbmV3IFRIUkVFLk1lc2goIGtleWdlb20sIG1hdCk7XG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY3JlYXRlIGJsYWNrIGtleSBnZW9tZXRyeVxuICAgICAqIEByZXR1cm5zIHtUSFJFRS5NZXNofVxuICAgICAqL1xuICAgIGNyZWF0ZUJsYWNrS2V5KGdlb21ldHJ5LCBtYXRlcmlhbCkge1xuICAgICAgICB2YXIga2V5Z2VvbSA9IGdlb21ldHJ5LmNsb25lKCk7XG4gICAgICAgIHZhciBtYXQgPSBtYXRlcmlhbC5jbG9uZSgpO1xuICAgICAgICBtYXQuY29sb3Iuc2V0SGV4KFN0eWxlLmtleXMubm9ybWFsLmJsYWNrLmNvbG9yKTtcbiAgICAgICAgbWF0LmVtaXNzaXZlLnNldEhleChTdHlsZS5rZXlzLm5vcm1hbC5ibGFjay5lbWlzc2l2ZSk7XG4gICAgICAgIGtleWdlb20udHJhbnNsYXRlKCAwLCAtMjUsIDAgKTtcbiAgICAgICAga2V5Z2VvbS5zY2FsZSgxLCAuNSwgMSk7XG4gICAgICAgIHZhciBrZXkgPSBuZXcgVEhSRUUuTWVzaCgga2V5Z2VvbSwgbWF0KTtcbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjcmVhdGUgYW5kIGFkZCBhIGtleVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0cmFuc2Zvcm1Qb3NpdGlvblxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gd2hpdGVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbm90YXRpb25cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb2N0YXZlXG4gICAgICogQHBhcmFtIHtUSFJFRS5HZW9tZXRyeX0gZ2VvbWV0cnlcbiAgICAgKiBAcGFyYW0ge1RIUkVFLk1hdGVyaWFsfSBtYXRlcmlhbFxuICAgICAqIEByZXR1cm4ge051bWJlcn0gdHJhbnNmb3JtIHBvc2l0aW9uXG4gICAgICovXG4gICAgYWRkS2V5KHRyYW5zZm9ybVBvc2l0aW9uLCB3aGl0ZSwgbm90YXRpb24sIG9jdGF2ZSwgZ2VvbWV0cnksIG1hdGVyaWFsKSB7XG4gICAgICAgIHZhciBrZXksIGNvbG9yLCByb3RhdGlvbjtcbiAgICAgICAgaWYgKHdoaXRlKSB7XG4gICAgICAgICAgICBjb2xvciA9ICd3aGl0ZSc7XG4gICAgICAgICAgICBrZXkgPSB0aGlzLmNyZWF0ZVdoaXRlS2V5KGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb2xvciA9ICdibGFjayc7XG4gICAgICAgICAgICBrZXkgPSB0aGlzLmNyZWF0ZUJsYWNrS2V5KGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgICAgIH1cblxuICAgICAgICB0cmFuc2Zvcm1Qb3NpdGlvbiA9IHRoaXMuYXBwbHlLZXlUcmFuc2Zvcm0oa2V5LCB0cmFuc2Zvcm1Qb3NpdGlvbiwgd2hpdGUpO1xuICAgICAgICB0aGlzLl9rZXlzLnB1c2goe1xuICAgICAgICAgICAgdHlwZTogY29sb3IsXG4gICAgICAgICAgICBvYmplY3Q6IGtleSxcbiAgICAgICAgICAgIG9jdGF2ZTogb2N0YXZlICsgdGhpcy5fc3RhcnRpbmdPY3RhdmUsXG4gICAgICAgICAgICBjb2xvcnR3ZWVuOiB7fSxcbiAgICAgICAgICAgIG5vdGF0aW9uOiBub3RhdGlvbixcbiAgICAgICAgICAgIG9yaWdpbmFsUm90YXRpb246IHtcbiAgICAgICAgICAgICAgICB4OiBrZXkucm90YXRpb24ueCxcbiAgICAgICAgICAgICAgICB5OiBrZXkucm90YXRpb24ueSxcbiAgICAgICAgICAgICAgICB6OiBrZXkucm90YXRpb24ueiB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuYWRkKGtleSwna2V5XycgKyBub3RhdGlvbik7XG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm1Qb3NpdGlvbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhcHBseSBrZXkgdHJhbnNmb3JtXG4gICAgICogQHBhcmFtIHtUSFJFRS5NZXNofSBrZXltZXNoXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHRyYW5zZm9ybVBvc2l0aW9uXG4gICAgICogQHBhcmFtIHtCb29sZWFufSB3aGl0ZWtleVxuICAgICAqL1xuICAgIGFwcGx5S2V5VHJhbnNmb3JtKGtleW1lc2gsIHRyYW5zZm9ybVBvc2l0aW9uLCB3aGl0ZWtleSkge31cblxuICAgIC8qKlxuICAgICAqIGZpbmQgdGhlIGtleSBmb3IgYSBzcGVjaWZpYyBub3RhdGlvblxuICAgICAqIEBwYXJhbSBub3RhdGlvblxuICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgKi9cbiAgICBmaW5kS2V5T2JqZWN0c0Zvck5vdGF0aW9uKG5vdGF0aW9uKSB7XG4gICAgICAgIHZhciBrZXlzID0gW107XG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgdGhpcy5fa2V5cy5sZW5ndGg7IGMrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2tleXNbY10ubm90YXRpb24gPT09IG5vdGF0aW9uKSB7XG4gICAgICAgICAgICAgICAga2V5cy5wdXNoKHRoaXMuX2tleXNbY10pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBrZXlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGZpbmQgc3BlY2lmaWMga2V5IG9iamVjdCBmb3Igbm90YXRpb24gYW5kIG9jdGF2ZVxuICAgICAqIEBwYXJhbSBub3RhdGlvblxuICAgICAqIEBwYXJhbSBvY3RhdmVcbiAgICAgKi9cbiAgICBmaW5kS2V5T2JqZWN0Rm9yTm90YXRpb24obm90YXRpb24sIG9jdGF2ZSkge1xuICAgICAgICB2YXIgbm90YXRpb25PZmZzZXQgPSBOb3RlLmluZGV4T2ZOb3RhdGlvbih0aGlzLl9zdGFydGluZ05vdGUpO1xuICAgICAgICBub3RhdGlvbk9mZnNldCArPSB0aGlzLl9zdGFydGluZ09jdGF2ZSAqIE5vdGUuc2hhcnBOb3RhdGlvbnMubGVuZ3RoO1xuICAgICAgICB2YXIgaW5keCA9IG9jdGF2ZSAqIE5vdGUuc2hhcnBOb3RhdGlvbnMubGVuZ3RoICsgTm90ZS5zaGFycE5vdGF0aW9ucy5pbmRleE9mKG5vdGF0aW9uKSAtIG5vdGF0aW9uT2Zmc2V0O1xuICAgICAgICByZXR1cm4gdGhpcy5fa2V5c1tpbmR4XTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvbiBzb25nIGRhdGFcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqL1xuICAgIG9uU29uZ0RhdGEoZGF0YSkge1xuICAgICAgICB2YXIgbm90YXRpb24gPSBOb3RlLk1JREl0b05vdGF0aW9uKGRhdGEubm90ZSk7XG4gICAgICAgIHZhciBrZXkgPSB0aGlzLmZpbmRLZXlPYmplY3RzRm9yTm90YXRpb24obm90YXRpb24pO1xuICAgICAgICB0aGlzLnRvZ2dsZUtleVByZXNzZWQoa2V5WzBdLCBkYXRhLnZlbG9jaXR5IC8gMTI3KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgQmFzZUtleWJvYXJkIGZyb20gJy4vYmFzZWtleWJvYXJkLmVzNic7XG5pbXBvcnQgSW5wdXQgZnJvbSAnLi4vLi4vaW5wdXQuZXM2JztcbmltcG9ydCBOb3RlIGZyb20gJy4uLy4uL211c2ljdGhlb3J5L25vdGUuZXM2JztcbmltcG9ydCBTdHlsZSBmcm9tICcuLi8uLi90aGVtZWluZy9zdHlsZS5lczYnO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4uLy4uL3V0aWxzLmVzNic7XG5pbXBvcnQgVG9uZVBsYXliYWNrIGZyb20gJy4uLy4uL3RvbmVwbGF5YmFjay5lczYnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaXJjdWxhcktleWJvYXJkIGV4dGVuZHMgQmFzZUtleWJvYXJkIHtcbiAgICAvKipcbiAgICAgKiBhcHBseSBrZXkgdHJhbnNmb3JtXG4gICAgICogQHBhcmFtIHtUSFJFRS5NZXNofSBrZXltZXNoXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc2l0aW9uIGluIGtleWJvYXJkXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGtleWluZGV4XG4gICAgICogQHBhcmFtIHtCb29sZWFufSB3aGl0ZWtleVxuICAgICAqL1xuICAgIGFwcGx5S2V5VHJhbnNmb3JtKGtleW1lc2gsIHRyYW5zZm9ybVBvc2l0aW9uLCB3aGl0ZWtleSkge1xuICAgICAgICB2YXIgcm90YXRlID0gMDtcbiAgICAgICAgdmFyIGV4dHJhUm90YXRlID0gMDtcbiAgICAgICAgaWYgKHdoaXRla2V5KSB7XG4gICAgICAgICAgICByb3RhdGUgPSAoTWF0aC5QSSAqIDIpIC8gMTQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBleHRyYVJvdGF0ZSA9IChNYXRoLlBJICogMikgLyAyODtcbiAgICAgICAgfVxuICAgICAgICBrZXltZXNoLnJvdGF0aW9uLnogPSB0cmFuc2Zvcm1Qb3NpdGlvbiArIHJvdGF0ZSArIGV4dHJhUm90YXRlO1xuXG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm1Qb3NpdGlvbiArIHJvdGF0ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzZXR1cCBzY2VuZVxuICAgICAqIEBwYXJhbSBnZW9tZXRyeVxuICAgICAqIEBwYXJhbSBtYXRlcmlhbFxuICAgICAqL1xuICAgIHNldHVwU2NlbmUoZ2VvbWV0cnksIG1hdGVyaWFsKSB7XG4gICAgICAgIHN1cGVyLnNldHVwU2NlbmUoZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgICAgdGhpcy5ncm91cC5wb3NpdGlvbi56ID0gLTQwMDtcbiAgICAgICAgdGhpcy5ncm91cC5zY2FsZS5zZXQoOCwgOCwgOCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IEJhc2VLZXlib2FyZCBmcm9tICcuL2Jhc2VrZXlib2FyZC5lczYnO1xuaW1wb3J0IElucHV0IGZyb20gJy4uLy4uL2lucHV0LmVzNic7XG5pbXBvcnQgTm90ZSBmcm9tICcuLi8uLi9tdXNpY3RoZW9yeS9ub3RlLmVzNic7XG5pbXBvcnQgU3R5bGUgZnJvbSAnLi4vLi4vdGhlbWVpbmcvc3R5bGUuZXM2JztcbmltcG9ydCBVdGlscyBmcm9tICcuLi8uLi91dGlscy5lczYnO1xuaW1wb3J0IFRvbmVQbGF5YmFjayBmcm9tICcuLi8uLi90b25lcGxheWJhY2suZXM2JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhZGl0aW9uYWxLZXlib2FyZCBleHRlbmRzIEJhc2VLZXlib2FyZCB7XG4gICAgb25Jbml0aWFsaXplKHBhcmFtcykge1xuICAgICAgICBzdXBlci5vbkluaXRpYWxpemUocGFyYW1zKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogaG93IG11Y2ggcm90YXRpb24gb2NjdXJzIG9uIGtleXByZXNzXG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9yb3RhdGlvbk9uUHJlc3MgPSBNYXRoLlBJLzY0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG9uIHJlbmRlciBzY2VuZVxuICAgICAqIEBwYXJhbSBzY2VuZVxuICAgICAqIEBwYXJhbSBjdXN0b21cbiAgICAgKi9cbiAgICBvblJlbmRlcihzY2VuZSwgY3VzdG9tKSB7XG4gICAgICAgIHN1cGVyLm9uUmVuZGVyKHNjZW5lLCBjdXN0b20pO1xuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IHRoaXMuX2tleXMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9rZXlzW2NdLmNvbG9ydHdlZW4uYW5pbWF0aW5nKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNjYWxlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9rZXlzW2NdLnN0cm9uZ2x5U3VnZ2VzdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjYWxlID0gMC4wMSArIHRoaXMuX2tleXNbY10uY29sb3J0d2Vlbi5zdGVwcyAqIDEuMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzY2FsZSA9IDAuMDEgKyB0aGlzLl9rZXlzW2NdLmNvbG9ydHdlZW4uc3RlcHMgKiAwLjU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX2tleXNbY10ubWFya2VyLnNjYWxlLnNldChzY2FsZSwgc2NhbGUsIHNjYWxlKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9rZXlzW2NdLm1hcmtlci5tYXRlcmlhbC5jb2xvci5zZXRSR0IoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2tleXNbY10uY29sb3J0d2Vlbi5yY29sb3IvMTAwLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9rZXlzW2NdLmNvbG9ydHdlZW4uZ2NvbG9yLzEwMCxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fa2V5c1tjXS5jb2xvcnR3ZWVuLmJjb2xvci8xMDAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNyZWF0ZSBhbmQgYWRkIGEga2V5XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHRyYW5zZm9ybVBvc2l0aW9uXG4gICAgICogQHBhcmFtIHtCb29sZWFufSB3aGl0ZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBub3RhdGlvblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBvY3RhdmVcbiAgICAgKiBAcGFyYW0ge1RIUkVFLkdlb21ldHJ5fSBnZW9tZXRyeVxuICAgICAqIEBwYXJhbSB7VEhSRUUuTWF0ZXJpYWx9IG1hdGVyaWFsXG4gICAgICogQHJldHVybiB7TnVtYmVyfSB0cmFuc2Zvcm0gcG9zaXRpb25cbiAgICAgKi9cbiAgICBhZGRLZXkodHJhbnNmb3JtUG9zaXRpb24sIHdoaXRlLCBub3RhdGlvbiwgb2N0YXZlLCBnZW9tZXRyeSwgbWF0ZXJpYWwpIHtcbiAgICAgICAgbWF0ZXJpYWwgPSBtYXRlcmlhbC5jbG9uZSgpO1xuICAgICAgICB2YXIga2V5bWFya2VyID0gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KC4yNSksIG1hdGVyaWFsKTtcbiAgICAgICAga2V5bWFya2VyLnNjYWxlLnNldCguMDEsIC4wMSwgLjAxKTtcblxuICAgICAgICBpZiAod2hpdGUpIHtcbiAgICAgICAgICAgIGtleW1hcmtlci5wb3NpdGlvbi54ID0gdHJhbnNmb3JtUG9zaXRpb24gKzI7XG4gICAgICAgICAgICBrZXltYXJrZXIucG9zaXRpb24ueSA9IC0xMS41O1xuICAgICAgICAgICAga2V5bWFya2VyLnBvc2l0aW9uLnogPSAuNzU7XG4gICAgICAgICAgICBtYXRlcmlhbC5lbWlzc2l2ZS5zZXRIZXgoU3R5bGUua2V5cy5ub3JtYWwud2hpdGUuZW1pc3NpdmUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAga2V5bWFya2VyLnBvc2l0aW9uLnggPSB0cmFuc2Zvcm1Qb3NpdGlvbiArMTtcbiAgICAgICAgICAgIGtleW1hcmtlci5wb3NpdGlvbi55ID0gLTc7XG4gICAgICAgICAgICBrZXltYXJrZXIucG9zaXRpb24ueiA9IDEuNTU7XG4gICAgICAgICAgICBtYXRlcmlhbC5lbWlzc2l2ZS5zZXRIZXgoU3R5bGUua2V5cy5ub3JtYWwud2hpdGUuZW1pc3NpdmUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hZGQoa2V5bWFya2VyLCAna2V5bWFya2VyXycgKyBub3RhdGlvbik7XG4gICAgICAgIHRyYW5zZm9ybVBvc2l0aW9uID0gc3VwZXIuYWRkS2V5KHRyYW5zZm9ybVBvc2l0aW9uLCB3aGl0ZSwgbm90YXRpb24sIG9jdGF2ZSwgZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgICAgdGhpcy5fa2V5c1t0aGlzLl9rZXlzLmxlbmd0aC0xXS5tYXJrZXIgPSBrZXltYXJrZXI7XG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm1Qb3NpdGlvbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0b2dnbGUga2V5IHN1Z2dlc3Rpb25cbiAgICAgKiBAcGFyYW0gbm90YXRpb25cbiAgICAgKiBAcGFyYW0ga2V5c2lnbm90YXRpb25cbiAgICAgKiBAcGFyYW0gdG9nZ2xlXG4gICAgICovXG4gICAgdG9nZ2xlS2V5U3VnZ2VzdGlvbihub3RhdGlvbiwga2V5c2lnbm90YXRpb24sIHRvZ2dsZSkge1xuICAgICAgICB2YXIga2V5cyA9IHN1cGVyLnRvZ2dsZUtleVN1Z2dlc3Rpb24obm90YXRpb24sIGtleXNpZ25vdGF0aW9uLCB0b2dnbGUpO1xuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IGtleXMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgIGlmICh0b2dnbGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoa2V5c1tjXS5zdHJvbmdseVN1Z2dlc3RlZCkge1xuICAgICAgICAgICAgICAgICAgICBrZXlzW2NdLm1hcmtlci5zY2FsZS5zZXQoMSwgMSwgMSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAga2V5c1tjXS5tYXJrZXIuc2NhbGUuc2V0KC41LCAuNSwgLjUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAga2V5c1tjXS5tYXJrZXIuc2NhbGUuc2V0KC4wMSwgLjAxLCAuMDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAga2V5c1tjXS5tYXJrZXIubWF0ZXJpYWwuY29sb3IgPSBrZXlzW2NdLm9iamVjdC5tYXRlcmlhbC5jb2xvcjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ga2V5cztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhcHBseSBrZXkgdHJhbnNmb3JtXG4gICAgICogQHBhcmFtIHtUSFJFRS5NZXNofSBrZXltZXNoXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc2l0aW9uIGluIGtleWJvYXJkXG4gICAgICogQHBhcmFtIHtCb29sZWFufSB3aGl0ZWtleVxuICAgICAqIEByZXR1cm4ge051bWJlcn0gY3VycmVudCBwb3NpdGlvblxuICAgICAqL1xuICAgIGFwcGx5S2V5VHJhbnNmb3JtKGtleW1lc2gsIHRyYW5zZm9ybVBvc2l0aW9uLCB3aGl0ZWtleSkge1xuICAgICAgICB2YXIgdHJhbnNsYXRlID0gMjtcbiAgICAgICAgaWYgKCF3aGl0ZWtleSkge1xuICAgICAgICAgICAga2V5bWVzaC5wb3NpdGlvbi55ID0gNTtcbiAgICAgICAgICAgIGtleW1lc2gucG9zaXRpb24ueiA9IDE7XG4gICAgICAgICAgICBrZXltZXNoLnBvc2l0aW9uLnggPSB0cmFuc2Zvcm1Qb3NpdGlvbiArMTtcbiAgICAgICAgICAgIHRyYW5zbGF0ZSA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBrZXltZXNoLnBvc2l0aW9uLnggPSB0cmFuc2Zvcm1Qb3NpdGlvbiArMjtcbiAgICAgICAgfVxuICAgICAgICBrZXltZXNoLnJvdGF0aW9uLnggPSAwO1xuICAgICAgICByZXR1cm4gdHJhbnNmb3JtUG9zaXRpb24gKyB0cmFuc2xhdGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2V0dXAgc2NlbmVcbiAgICAgKiBAcGFyYW0gZ2VvbWV0cnlcbiAgICAgKiBAcGFyYW0gbWF0ZXJpYWxcbiAgICAgKi9cbiAgICBzZXR1cFNjZW5lKGdlb21ldHJ5LCBtYXRlcmlhbCkge1xuICAgICAgICB2YXIgbGFzdFRyYW5zZm9ybVBvc2l0aW9uID0gc3VwZXIuc2V0dXBTY2VuZShnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgICB0aGlzLmdyb3VwLnBvc2l0aW9uLnggPSAtbGFzdFRyYW5zZm9ybVBvc2l0aW9uLzIgKiAxMDtcbiAgICAgICAgdGhpcy5ncm91cC5wb3NpdGlvbi56ID0gLTIzMDtcbiAgICAgICAgdGhpcy5ncm91cC5wb3NpdGlvbi55ID0gLTIwMDtcbiAgICAgICAgdGhpcy5ncm91cC5yb3RhdGlvbi54ID0gLU1hdGguUEkvMjtcbiAgICAgICAgdGhpcy5ncm91cC5zY2FsZS5zZXQoMTAsIDEwLCAxMCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IEJhc2VHcm91cCBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvdHJpdnIvc3JjL2Jhc2Vncm91cC5lczYnO1xuaW1wb3J0IFN0eWxlIGZyb20gJy4uL3RoZW1laW5nL3N0eWxlLmVzNic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpZ2h0aW5nIGV4dGVuZHMgQmFzZUdyb3VwIHtcbiAgICAvKipcbiAgICAgKiBvbiBjcmVhdGUgc2NlbmUgKG9yIGVhcmxpZXN0IHBvc3NpYmxlIG9wcG9ydHVuaXR5KVxuICAgICAqIEBwYXJhbSBzY2VuZVxuICAgICAqIEBwYXJhbSBjdXN0b21cbiAgICAgKi9cbiAgICBvbkNyZWF0ZShzY2VuZSwgY3VzdG9tKSB7XG4gICAgICAgIHRoaXMuX2xpZ2h0ID0gbmV3IFRIUkVFLkhlbWlzcGhlcmVMaWdodCggU3R5bGUubGlnaHRpbmcuaGVtaXNwaGVyZS50b3AsIFN0eWxlLmxpZ2h0aW5nLmhlbWlzcGhlcmUuYm90dG9tLCA0ICk7XG4gICAgICAgIHZhciBzcG90TGlnaHQgPSBuZXcgVEhSRUUuU3BvdExpZ2h0KCBTdHlsZS5saWdodGluZy5zcG90bGlnaHQgKTtcbiAgICAgICAgc3BvdExpZ2h0LnBvc2l0aW9uLnNldCggMCwgMCwgNDAwICk7XG4gICAgICAgIHNwb3RMaWdodC5yb3RhdGlvbi54ID0gTWF0aC5QSSAvIDI7XG5cbiAgICAgICAgc3BvdExpZ2h0LnNoYWRvdy5tYXBTaXplLndpZHRoID0gMTAyNDtcbiAgICAgICAgc3BvdExpZ2h0LnNoYWRvdy5tYXBTaXplLmhlaWdodCA9IDEwMjQ7XG5cbiAgICAgICAgc3BvdExpZ2h0LnNoYWRvdy5jYW1lcmEubmVhciA9IDEwMDtcbiAgICAgICAgc3BvdExpZ2h0LnNoYWRvdy5jYW1lcmEuZmFyID0gNDAwO1xuICAgICAgICBzcG90TGlnaHQuc2hhZG93LmNhbWVyYS5mb3YgPSAzMDtcblxuICAgICAgICB0aGlzLmFkZChzcG90TGlnaHQpO1xuICAgICAgICB0aGlzLmFkZCh0aGlzLl9saWdodCk7XG5cbiAgICAgICAgdGhpcy5fYW5pbWF0aW9uID0ge307XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb24gcmVuZGVyIHNjZW5lXG4gICAgICogQHBhcmFtIHNjZW5lXG4gICAgICogQHBhcmFtIGN1c3RvbVxuICAgICAqL1xuICAgIG9uUmVuZGVyKHNjZW5lLCBjdXN0b20pIHtcbiAgICAgICAgaWYgKHRoaXMuX2FuaW1hdGlvbi5hbmltYXRpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuX2xpZ2h0LmludGVuc2l0eSA9IHRoaXMuX2FuaW1hdGlvbi5pbnRlbnNpdHk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRJbnRlbnNpdHkodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fYW5pbWF0aW9uID0geyBhbmltYXRpbmc6IHRydWUsIGludGVuc2l0eTogdGhpcy5fbGlnaHQuaW50ZW5zaXR5IH07XG4gICAgICAgIGNyZWF0ZWpzLlR3ZWVuLmdldCh0aGlzLl9hbmltYXRpb24pXG4gICAgICAgICAgICAudG8oeyBpbnRlbnNpdHk6IHZhbHVlIH0sIDEwMDApXG4gICAgICAgICAgICAud2FpdCgxMDApIC8vIHdhaXQgYSBmZXcgdGlja3MsIG9yIHRoZSByZW5kZXIgY3ljbGUgd29uJ3QgcGljayB1cCB0aGUgY2hhbmdlcyB3aXRoIHRoZSBmbGFnXG4gICAgICAgICAgICAuY2FsbCggZnVuY3Rpb24oKSB7IHRoaXMuYW5pbWF0aW5nID0gZmFsc2U7IH0gKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgU2hhZGVycyBmcm9tICcuLy4uL3NoYWRlcnMuZXM2JztcbmltcG9ydCBCYXNlR3JvdXAgZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3RyaXZyL3NyYy9iYXNlZ3JvdXAuZXM2JztcbmltcG9ydCBTdHlsZSBmcm9tICcuLi90aGVtZWluZy9zdHlsZS5lczYnO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4uL3V0aWxzLmVzNic7XG5pbXBvcnQgVG9uZVBsYXliYWNrIGZyb20gJy4uL3RvbmVwbGF5YmFjay5lczYnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZXRyb25vbWUgZXh0ZW5kcyBCYXNlR3JvdXAge1xuICAgIG9uSW5pdGlhbGl6ZShwYXJhbXMpIHtcbiAgICAgICAgdGhpcy5fY29uZmlnID0gcGFyYW1zO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBtZXRyb25vbWUgaGFtbWVycyBpbiBzY2VuZVxuICAgICAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9oYW1tZXJzID0gW107XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIHN5bnRoXG4gICAgICAgICAqIEB0eXBlIHtUb25lfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgLy90aGlzLl9zeW50aCA9IG5ldyBUb25lLkRydW1TeW50aCgpLnRvTWFzdGVyKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIHR3ZWVuIHRhcmdldHNcbiAgICAgICAgICogQHR5cGUge3tkcnVtOiB7YW5pbWF0aW5nOiBib29sZWFuLCBwcm9wczoge319fX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3R3ZWVuVGFyZ2V0cyA9IHtcbiAgICAgICAgICAgIGRydW06IHsgYW5pbWF0aW5nOiBmYWxzZSwgcHJvcHM6IHt9IH0sXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5zZXRIaXRDb2xvcigpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNldCBkcnVtIGhpdC90cmlnZ2VyIGNvbG9yXG4gICAgICogQHBhcmFtIGhleFxuICAgICAqL1xuICAgIHNldEhpdENvbG9yKGhleCkge1xuICAgICAgICBpZiAoaGV4KSB7XG4gICAgICAgICAgICB0aGlzLl9oaXRDb2xvciA9IFV0aWxzLmRlY1RvUkdCKGhleCwgMTAwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2hpdENvbG9yID0gVXRpbHMuZGVjVG9SR0IoU3R5bGUubWV0cm9ub21lLmhhbW1lci5oaXRjb2xvciwgMTAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQ3JlYXRlKHNjZW5lY29sbGVjdGlvbiwgbXljb2xsZWN0aW9uKSB7XG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgdGhpcy5fY29uZmlnLmhhbW1lcnMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgIHRoaXMuYWRkSGFtbWVyKHRoaXMuX2NvbmZpZy5oYW1tZXJzW2NdLmRpcmVjdGlvbiwgTWF0aC5QSS90aGlzLl9jb25maWcuaGFtbWVyc1tjXS5yYXRlLCBNYXRoLlBJLzE2ICogdGhpcy5fY29uZmlnLmhhbW1lcnNbY10ub2Zmc2V0LCB0aGlzLl9jb25maWcuaGFtbWVyc1tjXS5ub3RhdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hZGREcnVtKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb24gcmVuZGVyXG4gICAgICogQHBhcmFtIHNjZW5lY29sbGVjdGlvblxuICAgICAqIEBwYXJhbSBteWNvbGxlY3Rpb25cbiAgICAgKi9cbiAgICBvblJlbmRlcihzY2VuZWNvbGxlY3Rpb24sIG15Y29sbGVjdGlvbikge1xuICAgICAgICB0aGlzLmFuaW1hdGVIYW1tZXJzKCk7XG4gICAgICAgIHRoaXMuYW5pbWF0ZURydW0oKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZW5kZXIgY3ljbGUgZm9yIGRydW1cbiAgICAgKi9cbiAgICBhbmltYXRlRHJ1bSgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3R3ZWVuVGFyZ2V0cy5kcnVtLmFuaW1hdGluZykge1xuICAgICAgICAgICAgdGhpcy5kcnVtLnBvc2l0aW9uLnogPSB0aGlzLl90d2VlblRhcmdldHMuZHJ1bS5wcm9wcy56UG9zaXRpb247XG4gICAgICAgICAgICB0aGlzLmRydW0ubWF0ZXJpYWwuYnVtcFNjYWxlID0gdGhpcy5fdHdlZW5UYXJnZXRzLmRydW0ucHJvcHMuYnVtcHNjYWxlO1xuICAgICAgICAgICAgdGhpcy5kcnVtLm1hdGVyaWFsLmNvbG9yLnNldFJHQihcbiAgICAgICAgICAgICAgICB0aGlzLl90d2VlblRhcmdldHMuZHJ1bS5wcm9wcy5yLzEwMCxcbiAgICAgICAgICAgICAgICB0aGlzLl90d2VlblRhcmdldHMuZHJ1bS5wcm9wcy5nLzEwMCxcbiAgICAgICAgICAgICAgICB0aGlzLl90d2VlblRhcmdldHMuZHJ1bS5wcm9wcy5iLzEwMCApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmVuZGVyIGN5Y2xlIGZvciBoYW1tZXJzXG4gICAgICovXG4gICAgYW5pbWF0ZUhhbW1lcnMoKSB7XG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgdGhpcy5faGFtbWVycy5sZW5ndGg7IGMrKykge1xuICAgICAgICAgICAgdmFyIGhhbW1lciA9IHRoaXMuX2hhbW1lcnNbY107XG5cbiAgICAgICAgICAgIGlmIChoYW1tZXIuYW5pbWF0aW5nR2xvdykge1xuICAgICAgICAgICAgICAgIGhhbW1lci5nbG93Lm1hdGVyaWFsLmNvbG9yLnNldFJHQihcbiAgICAgICAgICAgICAgICAgICAgaGFtbWVyLmdsb3dDb2xvci5yLzEwMCxcbiAgICAgICAgICAgICAgICAgICAgaGFtbWVyLmdsb3dDb2xvci5nLzEwMCxcbiAgICAgICAgICAgICAgICAgICAgaGFtbWVyLmdsb3dDb2xvci5iLzEwMCApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbmV3cm90YXRpb24gPSBoYW1tZXIucGl2b3Qucm90YXRpb25baGFtbWVyLnJvdGF0aW9uYXhpc10gKyBoYW1tZXIuZGlyZWN0aW9uICogaGFtbWVyLnJhdGU7XG5cbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhuZXdyb3RhdGlvbikgPiBNYXRoLlBJIC0gTWF0aC5QSS8xNikge1xuICAgICAgICAgICAgICAgIGhhbW1lci5kaXJlY3Rpb24gKj0gLTE7XG4gICAgICAgICAgICAgICAgbmV3cm90YXRpb24gPSBNYXRoLmFicyhuZXdyb3RhdGlvbikvbmV3cm90YXRpb24gKiAoTWF0aC5QSSAtIE1hdGguUEkvMTYpO1xuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlckRydW0oaGFtbWVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGhhbW1lci5waXZvdC5yb3RhdGlvbltoYW1tZXIucm90YXRpb25heGlzXSA9IG5ld3JvdGF0aW9uO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc291bmQgdGhlIGRydW0sIHRoZSBoYW1tZXIgaGl0IGl0XG4gICAgICogQHBhcmFtIGhhbW1lclxuICAgICAqL1xuICAgIHRyaWdnZXJEcnVtKGhhbW1lcikge1xuICAgICAgICBUb25lUGxheWJhY2subm90ZU9uKFRvbmVQbGF5YmFjay5TWU5USERSVU0sIGhhbW1lci5ub3RlLCAxMCwgMS8xNiwgdGhpcy5fY29uZmlnLnZlbG9jaXR5KTtcbiAgICAgICAvLyB0aGlzLl9zeW50aC50cmlnZ2VyQXR0YWNrUmVsZWFzZShoYW1tZXIubm90ZSwgXCIxNm5cIik7XG4gICAgICAgIGhhbW1lci5hbmltYXRpbmdHbG93ID0gdHJ1ZTtcbiAgICAgICAgdmFyIHN0YXJ0Y29sb3IgPSBVdGlscy5kZWNUb1JHQihTdHlsZS5tZXRyb25vbWUuaGFtbWVyLmNvbG9yLCAxMDApO1xuICAgICAgICB2YXIgZW5kY29sb3IgPSB0aGlzLl9oaXRDb2xvcjtcbiAgICAgICAgaGFtbWVyLmdsb3dDb2xvci5yID0gc3RhcnRjb2xvci5yO1xuICAgICAgICBoYW1tZXIuZ2xvd0NvbG9yLmcgPSBzdGFydGNvbG9yLmc7XG4gICAgICAgIGhhbW1lci5nbG93Q29sb3IuYiA9IHN0YXJ0Y29sb3IuYjtcbiAgICAgICAgY3JlYXRlanMuVHdlZW4uZ2V0KGhhbW1lci5nbG93Q29sb3IpXG4gICAgICAgICAgICAudG8oeyByOiBlbmRjb2xvci5yLCBnOiBlbmRjb2xvci5nLCBiOiBlbmRjb2xvci5iIH0sIDUwMClcbiAgICAgICAgICAgIC50byh7IHI6IHN0YXJ0Y29sb3IuciwgZzogc3RhcnRjb2xvci5nLCBiOiBzdGFydGNvbG9yLmIgfSwgNTAwKVxuICAgICAgICAgICAgLndhaXQoMTAwKSAvLyB3YWl0IGEgZmV3IHRpY2tzLCBvciB0aGUgcmVuZGVyIGN5Y2xlIHdvbid0IHBpY2sgdXAgdGhlIGNoYW5nZXMgd2l0aCB0aGUgZmxhZ1xuICAgICAgICAgICAgLmNhbGwoIGZ1bmN0aW9uIChzY29wZSkgeyBzY29wZS5hbmltYXRpbmdHbG93ID0gZmFsc2U7IH0gKTtcblxuICAgICAgICB2YXIgc3RhcnRjb2xvciA9IFV0aWxzLmRlY1RvUkdCKFN0eWxlLm1ldHJvbm9tZS5kcnVtLmNvbG9yLCAxMDApO1xuICAgICAgICB2YXIgZW5kY29sb3IgPSB0aGlzLl9oaXRDb2xvcjtcbiAgICAgICAgdGhpcy5fdHdlZW5UYXJnZXRzLmRydW0ucHJvcHMuciA9IHN0YXJ0Y29sb3IucjtcbiAgICAgICAgdGhpcy5fdHdlZW5UYXJnZXRzLmRydW0ucHJvcHMuZyA9IHN0YXJ0Y29sb3IuZztcbiAgICAgICAgdGhpcy5fdHdlZW5UYXJnZXRzLmRydW0ucHJvcHMuYiA9IHN0YXJ0Y29sb3IuYjtcbiAgICAgICAgdGhpcy5fdHdlZW5UYXJnZXRzLmRydW0ucHJvcHMuelBvc2l0aW9uID0gLTQwMDtcbiAgICAgICAgdGhpcy5fdHdlZW5UYXJnZXRzLmRydW0ucHJvcHMuYnVtcHNjYWxlID0gMDtcbiAgICAgICAgdGhpcy5fdHdlZW5UYXJnZXRzLmRydW0uYW5pbWF0aW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fdHdlZW5UYXJnZXRzLmRydW0uY3VycmVudFR3ZWVuID0gY3JlYXRlanMuVHdlZW4uZ2V0KHRoaXMuX3R3ZWVuVGFyZ2V0cy5kcnVtLnByb3BzKVxuICAgICAgICAgICAgLnRvKHtcbiAgICAgICAgICAgICAgICByOiBlbmRjb2xvci5yLCBnOiBlbmRjb2xvci5nLCBiOiBlbmRjb2xvci5iLFxuICAgICAgICAgICAgICAgIGJ1bXBzY2FsZTogMC4zNSxcbiAgICAgICAgICAgICAgICB6UG9zaXRpb246IC00MDAgKyBoYW1tZXIuZGlyZWN0aW9uICogNTAgfSwgMTUwKVxuICAgICAgICAgICAgLnRvKHtcbiAgICAgICAgICAgICAgICByOiBzdGFydGNvbG9yLnIsIGc6IHN0YXJ0Y29sb3IuZywgYjogc3RhcnRjb2xvci5iLFxuICAgICAgICAgICAgICAgIGJ1bXBzY2FsZTogMCxcbiAgICAgICAgICAgICAgICB6UG9zaXRpb246IC00MDAgfSwgMTUwKVxuICAgICAgICAgICAgLndhaXQoMTAwKSAvLyB3YWl0IGEgZmV3IHRpY2tzLCBvciB0aGUgcmVuZGVyIGN5Y2xlIHdvbid0IHBpY2sgdXAgdGhlIGNoYW5nZXMgd2l0aCB0aGUgZmxhZ1xuICAgICAgICAgICAgLmNhbGwoICgpID0+IHsgdGhpcy5fdHdlZW5UYXJnZXRzLmRydW0uYW5pbWF0aW5nID0gZmFsc2U7IH0gKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGQgY2VudGVyIGRydW1cbiAgICAgKi9cbiAgICBhZGREcnVtKCkge1xuICAgICAgICB2YXIgZHJ1bWdlb20gPSBuZXcgVEhSRUUuQ2lyY2xlR2VvbWV0cnkoIDMwLCAyNCApO1xuICAgICAgICBkcnVtZ2VvbS5zY2FsZSgxLDEsIDAuNzUpO1xuICAgICAgICB2YXIgbWFwSGVpZ2h0ID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKS5sb2FkKFN0eWxlLm1ldHJvbm9tZS5kcnVtLmJ1bXBtYXApO1xuICAgICAgICBtYXBIZWlnaHQuYW5pc290cm9weSA9IDQ7XG4gICAgICAgIG1hcEhlaWdodC5yZXBlYXQuc2V0KDEsIDEpO1xuICAgICAgICBtYXBIZWlnaHQud3JhcFMgPSBtYXBIZWlnaHQud3JhcFQgPSBUSFJFRS5DbGFtcFRvRWRnZVdyYXBwaW5nO1xuICAgICAgICBtYXBIZWlnaHQuZm9ybWF0ID0gVEhSRUUuUkdCRm9ybWF0O1xuXG4gICAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCgge1xuICAgICAgICAgICAgY29sb3I6IFN0eWxlLm1ldHJvbm9tZS5kcnVtLmNvbG9yLFxuICAgICAgICAgICAgZW1pc3NpdmU6IFN0eWxlLm1ldHJvbm9tZS5kcnVtLmVtaXNzaXZlLFxuICAgICAgICAgICAgc3BlY3VsYXI6IFN0eWxlLm1ldHJvbm9tZS5kcnVtLnNwZWN1bGFyLFxuICAgICAgICAgICAgYnVtcE1hcDogbWFwSGVpZ2h0LFxuICAgICAgICAgICAgYnVtcFNjYWxlOiAwLFxuICAgICAgICB9ICk7XG5cbiAgICAgICAgdGhpcy5kcnVtID0gbmV3IFRIUkVFLk1lc2goIGRydW1nZW9tLCBtYXRlcmlhbCApO1xuICAgICAgICB0aGlzLmRydW0ucG9zaXRpb24ueiA9IC02MDA7XG4gICAgICAgIHRoaXMuYWRkKHRoaXMuZHJ1bSwgJ2RydW0nKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGQgbWV0cm9ub21lIGhhbW1lclxuICAgICAqIEBwYXJhbSBvcmlnaW5cbiAgICAgKiBAcGFyYW0gcmF0ZVxuICAgICAqIEBwYXJhbSBvZmZzZXRcbiAgICAgKi9cbiAgICBhZGRIYW1tZXIob3JpZ2luLCByYXRlLCBvZmZzZXQsIHRvbmUpIHtcbiAgICAgICAgdmFyIGhhbW1lcmdlb20gPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoNSk7XG4gICAgICAgIHZhciBjZW50ZXJwaXZvdCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuXG4gICAgICAgIHZhciB0ZXh0dXJlQ3ViZSA9IG5ldyBUSFJFRS5DdWJlVGV4dHVyZUxvYWRlcigpLmxvYWQoU3R5bGUubWV0cm9ub21lLmhhbW1lci5yZWZyYWN0aW9uY3ViZSk7XG4gICAgICAgIHRleHR1cmVDdWJlLm1hcHBpbmcgPSBUSFJFRS5DdWJlUmVmcmFjdGlvbk1hcHBpbmc7XG5cbiAgICAgICAgdmFyIGlubmVybWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoIHtcbiAgICAgICAgICAgIGVudk1hcDogdGV4dHVyZUN1YmUgfSApO1xuXG4gICAgICAgIHZhciBvdXRlcm1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCB7XG4gICAgICAgICAgICBjb2xvcjogU3R5bGUubWV0cm9ub21lLmhhbW1lci5jb2xvcixcbiAgICAgICAgICAgIHRyYW5zcGFyZW50OiB0cnVlLFxuICAgICAgICAgICAgd2lyZWZyYW1lOiB0cnVlLFxuICAgICAgICAgICAgb3BhY2l0eTogMC41IH0gKTtcblxuXG4gICAgICAgIHZhciBoYW1tZXIgPSBuZXcgVEhSRUUuTWVzaCggaGFtbWVyZ2VvbSwgaW5uZXJtYXRlcmlhbCApO1xuICAgICAgICBoYW1tZXIubmFtZSA9ICdiYWxsJztcbiAgICAgICAgY2VudGVycGl2b3QuYWRkKGhhbW1lcik7XG4gICAgICAgIGNlbnRlcnBpdm90LnBvc2l0aW9uLnogPSAtNDAwO1xuXG4gICAgICAgIHZhciBnbG93ID0gbmV3IFRIUkVFLk1lc2goIGhhbW1lcmdlb20uY2xvbmUoKSwgb3V0ZXJtYXRlcmlhbCApO1xuICAgICAgICBnbG93Lm5hbWUgPSAnZ2xvdyc7XG4gICAgICAgIGdsb3cuc2NhbGUubXVsdGlwbHlTY2FsYXIoMS4yKTtcbiAgICAgICAgY2VudGVycGl2b3QuYWRkKGdsb3cpO1xuXG4gICAgICAgIHZhciByb3RhdGlvbmF4aXM7XG4gICAgICAgIHN3aXRjaCAob3JpZ2luKSB7XG4gICAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICAgICAgZ2xvdy5wb3NpdGlvbi54ID0gLTEwMDtcbiAgICAgICAgICAgICAgICBjZW50ZXJwaXZvdC5wb3NpdGlvbi54ID0gLTEwMDtcbiAgICAgICAgICAgICAgICBoYW1tZXIucG9zaXRpb24ueCA9IC0xMDA7XG4gICAgICAgICAgICAgICAgcm90YXRpb25heGlzID0gJ3knO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgICAgICAgICBnbG93LnBvc2l0aW9uLnggPSAxMDA7XG4gICAgICAgICAgICAgICAgY2VudGVycGl2b3QucG9zaXRpb24ueCA9IDEwMDtcbiAgICAgICAgICAgICAgICBoYW1tZXIucG9zaXRpb24ueCA9IDEwMDtcbiAgICAgICAgICAgICAgICByb3RhdGlvbmF4aXMgPSAneSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2Rvd24nOlxuICAgICAgICAgICAgICAgIGdsb3cucG9zaXRpb24ueSA9IDEwMDtcbiAgICAgICAgICAgICAgICBjZW50ZXJwaXZvdC5wb3NpdGlvbi55ID0gMTAwO1xuICAgICAgICAgICAgICAgIGhhbW1lci5wb3NpdGlvbi55ID0gMTAwO1xuICAgICAgICAgICAgICAgIHJvdGF0aW9uYXhpcyA9ICd4JztcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAndXAnOlxuICAgICAgICAgICAgICAgIGdsb3cucG9zaXRpb24ueSA9IC0xMDA7XG4gICAgICAgICAgICAgICAgY2VudGVycGl2b3QucG9zaXRpb24ueSA9IC0xMDA7XG4gICAgICAgICAgICAgICAgaGFtbWVyLnBvc2l0aW9uLnkgPSAtMTAwO1xuICAgICAgICAgICAgICAgIHJvdGF0aW9uYXhpcyA9ICd4JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGNlbnRlcnBpdm90LnJvdGF0aW9uW3JvdGF0aW9uYXhpc10gKz0gb2Zmc2V0O1xuXG4gICAgICAgIHRoaXMuX2hhbW1lcnMucHVzaCgge1xuICAgICAgICAgICAgYW5pbWF0aW5nR2xvdzogZmFsc2UsXG4gICAgICAgICAgICBnbG93OiBnbG93LFxuICAgICAgICAgICAgZ2xvd0NvbG9yOiB7fSxcbiAgICAgICAgICAgIGhhbW1lcjogaGFtbWVyLFxuICAgICAgICAgICAgcGl2b3Q6IGNlbnRlcnBpdm90LFxuICAgICAgICAgICAgZGlyZWN0aW9uOiAxLFxuICAgICAgICAgICAgcmF0ZTogcmF0ZSxcbiAgICAgICAgICAgIHJvdGF0aW9uYXhpczogcm90YXRpb25heGlzLFxuICAgICAgICAgICAgbm90ZTogdG9uZSB9XG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5hZGQoY2VudGVycGl2b3QsICdoYW1tZXInKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgQmFzZUdyb3VwIGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy90cml2ci9zcmMvYmFzZWdyb3VwLmVzNic7XG5pbXBvcnQgU3R5bGUgZnJvbSAnLi4vdGhlbWVpbmcvc3R5bGUuZXM2JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG9tZSBleHRlbmRzIEJhc2VHcm91cCB7XG4gICAgLyoqXG4gICAgICogb24gY3JlYXRlIHNjZW5lIChvciBlYXJsaWVzdCBwb3NzaWJsZSBvcHBvcnR1bml0eSlcbiAgICAgKiBAcGFyYW0gc2NlbmVcbiAgICAgKiBAcGFyYW0gY3VzdG9tXG4gICAgICovXG4gICAgb25DcmVhdGUoc2NlbmUsIGN1c3RvbSkge1xuICAgICAgICB2YXIgbG9hZGVyID0gbmV3IFRIUkVFLkZvbnRMb2FkZXIoKTtcbiAgICAgICAgbG9hZGVyLmxvYWQoICdhc3NldHMvbW9kZWxzL29wdGltZXJfYm9sZC50eXBlZmFjZS5qc29uJywgKCByZXNwb25zZSApID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9udCA9IHJlc3BvbnNlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvbiByZW5kZXJcbiAgICAgKiBAcGFyYW0gc2NlbmVjb2xsZWN0aW9uXG4gICAgICogQHBhcmFtIG15Y29sbGVjdGlvblxuICAgICAqL1xuICAgIG9uUmVuZGVyKHNjZW5lY29sbGVjdGlvbiwgbXljb2xsZWN0aW9uKSB7fVxuXG4gICAgLyoqXG4gICAgICogc2V0IHRleHRcbiAgICAgKiBAcGFyYW0gdGV4dFxuICAgICAqL1xuICAgIHNldFRleHQodGV4dCkge1xuICAgICAgICB0aGlzLmNyZWF0ZU1lc2godGV4dCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY3JlYXRlIG1lc2hcbiAgICAgKi9cbiAgICBjcmVhdGVNZXNoKHRleHQpIHtcbiAgICAgICAgaWYgKHRoaXMubWVzaCkge1xuICAgICAgICAgICAgdGhpcy5ncm91cC5yZW1vdmUodGhpcy5tZXNoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5tZXNoID0gbmV3IFRIUkVFLk1lc2godGhpcy5jcmVhdGVHZW9tZXRyeSh0ZXh0KSwgdGhpcy5jcmVhdGVNYXRlcmlhbCgpLCB0ZXh0Lmxlbmd0aCk7XG4gICAgICAgIHRoaXMubWVzaC5wb3NpdGlvbi56ID0gLTE1O1xuICAgICAgICB0aGlzLm1lc2gucG9zaXRpb24ueSA9IDEuMjA7XG4gICAgICAgIGlmICh0ZXh0Lmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgdGhpcy5tZXNoLnBvc2l0aW9uLnggPSAtLjY1O1xuICAgICAgICB9IGVsc2UgaWYgKHRleHQubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICB0aGlzLm1lc2gucG9zaXRpb24ueCA9IC0uODU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm1lc2gucG9zaXRpb24ueCA9IC0uMzU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tZXNoLm5hbWUgPSAnbm90YXRpb250ZXh0JztcbiAgICAgICAgdGhpcy5ncm91cC5hZGQodGhpcy5tZXNoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjcmVhdGUgZ2xvYmUgZ2VvbWV0cnlcbiAgICAgKiBAcmV0dXJucyB7VEhSRUUuSWNvc2FoZWRyb25HZW9tZXRyeX1cbiAgICAgKi9cbiAgICBjcmVhdGVHZW9tZXRyeSh0ZXh0KSB7XG4gICAgICAgIHZhciBzaXplID0gLjc1O1xuICAgICAgICBpZiAodGV4dC5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgIHNpemUgPSAuNTU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBUSFJFRS5UZXh0R2VvbWV0cnkoIHRleHQsIHtcbiAgICAgICAgICAgIGZvbnQ6IHRoaXMuZm9udCxcbiAgICAgICAgICAgIHNpemU6IHNpemUsXG4gICAgICAgICAgICBoZWlnaHQ6IC41LFxuICAgICAgICAgICAgY3VydmVTZWdtZW50czogNCxcbiAgICAgICAgICAgIGJldmVsVGhpY2tuZXNzOiAyLFxuICAgICAgICAgICAgYmV2ZWxTaXplOiAxLjUsXG4gICAgICAgICAgICBiZXZlbEVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgbWF0ZXJpYWw6IDAsXG4gICAgICAgICAgICBleHRydWRlTWF0ZXJpYWw6IDBcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY3JlYXRlIGdsb2JlIG1hdGVyaWFsXG4gICAgICovXG4gICAgY3JlYXRlTWF0ZXJpYWwoKSB7XG4gICAgICAgIHJldHVybiBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoe1xuICAgICAgICAgICAgY29sb3IgICAgICA6ICBTdHlsZS5kb21lLmNvbG9yLFxuICAgICAgICAgICAgZW1pc3NpdmUgICA6ICBTdHlsZS5kb21lLmVtaXNzaXZlLFxuICAgICAgICAgICAgc3BlY3VsYXIgICA6ICBTdHlsZS5kb21lLnNwZWN1bGFyLFxuICAgICAgICAgICAgc2lkZSAgICAgICA6ICBUSFJFRS5CYWNrU2lkZSxcbiAgICAgICAgICAgIHNoaW5pbmVzcyAgOiAgMTAsXG4gICAgICAgICAgICBzaGFkaW5nICAgIDogIFRIUkVFLkZsYXRTaGFkaW5nLFxuICAgICAgICAgICAgdHJhbnNwYXJlbnQ6IDEsXG4gICAgICAgICAgICBvcGFjaXR5ICAgIDogMVxuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgQmFzZUdyb3VwIGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy90cml2ci9zcmMvYmFzZWdyb3VwLmVzNic7XG5pbXBvcnQgU3R5bGUgZnJvbSAnLi4vdGhlbWVpbmcvc3R5bGUuZXM2JztcbmltcG9ydCBVdGlscyBmcm9tICcuLi91dGlscy5lczYnO1xuaW1wb3J0IFNoYWRlcnMgZnJvbSAnLi4vc2hhZGVycy5lczYnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXJ0aWNsZUZsb2NrIGV4dGVuZHMgQmFzZUdyb3VwIHtcbiAgICAvKipcbiAgICAgKiBvbiBjcmVhdGUgc2NlbmVcbiAgICAgKiBAcGFyYW0gc2NlbmVcbiAgICAgKiBAcGFyYW0gY3VzdG9tXG4gICAgICovXG4gICAgb25DcmVhdGUoc2NlbmUsIGN1c3RvbSkge1xuICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIgPSB7XG4gICAgICAgICAgICBncHVDb21wdXRlOiBudWxsLFxuICAgICAgICAgICAgdmVsb2NpdHlWYXJpYWJsZTogbnVsbCxcbiAgICAgICAgICAgIHBvc2l0aW9uVmFyaWFibGU6IG51bGwsXG4gICAgICAgICAgICBwb3NpdGlvblVuaWZvcm1zOiBudWxsLFxuICAgICAgICAgICAgdmVsb2NpdHlVbmlmb3JtczogbnVsbCxcbiAgICAgICAgICAgIHVuaWZvcm1zOiBudWxsXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fY29sb3I7XG5cbiAgICAgICAgLyogVEVYVFVSRSBXSURUSCBGT1IgU0lNVUxBVElPTiAqL1xuICAgICAgICB0aGlzLldJRFRIID0gMzI7XG5cbiAgICAgICAgdmFyIEJJUkRTID0gdGhpcy5XSURUSCAqIHRoaXMuV0lEVEg7XG5cbiAgICAgICAgdGhpcy5tb3VzZVggPSAwO1xuICAgICAgICB0aGlzLm1vdXNlWSA9IDA7XG4gICAgICAgIHRoaXMuQk9VTkRTID0gMTAwMDtcbiAgICAgICAgdGhpcy5CT1VORFNfSEFMRiA9IHRoaXMuQk9VTkRTIC8gMjtcblxuICAgICAgICB0aGlzLmltbWVyc2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaW1tZXJzaW9uTGV2ZWxzID0geyBtaW46IC0yMDAuMCwgbWF4OiAyMDAwLjAgfTtcbiAgICAgICAgdGhpcy5pbml0Q29tcHV0ZVJlbmRlcmVyKHNjZW5lLnJlbmRlcmVyKTtcblxuICAgICAgICAvKmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZW1vdmUnLCBlID0+IHRoaXMub25Eb2N1bWVudE1vdXNlTW92ZShlKSwgZmFsc2UgKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ3RvdWNoc3RhcnQnLCBlID0+IHRoaXMub25Eb2N1bWVudFRvdWNoU3RhcnQoZSksIGZhbHNlICk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICd0b3VjaG1vdmUnLCBlID0+IHRoaXMub25Eb2N1bWVudFRvdWNoTW92ZShlKSwgZmFsc2UgKTsqL1xuICAgICAgICB0aGlzLmluaXRCaXJkcygpO1xuICAgIH1cblxuICAgIG9uRG9jdW1lbnRNb3VzZU1vdmUoIGV2ZW50ICkge1xuICAgICAgICB0aGlzLm1vdXNlWCA9IGV2ZW50LmNsaWVudFggLSA2MDA7Ly8tIHdpbmRvd0hhbGZYO1xuICAgICAgICB0aGlzLm1vdXNlWSA9IGV2ZW50LmNsaWVudFkgLSA2MDA7Ly8tIHdpbmRvd0hhbGZZO1xuICAgIH1cblxuICAgIG9uRG9jdW1lbnRUb3VjaFN0YXJ0KCBldmVudCApIHtcbiAgICAgICAgaWYgKCBldmVudC50b3VjaGVzLmxlbmd0aCA9PT0gMSApIHtcblxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdGhpcy5tb3VzZVggPSBldmVudC50b3VjaGVzWyAwIF0ucGFnZVggLSA2MDA7Ly8tIHdpbmRvd0hhbGZYO1xuICAgICAgICAgICAgdGhpcy5tb3VzZVkgPSBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkgLSA2MDA7Ly8tIHdpbmRvd0hhbGZZO1xuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkRvY3VtZW50VG91Y2hNb3ZlKCBldmVudCApIHtcblxuICAgICAgICBpZiAoIGV2ZW50LnRvdWNoZXMubGVuZ3RoID09PSAxICkge1xuXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICB0aGlzLm1vdXNlWCA9IGV2ZW50LnRvdWNoZXNbIDAgXS5wYWdlWCAtIDYwMDsvL3dpbmRvd0hhbGZYO1xuICAgICAgICAgICAgdGhpcy5tb3VzZVkgPSBldmVudC50b3VjaGVzWyAwIF0ucGFnZVkgLSA2MDA7Ly93aW5kb3dIYWxmWTtcblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2V0IGRydW0gaGl0L3RyaWdnZXIgY29sb3JcbiAgICAgKiBAcGFyYW0gaGV4XG4gICAgICovXG4gICAgc2V0Q29sb3IoaGV4KSB7XG4gICAgICAgIHZhciBjb2xvcjtcbiAgICAgICAgaWYgKGhleCkge1xuICAgICAgICAgICAgY29sb3IgPSBVdGlscy5kZWNUb1JHQihoZXgsIDEpO1xuICAgICAgICAgICAgdGhpcy5pbW1lcnNlZCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb2xvciA9IFV0aWxzLmRlY1RvUkdCKFN0eWxlLmZsb2F0aW5ncGFydGljbGVzLmNvbG9yLCAxKTtcbiAgICAgICAgICAgIHRoaXMuaW1tZXJzZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5fY29sb3IgKSB7XG4gICAgICAgICAgICB0aGlzLl9jb2xvciA9IGNvbG9yO1xuICAgICAgICAgICAgdGhpcy5tZXNoLm1hdGVyaWFsLnVuaWZvcm1zLmNvbG9yLnZhbHVlID0gWyB0aGlzLl9jb2xvci5yLCB0aGlzLl9jb2xvci5nLCB0aGlzLl9jb2xvci5iIF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9jb2xvci5hbmltYXRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgY3JlYXRlanMuVHdlZW4uZ2V0KHRoaXMuX2NvbG9yKVxuICAgICAgICAgICAgICAgIC50byhjb2xvciwgMjAwMClcbiAgICAgICAgICAgICAgICAud2FpdCgxMDApIC8vIHdhaXQgYSBmZXcgdGlja3MsIG9yIHRoZSByZW5kZXIgY3ljbGUgd29uJ3QgcGljayB1cCB0aGUgY2hhbmdlcyB3aXRoIHRoZSBmbGFnXG4gICAgICAgICAgICAgICAgLmNhbGwoIGZ1bmN0aW9uKCkgeyB0aGlzLmFuaW1hdGluZyA9IGZhbHNlOyB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uUmVuZGVyKHRpbWUpIHtcblxuICAgICAgICBpZiAodGhpcy5pbW1lcnNlZCAmJiB0aGlzLmZsb2NrR1BVUmVuZGVyZXIucG9zaXRpb25Vbmlmb3Jtcy5kZXB0aC52YWx1ZSA8IHRoaXMuaW1tZXJzaW9uTGV2ZWxzLm1heCkge1xuICAgICAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnBvc2l0aW9uVW5pZm9ybXMuZGVwdGgudmFsdWUgKz0gMC41O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmltbWVyc2VkICYmIHRoaXMuZmxvY2tHUFVSZW5kZXJlci5wb3NpdGlvblVuaWZvcm1zLmRlcHRoLnZhbHVlID4gdGhpcy5pbW1lcnNpb25MZXZlbHMubWluKSB7XG4gICAgICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIucG9zaXRpb25Vbmlmb3Jtcy5kZXB0aC52YWx1ZSAtPSAwLjU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZGVsdGEgPSB0aW1lLmRlbHRhIC8gMTAwMDtcbiAgICAgICAgaWYgKGRlbHRhID4gMSkgZGVsdGEgPSAxO1xuICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIucG9zaXRpb25Vbmlmb3Jtcy50aW1lLnZhbHVlID0gdGltZS5ub3c7XG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci5wb3NpdGlvblVuaWZvcm1zLmRlbHRhLnZhbHVlID0gZGVsdGE7XG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci52ZWxvY2l0eVVuaWZvcm1zLnRpbWUudmFsdWUgPSB0aW1lLm5vdztcbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnZlbG9jaXR5VW5pZm9ybXMuZGVsdGEudmFsdWUgPSBkZWx0YTtcbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnVuaWZvcm1zLnRpbWUudmFsdWUgPSB0aW1lLm5vdztcbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnVuaWZvcm1zLmRlbHRhLnZhbHVlID0gZGVsdGE7XG4gICAgICAgIC8vdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnVuaWZvcm1zLmRlcHRoLnZhbHVlID0gLTIwMC4wO1xuXG4gICAgICAgIC8vdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnZlbG9jaXR5VW5pZm9ybXMucHJlZGF0b3IudmFsdWUuc2V0KCAwLjUgKiB0aGlzLm1vdXNlWCAvIDYwMCwgLSAwLjUgKiB0aGlzLm1vdXNlWSAvIDYwMCwgMCApO1xuICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIuZ3B1Q29tcHV0ZS5jb21wdXRlKCk7XG5cbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnVuaWZvcm1zLnRleHR1cmVQb3NpdGlvbi52YWx1ZSA9IHRoaXMuZmxvY2tHUFVSZW5kZXJlci5ncHVDb21wdXRlLmdldEN1cnJlbnRSZW5kZXJUYXJnZXQoIHRoaXMuZmxvY2tHUFVSZW5kZXJlci5wb3NpdGlvblZhcmlhYmxlICkudGV4dHVyZTtcbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnVuaWZvcm1zLnRleHR1cmVWZWxvY2l0eS52YWx1ZSA9IHRoaXMuZmxvY2tHUFVSZW5kZXJlci5ncHVDb21wdXRlLmdldEN1cnJlbnRSZW5kZXJUYXJnZXQoIHRoaXMuZmxvY2tHUFVSZW5kZXJlci52ZWxvY2l0eVZhcmlhYmxlICkudGV4dHVyZTtcblxuICAgICAgICBpZiAodGhpcy5fY29sb3IuYW5pbWF0aW5nKSB7XG4gICAgICAgICAgICB0aGlzLm1lc2gubWF0ZXJpYWwudW5pZm9ybXMuY29sb3IudmFsdWUgPSBbIHRoaXMuX2NvbG9yLnIsIHRoaXMuX2NvbG9yLmcsIHRoaXMuX2NvbG9yLmIgXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGluaXRDb21wdXRlUmVuZGVyZXIocmVuZGVyZXIpIHtcbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLmdwdUNvbXB1dGUgPSBuZXcgR1BVQ29tcHV0YXRpb25SZW5kZXJlciggdGhpcy5XSURUSCwgdGhpcy5XSURUSCwgcmVuZGVyZXIgKTtcbiAgICAgICAgdmFyIGR0UG9zaXRpb24gPSB0aGlzLmZsb2NrR1BVUmVuZGVyZXIuZ3B1Q29tcHV0ZS5jcmVhdGVUZXh0dXJlKCk7XG4gICAgICAgIHZhciBkdFZlbG9jaXR5ID0gdGhpcy5mbG9ja0dQVVJlbmRlcmVyLmdwdUNvbXB1dGUuY3JlYXRlVGV4dHVyZSgpO1xuICAgICAgICB0aGlzLmZpbGxQb3NpdGlvblRleHR1cmUoIGR0UG9zaXRpb24gKTtcbiAgICAgICAgdGhpcy5maWxsVmVsb2NpdHlUZXh0dXJlKCBkdFZlbG9jaXR5ICk7XG5cbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnZlbG9jaXR5VmFyaWFibGUgPSB0aGlzLmZsb2NrR1BVUmVuZGVyZXIuZ3B1Q29tcHV0ZS5hZGRWYXJpYWJsZSggXCJ0ZXh0dXJlVmVsb2NpdHlcIiwgU2hhZGVycy5mbG9ja3ZlbG9jaXR5LmZyYWdtZW50LCBkdFZlbG9jaXR5ICk7XG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci5wb3NpdGlvblZhcmlhYmxlID0gdGhpcy5mbG9ja0dQVVJlbmRlcmVyLmdwdUNvbXB1dGUuYWRkVmFyaWFibGUoIFwidGV4dHVyZVBvc2l0aW9uXCIsIFNoYWRlcnMuZmxvY2twb3NpdGlvbi5mcmFnbWVudCwgZHRQb3NpdGlvbiApO1xuXG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci5ncHVDb21wdXRlLnNldFZhcmlhYmxlRGVwZW5kZW5jaWVzKCB0aGlzLmZsb2NrR1BVUmVuZGVyZXIudmVsb2NpdHlWYXJpYWJsZSwgWyB0aGlzLmZsb2NrR1BVUmVuZGVyZXIucG9zaXRpb25WYXJpYWJsZSwgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnZlbG9jaXR5VmFyaWFibGUgXSApO1xuICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIuZ3B1Q29tcHV0ZS5zZXRWYXJpYWJsZURlcGVuZGVuY2llcyggdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnBvc2l0aW9uVmFyaWFibGUsIFsgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnBvc2l0aW9uVmFyaWFibGUsIHRoaXMuZmxvY2tHUFVSZW5kZXJlci52ZWxvY2l0eVZhcmlhYmxlIF0gKTtcblxuICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIucG9zaXRpb25Vbmlmb3JtcyA9IHRoaXMuZmxvY2tHUFVSZW5kZXJlci5wb3NpdGlvblZhcmlhYmxlLm1hdGVyaWFsLnVuaWZvcm1zO1xuICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIudmVsb2NpdHlVbmlmb3JtcyA9IHRoaXMuZmxvY2tHUFVSZW5kZXJlci52ZWxvY2l0eVZhcmlhYmxlLm1hdGVyaWFsLnVuaWZvcm1zO1xuXG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci5wb3NpdGlvblVuaWZvcm1zLnRpbWUgPSB7IHZhbHVlOiAwLjAgfTtcbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnBvc2l0aW9uVW5pZm9ybXMuZGVsdGEgPSB7IHZhbHVlOiAwLjAgfTtcbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnBvc2l0aW9uVW5pZm9ybXMuZGVwdGggPSB7IHZhbHVlOiAtMjAwLjAgfTtcbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnZlbG9jaXR5VW5pZm9ybXMudGltZSA9IHsgdmFsdWU6IDEuMCB9O1xuICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIudmVsb2NpdHlVbmlmb3Jtcy5kZWx0YSA9IHsgdmFsdWU6IDAuMCB9O1xuICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIudmVsb2NpdHlVbmlmb3Jtcy50ZXN0aW5nID0geyB2YWx1ZTogMS4wIH07XG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci52ZWxvY2l0eVVuaWZvcm1zLnNlcGVyYXRpb25EaXN0YW5jZSA9IHsgdmFsdWU6IDEuMCB9O1xuICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIudmVsb2NpdHlVbmlmb3Jtcy5hbGlnbm1lbnREaXN0YW5jZSA9IHsgdmFsdWU6IDEuMCB9O1xuICAgICAgICB0aGlzLmZsb2NrR1BVUmVuZGVyZXIudmVsb2NpdHlVbmlmb3Jtcy5jb2hlc2lvbkRpc3RhbmNlID0geyB2YWx1ZTogMS4wIH07XG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci52ZWxvY2l0eVVuaWZvcm1zLmZyZWVkb21GYWN0b3IgPSB7IHZhbHVlOiAxLjAgfTtcbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnZlbG9jaXR5VW5pZm9ybXMucHJlZGF0b3IgPSB7IHZhbHVlOiBuZXcgVEhSRUUuVmVjdG9yMygpIH07XG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci52ZWxvY2l0eVZhcmlhYmxlLm1hdGVyaWFsLmRlZmluZXMuQk9VTkRTID0gdGhpcy5CT1VORFMudG9GaXhlZCggMiApO1xuXG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci52ZWxvY2l0eVZhcmlhYmxlLndyYXBTID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci52ZWxvY2l0eVZhcmlhYmxlLndyYXBUID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci5wb3NpdGlvblZhcmlhYmxlLndyYXBTID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG4gICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci5wb3NpdGlvblZhcmlhYmxlLndyYXBUID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG5cbiAgICAgICAgdmFyIGVycm9yID0gdGhpcy5mbG9ja0dQVVJlbmRlcmVyLmdwdUNvbXB1dGUuaW5pdCgpO1xuICAgICAgICBpZiAoIGVycm9yICE9PSBudWxsICkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvciggZXJyb3IgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGluaXRCaXJkcygpIHtcbiAgICAgICAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLlN3YXJtUGFydGljbGVHZW9tZXRyeSh0aGlzLldJRFRIKTtcbiAgICAgICAgZ2VvbWV0cnkuc2NhbGUoMC41LCAwLjUsIDAuNSk7XG5cbiAgICAgICAgLy8gRm9yIFZlcnRleCBhbmQgRnJhZ21lbnRcbiAgICAgICAgdGhpcy5mbG9ja0dQVVJlbmRlcmVyLnVuaWZvcm1zID0ge1xuICAgICAgICAgICAgY29sb3I6IHsgdmFsdWU6IFswLjAsMC4wLDAuMF0gfSxcbiAgICAgICAgICAgIHRleHR1cmVQb3NpdGlvbjogeyB2YWx1ZTogbnVsbCB9LFxuICAgICAgICAgICAgdGV4dHVyZVZlbG9jaXR5OiB7IHZhbHVlOiBudWxsIH0sXG4gICAgICAgICAgICB0aW1lOiB7IHZhbHVlOiAxLjAgfSxcbiAgICAgICAgICAgIGRlbHRhOiB7IHZhbHVlOiAwLjAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFNoYWRlck1hdGVyaWFsXG4gICAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5TaGFkZXJNYXRlcmlhbCgge1xuICAgICAgICAgICAgdW5pZm9ybXM6ICAgICAgIHRoaXMuZmxvY2tHUFVSZW5kZXJlci51bmlmb3JtcyxcbiAgICAgICAgICAgIHZlcnRleFNoYWRlcjogICBTaGFkZXJzLmZsb2NrLnZlcnRleCxcbiAgICAgICAgICAgIGZyYWdtZW50U2hhZGVyOiBTaGFkZXJzLmZsb2NrLmZyYWdtZW50LFxuICAgICAgICAgICAgLy9zaWRlOiBUSFJFRS5Eb3VibGVTaWRlXG4gICAgICAgICAgICAvL3RyYW5zcGFyZW50OiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMubWVzaCA9IG5ldyBUSFJFRS5NZXNoKCBnZW9tZXRyeSwgbWF0ZXJpYWwgKTtcbiAgICAgICAgdGhpcy5tZXNoLnJvdGF0aW9uLnkgPSBNYXRoLlBJIC8gMjtcbiAgICAgICAgLy8gdGhpcy5tZXNoLnBvc2l0aW9uLnogPSAtMTAwO1xuICAgICAgICAvLyB0aGlzLm1lc2gucG9zaXRpb24ueSA9IC0xMDtcbiAgICAgICAgLyp0aGlzLm1lc2guc2NhbGUueCA9IC4yO1xuICAgICAgICB0aGlzLm1lc2guc2NhbGUueSA9IC4yO1xuICAgICAgICB0aGlzLm1lc2guc2NhbGUueiA9IC4yOyovXG4gICAgICAgIHRoaXMubWVzaC5tYXRyaXhBdXRvVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tZXNoLnVwZGF0ZU1hdHJpeCgpO1xuXG4gICAgICAgIHRoaXMuYWRkKHRoaXMubWVzaCk7XG4gICAgICAgIHRoaXMuc2V0Q29sb3IoKTtcblxuICAgIH1cblxuICAgIGZpbGxQb3NpdGlvblRleHR1cmUoIHRleHR1cmUgKSB7XG4gICAgICAgIHZhciB0aGVBcnJheSA9IHRleHR1cmUuaW1hZ2UuZGF0YTtcblxuICAgICAgICBmb3IgKCB2YXIgayA9IDAsIGtsID0gdGhlQXJyYXkubGVuZ3RoOyBrIDwga2w7IGsgKz0gNCApIHtcblxuICAgICAgICAgICAgdmFyIHggPSAoTWF0aC5yYW5kb20oKSAqIHRoaXMuQk9VTkRTIC0gdGhpcy5CT1VORFNfSEFMRikvMTtcbiAgICAgICAgICAgIHZhciB5ID0gKE1hdGgucmFuZG9tKCkgKiB0aGlzLkJPVU5EUyAtIHRoaXMuQk9VTkRTX0hBTEYpLzE7XG4gICAgICAgICAgICB2YXIgeiA9IChNYXRoLnJhbmRvbSgpICogdGhpcy5CT1VORFMgLSB0aGlzLkJPVU5EU19IQUxGKS8xO1xuXG4gICAgICAgICAgICB0aGVBcnJheVsgayArIDAgXSA9IHg7XG4gICAgICAgICAgICB0aGVBcnJheVsgayArIDEgXSA9IHk7XG4gICAgICAgICAgICB0aGVBcnJheVsgayArIDIgXSA9IHo7XG4gICAgICAgICAgICB0aGVBcnJheVsgayArIDMgXSA9IDE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaWxsVmVsb2NpdHlUZXh0dXJlKCB0ZXh0dXJlICkge1xuICAgICAgICB2YXIgdGhlQXJyYXkgPSB0ZXh0dXJlLmltYWdlLmRhdGE7XG5cbiAgICAgICAgZm9yICggdmFyIGsgPSAwLCBrbCA9IHRoZUFycmF5Lmxlbmd0aDsgayA8IGtsOyBrICs9IDQgKSB7XG4gICAgICAgICAgICB2YXIgeCA9IE1hdGgucmFuZG9tKCkgLSAwLjU7XG4gICAgICAgICAgICB2YXIgeSA9IE1hdGgucmFuZG9tKCkgLSAwLjU7XG4gICAgICAgICAgICB2YXIgeiA9IE1hdGgucmFuZG9tKCkgLSAwLjU7XG5cbiAgICAgICAgICAgIHRoZUFycmF5WyBrICsgMCBdID0geCAqIDEwO1xuICAgICAgICAgICAgdGhlQXJyYXlbIGsgKyAxIF0gPSB5ICogMTA7XG4gICAgICAgICAgICB0aGVBcnJheVsgayArIDIgXSA9IHogKiAxMDtcbiAgICAgICAgICAgIHRoZUFycmF5WyBrICsgMyBdID0gMTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuIiwiaW1wb3J0IE5vdGUgZnJvbSAnLi9tdXNpY3RoZW9yeS9ub3RlLmVzNic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXMsIGNiKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBldmVudCBjYWxsYmFja1xuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fY2FsbGJhY2sgPSBjYjtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSlNPTiBjb25maWdcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2NvbmZpZyA9IHBhcmFtcztcblxuICAgICAgICAvKipcbiAgICAgICAgICoga2V5cyBkb3duXG4gICAgICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2tleXMgPSBbXTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogcG90ZW50aWFsIGtleXMgcHJlc3NlZCBpbiBvcmRlclxuICAgICAgICAgKiBAdHlwZSB7c3RyaW5nW119XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9wb3RlbnRpYWxLZXlzID0gW1xuICAgICAgICAgICAgJ2AnLCAnMScsICcyJywgJzMnLCAnNCcsICc1JywgJzYnLCAnNycsICc4JywgJzknLCAnMCcsICctJywgJysnLFxuICAgICAgICAgICAgJ3EnLCAndycsICdlJywgJ3InLCAndCcsICd5JywgJ3UnLCAnaScsICdvJywgJ3AnLCAnWycsICddJywgJ1xcXFwnLFxuICAgICAgICAgICAgJ2EnLCAncycsICdkJywgJ2YnLCAnZycsICdoJywgJ2onLCAnaycsICdsJywgJzsnLCAnXFwnJ1xuICAgICAgICBdO1xuXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBldmVudCA9PiB0aGlzLm9uS2V5RG93bihldmVudCkpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGV2ZW50ID0+IHRoaXMub25LZXlVcChldmVudCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdldCBrZXlzIGRvd25cbiAgICAgKiBAcGFyYW0gbWFwcGluZ1xuICAgICAqL1xuICAgIGdldEtleXNEb3duKCkge1xuICAgICAgICB2YXIgZG93biA9IFtdO1xuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IHRoaXMuX2tleXMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9rZXlzW2NdID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBvY3RhdmUgPSAwO1xuICAgICAgICAgICAgICAgIGlmIChjID49IHRoaXMuX2tleXMubGVuZ3RoLzIpIHsgb2N0YXZlID0gMTsgfVxuICAgICAgICAgICAgICAgIGRvd24ucHVzaCggeyBub3RhdGlvbjogTm90ZS5ub3RhdGlvbkF0SW5kZXgoYyksIG9jdGF2ZTogb2N0YXZlICsgMiwgaW5kZXg6IGMsIHZlbG9jaXR5OiB0aGlzLl9rZXlzW2NdfSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkb3duO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG9uIGtleSBkb3duXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICovXG4gICAgb25LZXlEb3duKGV2ZW50KSB7XG4gICAgICAgIHZhciBrZXkgPSB0aGlzLl9wb3RlbnRpYWxLZXlzLmluZGV4T2YoZXZlbnQua2V5LnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICBpZiAoa2V5ICE9PSAtMSAmJiAodGhpcy5fa2V5c1trZXldID09PSAwIHx8ICF0aGlzLl9rZXlzW2tleV0pKSB7XG4gICAgICAgICAgICB0aGlzLl9rZXlzW2tleV0gPSAxLjA7IC8vIG9uIGFuIGFjdHVhbCBNSURJIGtleWJvYXJkLCB3ZSdkIGhhdmUgYSB2ZWxvY2l0eVxuICAgICAgICAgICAgdmFyIG9jdGF2ZSA9IE1hdGguZmxvb3Ioa2V5IC8gTm90ZS5zaGFycE5vdGF0aW9ucy5sZW5ndGgpO1xuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2soe1xuICAgICAgICAgICAgICAgIG5vdGF0aW9uOiBOb3RlLm5vdGF0aW9uQXRJbmRleChrZXkpLFxuICAgICAgICAgICAgICAgIG9jdGF2ZTogb2N0YXZlICsgdGhpcy5fY29uZmlnLnN0YXJ0b2N0YXZlLFxuICAgICAgICAgICAgICAgIC8vaW5kZXg6IGtleSxcbiAgICAgICAgICAgICAgICB2ZWxvY2l0eTogMS4wLFxuICAgICAgICAgICAgICAgIGFjdGlvbjogJ3ByZXNzJyB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG9uIGtleSBkb3duXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICovXG4gICAgb25LZXlVcChldmVudCkge1xuICAgICAgICB2YXIga2V5ID0gdGhpcy5fcG90ZW50aWFsS2V5cy5pbmRleE9mKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgaWYgKGtleSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuX2tleXNba2V5XSA9IDAuMDsgLy8gb24gYW4gYWN0dWFsIE1JREkga2V5Ym9hcmQsIHdlJ2QgaGF2ZSBhIHZlbG9jaXR5XG4gICAgICAgICAgICB2YXIgb2N0YXZlID0gTWF0aC5mbG9vcihrZXkgLyBOb3RlLnNoYXJwTm90YXRpb25zLmxlbmd0aCk7XG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFjayh7XG4gICAgICAgICAgICAgICAgbm90YXRpb246IE5vdGUubm90YXRpb25BdEluZGV4KGtleSksXG4gICAgICAgICAgICAgICAgb2N0YXZlOiBvY3RhdmUgKyB0aGlzLl9jb25maWcuc3RhcnRvY3RhdmUsXG4gICAgICAgICAgICAgICAgLy9pbmRleDoga2V5LFxuICAgICAgICAgICAgICAgIHZlbG9jaXR5OiAwLFxuICAgICAgICAgICAgICAgIGFjdGlvbjogJ3JlbGVhc2UnIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQge1xuICBcImV4cGxvc2lvblwiOiB7XG4gICAgXCJmcmFnbWVudFwiOiBcInZhcnlpbmcgZmxvYXQgbm9pc2U7IHVuaWZvcm0gc2FtcGxlcjJEIHRFeHBsb3Npb247ICBmbG9hdCByYW5kb20oIHZlYzMgc2NhbGUsIGZsb2F0IHNlZWQgKXsgICByZXR1cm4gZnJhY3QoIHNpbiggZG90KCBnbF9GcmFnQ29vcmQueHl6ICsgc2VlZCwgc2NhbGUgKSApICogNDM3NTguNTQ1MyArIHNlZWQgKSA7IH0gIHZvaWQgbWFpbigpIHsgICAgZmxvYXQgciA9IC4wMSAqIHJhbmRvbSggdmVjMyggMTIuOTg5OCwgNzguMjMzLCAxNTEuNzE4MiApLCAwLjAgKTsgICB2ZWMyIHRQb3MgPSB2ZWMyKCAwLCAxLjAgLSAxLjMgKiBub2lzZSArIHIgKTsgICB2ZWM0IGNvbG9yID0gdGV4dHVyZTJEKCB0RXhwbG9zaW9uLCB0UG9zICk7ICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCggY29sb3IucmdiLCAxLjAgKTsgIH1cIixcbiAgICBcInZlcnRleFwiOiBcIiAgdmVjMyBtb2QyODkodmVjMyB4KSB7ICAgcmV0dXJuIHggLSBmbG9vcih4ICogKDEuMCAvIDI4OS4wKSkgKiAyODkuMDsgfSAgdmVjNCBtb2QyODkodmVjNCB4KSB7ICAgcmV0dXJuIHggLSBmbG9vcih4ICogKDEuMCAvIDI4OS4wKSkgKiAyODkuMDsgfSAgdmVjNCBwZXJtdXRlKHZlYzQgeCkgeyAgIHJldHVybiBtb2QyODkoKCh4KjM0LjApKzEuMCkqeCk7IH0gIHZlYzQgdGF5bG9ySW52U3FydCh2ZWM0IHIpIHsgICByZXR1cm4gMS43OTI4NDI5MTQwMDE1OSAtIDAuODUzNzM0NzIwOTUzMTQgKiByOyB9ICB2ZWMzIGZhZGUodmVjMyB0KSB7ICAgcmV0dXJuIHQqdCp0Kih0Kih0KjYuMC0xNS4wKSsxMC4wKTsgfSAgZmxvYXQgY25vaXNlKHZlYzMgUCkgeyAgIHZlYzMgUGkwID0gZmxvb3IoUCk7ICAgdmVjMyBQaTEgPSBQaTAgKyB2ZWMzKDEuMCk7ICAgUGkwID0gbW9kMjg5KFBpMCk7ICAgUGkxID0gbW9kMjg5KFBpMSk7ICAgdmVjMyBQZjAgPSBmcmFjdChQKTsgICB2ZWMzIFBmMSA9IFBmMCAtIHZlYzMoMS4wKTsgICB2ZWM0IGl4ID0gdmVjNChQaTAueCwgUGkxLngsIFBpMC54LCBQaTEueCk7ICAgdmVjNCBpeSA9IHZlYzQoUGkwLnl5LCBQaTEueXkpOyAgIHZlYzQgaXowID0gUGkwLnp6eno7ICAgdmVjNCBpejEgPSBQaTEuenp6ejsgICAgdmVjNCBpeHkgPSBwZXJtdXRlKHBlcm11dGUoaXgpICsgaXkpOyAgIHZlYzQgaXh5MCA9IHBlcm11dGUoaXh5ICsgaXowKTsgICB2ZWM0IGl4eTEgPSBwZXJtdXRlKGl4eSArIGl6MSk7ICAgIHZlYzQgZ3gwID0gaXh5MCAqICgxLjAgLyA3LjApOyAgIHZlYzQgZ3kwID0gZnJhY3QoZmxvb3IoZ3gwKSAqICgxLjAgLyA3LjApKSAtIDAuNTsgICBneDAgPSBmcmFjdChneDApOyAgIHZlYzQgZ3owID0gdmVjNCgwLjUpIC0gYWJzKGd4MCkgLSBhYnMoZ3kwKTsgICB2ZWM0IHN6MCA9IHN0ZXAoZ3owLCB2ZWM0KDAuMCkpOyAgIGd4MCAtPSBzejAgKiAoc3RlcCgwLjAsIGd4MCkgLSAwLjUpOyAgIGd5MCAtPSBzejAgKiAoc3RlcCgwLjAsIGd5MCkgLSAwLjUpOyAgICB2ZWM0IGd4MSA9IGl4eTEgKiAoMS4wIC8gNy4wKTsgICB2ZWM0IGd5MSA9IGZyYWN0KGZsb29yKGd4MSkgKiAoMS4wIC8gNy4wKSkgLSAwLjU7ICAgZ3gxID0gZnJhY3QoZ3gxKTsgICB2ZWM0IGd6MSA9IHZlYzQoMC41KSAtIGFicyhneDEpIC0gYWJzKGd5MSk7ICAgdmVjNCBzejEgPSBzdGVwKGd6MSwgdmVjNCgwLjApKTsgICBneDEgLT0gc3oxICogKHN0ZXAoMC4wLCBneDEpIC0gMC41KTsgICBneTEgLT0gc3oxICogKHN0ZXAoMC4wLCBneTEpIC0gMC41KTsgICAgdmVjMyBnMDAwID0gdmVjMyhneDAueCxneTAueCxnejAueCk7ICAgdmVjMyBnMTAwID0gdmVjMyhneDAueSxneTAueSxnejAueSk7ICAgdmVjMyBnMDEwID0gdmVjMyhneDAueixneTAueixnejAueik7ICAgdmVjMyBnMTEwID0gdmVjMyhneDAudyxneTAudyxnejAudyk7ICAgdmVjMyBnMDAxID0gdmVjMyhneDEueCxneTEueCxnejEueCk7ICAgdmVjMyBnMTAxID0gdmVjMyhneDEueSxneTEueSxnejEueSk7ICAgdmVjMyBnMDExID0gdmVjMyhneDEueixneTEueixnejEueik7ICAgdmVjMyBnMTExID0gdmVjMyhneDEudyxneTEudyxnejEudyk7ICAgIHZlYzQgbm9ybTAgPSB0YXlsb3JJbnZTcXJ0KHZlYzQoZG90KGcwMDAsIGcwMDApLCBkb3QoZzAxMCwgZzAxMCksIGRvdChnMTAwLCBnMTAwKSwgZG90KGcxMTAsIGcxMTApKSk7ICAgZzAwMCAqPSBub3JtMC54OyAgIGcwMTAgKj0gbm9ybTAueTsgICBnMTAwICo9IG5vcm0wLno7ICAgZzExMCAqPSBub3JtMC53OyAgIHZlYzQgbm9ybTEgPSB0YXlsb3JJbnZTcXJ0KHZlYzQoZG90KGcwMDEsIGcwMDEpLCBkb3QoZzAxMSwgZzAxMSksIGRvdChnMTAxLCBnMTAxKSwgZG90KGcxMTEsIGcxMTEpKSk7ICAgZzAwMSAqPSBub3JtMS54OyAgIGcwMTEgKj0gbm9ybTEueTsgICBnMTAxICo9IG5vcm0xLno7ICAgZzExMSAqPSBub3JtMS53OyAgICBmbG9hdCBuMDAwID0gZG90KGcwMDAsIFBmMCk7ICAgZmxvYXQgbjEwMCA9IGRvdChnMTAwLCB2ZWMzKFBmMS54LCBQZjAueXopKTsgICBmbG9hdCBuMDEwID0gZG90KGcwMTAsIHZlYzMoUGYwLngsIFBmMS55LCBQZjAueikpOyAgIGZsb2F0IG4xMTAgPSBkb3QoZzExMCwgdmVjMyhQZjEueHksIFBmMC56KSk7ICAgZmxvYXQgbjAwMSA9IGRvdChnMDAxLCB2ZWMzKFBmMC54eSwgUGYxLnopKTsgICBmbG9hdCBuMTAxID0gZG90KGcxMDEsIHZlYzMoUGYxLngsIFBmMC55LCBQZjEueikpOyAgIGZsb2F0IG4wMTEgPSBkb3QoZzAxMSwgdmVjMyhQZjAueCwgUGYxLnl6KSk7ICAgZmxvYXQgbjExMSA9IGRvdChnMTExLCBQZjEpOyAgICB2ZWMzIGZhZGVfeHl6ID0gZmFkZShQZjApOyAgIHZlYzQgbl96ID0gbWl4KHZlYzQobjAwMCwgbjEwMCwgbjAxMCwgbjExMCksIHZlYzQobjAwMSwgbjEwMSwgbjAxMSwgbjExMSksIGZhZGVfeHl6LnopOyAgIHZlYzIgbl95eiA9IG1peChuX3oueHksIG5fei56dywgZmFkZV94eXoueSk7ICAgZmxvYXQgbl94eXogPSBtaXgobl95ei54LCBuX3l6LnksIGZhZGVfeHl6LngpOyAgIHJldHVybiAyLjIgKiBuX3h5ejsgfSAgZmxvYXQgcG5vaXNlKHZlYzMgUCwgdmVjMyByZXApIHsgICB2ZWMzIFBpMCA9IG1vZChmbG9vcihQKSwgcmVwKTsgICB2ZWMzIFBpMSA9IG1vZChQaTAgKyB2ZWMzKDEuMCksIHJlcCk7ICAgUGkwID0gbW9kMjg5KFBpMCk7ICAgUGkxID0gbW9kMjg5KFBpMSk7ICAgdmVjMyBQZjAgPSBmcmFjdChQKTsgICB2ZWMzIFBmMSA9IFBmMCAtIHZlYzMoMS4wKTsgICB2ZWM0IGl4ID0gdmVjNChQaTAueCwgUGkxLngsIFBpMC54LCBQaTEueCk7ICAgdmVjNCBpeSA9IHZlYzQoUGkwLnl5LCBQaTEueXkpOyAgIHZlYzQgaXowID0gUGkwLnp6eno7ICAgdmVjNCBpejEgPSBQaTEuenp6ejsgICAgdmVjNCBpeHkgPSBwZXJtdXRlKHBlcm11dGUoaXgpICsgaXkpOyAgIHZlYzQgaXh5MCA9IHBlcm11dGUoaXh5ICsgaXowKTsgICB2ZWM0IGl4eTEgPSBwZXJtdXRlKGl4eSArIGl6MSk7ICAgIHZlYzQgZ3gwID0gaXh5MCAqICgxLjAgLyA3LjApOyAgIHZlYzQgZ3kwID0gZnJhY3QoZmxvb3IoZ3gwKSAqICgxLjAgLyA3LjApKSAtIDAuNTsgICBneDAgPSBmcmFjdChneDApOyAgIHZlYzQgZ3owID0gdmVjNCgwLjUpIC0gYWJzKGd4MCkgLSBhYnMoZ3kwKTsgICB2ZWM0IHN6MCA9IHN0ZXAoZ3owLCB2ZWM0KDAuMCkpOyAgIGd4MCAtPSBzejAgKiAoc3RlcCgwLjAsIGd4MCkgLSAwLjUpOyAgIGd5MCAtPSBzejAgKiAoc3RlcCgwLjAsIGd5MCkgLSAwLjUpOyAgICB2ZWM0IGd4MSA9IGl4eTEgKiAoMS4wIC8gNy4wKTsgICB2ZWM0IGd5MSA9IGZyYWN0KGZsb29yKGd4MSkgKiAoMS4wIC8gNy4wKSkgLSAwLjU7ICAgZ3gxID0gZnJhY3QoZ3gxKTsgICB2ZWM0IGd6MSA9IHZlYzQoMC41KSAtIGFicyhneDEpIC0gYWJzKGd5MSk7ICAgdmVjNCBzejEgPSBzdGVwKGd6MSwgdmVjNCgwLjApKTsgICBneDEgLT0gc3oxICogKHN0ZXAoMC4wLCBneDEpIC0gMC41KTsgICBneTEgLT0gc3oxICogKHN0ZXAoMC4wLCBneTEpIC0gMC41KTsgICAgdmVjMyBnMDAwID0gdmVjMyhneDAueCxneTAueCxnejAueCk7ICAgdmVjMyBnMTAwID0gdmVjMyhneDAueSxneTAueSxnejAueSk7ICAgdmVjMyBnMDEwID0gdmVjMyhneDAueixneTAueixnejAueik7ICAgdmVjMyBnMTEwID0gdmVjMyhneDAudyxneTAudyxnejAudyk7ICAgdmVjMyBnMDAxID0gdmVjMyhneDEueCxneTEueCxnejEueCk7ICAgdmVjMyBnMTAxID0gdmVjMyhneDEueSxneTEueSxnejEueSk7ICAgdmVjMyBnMDExID0gdmVjMyhneDEueixneTEueixnejEueik7ICAgdmVjMyBnMTExID0gdmVjMyhneDEudyxneTEudyxnejEudyk7ICAgIHZlYzQgbm9ybTAgPSB0YXlsb3JJbnZTcXJ0KHZlYzQoZG90KGcwMDAsIGcwMDApLCBkb3QoZzAxMCwgZzAxMCksIGRvdChnMTAwLCBnMTAwKSwgZG90KGcxMTAsIGcxMTApKSk7ICAgZzAwMCAqPSBub3JtMC54OyAgIGcwMTAgKj0gbm9ybTAueTsgICBnMTAwICo9IG5vcm0wLno7ICAgZzExMCAqPSBub3JtMC53OyAgIHZlYzQgbm9ybTEgPSB0YXlsb3JJbnZTcXJ0KHZlYzQoZG90KGcwMDEsIGcwMDEpLCBkb3QoZzAxMSwgZzAxMSksIGRvdChnMTAxLCBnMTAxKSwgZG90KGcxMTEsIGcxMTEpKSk7ICAgZzAwMSAqPSBub3JtMS54OyAgIGcwMTEgKj0gbm9ybTEueTsgICBnMTAxICo9IG5vcm0xLno7ICAgZzExMSAqPSBub3JtMS53OyAgICBmbG9hdCBuMDAwID0gZG90KGcwMDAsIFBmMCk7ICAgZmxvYXQgbjEwMCA9IGRvdChnMTAwLCB2ZWMzKFBmMS54LCBQZjAueXopKTsgICBmbG9hdCBuMDEwID0gZG90KGcwMTAsIHZlYzMoUGYwLngsIFBmMS55LCBQZjAueikpOyAgIGZsb2F0IG4xMTAgPSBkb3QoZzExMCwgdmVjMyhQZjEueHksIFBmMC56KSk7ICAgZmxvYXQgbjAwMSA9IGRvdChnMDAxLCB2ZWMzKFBmMC54eSwgUGYxLnopKTsgICBmbG9hdCBuMTAxID0gZG90KGcxMDEsIHZlYzMoUGYxLngsIFBmMC55LCBQZjEueikpOyAgIGZsb2F0IG4wMTEgPSBkb3QoZzAxMSwgdmVjMyhQZjAueCwgUGYxLnl6KSk7ICAgZmxvYXQgbjExMSA9IGRvdChnMTExLCBQZjEpOyAgICB2ZWMzIGZhZGVfeHl6ID0gZmFkZShQZjApOyAgIHZlYzQgbl96ID0gbWl4KHZlYzQobjAwMCwgbjEwMCwgbjAxMCwgbjExMCksIHZlYzQobjAwMSwgbjEwMSwgbjAxMSwgbjExMSksIGZhZGVfeHl6LnopOyAgIHZlYzIgbl95eiA9IG1peChuX3oueHksIG5fei56dywgZmFkZV94eXoueSk7ICAgZmxvYXQgbl94eXogPSBtaXgobl95ei54LCBuX3l6LnksIGZhZGVfeHl6LngpOyAgIHJldHVybiAyLjIgKiBuX3h5ejsgfSAgdmFyeWluZyBmbG9hdCBub2lzZTsgdW5pZm9ybSBmbG9hdCB0aW1lOyAgZmxvYXQgdHVyYnVsZW5jZSggdmVjMyBwICkgeyAgIGZsb2F0IHcgPSAxMDAuMDsgICBmbG9hdCB0ID0gLS41OyAgIGZvciAoZmxvYXQgZiA9IDEuMCA7IGYgPD0gMTAuMCA7IGYrKyApeyAgICAgZmxvYXQgcG93ZXIgPSBwb3coIDIuMCwgZiApOyAgICAgdCArPSBhYnMoIHBub2lzZSggdmVjMyggcG93ZXIgKiBwICksIHZlYzMoIDEwLjAsIDEwLjAsIDEwLjAgKSApIC8gcG93ZXIgKTsgICB9ICAgcmV0dXJuIHQ7IH0gIHZvaWQgbWFpbigpIHsgICBub2lzZSA9IDEwLjAgKiAgLS4xMCAqIHR1cmJ1bGVuY2UoIC41ICogbm9ybWFsICsgdGltZSApOyAgIGZsb2F0IGIgPSA1LjAgKiBwbm9pc2UoIDAuMDUgKiBwb3NpdGlvbiArIHZlYzMoIDIuMCAqIHRpbWUgKSwgdmVjMyggMTAwLjAgKSApOyAgIGZsb2F0IGRpc3BsYWNlbWVudCA9IC0gMTAuICogbm9pc2UgKyBiOyAgICB2ZWMzIG5ld1Bvc2l0aW9uID0gcG9zaXRpb24gKyBub3JtYWwgKiBkaXNwbGFjZW1lbnQ7ICAgZ2xfUG9zaXRpb24gPSBwcm9qZWN0aW9uTWF0cml4ICogbW9kZWxWaWV3TWF0cml4ICogdmVjNCggbmV3UG9zaXRpb24sIDEuMCApOyAgfVwiXG4gIH0sXG4gIFwiZmxvY2tcIjoge1xuICAgIFwiZnJhZ21lbnRcIjogXCJ1bmlmb3JtIHZlYzMgY29sb3I7ICB2b2lkIG1haW4oKSB7ICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KCBjb2xvciwgMC4xICk7IH0gXCIsXG4gICAgXCJ2ZXJ0ZXhcIjogXCJhdHRyaWJ1dGUgdmVjMiByZWZlcmVuY2U7IGF0dHJpYnV0ZSBmbG9hdCB2ZXJ0ZXg7ICB1bmlmb3JtIHNhbXBsZXIyRCB0ZXh0dXJlUG9zaXRpb247IHVuaWZvcm0gc2FtcGxlcjJEIHRleHR1cmVWZWxvY2l0eTsgIHVuaWZvcm0gZmxvYXQgdGltZTsgIHZvaWQgbWFpbigpIHsgICAgICB2ZWM0IHRtcFBvcyA9IHRleHR1cmUyRCggdGV4dHVyZVBvc2l0aW9uLCByZWZlcmVuY2UgKTsgICAgIHZlYzMgcG9zID0gdG1wUG9zLnh5ejsgICAgIHZlYzMgdmVsb2NpdHkgPSBub3JtYWxpemUodGV4dHVyZTJEKCB0ZXh0dXJlVmVsb2NpdHksIHJlZmVyZW5jZSApLnh5eik7ICAgICAgdmVjMyBuZXdQb3NpdGlvbiA9IHBvc2l0aW9uOyAgICAgIGlmICggdmVydGV4ID09IDQuMCB8fCB2ZXJ0ZXggPT0gNy4wICkgeyAgICAgICAgICAgICAgICAgbmV3UG9zaXRpb24ueSA9IHNpbiggdG1wUG9zLncgKSAqIDUuOyAgICAgfSAgICAgIG5ld1Bvc2l0aW9uID0gbWF0MyggbW9kZWxNYXRyaXggKSAqIG5ld1Bvc2l0aW9uOyAgICAgICB2ZWxvY2l0eS56ICo9IC0xLjsgICAgIGZsb2F0IHh6ID0gbGVuZ3RoKCB2ZWxvY2l0eS54eiApOyAgICAgZmxvYXQgeHl6ID0gMS47ICAgICBmbG9hdCB4ID0gc3FydCggMS4gLSB2ZWxvY2l0eS55ICogdmVsb2NpdHkueSApOyAgICAgIGZsb2F0IGNvc3J5ID0gdmVsb2NpdHkueCAvIHh6OyAgICAgZmxvYXQgc2lucnkgPSB2ZWxvY2l0eS56IC8geHo7ICAgICAgZmxvYXQgY29zcnogPSB4IC8geHl6OyAgICAgZmxvYXQgc2lucnogPSB2ZWxvY2l0eS55IC8geHl6OyAgICAgIG1hdDMgbWF0eSA9ICBtYXQzKCAgICAgICAgIGNvc3J5LCAwLCAtc2lucnksICAgICAgICAgMCAgICAsIDEsIDAgICAgICwgICAgICAgICBzaW5yeSwgMCwgY29zcnkgICAgICApOyAgICAgIG1hdDMgbWF0eiA9ICBtYXQzKCAgICAgICAgIGNvc3J6ICwgc2lucnosIDAsICAgICAgICAgLXNpbnJ6LCBjb3NyeiwgMCwgICAgICAgICAwICAgICAsIDAgICAgLCAxICAgICApOyAgICAgIG5ld1Bvc2l0aW9uID0gIG1hdHkgKiBtYXR6ICogbmV3UG9zaXRpb247ICAgICBuZXdQb3NpdGlvbiArPSBwb3M7ICAgICBnbF9Qb3NpdGlvbiA9IHByb2plY3Rpb25NYXRyaXggKiAgdmlld01hdHJpeCAgKiB2ZWM0KCBuZXdQb3NpdGlvbiwgMS4wICk7IH0gXCJcbiAgfSxcbiAgXCJmbG9ja3Bvc2l0aW9uXCI6IHtcbiAgICBcImZyYWdtZW50XCI6IFwidW5pZm9ybSBmbG9hdCB0aW1lOyB1bmlmb3JtIGZsb2F0IGRlbHRhOyB1bmlmb3JtIGZsb2F0IGRlcHRoOyAgdm9pZCBtYWluKCkgeyAgICAgIHZlYzIgdXYgPSBnbF9GcmFnQ29vcmQueHkgLyByZXNvbHV0aW9uLnh5OyAgICAgdmVjNCB0bXBQb3MgPSB0ZXh0dXJlMkQoIHRleHR1cmVQb3NpdGlvbiwgdXYgKTsgICAgIHZlYzMgcG9zaXRpb24gPSB0bXBQb3MueHl6OyAgICAgdmVjMyB2ZWxvY2l0eSA9IHRleHR1cmUyRCggdGV4dHVyZVZlbG9jaXR5LCB1diApLnh5ejsgICAgICBmbG9hdCBwaGFzZSA9IHRtcFBvcy53OyAgICAgIHBoYXNlID0gbW9kKCAoIHBoYXNlICsgZGVsdGEgKyAgICAgICAgIGxlbmd0aCggdmVsb2NpdHkueHogKSAqIGRlbHRhICogMy4gKyAgICAgICAgIG1heCggdmVsb2NpdHkueSwgMC4wICkgKiBkZWx0YSAqIDYuICksIDYyLjgzICk7ICAgICAgdmVjMyBjYWxjdWxhdGVkUG9zID0gdmVjMyggcG9zaXRpb24gKyB2ZWxvY2l0eSAqIGRlbHRhICogMTUuKTsgICAgIGNhbGN1bGF0ZWRQb3MueSA9IGNsYW1wKCBjYWxjdWxhdGVkUG9zLnksIC0yMDAwLjAsIGRlcHRoKTsgICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoIGNhbGN1bGF0ZWRQb3MsIHBoYXNlKTsgIH0gXCJcbiAgfSxcbiAgXCJmbG9ja3ZlbG9jaXR5XCI6IHtcbiAgICBcImZyYWdtZW50XCI6IFwidW5pZm9ybSBmbG9hdCB0aW1lOyB1bmlmb3JtIGZsb2F0IHRlc3Rpbmc7IHVuaWZvcm0gZmxvYXQgZGVsdGE7IHVuaWZvcm0gZmxvYXQgc2VwZXJhdGlvbkRpc3RhbmNlOyB1bmlmb3JtIGZsb2F0IGFsaWdubWVudERpc3RhbmNlOyB1bmlmb3JtIGZsb2F0IGNvaGVzaW9uRGlzdGFuY2U7IHVuaWZvcm0gZmxvYXQgZnJlZWRvbUZhY3RvcjsgIGNvbnN0IGZsb2F0IHdpZHRoID0gcmVzb2x1dGlvbi54OyBjb25zdCBmbG9hdCBoZWlnaHQgPSByZXNvbHV0aW9uLnk7ICBjb25zdCBmbG9hdCBQSSA9IDMuMTQxNTkyNjUzNTg5NzkzOyBjb25zdCBmbG9hdCBQSV8yID0gUEkgKiAyLjA7ICBmbG9hdCB6b25lUmFkaXVzID0gMTYwLjA7IGZsb2F0IHpvbmVSYWRpdXNTcXVhcmVkID0gMjU2MDAuMDsgIGZsb2F0IHNlcGFyYXRpb25UaHJlc2ggPSAwLjQ1OyBmbG9hdCBhbGlnbm1lbnRUaHJlc2ggPSAwLjY1OyAgY29uc3QgZmxvYXQgVVBQRVJfQk9VTkRTID0gQk9VTkRTOyBjb25zdCBmbG9hdCBMT1dFUl9CT1VORFMgPSAtVVBQRVJfQk9VTkRTOyAgY29uc3QgZmxvYXQgU1BFRURfTElNSVQgPSA5LjA7ICBmbG9hdCByYW5kKHZlYzIgY28peyAgICAgcmV0dXJuIGZyYWN0KHNpbihkb3QoY28ueHkgLHZlYzIoMTIuOTg5OCw3OC4yMzMpKSkgKiA0Mzc1OC41NDUzKTsgfSAgdm9pZCBtYWluKCkgeyAgICAgIHpvbmVSYWRpdXMgPSBzZXBlcmF0aW9uRGlzdGFuY2UgKyBhbGlnbm1lbnREaXN0YW5jZSArIGNvaGVzaW9uRGlzdGFuY2U7ICAgICBzZXBhcmF0aW9uVGhyZXNoID0gc2VwZXJhdGlvbkRpc3RhbmNlIC8gem9uZVJhZGl1czsgICAgIGFsaWdubWVudFRocmVzaCA9ICggc2VwZXJhdGlvbkRpc3RhbmNlICsgYWxpZ25tZW50RGlzdGFuY2UgKSAvIHpvbmVSYWRpdXM7ICAgICB6b25lUmFkaXVzU3F1YXJlZCA9IHpvbmVSYWRpdXMgKiB6b25lUmFkaXVzOyAgICAgICB2ZWMyIHV2ID0gZ2xfRnJhZ0Nvb3JkLnh5IC8gcmVzb2x1dGlvbi54eTsgICAgIHZlYzMgZmxvY2twb3NpdGlvbiwgZmxvY2t2ZWxvY2l0eTsgICAgICB2ZWMzIHNlbGZQb3NpdGlvbiA9IHRleHR1cmUyRCggdGV4dHVyZVBvc2l0aW9uLCB1diApLnh5ejsgICAgIHZlYzMgc2VsZlZlbG9jaXR5ID0gdGV4dHVyZTJEKCB0ZXh0dXJlVmVsb2NpdHksIHV2ICkueHl6OyAgICAgIGZsb2F0IGRpc3Q7ICAgICB2ZWMzIGRpcjsgICAgIGZsb2F0IGRpc3RTcXVhcmVkOyAgICAgIGZsb2F0IHNlcGVyYXRpb25TcXVhcmVkID0gc2VwZXJhdGlvbkRpc3RhbmNlICogc2VwZXJhdGlvbkRpc3RhbmNlOyAgICAgZmxvYXQgY29oZXNpb25TcXVhcmVkID0gY29oZXNpb25EaXN0YW5jZSAqIGNvaGVzaW9uRGlzdGFuY2U7ICAgICAgZmxvYXQgZjsgICAgIGZsb2F0IHBlcmNlbnQ7ICAgICAgdmVjMyB2ZWxvY2l0eSA9IHNlbGZWZWxvY2l0eTsgICAgICBmbG9hdCBsaW1pdCA9IFNQRUVEX0xJTUlUOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVjMyBjZW50cmFsID0gdmVjMyggMC4sIDAuLCAwLiApOyAgICAgZGlyID0gc2VsZlBvc2l0aW9uIC0gY2VudHJhbDsgICAgIGRpc3QgPSBsZW5ndGgoIGRpciApOyAgICAgIGRpci55ICo9IDIuNTsgICAgIHZlbG9jaXR5IC09IG5vcm1hbGl6ZSggZGlyICkgKiBkZWx0YSAqIDUuOyAgICAgIGZvciAoZmxvYXQgeT0wLjA7eTxoZWlnaHQ7eSsrKSB7ICAgICAgICAgZm9yIChmbG9hdCB4PTAuMDt4PHdpZHRoO3grKykgeyAgICAgICAgICAgICAgdmVjMiByZWYgPSB2ZWMyKCB4ICsgMC41LCB5ICsgMC41ICkgLyByZXNvbHV0aW9uLnh5OyAgICAgICAgICAgICBmbG9ja3Bvc2l0aW9uID0gdGV4dHVyZTJEKCB0ZXh0dXJlUG9zaXRpb24sIHJlZiApLnh5ejsgICAgICAgICAgICAgIGRpciA9IGZsb2NrcG9zaXRpb24gLSBzZWxmUG9zaXRpb247ICAgICAgICAgICAgIGRpc3QgPSBsZW5ndGgoZGlyKTsgICAgICAgICAgICAgIGlmIChkaXN0IDwgMC4wMDAxKSBjb250aW51ZTsgICAgICAgICAgICAgIGRpc3RTcXVhcmVkID0gZGlzdCAqIGRpc3Q7ICAgICAgICAgICAgICBpZiAoZGlzdFNxdWFyZWQgPiB6b25lUmFkaXVzU3F1YXJlZCApIGNvbnRpbnVlOyAgICAgICAgICAgICAgcGVyY2VudCA9IGRpc3RTcXVhcmVkIC8gem9uZVJhZGl1c1NxdWFyZWQ7ICAgICAgICAgICAgICBpZiAoIHBlcmNlbnQgPCBzZXBhcmF0aW9uVGhyZXNoICkgeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmID0gKHNlcGFyYXRpb25UaHJlc2ggLyBwZXJjZW50IC0gMS4wKSAqIGRlbHRhOyAgICAgICAgICAgICAgICAgdmVsb2NpdHkgLT0gbm9ybWFsaXplKGRpcikgKiBmOyAgICAgICAgICAgICAgfSBlbHNlIGlmICggcGVyY2VudCA8IGFsaWdubWVudFRocmVzaCApIHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxvYXQgdGhyZXNoRGVsdGEgPSBhbGlnbm1lbnRUaHJlc2ggLSBzZXBhcmF0aW9uVGhyZXNoOyAgICAgICAgICAgICAgICAgZmxvYXQgYWRqdXN0ZWRQZXJjZW50ID0gKCBwZXJjZW50IC0gc2VwYXJhdGlvblRocmVzaCApIC8gdGhyZXNoRGVsdGE7ICAgICAgICAgICAgICAgICAgZmxvY2t2ZWxvY2l0eSA9IHRleHR1cmUyRCggdGV4dHVyZVZlbG9jaXR5LCByZWYgKS54eXo7ICAgICAgICAgICAgICAgICAgZiA9ICggMC41IC0gY29zKCBhZGp1c3RlZFBlcmNlbnQgKiBQSV8yICkgKiAwLjUgKyAwLjUgKSAqIGRlbHRhOyAgICAgICAgICAgICAgICAgZmxvY2t2ZWxvY2l0eSArPSBub3JtYWxpemUoZmxvY2t2ZWxvY2l0eSkgKiBmOyAgICAgICAgICAgICAgfSBlbHNlIHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxvYXQgdGhyZXNoRGVsdGEgPSAxLjAgLSBhbGlnbm1lbnRUaHJlc2g7ICAgICAgICAgICAgICAgICBmbG9hdCBhZGp1c3RlZFBlcmNlbnQgPSAoIHBlcmNlbnQgLSBhbGlnbm1lbnRUaHJlc2ggKSAvIHRocmVzaERlbHRhOyAgICAgICAgICAgICAgICAgIGYgPSAoIDAuNSAtICggY29zKCBhZGp1c3RlZFBlcmNlbnQgKiBQSV8yICkgKiAtMC41ICsgMC41ICkgKSAqIGRlbHRhOyAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ICs9IG5vcm1hbGl6ZShkaXIpICogZjsgICAgICAgICAgICAgIH0gICAgICAgICAgfSAgICAgIH0gICAgICAgICAgICAgICAgICAgIGlmICggbGVuZ3RoKCB2ZWxvY2l0eSApID4gbGltaXQgKSB7ICAgICAgICAgdmVsb2NpdHkgPSBub3JtYWxpemUoIHZlbG9jaXR5ICkgKiBsaW1pdDsgICAgIH0gICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KCB2ZWxvY2l0eSwgMS4wICk7ICB9IFwiXG4gIH0sXG4gIFwiZ2xvd1wiOiB7XG4gICAgXCJmcmFnbWVudFwiOiBcInVuaWZvcm0gdmVjMyBnbG93Q29sb3I7IHZhcnlpbmcgZmxvYXQgaW50ZW5zaXR5OyB2b2lkIG1haW4oKSAgeyAgdmVjMyBnbG93ID0gZ2xvd0NvbG9yICogaW50ZW5zaXR5OyAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCggZ2xvdywgMS4wICk7IH1cIixcbiAgICBcInZlcnRleFwiOiBcInVuaWZvcm0gdmVjMyB2aWV3VmVjdG9yOyB1bmlmb3JtIGZsb2F0IGM7IHVuaWZvcm0gZmxvYXQgcDsgdmFyeWluZyBmbG9hdCBpbnRlbnNpdHk7IHZvaWQgbWFpbigpICB7ICAgICB2ZWMzIHZOb3JtYWwgPSBub3JtYWxpemUoIG5vcm1hbE1hdHJpeCAqIG5vcm1hbCApOyAgdmVjMyB2Tm9ybWVsID0gbm9ybWFsaXplKCBub3JtYWxNYXRyaXggKiB2aWV3VmVjdG9yICk7ICBpbnRlbnNpdHkgPSBwb3coIGMgLSBkb3Qodk5vcm1hbCwgdk5vcm1lbCksIHAgKTsgICAgICAgZ2xfUG9zaXRpb24gPSBwcm9qZWN0aW9uTWF0cml4ICogbW9kZWxWaWV3TWF0cml4ICogdmVjNCggcG9zaXRpb24sIDEuMCApOyB9XCJcbiAgfVxufSIsImV4cG9ydCBkZWZhdWx0IHtcbiAgICBuZXV0cmFsOiB7XG4gICAgICAgIHJlZDogMHg3QTY4NjksXG4gICAgICAgIGRhcmtyZWQ6IDB4MmQyNjI3LFxuICAgICAgICAvL2dyZWVuOiAweDY1ODc2RSxcblxuICAgICAgICBncmVlbjogMHhjMGM0YjYsXG4gICAgICAgIGxpZ2h0cmVkOiAweGVhZGZkYixcbiAgICAgICAgZ3JheWJsdWU6IDB4YWRhZWIwLFxuICAgICAgICBicm93bjogMHhkOGMyYjUsXG4gICAgICAgIG9yYW5nZTogMHhmMmNmYjNcbiAgICB9LFxuXG4gICAgbmVvbjoge1xuICAgICAgICBibHVlOiAweDAwZWNmZixcbiAgICAgICAgZ3JlZW46IDB4N2NmZjAwLFxuICAgICAgICB5ZWxsb3c6IDB4ZTNmZjAwLFxuICAgICAgICBvcmFuZ2U6IDB4ZmZiNDAwLFxuICAgICAgICB2aW9sZXQ6IDB4ZmQwMGZmXG4gICAgfSxcblxuICAgIGdyYXlzY2FsZTogW1xuICAgICAgICAweDAwMDAwMCxcbiAgICAgICAgMHgyYTJhMmEsXG4gICAgICAgIDB4NWE1YTVhLFxuICAgICAgICAweDhhOGE4YSxcbiAgICAgICAgMHhhYWFhYWEsXG4gICAgICAgIDB4ZmZmZmZmXG4gICAgXVxufSIsImltcG9ydCBDb2xvcnMgZnJvbSAnLi9jb2xvcnMuZXM2JztcbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBjb2xvcndoZWVsSGlnaFNhdHVyYXRpb246IFtcbiAgICAgICAgMHhmZmZhMDAsIDB4ZmZjZjAwLCAweGZmYTYwMCwgMHhmZjdkMDEsXG4gICAgICAgIDB4ZmYyMDAwLCAweGY0MjQ5NCwgMHg4YjIwYmIsIDB4MDAyNGJhLFxuICAgICAgICAweDAwN2FjNywgMHgwMGIyZDYsIDB4MDJiODAxLCAweDg0Y2UwMCBdLFxuXG4gICAgY29sb3J3aGVlbExvd1NhdHVyYXRpb246IFtcbiAgICAgICAgMHhiZmJkNDAsIDB4YmZhODQwLCAweGJmOTM0MCwgMHhiZjdkNDAsXG4gICAgICAgIDB4YmY1MTQwLCAweGM2NTM5MCwgMHg4MjM3YTQsIDB4MmU0MDhhLFxuICAgICAgICAweDMyNmY5NSwgMHgzNjhmYTEsIDB4MmU4YTJlLCAweDc0OTkzMyBdLFxuXG5cbiAgICBrZXlzOiB7XG4gICAgICAgIG5vcm1hbDoge1xuICAgICAgICAgICAgd2hpdGU6IHtcbiAgICAgICAgICAgICAgICBlbWlzc2l2ZTogQ29sb3JzLmdyYXlzY2FsZVszXSxcbiAgICAgICAgICAgICAgICBjb2xvcjogQ29sb3JzLm5ldXRyYWwucmVkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYmxhY2s6IHtcbiAgICAgICAgICAgICAgICBlbWlzc2l2ZTogQ29sb3JzLmdyYXlzY2FsZVsxXSxcbiAgICAgICAgICAgICAgICBjb2xvcjogQ29sb3JzLm5ldXRyYWwucmVkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHN1Z2dlc3RlZDoge1xuICAgICAgICAgICAgd2hpdGU6IHtcbiAgICAgICAgICAgICAgICBlbWlzc2l2ZTogQ29sb3JzLmdyYXlzY2FsZVsyXSxcbiAgICAgICAgICAgICAgICBjb2xvcjogQ29sb3JzLm5lb24uZ3JlZW5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBibGFjazoge1xuICAgICAgICAgICAgICAgIGVtaXNzaXZlOiBDb2xvcnMuZ3JheXNjYWxlWzFdLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBDb2xvcnMubmVvbi5ncmVlblxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzdHJvbmdseVN1Z2dlc3RlZDoge1xuICAgICAgICAgICAgd2hpdGU6IHtcbiAgICAgICAgICAgICAgICBlbWlzc2l2ZTogQ29sb3JzLmdyYXlzY2FsZVsyXSxcbiAgICAgICAgICAgICAgICBjb2xvcjogQ29sb3JzLm5lb24ub3JhbmdlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYmxhY2s6IHtcbiAgICAgICAgICAgICAgICBlbWlzc2l2ZTogQ29sb3JzLmdyYXlzY2FsZVsxXSxcbiAgICAgICAgICAgICAgICBjb2xvcjogQ29sb3JzLm5lb24ub3JhbmdlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cblxuICAgIH0sXG5cbiAgICBtZXRyb25vbWU6IHtcbiAgICAgICAgZHJ1bToge1xuICAgICAgICAgICAgYnVtcG1hcDogJy4vYXNzZXRzL2ltYWdlcy9yaXBwbGVtYXAuanBnJyxcbiAgICAgICAgICAgIGNvbG9yOiBDb2xvcnMubmV1dHJhbC5kYXJrcmVkLFxuICAgICAgICAgICAgZW1pc3NpdmU6IENvbG9ycy5ncmF5c2NhbGVbMF0sXG4gICAgICAgICAgICBzcGVjdWxhcjogQ29sb3JzLm5ldXRyYWwuZ3JheWJsdWVcbiAgICAgICAgfSxcblxuICAgICAgICBoYW1tZXI6IHtcbiAgICAgICAgICAgIHJlZnJhY3Rpb25jdWJlOiBbXG4gICAgICAgICAgICAgICAgJy4vYXNzZXRzL2ltYWdlcy9ueC5qcGcnLFxuICAgICAgICAgICAgICAgICcuL2Fzc2V0cy9pbWFnZXMvbnkuanBnJyxcbiAgICAgICAgICAgICAgICAnLi9hc3NldHMvaW1hZ2VzL256LmpwZycsXG4gICAgICAgICAgICAgICAgJy4vYXNzZXRzL2ltYWdlcy9ueC5qcGcnLFxuICAgICAgICAgICAgICAgICcuL2Fzc2V0cy9pbWFnZXMvbnkuanBnJyxcbiAgICAgICAgICAgICAgICAnLi9hc3NldHMvaW1hZ2VzL256LmpwZycgXSxcbiAgICAgICAgICAgIGNvbG9yOiBDb2xvcnMubmV1dHJhbC5yZWQsXG4gICAgICAgICAgICBoaXRjb2xvcjogQ29sb3JzLmdyYXlzY2FsZVswXVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGRvbWU6IHtcbiAgICAgICAgY29sb3I6IENvbG9ycy5uZXV0cmFsLmRhcmtyZWQsXG4gICAgICAgIGVtaXNzaXZlOiBDb2xvcnMubmV1dHJhbC5kYXJrcmVkLFxuICAgICAgICBlbWlzc2l2ZW1pbm9yOiBDb2xvcnMuZ3JheXNjYWxlWzFdLFxuICAgICAgICBzcGVjdWxhcjogQ29sb3JzLm5ldXRyYWwucmVkXG4gICAgfSxcblxuICAgIGZsb2F0aW5ncGFydGljbGVzOiB7XG4gICAgICAgIHNwcml0ZTogJy4vYXNzZXRzL2ltYWdlcy9wYXJ0aWNsZS5wbmcnLFxuICAgICAgICBjb2xvcjogQ29sb3JzLmdyYXlzY2FsZVsyXVxuICAgIH0sXG5cbiAgICBsaWdodGluZzoge1xuICAgICAgICBoZW1pc3BoZXJlOiB7XG4gICAgICAgICAgICB0b3A6IENvbG9ycy5uZXV0cmFsLmRhcmtyZWQsXG4gICAgICAgICAgICBib3R0b206IENvbG9ycy5uZXV0cmFsLmdyZWVuXG4gICAgICAgIH0sXG4gICAgICAgIHNwb3RsaWdodDogQ29sb3JzLmdyYXlzY2FsZVsxXVxuICAgIH1cbn1cbiIsImltcG9ydCBOb3RlIGZyb20gJy4vbXVzaWN0aGVvcnkvbm90ZS5lczYnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgU1lOVEhEUlVNOiAnc3ludGhfZHJ1bScsXG4gICAgUElBTk86ICAgICAnYWNvdXN0aWNfZ3JhbmRfcGlhbm8nLFxuXG4gICAgcGxheWVyU3RhdGU6ICdyZWFkeScsXG5cbiAgICAvKipcbiAgICAgKiBpbnN0cnVtZW50cyBsb2FkZWRcbiAgICAgKi9cbiAgICBfaW5zdHJ1bWVudHNMb2FkZWQ6IFtdLFxuXG4gICAgLyoqXG4gICAgICogcGxheSBtaWRpIGZpbGVcbiAgICAgKiBAcGFyYW0gdXJpIG9mIG1pZGllIGZpbGVcbiAgICAgKi9cbiAgICBwbGF5KHVyaSkge1xuICAgICAgICB0aGlzLnBsYXllclN0YXRlID0gJ2xvYWRpbmcnO1xuICAgICAgICBNSURJLlBsYXllci50aW1lV2FycCA9IDE7IC8vIHNwZWVkIHRoZSBzb25nIGlzIHBsYXllZCBiYWNrXG4gICAgICAgIE1JREkuUGxheWVyLmxvYWRGaWxlKHVyaSxcbiAgICAgICAgICAgICgpID0+IHRoaXMub25Mb2FkZWQoKSxcbiAgICAgICAgICAgICgpID0+IHRoaXMub25Qcm9ncmVzcygpLFxuICAgICAgICAgICAgKGVycikgPT4gdGhpcy5vbkVycm9yKGVycikpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBwYXVzZSBwbGF5aW5nIG1pZGkgZmlsZVxuICAgICAqL1xuICAgIHBhdXNlKCkge1xuICAgICAgICB0aGlzLnBsYXllclN0YXRlID0gJ3BhdXNlZCc7XG4gICAgICAgIE1JREkuUGxheWVyLnBhdXNlKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHJlc3VtZSBwbGF5aW5nIG1pZGkgZmlsZVxuICAgICAqL1xuICAgIHJlc3VtZSgpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJTdGF0ZSA9ICdwbGF5aW5nJztcbiAgICAgICAgTUlESS5QbGF5ZXIucmVzdW1lKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGNoZWNrIGlmIGluc3RydW1lbnQgaXMgbG9hZGVkXG4gICAgICogQHBhcmFtIGluc3RydW1lbnRcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBpc0luc3RydW1lbnRMb2FkZWQoaW5zdHJ1bWVudCkge1xuICAgICAgICBpZiAodGhpcy5faW5zdHJ1bWVudHNMb2FkZWQuaW5kZXhPZihpbnN0cnVtZW50KSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGxvYWQgaW5zdHJ1bWVudFxuICAgICAqIEBwYXJhbSBpbnN0cnVtZW50XG4gICAgICovXG4gICAgbG9hZEluc3RydW1lbnQoaW5zdHJ1bWVudCwgcGF0aCkge1xuICAgICAgICBNSURJLmxvYWRQbHVnaW4oe1xuICAgICAgICAgICAgc291bmRmb250VXJsOiBwYXRoLFxuICAgICAgICAgICAgaW5zdHJ1bWVudDogaW5zdHJ1bWVudCxcbiAgICAgICAgICAgIG9ucHJvZ3Jlc3M6IChzdGF0ZSwgcHJvZ3Jlc3MsIGluc3RydW1lbnQpID0+IHRoaXMub25JbnN0cnVtZW50TG9hZFByb2dyZXNzKHN0YXRlLCBwcm9ncmVzcywgaW5zdHJ1bWVudCksXG4gICAgICAgICAgICBvbnN1Y2Nlc3M6IChldmVudCkgPT4gdGhpcy5vbkluc3RydW1lbnRMb2FkZWQoZXZlbnQpLFxuICAgICAgICAgICAgb25lcnJvcjogKGVycikgPT4gdGhpcy5vbkluc3RydW1lbnRMb2FkZWRFcnJvcihlcnIpLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogcGxheSBhIHRvbmVcbiAgICAgKiBAcGFyYW0gaW5zdHJ1bWVudFxuICAgICAqIEBwYXJhbSBub3RhdGlvblxuICAgICAqIEBwYXJhbSBkdXJhdGlvblxuICAgICAqL1xuICAgIHBsYXlUb25lKGluc3RydW1lbnQsIG5vdGF0aW9uLCBtaWRpY2hhbm5lbCwgZHVyYXRpb24pIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzSW5zdHJ1bWVudExvYWRlZChpbnN0cnVtZW50KSkgeyByZXR1cm47IH1cblxuICAgICAgICBNSURJLnByb2dyYW1DaGFuZ2UoMCwgTUlESS5HTS5ieU5hbWVbaW5zdHJ1bWVudF0ubnVtYmVyKTtcbiAgICAgICAgdmFyIGRlbGF5ID0gMDsgLy8gcGxheSBvbmUgbm90ZSBldmVyeSBxdWFydGVyIHNlY29uZFxuICAgICAgICB2YXIgbm90ZSA9IE5vdGUubm90YXRpb25Ub01JREkobm90YXRpb24pOyAvLyB0aGUgTUlESSBub3RlXG4gICAgICAgIHZhciB2ZWxvY2l0eSA9IDEyNzsgLy8gaG93IGhhcmQgdGhlIG5vdGUgaGl0c1xuICAgICAgICAvLyBwbGF5IHRoZSBub3RlXG4gICAgICAgIE1JREkuc2V0Vm9sdW1lKDAsIDEyNyk7XG4gICAgICAgIE1JREkubm90ZU9uKDAsIG5vdGUsIHZlbG9jaXR5LCBkZWxheSk7XG5cbiAgICAgICAgaWYgKGR1cmF0aW9uKSB7XG4gICAgICAgICAgICBNSURJLm5vdGVPZmYoMCwgbm90ZSwgZGVsYXkgKyBkdXJhdGlvbik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogbm90ZSBvblxuICAgICAqIEBwYXJhbSBpbnN0cnVtZW50XG4gICAgICogQHBhcmFtIG5vdGF0aW9uXG4gICAgICogQHBhcmFtIG1pZGljaGFubmVsXG4gICAgICovXG4gICAgbm90ZU9uKGluc3RydW1lbnQsIG5vdGF0aW9uLCBtaWRpY2hhbm5lbCwgZHVyYXRpb24sIHZlbG9jaXR5KSB7XG4gICAgICAgIGlmICghdGhpcy5pc0luc3RydW1lbnRMb2FkZWQoaW5zdHJ1bWVudCkpIHsgcmV0dXJuOyB9XG4gICAgICAgIHZhciBub3RlID0gTm90ZS5ub3RhdGlvblRvTUlESShub3RhdGlvbik7XG4gICAgICAgIE1JREkucHJvZ3JhbUNoYW5nZShtaWRpY2hhbm5lbCwgTUlESS5HTS5ieU5hbWVbaW5zdHJ1bWVudF0ubnVtYmVyKTtcbiAgICAgICAgaWYgKCF2ZWxvY2l0eSkgeyB2ZWxvY2l0eSA9IDEyNzsgfVxuICAgICAgICBNSURJLnNldFZvbHVtZSgwLCB2ZWxvY2l0eSk7XG4gICAgICAgIE1JREkubm90ZU9uKG1pZGljaGFubmVsLCBub3RlLCB2ZWxvY2l0eSwgMCk7XG5cbiAgICAgICAgaWYgKGR1cmF0aW9uKSB7XG4gICAgICAgICAgICBNSURJLm5vdGVPZmYobWlkaWNoYW5uZWwsIG5vdGUsIGR1cmF0aW9uKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBub3RlIG9mZlxuICAgICAqIEBwYXJhbSBub3RhdGlvblxuICAgICAqIEBwYXJhbSBtaWRpY2hhbm5lbFxuICAgICAqIEBwYXJhbSBkZWxheVxuICAgICAqL1xuICAgIG5vdGVPZmYobm90YXRpb24sIG1pZGljaGFubmVsLCBkZWxheSkge1xuICAgICAgICBpZiAoIWRlbGF5KSB7IGRlbGF5ID0gMDsgfVxuICAgICAgICB2YXIgbm90ZSA9IE5vdGUubm90YXRpb25Ub01JREkobm90YXRpb24pO1xuICAgICAgICBNSURJLm5vdGVPZmYobWlkaWNoYW5uZWwsIG5vdGUsIGRlbGF5KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogYWRkIGV2ZW50IGxpc3RlbmVyXG4gICAgICogQHBhcmFtIGV2ZW50dHlwZVxuICAgICAqIEBwYXJhbSBjYWxsYmFja1xuICAgICAqL1xuICAgIGFkZEV2ZW50TGlzdGVuZXIoZXZlbnR0eXBlLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAoIXRoaXMuX2xpc3RlbmVycykgeyB0aGlzLl9saXN0ZW5lcnMgPSBbXTsgfVxuICAgICAgICB0aGlzLl9saXN0ZW5lcnMucHVzaCggeyB0eXBlOiBldmVudHR5cGUsIGNhbGxiYWNrOiBjYWxsYmFjayB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogb24gaW5zdHJ1bWVudCBsb2FkZWRcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKi9cbiAgICBvbkluc3RydW1lbnRMb2FkZWQoKSB7fSxcblxuICAgIC8qKlxuICAgICAqIG9uIGluc3RydW1lbnQgbG9hZCBwcm9ncmVzc1xuICAgICAqIEBwYXJhbSBzdGF0ZVxuICAgICAqIEBwYXJhbSBwcm9ncmVzc1xuICAgICAqIEBwYXJhbSBpbnN0cnVtZW50XG4gICAgICovXG4gICAgb25JbnN0cnVtZW50TG9hZFByb2dyZXNzKHN0YXRlLCBwcm9ncmVzcywgaW5zdHJ1bWVudCkge1xuICAgICAgICBpZiAoaW5zdHJ1bWVudCAmJiBwcm9ncmVzcyA9PT0gMSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coaW5zdHJ1bWVudCArICcgbG9hZGVkJyk7XG4gICAgICAgICAgICB0aGlzLl9pbnN0cnVtZW50c0xvYWRlZC5wdXNoKGluc3RydW1lbnQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIG9uIGluc3RydW1lbnQgbG9hZGVkIGVycm9yXG4gICAgICogQHBhcmFtIGVyclxuICAgICAqL1xuICAgIG9uSW5zdHJ1bWVudExvYWRlZEVycm9yKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZygnSW5zdHJ1bWVudCBsb2FkaW5nIGVycm9yJywgZXJyKTtcbiAgICB9LFxuXG4gICAgb25Mb2FkZWQoKSB7XG4gICAgICAgIE1JREkucHJvZ3JhbUNoYW5nZSgwLCBNSURJLkdNLmJ5TmFtZVt0aGlzLlBJQU5PXS5udW1iZXIpO1xuICAgICAgICBNSURJLlBsYXllci5zdGFydCgpO1xuICAgICAgICB0aGlzLnBsYXllclN0YXRlID0gJ3BsYXlpbmcnO1xuICAgICAgICB0aGlzLmlzUGxheWluZyA9IHRydWU7XG4gICAgICAgIE1JREkuUGxheWVyLmFkZExpc3RlbmVyKGRhdGEgPT4gdGhpcy5vbk1JRElEYXRhKGRhdGEpKTtcbiAgICB9LFxuXG4gICAgb25Qcm9ncmVzcygpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3Byb2dyZXNzJyk7XG4gICAgfSxcblxuICAgIG9uRXJyb3IoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcicsIGVycik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIG9uIG1pZGkgZGF0YSBjYWxsYmFja1xuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICovXG4gICAgb25NSURJRGF0YShkYXRhKSB7XG4gICAgICAgIGlmICh0aGlzLl9saXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgdGhpcy5fbGlzdGVuZXJzLmxlbmd0aDsgYysrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2xpc3RlbmVyc1tjXS50eXBlID09PSAnbWlkaWRhdGEnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnNbY10uY2FsbGJhY2suYXBwbHkodGhpcywgW3sgbm90ZTogZGF0YS5ub3RlIC0gMjEsIHZlbG9jaXR5OiBkYXRhLnZlbG9jaXR5IH1dKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgTm90ZSBmcm9tICcuL211c2ljdGhlb3J5L25vdGUuZXM2JztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIC8qKlxuICAgICAqIGFwcGx5IG4gbnVtYmVyIG9mIHByb3BlcnRpZXMgdG8gYW4gb2JqZWN0XG4gICAgICogQHBhcmFtIG9iamVjdFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wc1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2Ugb2YgcHJvcGVydHkgKHByZXBlbmQga2V5IG5hbWUpXG4gICAgICovXG4gICAgY29weVByb3BzVG8ob2JqZWN0LCBwcm9wcywgbmFtZXNwYWNlKSB7XG4gICAgICAgIGlmICghbmFtZXNwYWNlKSB7IG5hbWVzcGFjZSA9ICcnOyB9XG4gICAgICAgIGZvciAodmFyIGMgaW4gcHJvcHMpIHtcbiAgICAgICAgICAgIG9iamVjdFtjICsgbmFtZXNwYWNlXSA9IHByb3BzW2NdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHR1cm4gZGVjaW1hbCBjb2xvciB0byBSR0JcbiAgICAgKiBAcGFyYW0gZGVjXG4gICAgICogQHBhcmFtIG1heFxuICAgICAqIEByZXR1cm5zIHt7cjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlcn19XG4gICAgICovXG4gICAgZGVjVG9SR0IoZGVjLCBtYXgpIHtcbiAgICAgICAgaWYgKCFtYXgpIHsgbWF4ID0gMjU1OyB9XG4gICAgICAgIG1heCArPSAxOyAvLyBhaWRzIHdpdGggcm91bmRpbmdcbiAgICAgICAgdmFyIHIgPSBNYXRoLmZsb29yKGRlYyAvICgyNTYqMjU2KSk7XG4gICAgICAgIHZhciBnID0gTWF0aC5mbG9vcihkZWMgLyAyNTYpICUgMjU2O1xuICAgICAgICB2YXIgYiA9IGRlYyAlIDI1NjtcbiAgICAgICAgcmV0dXJuIHsgcjogci8yNTUgKiBtYXgsIGc6IGcvMjU1ICogbWF4LCBiOiBiLzI1NSAqIG1heCB9O1xuICAgIH0sXG5cbiAgICBSR0JUb0RlYyhyZ2IpIHtcbiAgICAgICAgcmV0dXJuIHJnYi5yIDw8IDE2ICsgcmdiLmcgPDwgMTYgKyByZ2IuYjtcbiAgICB9XG59IiwiaW1wb3J0IE1pZGlLZXlNYW5hZ2VyIGZyb20gJy4vbWlkaWtleW1hbmFnZXIuZXM2JztcbmltcG9ydCBOb3RlIGZyb20gJy4vbXVzaWN0aGVvcnkvbm90ZS5lczYnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIE1pZGlLZXlNYW5hZ2VyIHtcbiAgICAvKipcbiAgICAgKiBpbml0aWFsaXplIG1pZGkgZGV2aWNlXG4gICAgICovXG4gICAgaW5pdGlhbGl6ZURldmljZSgpIHtcbiAgICAgICAgdGhpcy5zb2NrZXQgPSBuZXcgV2ViU29ja2V0KCd3czovL2xvY2FsaG9zdDo4MDgwJyk7XG4gICAgICAgIHRoaXMuc29ja2V0Lm9uZXJyb3IgPSBmdW5jdGlvbiAoZXJyb3IpIHsgY29uc29sZS5sb2coJ1dlYlNvY2tldCBFcnJvciAnICsgZXJyb3IpOyB9O1xuXG4gICAgICAgIHRoaXMuc29ja2V0Lm9ubWVzc2FnZSA9IChlKSA9PiB7XG4gICAgICAgICAgICB2YXIgbXNnID0gSlNPTi5wYXJzZShlLmRhdGEpO1xuICAgICAgICAgICAgdGhpcy5vbk1JRElNZXNzYWdlKG1zZyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5zb2NrZXQub25vcGVuID0gKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoJ2Nvbm5lY3QnKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlR3JvdXAge1xuICAgIGNvbnN0cnVjdG9yKHBhcmFtcykge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBwYXJlbnQgZ3JvdXAgb2YgY2hpbGQgb2JqZWN0cyB3ZSB3aWxsIGNyZWF0ZVxuICAgICAgICAgKiBAdHlwZSB7VEhSRUUuT2JqZWN0M0R9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9ncm91cCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuXG4gICAgICAgIGlmIChwYXJhbXMgJiYgcGFyYW1zLmFzc2V0cykge1xuICAgICAgICAgICAgLy8gdG9kbzogZGV0ZXJtaW5lIHdoZW4gdG8gdXNlIEpTT04gTG9hZGVyLCBPQkogbG9hZGVyLCBvciB3aGF0ZXZlclxuICAgICAgICAgICAgdmFyIGxvYWRlciA9IG5ldyBUSFJFRS5KU09OTG9hZGVyKCk7XG4gICAgICAgICAgICBsb2FkZXIubG9hZChwYXJhbXMuYXNzZXRzLCAoZ2VvbWV0cnksIG1hdGVyaWFscykgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMub25Bc3NldHNMb2FkZWQoZ2VvbWV0cnksIG1hdGVyaWFscyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub25Jbml0aWFsaXplKHBhcmFtcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZ2V0IG5hbWUgb2YgZ3JvdXBcbiAgICAgKi9cbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IubmFtZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvdmVycmlkYWJsZSBtZXRob2RzXG4gICAgICogbGVhdmUgZW1wdHkgdG8gYmUgYSBzaW1wbGUgYWJzdHJhY3Rpb24gd2UgZG9uJ3QgaGF2ZSB0byBjYWxsIHN1cGVyIG9uXG4gICAgICogQHBhcmFtIHNjZW5lXG4gICAgICogQHBhcmFtIGN1c3RvbVxuICAgICAqL1xuICAgIG9uQ3JlYXRlKHNjZW5lLCBjdXN0b20pIHt9O1xuICAgIG9uUmVuZGVyKHNjZW5lLCBjdXN0b20pIHt9O1xuICAgIG9uSW5pdGlhbGl6ZShwYXJhbXMpIHt9O1xuICAgIG9uQXNzZXRzTG9hZGVkKGdlb21ldHJ5LCBtYXRlcmlhbCkge307XG5cbiAgICAvKipcbiAgICAgKiBvbiBjcmVhdGUgc2NlbmUgKG9yIGVhcmxpZXN0IHBvc3NpYmxlIG9wcG9ydHVuaXR5KVxuICAgICAqIEBwYXJhbSBzY2VuZVxuICAgICAqIEBwYXJhbSBjdXN0b21cbiAgICAgKi9cbiAgICBjcmVhdGUoc2NlbmUsIGN1c3RvbSkge1xuICAgICAgICB0aGlzLl9ncm91cC5uYW1lID0gdGhpcy5uYW1lO1xuICAgICAgICBzY2VuZS5zY2VuZS5hZGQodGhpcy5fZ3JvdXApO1xuICAgICAgICB0aGlzLm9uQ3JlYXRlKHNjZW5lLCBjdXN0b20pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFkZCBvYmplY3QgdG8gc2NlbmVcbiAgICAgKiBAcGFyYW0gb2JqZWN0XG4gICAgICovXG4gICAgYWRkKG9iamVjdCwgbmFtZSkge1xuICAgICAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgICAgIG5hbWUgPSB0aGlzLm5hbWUgKyAnLWNoaWxkJztcbiAgICAgICAgfVxuICAgICAgICBvYmplY3QubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuX2dyb3VwLmFkZChvYmplY3QpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdldCBwYXJlbnQgZ3JvdXAgb2JqZWN0XG4gICAgICogQHJldHVybnMge1RIUkVFLk9iamVjdDNEfVxuICAgICAqL1xuICAgIGdldCBncm91cCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dyb3VwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdldCBjaGlsZHJlbiBvZiB0aGlzIGdyb3VwXG4gICAgICogQHJldHVybnMge0FycmF5fVxuICAgICAqL1xuICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dyb3VwLmNoaWxkcmVuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG9uIHByZXJlbmRlciBzY2VuZVxuICAgICAqIEBwYXJhbSBzY2VuZVxuICAgICAqIEBwYXJhbSBjdXN0b21cbiAgICAgKi9cbiAgICBwcmVSZW5kZXIoc2NlbmUsIGN1c3RvbSkge31cblxuICAgIC8qKlxuICAgICAqIG9uIHJlbmRlciBzY2VuZVxuICAgICAqIEBwYXJhbSBzY2VuZVxuICAgICAqIEBwYXJhbSBjdXN0b21cbiAgICAgKi9cbiAgICByZW5kZXIoc2NlbmUsIGN1c3RvbSkge1xuICAgICAgICB0aGlzLm9uUmVuZGVyKHNjZW5lLCBjdXN0b20pO1xuICAgIH1cbn0iXX0=