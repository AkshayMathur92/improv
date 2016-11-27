(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Improv = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

var _floatingparticles = require('./objects/floatingparticles.es6');

var _floatingparticles2 = _interopRequireDefault(_floatingparticles);

var _lighting = require('./objects/lighting.es6');

var _lighting2 = _interopRequireDefault(_lighting);

var _toneplayback = require('./toneplayback.es6');

var _toneplayback2 = _interopRequireDefault(_toneplayback);

var _input = require('./input.es6');

var _input2 = _interopRequireDefault(_input);

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

            this._scene.addObjects([new _metronome2.default(), new _floatingparticles2.default(), new _dome2.default(), this._keyboard, this._hudKeyboard, new _lighting2.default()]);

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

},{"./input.es6":3,"./objects/dome.es6":7,"./objects/floatingparticles.es6":8,"./objects/keyboards/circularkeyboard.es6":10,"./objects/keyboards/traditionalkeyboard.es6":11,"./objects/lighting.es6":12,"./objects/metronome.es6":13,"./toneplayback.es6":18}],3:[function(require,module,exports){
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

},{"./midikeymanager.es6":4,"./musictheory/keysignatureprediction.es6":5,"./qwertykeymanager.es6":14}],4:[function(require,module,exports){
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

},{"./musictheory/note.es6":6}],5:[function(require,module,exports){
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

},{"./note.es6":6}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{"../../node_modules/trivr/src/basegroup.es6":1,"../themeing/style.es6":17,"../toneplayback.es6":18}],8:[function(require,module,exports){
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
                    size: Math.random() * 1.0 + .75,
                    map: sprite,
                    blending: THREE.AdditiveBlending,
                    depthTest: false,
                    transparent: true });

                this.materials[i].color.set(_style2.default.floatingparticles.color);

                var particles = new THREE.Points(geometry, this.materials[i]);

                particles.rotation.x = Math.random() * 6;
                particles.rotation.y = Math.random() * 6;
                particles.rotation.z = Math.random() * 6;
                this.add(particles);
            }
        }
    }, {
        key: 'onRender',
        value: function onRender() {
            var time = Date.now() * 0.00005;
            for (var i = 0; i < this.children.length; i++) {
                var object = this.children[i];
                if (object instanceof THREE.Points) {
                    object.rotation.y = time * (i < 4 ? i + 1 : -(i + 1));
                }
            }

            /*for ( i = 0; i < this.materials.length; i ++ ) {
                var h = ( 360 * ( 0 + time ) % 360 ) / 360;
                this.materials[i].color.setHSL( 1, .5, h );
            }*/
        }
    }]);

    return FloatingParticles;
}(_basegroup2.default);

exports.default = FloatingParticles;

},{"../../node_modules/trivr/src/basegroup.es6":1,"../themeing/style.es6":17}],9:[function(require,module,exports){
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
             * keyboard/key input
             * @type {$ES6_ANONYMOUS_CLASS$}
             * @private
             */
            //this._input = new Input(params.input, (keys) => this.onKeyInputChange(keys) );

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

},{"../../../node_modules/trivr/src/basegroup.es6":1,"../../input.es6":3,"../../musictheory/note.es6":6,"../../themeing/style.es6":17,"../../toneplayback.es6":18,"../../utils.es6":19}],10:[function(require,module,exports){
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

},{"../../input.es6":3,"../../musictheory/note.es6":6,"../../themeing/style.es6":17,"../../toneplayback.es6":18,"../../utils.es6":19,"./basekeyboard.es6":9}],11:[function(require,module,exports){
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

},{"../../input.es6":3,"../../musictheory/note.es6":6,"../../themeing/style.es6":17,"../../toneplayback.es6":18,"../../utils.es6":19,"./basekeyboard.es6":9}],12:[function(require,module,exports){
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

},{"../../node_modules/trivr/src/basegroup.es6":1,"../themeing/style.es6":17}],13:[function(require,module,exports){
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
        }
    }, {
        key: 'onCreate',
        value: function onCreate(scenecollection, mycollection) {
            //this.addHammer('right', Math.PI/64, Math.PI * 2, 'C4');
            //this.addHammer('left', Math.PI/128, Math.PI/4, 'A4');
            this.addHammer('up', Math.PI / 32, Math.PI / 2, 'G4');
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
            var endcolor = _utils2.default.decToRGB(_style2.default.metronome.hammer.hitcolor, 100);
            hammer.glowColor.r = startcolor.r;
            hammer.glowColor.g = startcolor.g;
            hammer.glowColor.b = startcolor.b;
            createjs.Tween.get(hammer.glowColor).to({ r: endcolor.r, g: endcolor.g, b: endcolor.b }, 500).to({ r: startcolor.r, g: startcolor.g, b: startcolor.b }, 500).wait(100) // wait a few ticks, or the render cycle won't pick up the changes with the flag
            .call(function (scope) {
                scope.animatingGlow = false;
            });

            var startcolor = _utils2.default.decToRGB(_style2.default.metronome.drum.color, 100);
            var endcolor = _utils2.default.decToRGB(_style2.default.metronome.drum.hitcolor, 100);
            this._tweenTargets.drum.props.r = startcolor.r;
            this._tweenTargets.drum.props.g = startcolor.g;
            this._tweenTargets.drum.props.b = startcolor.b;
            this._tweenTargets.drum.props.zPosition = -400;
            this._tweenTargets.drum.props.bumpscale = 0;
            this._tweenTargets.drum.animating = true;
            this._tweenTargets.drum.currentTween = createjs.Tween.get(this._tweenTargets.drum.props).to({
                r: endcolor.r, g: endcolor.g, b: endcolor.b,
                bumpscale: 5,
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

},{"../../node_modules/trivr/src/basegroup.es6":1,"../themeing/style.es6":17,"../toneplayback.es6":18,"../utils.es6":19,"./../shaders.es6":15}],14:[function(require,module,exports){
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

},{"./musictheory/note.es6":6}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  "explosion": {
    "fragment": "varying float noise; uniform sampler2D tExplosion;  float random( vec3 scale, float seed ){   return fract( sin( dot( gl_FragCoord.xyz + seed, scale ) ) * 43758.5453 + seed ) ; }  void main() {    float r = .01 * random( vec3( 12.9898, 78.233, 151.7182 ), 0.0 );   vec2 tPos = vec2( 0, 1.0 - 1.3 * noise + r );   vec4 color = texture2D( tExplosion, tPos );   gl_FragColor = vec4( color.rgb, 1.0 );  }",
    "vertex": "  vec3 mod289(vec3 x) {   return x - floor(x * (1.0 / 289.0)) * 289.0; }  vec4 mod289(vec4 x) {   return x - floor(x * (1.0 / 289.0)) * 289.0; }  vec4 permute(vec4 x) {   return mod289(((x*34.0)+1.0)*x); }  vec4 taylorInvSqrt(vec4 r) {   return 1.79284291400159 - 0.85373472095314 * r; }  vec3 fade(vec3 t) {   return t*t*t*(t*(t*6.0-15.0)+10.0); }  float cnoise(vec3 P) {   vec3 Pi0 = floor(P);   vec3 Pi1 = Pi0 + vec3(1.0);   Pi0 = mod289(Pi0);   Pi1 = mod289(Pi1);   vec3 Pf0 = fract(P);   vec3 Pf1 = Pf0 - vec3(1.0);   vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);   vec4 iy = vec4(Pi0.yy, Pi1.yy);   vec4 iz0 = Pi0.zzzz;   vec4 iz1 = Pi1.zzzz;    vec4 ixy = permute(permute(ix) + iy);   vec4 ixy0 = permute(ixy + iz0);   vec4 ixy1 = permute(ixy + iz1);    vec4 gx0 = ixy0 * (1.0 / 7.0);   vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;   gx0 = fract(gx0);   vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);   vec4 sz0 = step(gz0, vec4(0.0));   gx0 -= sz0 * (step(0.0, gx0) - 0.5);   gy0 -= sz0 * (step(0.0, gy0) - 0.5);    vec4 gx1 = ixy1 * (1.0 / 7.0);   vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;   gx1 = fract(gx1);   vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);   vec4 sz1 = step(gz1, vec4(0.0));   gx1 -= sz1 * (step(0.0, gx1) - 0.5);   gy1 -= sz1 * (step(0.0, gy1) - 0.5);    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);   vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);   vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);   vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);   vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);   vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);   vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);   vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));   g000 *= norm0.x;   g010 *= norm0.y;   g100 *= norm0.z;   g110 *= norm0.w;   vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));   g001 *= norm1.x;   g011 *= norm1.y;   g101 *= norm1.z;   g111 *= norm1.w;    float n000 = dot(g000, Pf0);   float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));   float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));   float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));   float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));   float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));   float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));   float n111 = dot(g111, Pf1);    vec3 fade_xyz = fade(Pf0);   vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);   vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);   float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);   return 2.2 * n_xyz; }  float pnoise(vec3 P, vec3 rep) {   vec3 Pi0 = mod(floor(P), rep);   vec3 Pi1 = mod(Pi0 + vec3(1.0), rep);   Pi0 = mod289(Pi0);   Pi1 = mod289(Pi1);   vec3 Pf0 = fract(P);   vec3 Pf1 = Pf0 - vec3(1.0);   vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);   vec4 iy = vec4(Pi0.yy, Pi1.yy);   vec4 iz0 = Pi0.zzzz;   vec4 iz1 = Pi1.zzzz;    vec4 ixy = permute(permute(ix) + iy);   vec4 ixy0 = permute(ixy + iz0);   vec4 ixy1 = permute(ixy + iz1);    vec4 gx0 = ixy0 * (1.0 / 7.0);   vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;   gx0 = fract(gx0);   vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);   vec4 sz0 = step(gz0, vec4(0.0));   gx0 -= sz0 * (step(0.0, gx0) - 0.5);   gy0 -= sz0 * (step(0.0, gy0) - 0.5);    vec4 gx1 = ixy1 * (1.0 / 7.0);   vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;   gx1 = fract(gx1);   vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);   vec4 sz1 = step(gz1, vec4(0.0));   gx1 -= sz1 * (step(0.0, gx1) - 0.5);   gy1 -= sz1 * (step(0.0, gy1) - 0.5);    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);   vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);   vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);   vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);   vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);   vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);   vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);   vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));   g000 *= norm0.x;   g010 *= norm0.y;   g100 *= norm0.z;   g110 *= norm0.w;   vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));   g001 *= norm1.x;   g011 *= norm1.y;   g101 *= norm1.z;   g111 *= norm1.w;    float n000 = dot(g000, Pf0);   float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));   float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));   float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));   float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));   float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));   float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));   float n111 = dot(g111, Pf1);    vec3 fade_xyz = fade(Pf0);   vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);   vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);   float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);   return 2.2 * n_xyz; }  varying float noise; uniform float time;  float turbulence( vec3 p ) {   float w = 100.0;   float t = -.5;   for (float f = 1.0 ; f <= 10.0 ; f++ ){     float power = pow( 2.0, f );     t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );   }   return t; }  void main() {   noise = 10.0 *  -.10 * turbulence( .5 * normal + time );   float b = 5.0 * pnoise( 0.05 * position + vec3( 2.0 * time ), vec3( 100.0 ) );   float displacement = - 10. * noise + b;    vec3 newPosition = position + normal * displacement;   gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );  }"
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
            hitcolor: _colors2.default.neon.blue,
            emissive: _colors2.default.grayscale[0],
            specular: _colors2.default.neutral.grayblue
        },

        hammer: {
            refractioncube: ['./assets/images/nx.jpg', './assets/images/ny.jpg', './assets/images/nz.jpg', './assets/images/nx.jpg', './assets/images/ny.jpg', './assets/images/nz.jpg'],
            color: _colors2.default.neutral.red,
            hitcolor: _colors2.default.neon.blue
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

},{"./musictheory/note.es6":6}],19:[function(require,module,exports){
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

},{"./musictheory/note.es6":6}]},{},[2])(2)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvdHJpdnIvc3JjL2Jhc2Vncm91cC5lczYiLCJzcmMvaW1wcm92LmVzNiIsInNyYy9pbnB1dC5lczYiLCJzcmMvbWlkaWtleW1hbmFnZXIuZXM2Iiwic3JjL211c2ljdGhlb3J5L2tleXNpZ25hdHVyZXByZWRpY3Rpb24uZXM2Iiwic3JjL211c2ljdGhlb3J5L25vdGUuZXM2Iiwic3JjL29iamVjdHMvZG9tZS5lczYiLCJzcmMvb2JqZWN0cy9mbG9hdGluZ3BhcnRpY2xlcy5lczYiLCJzcmMvb2JqZWN0cy9rZXlib2FyZHMvYmFzZWtleWJvYXJkLmVzNiIsInNyYy9vYmplY3RzL2tleWJvYXJkcy9jaXJjdWxhcmtleWJvYXJkLmVzNiIsInNyYy9vYmplY3RzL2tleWJvYXJkcy90cmFkaXRpb25hbGtleWJvYXJkLmVzNiIsInNyYy9vYmplY3RzL2xpZ2h0aW5nLmVzNiIsInNyYy9vYmplY3RzL21ldHJvbm9tZS5lczYiLCJzcmMvcXdlcnR5a2V5bWFuYWdlci5lczYiLCJzcmMvc2hhZGVycy5lczYiLCJzcmMvdGhlbWVpbmcvY29sb3JzLmVzNiIsInNyYy90aGVtZWluZy9zdHlsZS5lczYiLCJzcmMvdG9uZXBsYXliYWNrLmVzNiIsInNyYy91dGlscy5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lDQXFCLFM7QUFDakIsdUJBQVksTUFBWixFQUFvQjtBQUFBOztBQUFBOztBQUVoQjs7Ozs7QUFLQSxhQUFLLE1BQUwsR0FBYyxJQUFJLE1BQU0sUUFBVixFQUFkOztBQUVBLFlBQUksVUFBVSxPQUFPLE1BQXJCLEVBQTZCO0FBQ3pCO0FBQ0EsZ0JBQUksU0FBUyxJQUFJLE1BQU0sVUFBVixFQUFiO0FBQ0EsbUJBQU8sSUFBUCxDQUFZLE9BQU8sTUFBbkIsRUFBMkIsVUFBQyxRQUFELEVBQVcsU0FBWCxFQUF5QjtBQUNoRCxzQkFBSyxj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R0FBWCxDQUFYLENBQVI7QUFDQSxZQUFJLElBQUksS0FBSyxLQUFMLENBQVcsTUFBTSxHQUFqQixJQUF3QixHQUFoQztBQUNBLFlBQUksSUFBSSxNQUFNLEdBQWQ7QUFDQSxlQUFPLEVBQUUsR0FBRyxJQUFFLEdBQUYsR0FBUSxHQUFiLEVBQWtCLEdBQUcsSUFBRSxHQUFGLEdBQVEsR0FBN0IsRUFBa0MsR0FBRyxJQUFFLEdBQUYsR0FBUSxHQUE3QyxFQUFQO0FBQ0gsS0E1QlU7QUE4QlgsWUE5Qlcsb0JBOEJGLEdBOUJFLEVBOEJHO0FBQ1YsZUFBTyxJQUFJLENBQUosSUFBUyxLQUFLLElBQUksQ0FBbEIsSUFBdUIsS0FBSyxJQUFJLENBQXZDO0FBQ0g7QUFoQ1UsQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlR3JvdXAge1xuICAgIGNvbnN0cnVjdG9yKHBhcmFtcykge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBwYXJlbnQgZ3JvdXAgb2YgY2hpbGQgb2JqZWN0cyB3ZSB3aWxsIGNyZWF0ZVxuICAgICAgICAgKiBAdHlwZSB7VEhSRUUuT2JqZWN0M0R9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9ncm91cCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuXG4gICAgICAgIGlmIChwYXJhbXMgJiYgcGFyYW1zLmFzc2V0cykge1xuICAgICAgICAgICAgLy8gdG9kbzogZGV0ZXJtaW5lIHdoZW4gdG8gdXNlIEpTT04gTG9hZGVyLCBPQkogbG9hZGVyLCBvciB3aGF0ZXZlclxuICAgICAgICAgICAgdmFyIGxvYWRlciA9IG5ldyBUSFJFRS5KU09OTG9hZGVyKCk7XG4gICAgICAgICAgICBsb2FkZXIubG9hZChwYXJhbXMuYXNzZXRzLCAoZ2VvbWV0cnksIG1hdGVyaWFscykgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMub25Bc3NldHNMb2FkZWQoZ2VvbWV0cnksIG1hdGVyaWFscyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub25Jbml0aWFsaXplKHBhcmFtcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZ2V0IG5hbWUgb2YgZ3JvdXBcbiAgICAgKi9cbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IubmFtZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvdmVycmlkYWJsZSBtZXRob2RzXG4gICAgICogbGVhdmUgZW1wdHkgdG8gYmUgYSBzaW1wbGUgYWJzdHJhY3Rpb24gd2UgZG9uJ3QgaGF2ZSB0byBjYWxsIHN1cGVyIG9uXG4gICAgICogQHBhcmFtIHNjZW5lXG4gICAgICogQHBhcmFtIGN1c3RvbVxuICAgICAqL1xuICAgIG9uQ3JlYXRlKHNjZW5lLCBjdXN0b20pIHt9O1xuICAgIG9uUmVuZGVyKHNjZW5lLCBjdXN0b20pIHt9O1xuICAgIG9uSW5pdGlhbGl6ZShwYXJhbXMpIHt9O1xuICAgIG9uQXNzZXRzTG9hZGVkKGdlb21ldHJ5LCBtYXRlcmlhbCkge307XG5cbiAgICAvKipcbiAgICAgKiBvbiBjcmVhdGUgc2NlbmUgKG9yIGVhcmxpZXN0IHBvc3NpYmxlIG9wcG9ydHVuaXR5KVxuICAgICAqIEBwYXJhbSBzY2VuZVxuICAgICAqIEBwYXJhbSBjdXN0b21cbiAgICAgKi9cbiAgICBjcmVhdGUoc2NlbmUsIGN1c3RvbSkge1xuICAgICAgICB0aGlzLl9ncm91cC5uYW1lID0gdGhpcy5uYW1lO1xuICAgICAgICBzY2VuZS5zY2VuZS5hZGQodGhpcy5fZ3JvdXApO1xuICAgICAgICB0aGlzLm9uQ3JlYXRlKHNjZW5lLCBjdXN0b20pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFkZCBvYmplY3QgdG8gc2NlbmVcbiAgICAgKiBAcGFyYW0gb2JqZWN0XG4gICAgICovXG4gICAgYWRkKG9iamVjdCwgbmFtZSkge1xuICAgICAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgICAgIG5hbWUgPSB0aGlzLm5hbWUgKyAnLWNoaWxkJztcbiAgICAgICAgfVxuICAgICAgICBvYmplY3QubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuX2dyb3VwLmFkZChvYmplY3QpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdldCBwYXJlbnQgZ3JvdXAgb2JqZWN0XG4gICAgICogQHJldHVybnMge1RIUkVFLk9iamVjdDNEfVxuICAgICAqL1xuICAgIGdldCBncm91cCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dyb3VwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdldCBjaGlsZHJlbiBvZiB0aGlzIGdyb3VwXG4gICAgICogQHJldHVybnMge0FycmF5fVxuICAgICAqL1xuICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dyb3VwLmNoaWxkcmVuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG9uIHByZXJlbmRlciBzY2VuZVxuICAgICAqIEBwYXJhbSBzY2VuZVxuICAgICAqIEBwYXJhbSBjdXN0b21cbiAgICAgKi9cbiAgICBwcmVSZW5kZXIoc2NlbmUsIGN1c3RvbSkge31cblxuICAgIC8qKlxuICAgICAqIG9uIHJlbmRlciBzY2VuZVxuICAgICAqIEBwYXJhbSBzY2VuZVxuICAgICAqIEBwYXJhbSBjdXN0b21cbiAgICAgKi9cbiAgICByZW5kZXIoc2NlbmUsIGN1c3RvbSkge1xuICAgICAgICB0aGlzLm9uUmVuZGVyKHNjZW5lLCBjdXN0b20pO1xuICAgIH1cbn0iLCJpbXBvcnQgTWV0cm9ub21lIGZyb20gJy4vb2JqZWN0cy9tZXRyb25vbWUuZXM2JztcbmltcG9ydCBDaXJjdWxhcktleWJvYXJkIGZyb20gJy4vb2JqZWN0cy9rZXlib2FyZHMvY2lyY3VsYXJrZXlib2FyZC5lczYnO1xuaW1wb3J0IFRyYWRpdGlvbmFsS2V5Ym9hcmQgZnJvbSAnLi9vYmplY3RzL2tleWJvYXJkcy90cmFkaXRpb25hbGtleWJvYXJkLmVzNic7XG5pbXBvcnQgRG9tZSBmcm9tICcuL29iamVjdHMvZG9tZS5lczYnO1xuaW1wb3J0IEZsb2F0aW5nUGFydGljbGVzIGZyb20gJy4vb2JqZWN0cy9mbG9hdGluZ3BhcnRpY2xlcy5lczYnO1xuaW1wb3J0IExpZ2h0aW5nIGZyb20gJy4vb2JqZWN0cy9saWdodGluZy5lczYnO1xuaW1wb3J0IFRvbmVQbGF5YmFjayBmcm9tICcuL3RvbmVwbGF5YmFjay5lczYnO1xuaW1wb3J0IElucHV0IGZyb20gJy4vaW5wdXQuZXM2JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW1wcm92IHtcbiAgICBjb25zdHJ1Y3RvcihzY2VuZSwgY29uZmlnVVJJKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBjdXJyZW50IGtleSBzaWduYXR1cmVcbiAgICAgICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY3VycmVudEtleVNpZ25hdHVyZSA9IG51bGw7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGluYWN0aXZpdHkgdGltZXIgZm9yIHN1Z2dlc3Rpb25zXG4gICAgICAgICAqIEB0eXBlIHtudWxsfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5faW5hY3Rpdml0eVRpbWVyID0gbnVsbDtcblxuICAgICAgICB0aGlzLl9zY2VuZSA9IHNjZW5lO1xuICAgICAgICB0aGlzLl9yZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHRoaXMuX3JlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4gdGhpcy5vbkNvbmZpZ0xvYWRlZCgpO1xuICAgICAgICB0aGlzLl9yZXF1ZXN0Lm9wZW4oJ0dFVCcsIGNvbmZpZ1VSSSk7XG4gICAgICAgIHRoaXMuX3JlcXVlc3Quc2VuZCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG9uIGtleSBjaGFuZ2VcbiAgICAgKiBAcGFyYW0ga2V5c1xuICAgICAqL1xuICAgIG9uS2V5SW5wdXRDaGFuZ2UoZXZlbnQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2luYWN0aXZpdHlUaW1lcik7XG4gICAgICAgIHRoaXMuX2luYWN0aXZpdHlUaW1lciA9IHNldFRpbWVvdXQoICgpID0+IHRoaXMub25JbmFjdGl2aXR5VGltZW91dCgpLCA1MDAwKTtcblxuICAgICAgICB0aGlzLl9rZXlib2FyZC50b2dnbGVLZXlQcmVzc2VkKHtcbiAgICAgICAgICAgIG5vdGF0aW9uOiBldmVudC5jaGFuZ2VkLm5vdGF0aW9uLFxuICAgICAgICAgICAgb2N0YXZlOiBldmVudC5jaGFuZ2VkLm9jdGF2ZSxcbiAgICAgICAgICAgIHZlbG9jaXR5OiBldmVudC5jaGFuZ2VkLnZlbG9jaXR5IH0pO1xuXG4gICAgICAgIGlmIChldmVudC5wcmVkaWN0ZWRLZXkubGVuZ3RoID4gMCAmJiB0aGlzLmN1cnJlbnRLZXlTaWduYXR1cmUgIT09IGV2ZW50LnByZWRpY3RlZEtleVswXS5rZXkpIHtcbiAgICAgICAgICAgIHRoaXMuX2tleWJvYXJkLmNoYW5nZUtleVNpZ25hdHVyZShldmVudC5wcmVkaWN0ZWRLZXlbMF0ua2V5KTtcbiAgICAgICAgICAgIHRoaXMuX2h1ZEtleWJvYXJkLmNoYW5nZUtleVNpZ25hdHVyZShldmVudC5wcmVkaWN0ZWRLZXlbMF0ua2V5KTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEtleVNpZ25hdHVyZSA9IGV2ZW50LnByZWRpY3RlZEtleVswXS5rZXk7XG4gICAgICAgIH1cblxuICAgICAgICAvL3RoaXMuX2tleWJvYXJkLnRvZ2dsZUtleVByZXNzZWQoa2V5W29jdGF2ZV0sIGV2ZW50LmNoYW5nZWQudmVsb2NpdHkpO1xuICAgICAgICAgLyp2YXIga2V5ID0gdGhpcy5maW5kS2V5T2JqZWN0c0Zvck5vdGF0aW9uKGV2ZW50LmNoYW5nZWQubm90YXRpb24pO1xuICAgICAgICAgdmFyIG9jdGF2ZTtcbiAgICAgICAgIGlmIChldmVudC5jaGFuZ2VkLm9jdGF2ZSAvIDIgPT09IE1hdGguZmxvb3IoZXZlbnQuY2hhbmdlZC5vY3RhdmUgLyAyKSkge1xuICAgICAgICAgICAgb2N0YXZlID0gMTtcbiAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvY3RhdmUgPSAwO1xuICAgICAgICAgfVxuXG4gICAgICAgICB0aGlzLnRvZ2dsZUtleVByZXNzZWQoa2V5W29jdGF2ZV0sIGV2ZW50LmNoYW5nZWQudmVsb2NpdHkpO1xuXG4gICAgICAgICBpZiAoZXZlbnQucHJlZGljdGVkS2V5Lmxlbmd0aCA+IDAgJiYgZXZlbnQucHJlZGljdGVkS2V5WzBdICE9PSB0aGlzLmN1cnJlbnRLZXlTaWduYXR1cmUpIHtcbiAgICAgICAgICAgIHRoaXMub25LZXlTaWduYXR1cmVDaGFuZ2UoZXZlbnQucHJlZGljdGVkS2V5WzBdLmtleSk7XG4gICAgICAgICB9Ki9cbiAgICAgfVxuXG4gICAgLyoqXG4gICAgICogaW5hY3Rpdml0eSB0aW1lb3V0XG4gICAgICovXG4gICAgb25JbmFjdGl2aXR5VGltZW91dCgpIHtcbiAgICAgICAgdGhpcy5fa2V5Ym9hcmQucmVzZXRLZXlzKCk7XG4gICAgICAgIHRoaXMuX2h1ZEtleWJvYXJkLnJlc2V0S2V5cygpO1xuICAgICAgICB0aGlzLl9pbnB1dC5jbGVhclByZWRpY3Rpb25IaXN0b3J5KCk7XG4gICAgIH1cblxuICAgIC8qKlxuICAgICAqIG9uIGNvbmZpZyBsb2FkZWRcbiAgICAgKi9cbiAgICBvbkNvbmZpZ0xvYWRlZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3JlcXVlc3QucmVhZHlTdGF0ZSA9PT0gWE1MSHR0cFJlcXVlc3QuRE9ORSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3JlcXVlc3Quc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICB2YXIgY29uZmlnID0gSlNPTi5wYXJzZSh0aGlzLl9yZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXR1cChjb25maWcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnVGhlcmUgd2FzIGEgcHJvYmxlbSB3aXRoIHRoZSByZXF1ZXN0LicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHNldHVwIGFwcFxuICAgICAqIEBwYXJhbSBjb25maWdcbiAgICAgKiBAcGFyYW0gY29uZmlnXG4gICAgICovXG4gICAgc2V0dXAoY29uZmlnKSB7XG4gICAgICAgIHRoaXMuX3NjZW5lLm9uQ3JlYXRlID0gdGhpcy5jcmVhdGU7XG5cbiAgICAgICAgdGhpcy5faW5wdXQgPSBuZXcgSW5wdXQoY29uZmlnLmlucHV0LCAoa2V5cykgPT4gdGhpcy5vbktleUlucHV0Q2hhbmdlKGtleXMpICk7XG4gICAgICAgIHRoaXMuX2tleWJvYXJkID0gbmV3IFRyYWRpdGlvbmFsS2V5Ym9hcmQoY29uZmlnLmtleWJvYXJkKTtcbiAgICAgICAgdGhpcy5faHVkS2V5Ym9hcmQgPSBuZXcgQ2lyY3VsYXJLZXlib2FyZChjb25maWcubm90YXRpb25kaXNwbGF5KTtcblxuICAgICAgICB0aGlzLl9zY2VuZS5hZGRPYmplY3RzKFtcbiAgICAgICAgICAgIG5ldyBNZXRyb25vbWUoKSxcbiAgICAgICAgICAgIG5ldyBGbG9hdGluZ1BhcnRpY2xlcygpLFxuICAgICAgICAgICAgbmV3IERvbWUoKSxcbiAgICAgICAgICAgIHRoaXMuX2tleWJvYXJkLFxuICAgICAgICAgICAgdGhpcy5faHVkS2V5Ym9hcmQsXG4gICAgICAgICAgICBuZXcgTGlnaHRpbmcoKSBdKTtcblxuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IGNvbmZpZy5zb3VuZC5zb3VuZGZvbnRzLmxlbmd0aDsgYysrKSB7XG4gICAgICAgICAgICBUb25lUGxheWJhY2subG9hZEluc3RydW1lbnQoY29uZmlnLnNvdW5kLnNvdW5kZm9udHNbY10sIGNvbmZpZy5zb3VuZC5zb3VuZGZvbnRsb2NhdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGV2ZW50ID0+IHRoaXMub25LZXlEb3duKGV2ZW50KSApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG9uIGtleWRvd25cbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKi9cbiAgICBvbktleURvd24oZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LmNvZGUgPT09ICdTcGFjZScpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoVG9uZVBsYXliYWNrLnBsYXllclN0YXRlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAncmVhZHknOiBUb25lUGxheWJhY2sucGxheSgnLi9hc3NldHMvYXVkaW8vQm9ubmllX1R5bGVyXy1fVG90YWxfRWNsaXBzZV9vZl90aGVfSGVhcnQubWlkJyk7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3BsYXlpbmcnOiBUb25lUGxheWJhY2sucGF1c2UoKTsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAncGF1c2VkJzogVG9uZVBsYXliYWNrLnJlc3VtZSgpOyBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZShzY2VuZSwgY3VzdG9tKSB7XG4gICAgICAgIHNjZW5lLnJlbmRlcmVyLmdhbW1hSW5wdXQgPSB0cnVlO1xuICAgICAgICBzY2VuZS5yZW5kZXJlci5nYW1tYU91dHB1dCA9IHRydWU7XG4gICAgfVxuXG4gICAgcmVuZGVyKHNjZW5lLCBjdXN0b20pIHt9XG59XG4iLCJpbXBvcnQgUVdFUlRZS2V5TWFuYWdlciBmcm9tICcuL3F3ZXJ0eWtleW1hbmFnZXIuZXM2JztcbmltcG9ydCBNSURJS2V5TWFuYWdlciBmcm9tICcuL21pZGlrZXltYW5hZ2VyLmVzNic7XG5pbXBvcnQgS2V5U2lnbmF0dXJlUHJlZGljdGlvbiBmcm9tICcuL211c2ljdGhlb3J5L2tleXNpZ25hdHVyZXByZWRpY3Rpb24uZXM2JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKHBhcmFtcywgY2IpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGtleSBtYW5hZ2VyXG4gICAgICAgICAqIEB0eXBlIHskRVM2X0FOT05ZTU9VU19DTEFTUyR9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBpZiAocGFyYW1zLmRldmljZSA9PT0gJ1FXRVJUWScpIHtcbiAgICAgICAgICAgIHRoaXMuX2tleW1hbmFnZXIgPSBuZXcgUVdFUlRZS2V5TWFuYWdlcihwYXJhbXMsIGNoYW5nZWQgPT4gdGhpcy5vbktleUNoYW5nZShjaGFuZ2VkKSk7XG4gICAgICAgIH0gZWxzZSBpZiAocGFyYW1zLmRldmljZSA9PT0gJ01JREknKSB7XG4gICAgICAgICAgICB0aGlzLl9rZXltYW5hZ2VyID0gbmV3IE1JRElLZXlNYW5hZ2VyKHBhcmFtcywgY2hhbmdlZCA9PiB0aGlzLm9uS2V5Q2hhbmdlKGNoYW5nZWQpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBrZXkgc2lnbmF0dXJlIHByZWRpY3Rpb25cbiAgICAgICAgICogQHR5cGUgeyRFUzZfQU5PTllNT1VTX0NMQVNTJH1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2tleVNpZ1ByZWRpY3Rpb24gPSBuZXcgS2V5U2lnbmF0dXJlUHJlZGljdGlvbigpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBrZXkgY2hhbmdlIGNhbGxiYWNrXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9jYWxsYmFjayA9IGNiO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNsZWFyIHByZWRpY3Rpb24gaGlzdG9yeVxuICAgICAqL1xuICAgIGNsZWFyUHJlZGljdGlvbkhpc3RvcnkoKSB7XG4gICAgICAgIHRoaXMuX2tleVNpZ1ByZWRpY3Rpb24uY2xlYXJIaXN0b3J5KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb24ga2V5IGNoYW5nZVxuICAgICAqIEBwYXJhbSBjaGFuZ2VkXG4gICAgICovXG4gICAgb25LZXlDaGFuZ2UoY2hhbmdlZCkge1xuICAgICAgICB2YXIga2QgPSB0aGlzLl9rZXltYW5hZ2VyLmdldEtleXNEb3duKCk7XG4gICAgICAgIHZhciBwcmVkaWN0ZWQgPSB0aGlzLl9rZXlTaWdQcmVkaWN0aW9uLnVwZGF0ZShrZCk7XG4gICAgICAgIHRoaXMuX2NhbGxiYWNrLmFwcGx5KHRoaXMsIFsgeyBkb3duOiBrZCwgcHJlZGljdGVkS2V5OiBwcmVkaWN0ZWQsIGNoYW5nZWQ6IGNoYW5nZWQgfV0pO1xuICAgIH1cbn1cbiIsImltcG9ydCBOb3RlIGZyb20gJy4vbXVzaWN0aGVvcnkvbm90ZS5lczYnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gICAgY29uc3RydWN0b3IocGFyYW1zLCBjYikge1xuICAgICAgICAvKipcbiAgICAgICAgICogZXZlbnQgY2FsbGJhY2tcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrID0gY2I7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGtleXMgZG93blxuICAgICAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9rZXlzID0gW107XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1JREkga2V5IHRvIG5vdGF0aW9uIG1hcHBpbmcgKGNvbWluZyBmcm9tIE1JREksIHNvIG5vdCBjdXN0b21pemFibGUpXG4gICAgICAgICAqIHRoZSBzcGxpY2UgaGFwcGVucyBiZWNhdXNlIDAgaW5kZXggaW4gTUlESSBzdGFydHMgd2l0aCBDXG4gICAgICAgICAqIEB0eXBlIHtBcnJheS48c3RyaW5nPn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX21hcHBpbmcgPSBOb3RlLnNoYXJwTm90YXRpb25zXG4gICAgICAgICAgICAuY29uY2F0KE5vdGUuc2hhcnBOb3RhdGlvbnMpXG4gICAgICAgICAgICAuY29uY2F0KE5vdGUuc2hhcnBOb3RhdGlvbnMpXG4gICAgICAgICAgICAuY29uY2F0KE5vdGUuc2hhcnBOb3RhdGlvbnMpXG4gICAgICAgICAgICAuY29uY2F0KE5vdGUuc2hhcnBOb3RhdGlvbnMpXG4gICAgICAgICAgICAuY29uY2F0KE5vdGUuc2hhcnBOb3RhdGlvbnMpXG4gICAgICAgICAgICAuY29uY2F0KE5vdGUuc2hhcnBOb3RhdGlvbnMpXG4gICAgICAgICAgICAuY29uY2F0KE5vdGUuc2hhcnBOb3RhdGlvbnMpXG4gICAgICAgICAgICAuY29uY2F0KE5vdGUuc2hhcnBOb3RhdGlvbnMpXG4gICAgICAgICAgICAuY29uY2F0KE5vdGUuc2hhcnBOb3RhdGlvbnMpLnNwbGljZSgzLCBOb3RlLnNoYXJwTm90YXRpb25zLmxlbmd0aCAqMTApO1xuXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZURldmljZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGluaXRpYWxpemUgbWlkaSBkZXZpY2VcbiAgICAgKi9cbiAgICBpbml0aWFsaXplRGV2aWNlKCkge1xuICAgICAgICAvLyByZXF1ZXN0IE1JREkgYWNjZXNzXG4gICAgICAgIGlmIChuYXZpZ2F0b3IucmVxdWVzdE1JRElBY2Nlc3MpIHtcbiAgICAgICAgICAgIG5hdmlnYXRvci5yZXF1ZXN0TUlESUFjY2VzcygpLnRoZW4oXG4gICAgICAgICAgICAgICAgKGV2ZW50KSA9PiB0aGlzLm9uTUlESVN1Y2Nlc3MoZXZlbnQpLFxuICAgICAgICAgICAgICAgIChldmVudCkgPT4gdGhpcy5vbk1JRElGYWlsdXJlKGV2ZW50KSApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJObyBNSURJIHN1cHBvcnQgaW4geW91ciBicm93c2VyLlwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG9uIG1pZGkgY29ubmVjdGlvbiBzdWNjZXNzXG4gICAgICogQHBhcmFtIG1pZGlcbiAgICAgKi9cbiAgICBvbk1JRElTdWNjZXNzKG1pZGkpIHtcbiAgICAgICAgdmFyIGlucHV0cyA9IG1pZGkuaW5wdXRzO1xuICAgICAgICBmb3IgKGxldCBpbnB1dCBvZiBpbnB1dHMudmFsdWVzKCkpIHtcbiAgICAgICAgICAgIGlucHV0Lm9ubWlkaW1lc3NhZ2UgPSBtc2cgPT4gdGhpcy5vbk1JRElNZXNzYWdlKG1zZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvbiBtaWRpIGNvbm5lY3Rpb24gZmFpbHVyZVxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqL1xuICAgIG9uTUlESUZhaWx1cmUoZXZlbnQpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJObyBhY2Nlc3MgdG8gTUlESSBkZXZpY2VzIG9yIHlvdXIgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgV2ViTUlESSBBUEkuIFBsZWFzZSB1c2UgV2ViTUlESUFQSVNoaW0gXCIgKyBldmVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb24gbWlkaSBtZXNzYWdlXG4gICAgICogQHBhcmFtIG1zZ1xuICAgICAqL1xuICAgIG9uTUlESU1lc3NhZ2UobXNnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKG1zZylcbiAgICAgICAgdmFyIGNtZCA9IG1zZy5kYXRhWzBdID4+IDQ7XG4gICAgICAgIHZhciBjaGFubmVsID0gbXNnLmRhdGFbMF0gJiAweGY7XG4gICAgICAgIHZhciBub3RlTnVtYmVyID0gbXNnLmRhdGFbMV07XG4gICAgICAgIHZhciB2ZWxvY2l0eSA9IDA7XG4gICAgICAgIGlmIChtc2cuZGF0YS5sZW5ndGggPiAyKVxuICAgICAgICAgICAgdmVsb2NpdHkgPSBtc2cuZGF0YVsyXSAvIDEwMDtcblxuICAgICAgICAvLyBNSURJIG5vdGVvbiB3aXRoIHZlbG9jaXR5PTAgaXMgdGhlIHNhbWUgYXMgbm90ZW9mZlxuICAgICAgICBpZiAoIGNtZD09OCB8fCAoKGNtZD09OSkmJih2ZWxvY2l0eT09MCkpICkgeyAvLyBub3Rlb2ZmXG4gICAgICAgICAgICB0aGlzLm9uS2V5VXAobm90ZU51bWJlcik7XG4gICAgICAgIH0gZWxzZSBpZiAoY21kID09IDkpIHsgLy8gbm90ZSBvblxuICAgICAgICAgICAgdGhpcy5vbktleURvd24obm90ZU51bWJlciwgdmVsb2NpdHkpO1xuICAgICAgICB9IC8vZWxzZSBpZiAoY21kID09IDExKSB7IC8vIGNvbnRyb2xsZXIgbWVzc2FnZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdldCBrZXlzIGRvd25cbiAgICAgKi9cbiAgICBnZXRLZXlzRG93bigpIHtcbiAgICAgICAgdmFyIGRvd24gPSBbXTtcbiAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCB0aGlzLl9rZXlzLmxlbmd0aDsgYysrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fa2V5c1tjXSA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgb2N0YXZlID0gMDtcbiAgICAgICAgICAgICAgICBpZiAoYyA+PSB0aGlzLl9rZXlzLmxlbmd0aC8yKSB7IG9jdGF2ZSA9IDE7IH1cbiAgICAgICAgICAgICAgICBkb3duLnB1c2goIHsgbm90YXRpb246IHRoaXMuX21hcHBpbmdbY10sIG9jdGF2ZTogb2N0YXZlLCBpbmRleDogYywgdmVsb2NpdHk6IHRoaXMuX2tleXNbY119ICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRvd247XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb24ga2V5IGRvd25cbiAgICAgKiBAcGFyYW0ga2V5XG4gICAgICogQHBhcmFtIHZlbG9jaXR5XG4gICAgICovXG4gICAgb25LZXlEb3duKGtleSwgdmVsb2NpdHkpIHtcbiAgICAgICAgdGhpcy5fa2V5c1trZXldID0gdmVsb2NpdHk7XG4gICAgICAgIHZhciBvY3RhdmUgPSAwO1xuICAgICAgICBvY3RhdmUgPSBNYXRoLmZsb29yKGtleSAvIE5vdGUuc2hhcnBOb3RhdGlvbnMubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2soe1xuICAgICAgICAgICAgbm90YXRpb246IHRoaXMuX21hcHBpbmdba2V5XSxcbiAgICAgICAgICAgIG9jdGF2ZTogb2N0YXZlLFxuICAgICAgICAgICAgaW5kZXg6IGtleSxcbiAgICAgICAgICAgIHZlbG9jaXR5OiB2ZWxvY2l0eSxcbiAgICAgICAgICAgIGFjdGlvbjogJ3ByZXNzJyB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvbiBrZXkgZG93blxuICAgICAqIEBwYXJhbSBrZXlcbiAgICAgKi9cbiAgICBvbktleVVwKGtleSkge1xuICAgICAgICB0aGlzLl9rZXlzW2tleV0gPSAwLjA7XG4gICAgICAgIHZhciBvY3RhdmUgPSAwO1xuICAgICAgICBvY3RhdmUgPSBNYXRoLmZsb29yKGtleSAvIE5vdGUuc2hhcnBOb3RhdGlvbnMubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2soe1xuICAgICAgICAgICAgbm90YXRpb246IHRoaXMuX21hcHBpbmdba2V5XSxcbiAgICAgICAgICAgIG9jdGF2ZTogb2N0YXZlLFxuICAgICAgICAgICAgaW5kZXg6IGtleSxcbiAgICAgICAgICAgIHZlbG9jaXR5OiAwLFxuICAgICAgICAgICAgYWN0aW9uOiAncmVsZWFzZScgfSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IE5vdGUgZnJvbSAnLi9ub3RlLmVzNic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGtleSBzaWduYXR1cmUgc2NvcmUgaGlzdG9yeVxuICAgICAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9rZXlTaWduYXR1cmVTY29yZUhpc3RvcnkgPSBbXTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogaGlzdG9yeSBkZWNheSByYXRlXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9rZXlTaWduYXR1cmVEZWNheVJhdGUgPSAwLjk7XG5cbiAgICAgICAgTm90ZS5nZW5lcmF0ZUtleVNpZ25hdHVyZUxvb2t1cCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHVwZGF0ZSBrZXlzIHByZXNzZWRcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBrZXlzXG4gICAgICovXG4gICAgdXBkYXRlKGtleXMpIHtcbiAgICAgICAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7IHJldHVybiB0aGlzLl9rZXlTaWduYXR1cmVTY29yZUhpc3Rvcnk7IH1cbiAgICAgICAgdmFyIGtleXNpZ1Njb3JlcyA9IHt9O1xuICAgICAgICBmb3IgKHZhciBzaWcgaW4gTm90ZS5rZXlzKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBkID0gMDsgZCA8IGtleXMubGVuZ3RoOyBkKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoTm90ZS5rZXlzW3NpZ10uaW5kZXhPZihrZXlzW2RdLm5vdGF0aW9uKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFrZXlzaWdTY29yZXNbc2lnXSkgeyBrZXlzaWdTY29yZXNbc2lnXSA9IDA7IH1cbiAgICAgICAgICAgICAgICAgICAga2V5c2lnU2NvcmVzW3NpZ10gKys7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleXNbZF0ubm90YXRpb24gPT09IHNpZykge1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5c2lnU2NvcmVzW3NpZ10gKz0gLjAxOyAvLyBzbWFsbCBwcmlvcml0eSBib29zdCBmb3Igcm9vdCBub3RlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2NvcmVzID0gW107XG4gICAgICAgIGZvciAodmFyIHNjb3JlIGluIGtleXNpZ1Njb3Jlcykge1xuICAgICAgICAgICAgc2NvcmVzLnB1c2goIHsgc2NvcmU6IGtleXNpZ1Njb3Jlc1tzY29yZV0sIGtleTogc2NvcmUsIHRpbWVzdGFtcDogRGF0ZS5ub3coKSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGVjYXlIaXN0b3JpY2FsU2NvcmVzKCk7XG4gICAgICAgIHJldHVybiB0aGlzLmFwcGx5Q3VycmVudFNjb3JlVG9IaXN0b3J5KHNjb3Jlcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY2xlYXIgaGlzdG9yeVxuICAgICAqL1xuICAgIGNsZWFySGlzdG9yeSgpIHtcbiAgICAgICAgdGhpcy5fa2V5U2lnbmF0dXJlU2NvcmVIaXN0b3J5ID0gW107XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2xvd2x5IGRlY2F5IGN1cnJlbnQgaGlzdG9yaWNhbCBzY29yZXNcbiAgICAgKi9cbiAgICBkZWNheUhpc3RvcmljYWxTY29yZXMoKSB7XG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgdGhpcy5fa2V5U2lnbmF0dXJlU2NvcmVIaXN0b3J5Lmxlbmd0aDsgYysrKSB7XG4gICAgICAgICAgICB0aGlzLl9rZXlTaWduYXR1cmVTY29yZUhpc3RvcnlbY10uc2NvcmUgKj0gdGhpcy5fa2V5U2lnbmF0dXJlRGVjYXlSYXRlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYXBwbHkgc2NvcmVzIHRvIGhpc3RvcnkgKGFnZ3JlZ2F0ZSBhbGwgc2NvcmVzOiBjdXJyZW50IGFuZCBwYXN0KVxuICAgICAqIEBwYXJhbSBzY29yZXNcbiAgICAgKi9cbiAgICBhcHBseUN1cnJlbnRTY29yZVRvSGlzdG9yeShzY29yZXMpIHtcbiAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCBzY29yZXMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgIHZhciBmb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgZm9yICh2YXIgZCA9IDA7IGQgPCB0aGlzLl9rZXlTaWduYXR1cmVTY29yZUhpc3RvcnkubGVuZ3RoOyBkKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fa2V5U2lnbmF0dXJlU2NvcmVIaXN0b3J5W2RdLmtleSA9PT0gc2NvcmVzW2NdLmtleSkge1xuICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2tleVNpZ25hdHVyZVNjb3JlSGlzdG9yeVtkXS5zY29yZSArPSBzY29yZXNbY10uc2NvcmU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2tleVNpZ25hdHVyZVNjb3JlSGlzdG9yeS5wdXNoKHNjb3Jlc1tjXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2tleVNpZ25hdHVyZVNjb3JlSGlzdG9yeS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIChhLnNjb3JlIDwgYi5zY29yZSApID8gMSA6ICgoYi5zY29yZSA8IGEuc2NvcmUpID8gLTEgOiAwKTsgfSk7XG4gICAgfVxufVxuIiwiLyoqXG4gKiBOb3RlIHN0YXRpYyBjbGFzc1xuICogQGNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICAvKiogY2FjaGVkIGtleXNpZ25hdHVyZSBsb29rdXAgdGFibGUgKi9cbiAgICBrZXlzOiB7fSxcblxuICAgIC8qKlxuICAgICAqIGluY3JlbWVudGFsIHRvbmVzIGFzIHNoYXJwIG5vdGF0aW9uXG4gICAgICogQGNvbnN0XG4gICAgICogQHN0YXRpY1xuICAgICAqIEB0eXBlIHtBcnJheS48c3RyaW5nPn1cbiAgICAgKiovXG4gICAgc2hhcnBOb3RhdGlvbnM6IFtcIkFcIiwgXCJBI1wiLCBcIkJcIiwgXCJDXCIsIFwiQyNcIiwgXCJEXCIsIFwiRCNcIiwgXCJFXCIsIFwiRlwiLCBcIkYjXCIsIFwiR1wiLCBcIkcjXCJdLFxuXG4gICAgLyoqXG4gICAgICogaW5jcmVtZW50YWwgdG9uZXMgYXMgZmxhdCBub3RhdGlvblxuICAgICAqIEBjb25zdFxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAdHlwZSB7QXJyYXkuPHN0cmluZz59XG4gICAgICoqL1xuICAgIGZsYXROb3RhdGlvbnM6IFtcIkFcIiwgXCJCYlwiLCBcIkJcIiwgXCJDXCIsIFwiRGJcIiwgXCJEXCIsIFwiRWJcIiwgXCJFXCIsIFwiRlwiLCBcIkdiXCIsIFwiR1wiLCBcIkFiXCJdLFxuXG4gICAgLyoqXG4gICAgICogZ2V0IG5vdGF0aW9uIGluZGV4IHdoZW4gbm90YXRpb24gaXMgZWl0aGVyIGZsYXQgb3Igc2hhcnBcbiAgICAgKiBAcGFyYW0gbm90YXRpb25cbiAgICAgKi9cbiAgICBpbmRleE9mTm90YXRpb24obm90YXRpb24pIHtcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5zaGFycE5vdGF0aW9ucy5pbmRleE9mKG5vdGF0aW9uKTtcbiAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgaW5kZXggPSB0aGlzLmZsYXROb3RhdGlvbnMuaW5kZXhPZihub3RhdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBnZXQgbm90YXRpb24gZ2l2ZW4gYW4gaW5kZXhcbiAgICAgKiBAcGFyYW0gaW5kZXhcbiAgICAgKi9cbiAgICBub3RhdGlvbkF0SW5kZXgoaW5kZXgsIHByZWZlckZsYXQpIHtcbiAgICAgICAgaWYgKGluZGV4ID49IHRoaXMuc2hhcnBOb3RhdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpbmRleCA9IGluZGV4ICUgdGhpcy5zaGFycE5vdGF0aW9ucy5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJlZmVyRmxhdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmxhdE5vdGF0aW9uc1tpbmRleF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zaGFycE5vdGF0aW9uc1tpbmRleF07XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogb2RkIG5vdGF0aW9uc1xuICAgICAqIEBjb25zdFxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAdHlwZSB7QXJyYXkuPHN0cmluZz59XG4gICAgICoqL1xuICAgICBvZGROb3RhdGlvbnM6IFtcIkIjXCIsIFwiQ2JcIiwgXCJFI1wiLCBcIkZiXCJdLFxuXG4gICAgLyoqXG4gICAgICogY29ycmVjdGVkIG5vdGF0aW9uc1xuICAgICAqIEBjb25zdFxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAdHlwZSB7QXJyYXkuPHN0cmluZz59XG4gICAgICoqL1xuICAgICBjb3JyZWN0ZWROb3RhdGlvbnM6IFtcIkNcIiwgXCJDXCIsIFwiRlwiLCBcIkZcIl0sXG5cbiAgICAvKipcbiAgICAgKiB0cmFuc2xhdGUgaW5kZXggZnJvbSBNSURJIHRvIG5vdGF0aW9uXG4gICAgICogQHBhcmFtIGluZGV4XG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgTUlESXRvTm90YXRpb24oaW5kZXgpIHtcbiAgICAgICAgdmFyIHBvc2l0aW9uID0gaW5kZXggJSB0aGlzLnNoYXJwTm90YXRpb25zLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2hhcnBOb3RhdGlvbnNbcG9zaXRpb25dO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiB0cmFuc2xhdGUgbm90YXRpb24gYW5kIG9jdGF2ZSB0byBNSURJIGluZGV4XG4gICAgICogQHBhcmFtIG5vdGF0aW9uXG4gICAgICovXG4gICAgbm90YXRpb25Ub01JREkobm90YXRpb24pIHtcbiAgICAgICAgdmFyIG50T2JqID0gdGhpcy5wYXJzZU5vdGF0aW9uKG5vdGF0aW9uKTtcbiAgICAgICAgdmFyIG50aW5keCA9IHRoaXMuc2hhcnBOb3RhdGlvbnMuaW5kZXhPZihudE9iai5ub3RhdGlvbik7XG4gICAgICAgIGlmIChudGluZHggPT09IC0xKSB7XG4gICAgICAgICAgICBudGluZHggPSB0aGlzLmZsYXROb3RhdGlvbnMuaW5kZXhPZihudE9iai5ub3RhdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG50T2JqLm9jdGF2ZSAqIHRoaXMuc2hhcnBOb3RhdGlvbnMubGVuZ3RoICsgbnRpbmR4O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBwYXJzZSBub3RhdGlvbiB0byBub3RhdGlvbiBhbmQgb2N0YXZlXG4gICAgICogQHBhcmFtIG5vdGF0aW9uXG4gICAgICovXG4gICAgcGFyc2VOb3RhdGlvbihub3RhdGlvbikge1xuICAgICAgICB2YXIgbm90ZSA9IHt9O1xuICAgICAgICAvLyBvbmx5IHN1cHBvcnRzIG9uZSBkaWdpdCBvY3RhdmVzIChpZiB0aGF0cyBldmVuIGEgcmVhbCBpc3N1ZSlcbiAgICAgICAgdmFyIG9jdGF2ZSA9IG5vdGF0aW9uLmNoYXJBdChub3RhdGlvbi5sZW5ndGgtMSk7XG4gICAgICAgIGlmIChwYXJzZUludChvY3RhdmUpID09IG9jdGF2ZSkge1xuICAgICAgICAgICAgbm90ZS5vY3RhdmUgPSBvY3RhdmU7XG4gICAgICAgICAgICBub3RlLm5vdGF0aW9uID0gbm90YXRpb24uc3Vic3RyKDAsIG5vdGF0aW9uLmxlbmd0aC0yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vdGUub2N0YXZlID0gNDsgLy8gZGVmYXVsdFxuICAgICAgICAgICAgbm90ZS5ub3RhdGlvbiA9IG5vdGF0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5vdGU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHR1cm4gYSBub3RhdGlvbiBpbnRvIGEgZnJlcXVlbmN5XG4gICAgICogQHN0YXRpY1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBub3RhdGlvblxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gZnJlcXVlbmN5XG4gICAgICovXG4gICAgZ2V0RnJlcXVlbmN5Rm9yTm90YXRpb24obnQpIHtcbiAgICAgICAgdmFyIG9jdGF2ZSA9IDQ7XG5cbiAgICAgICAgLy8gZG9lcyBub3RhdGlvbiBpbmNsdWRlIHRoZSBvY3RhdmU/XG4gICAgICAgIGlmICggIWlzTmFOKCBwYXJzZUludChudC5jaGFyQXQobnQubGVuZ3RoIC0xKSkgKSkge1xuICAgICAgICAgICAgb2N0YXZlID0gcGFyc2VJbnQobnQuY2hhckF0KG50Lmxlbmd0aCAtMSkpO1xuICAgICAgICAgICAgbnQgPSBudC5zdWJzdHIoMCwgbnQubGVuZ3RoLTEpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY29ycmVjdCBhbnkgZmxhdC9zaGFycHMgdGhhdCByZXNvbHZlIHRvIGEgbmF0dXJhbFxuICAgICAgICBpZiAodGhpcy5vZGROb3RhdGlvbnMuaW5kZXhPZihudCkgIT0gLTEpIHtcbiAgICAgICAgICAgIG50ID0gdGhpcy5jb3JyZWN0ZWROb3RhdGlvbnNbdGhpcy5vZGROb3RhdGlvbnMuaW5kZXhPZihudCldO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZyZXE7XG4gICAgICAgIHZhciBpbmR4ID0gdGhpcy5zaGFycE5vdGF0aW9ucy5pbmRleE9mKG50KTtcblxuICAgICAgICBpZiAoaW5keCA9PSAtMSkge1xuICAgICAgICAgICAgaW5keCA9IHRoaXMuZmxhdE5vdGF0aW9ucy5pbmRleE9mKG50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbmR4ICE9IC0xKSB7XG4gICAgICAgICAgICBpbmR4ICs9IChvY3RhdmUtNCkgKiB0aGlzLnNoYXJwTm90YXRpb25zLmxlbmd0aDtcbiAgICAgICAgICAgIGZyZXEgPSA0NDAgKiAoTWF0aC5wb3coMiwgaW5keC8xMikpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmcmVxO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBnZXQgbm90ZXMgaW4gYSBzcGVjaWZpYyBrZXkgc2lnbmF0dXJlXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSAocm9vdCBub3RlKVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gaWYgbWFqb3Iga2V5IHNpZ25hdHVyZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBvY3RhdmUgdG8gdXNlIChvcHRpb25hbClcbiAgICAgKiBAcmV0dXJuIHtBcnJheS48c3RyaW5nPn0ga2V5cyBpbiBrZXkgc2lnbmF0dXJlXG4gICAgICovXG4gICAgbm90ZXNJbktleVNpZ25hdHVyZShrZXksIG1ham9yLCBvY3RhdmUpIHtcbiAgICAgICAgdmFyIG5vdGVzVG9JbmRleDtcbiAgICAgICAgdmFyIG5vdGVzSW5LZXkgPSBbXTtcbiAgICAgICAgdmFyIHN0YXJ0UG9zO1xuXG4gICAgICAgIC8vIGNvcnJlY3QgYW55IGZsYXQvc2hhcnBzIHRoYXQgcmVzb2x2ZSB0byBhIG5hdHVyYWxcbiAgICAgICAgaWYgKHRoaXMub2RkTm90YXRpb25zLmluZGV4T2Yoa2V5KSAhPSAtMSkge1xuICAgICAgICAgICAga2V5ID0gdGhpcy5jb3JyZWN0ZWROb3RhdGlvbnNbdGhpcy5vZGROb3RhdGlvbnMuaW5kZXhPZihrZXkpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZpbmQgdGhlIGNvcnJlY3Qgbm90ZSBhbmQgbm90YXRpb25cbiAgICAgICAgaWYgKHRoaXMuc2hhcnBOb3RhdGlvbnMuaW5kZXhPZihrZXkpICE9IC0xKSB7XG4gICAgICAgICAgICBub3Rlc1RvSW5kZXggPSB0aGlzLnNoYXJwTm90YXRpb25zLnNsaWNlKCk7XG4gICAgICAgICAgICBzdGFydFBvcyA9IHRoaXMuc2hhcnBOb3RhdGlvbnMuaW5kZXhPZihrZXkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm90ZXNUb0luZGV4ID0gdGhpcy5mbGF0Tm90YXRpb25zLnNsaWNlKCk7XG4gICAgICAgICAgICBzdGFydFBvcyA9IHRoaXMuZmxhdE5vdGF0aW9ucy5pbmRleE9mKGtleSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkb3VibGUgdGhlIGFycmF5IGxlbmd0aFxuICAgICAgICB2YXIgbGVuID0gbm90ZXNUb0luZGV4Lmxlbmd0aDtcbiAgICAgICAgZm9yICggdmFyIGMgPSAwOyBjIDwgbGVuOyBjKysgKSB7XG4gICAgICAgICAgICBpZiAob2N0YXZlKSB7XG4gICAgICAgICAgICAgICAgbm90ZXNUb0luZGV4LnB1c2gobm90ZXNUb0luZGV4W2NdICsgKG9jdGF2ZSsxKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5vdGVzVG9JbmRleC5wdXNoKG5vdGVzVG9JbmRleFtjXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhZGQgb2N0YXZlIG5vdGF0aW9uIHRvIHRoZSBmaXJzdCBoYWxmIG9mIHRoZSBhcnJheVxuICAgICAgICBpZiAob2N0YXZlKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IHRoaXMuZmxhdE5vdGF0aW9ucy5sZW5ndGg7IGMrKykge1xuICAgICAgICAgICAgICAgIG5vdGVzVG9JbmRleFtjXSArPSBvY3RhdmU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2hvcCBvZmYgdGhlIGZyb250IG9mIHRoZSBhcnJheSB0byBzdGFydCBhdCB0aGUgcm9vdCBrZXkgaW4gdGhlIGtleSBzaWduYXR1cmVcbiAgICAgICAgbm90ZXNUb0luZGV4LnNwbGljZSgwLCBzdGFydFBvcyk7XG5cbiAgICAgICAgLy8gYnVpbGQgdGhlIGtleSBzaWduYXR1cmVcbiAgICAgICAgaWYgKG1ham9yKSB7XG4gICAgICAgICAgICAvLyBNQUpPUiBGcm9tIHJvb3Q6IHdob2xlIHN0ZXAsIHdob2xlIHN0ZXAsIGhhbGYgc3RlcCwgd2hvbGUgc3RlcCwgd2hvbGUgc3RlcCwgd2hvbGUgc3RlcCwgaGFsZiBzdGVwXG4gICAgICAgICAgICBub3Rlc0luS2V5LnB1c2goIG5vdGVzVG9JbmRleFswXSApO1xuICAgICAgICAgICAgbm90ZXNJbktleS5wdXNoKCBub3Rlc1RvSW5kZXhbMl0gKTtcbiAgICAgICAgICAgIG5vdGVzSW5LZXkucHVzaCggbm90ZXNUb0luZGV4WzRdICk7XG4gICAgICAgICAgICBub3Rlc0luS2V5LnB1c2goIG5vdGVzVG9JbmRleFs1XSApO1xuICAgICAgICAgICAgbm90ZXNJbktleS5wdXNoKCBub3Rlc1RvSW5kZXhbN10gKTtcbiAgICAgICAgICAgIG5vdGVzSW5LZXkucHVzaCggbm90ZXNUb0luZGV4WzldICk7XG4gICAgICAgICAgICBub3Rlc0luS2V5LnB1c2goIG5vdGVzVG9JbmRleFsxMV0gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE1JTk9SIEZyb20gcm9vdDogd2hvbGUgc3RlcCwgaGFsZiBzdGVwLCB3aG9sZSBzdGVwLCB3aG9sZSBzdGVwLCBoYWxmIHN0ZXAsIHdob2xlIHN0ZXAsIHdob2xlIHN0ZXBcbiAgICAgICAgICAgIG5vdGVzSW5LZXkucHVzaCggbm90ZXNUb0luZGV4WzBdICk7XG4gICAgICAgICAgICBub3Rlc0luS2V5LnB1c2goIG5vdGVzVG9JbmRleFsyXSApO1xuICAgICAgICAgICAgbm90ZXNJbktleS5wdXNoKCBub3Rlc1RvSW5kZXhbM10gKTtcbiAgICAgICAgICAgIG5vdGVzSW5LZXkucHVzaCggbm90ZXNUb0luZGV4WzVdICk7XG4gICAgICAgICAgICBub3Rlc0luS2V5LnB1c2goIG5vdGVzVG9JbmRleFs3XSApO1xuICAgICAgICAgICAgbm90ZXNJbktleS5wdXNoKCBub3Rlc1RvSW5kZXhbOF0gKTtcbiAgICAgICAgICAgIG5vdGVzSW5LZXkucHVzaCggbm90ZXNUb0luZGV4WzEwXSApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub3Rlc0luS2V5O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBwcmVnZW5lcmF0ZSBhIGtleSBzaWduYXR1cmUgbG9va3VwIHRhYmxlIGZvciBldmVyeSBub3RlXG4gICAgICovXG4gICAgZ2VuZXJhdGVLZXlTaWduYXR1cmVMb29rdXAoKSB7XG4gICAgICAgIHZhciBreXMgPSB0aGlzLnNoYXJwTm90YXRpb25zO1xuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IGt5cy5sZW5ndGg7IGMrKykge1xuICAgICAgICAgICAgdGhpcy5rZXlzW2t5c1tjXV0gPSB0aGlzLm5vdGVzSW5LZXlTaWduYXR1cmUoa3lzW2NdLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMua2V5c1treXNbY10gKyAnbSddID0gdGhpcy5ub3Rlc0luS2V5U2lnbmF0dXJlKGt5c1tjXSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgfVxuXG59O1xuIiwiaW1wb3J0IEJhc2VHcm91cCBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvdHJpdnIvc3JjL2Jhc2Vncm91cC5lczYnO1xuaW1wb3J0IFN0eWxlIGZyb20gJy4uL3RoZW1laW5nL3N0eWxlLmVzNic7XG5pbXBvcnQgVG9uZVBsYXliYWNrIGZyb20gJy4uL3RvbmVwbGF5YmFjay5lczYnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb21lIGV4dGVuZHMgQmFzZUdyb3VwIHtcbiAgICAvKipcbiAgICAgKiBvbiBjcmVhdGUgc2NlbmUgKG9yIGVhcmxpZXN0IHBvc3NpYmxlIG9wcG9ydHVuaXR5KVxuICAgICAqIEBwYXJhbSBzY2VuZVxuICAgICAqIEBwYXJhbSBjdXN0b21cbiAgICAgKi9cbiAgICBvbkNyZWF0ZShzY2VuZSwgY3VzdG9tKSB7XG4gICAgICAgIHZhciBtZXNoID0gbmV3IFRIUkVFLk1lc2godGhpcy5jcmVhdGVHZW9tZXRyeSgpLCB0aGlzLmNyZWF0ZU1hdGVyaWFsKCkpO1xuICAgICAgICBtZXNoLnBvc2l0aW9uLnogPSA1O1xuICAgICAgICB0aGlzLmFkZChtZXNoLCAnZG9tZScpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG9uIHJlbmRlclxuICAgICAqIEBwYXJhbSBzY2VuZWNvbGxlY3Rpb25cbiAgICAgKiBAcGFyYW0gbXljb2xsZWN0aW9uXG4gICAgICovXG4gICAgb25SZW5kZXIoc2NlbmVjb2xsZWN0aW9uLCBteWNvbGxlY3Rpb24pIHtcbiAgICAgICAgaWYgKFRvbmVQbGF5YmFjay5pc1BsYXlpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JvdXAucm90YXRpb24ueSArPSBNYXRoLlBJIC8gMTAyNDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNyZWF0ZSBnbG9iZSBnZW9tZXRyeVxuICAgICAqIEByZXR1cm5zIHtUSFJFRS5JY29zYWhlZHJvbkdlb21ldHJ5fVxuICAgICAqL1xuICAgIGNyZWF0ZUdlb21ldHJ5KCkge1xuICAgICAgICByZXR1cm4gbmV3IFRIUkVFLkljb3NhaGVkcm9uR2VvbWV0cnkoIDgwMCwgMiApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNyZWF0ZSBnbG9iZSBtYXRlcmlhbFxuICAgICAqL1xuICAgIGNyZWF0ZU1hdGVyaWFsKCkge1xuICAgICAgICByZXR1cm4gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHtcbiAgICAgICAgICAgIGNvbG9yICAgICAgOiAgU3R5bGUuZG9tZS5jb2xvcixcbiAgICAgICAgICAgIGVtaXNzaXZlICAgOiAgU3R5bGUuZG9tZS5lbWlzc2l2ZSxcbiAgICAgICAgICAgIHNwZWN1bGFyICAgOiAgU3R5bGUuZG9tZS5zcGVjdWxhcixcbiAgICAgICAgICAgIHNpZGUgICAgICAgOiAgVEhSRUUuQmFja1NpZGUsXG4gICAgICAgICAgICBzaGluaW5lc3MgIDogIDEwLFxuICAgICAgICAgICAgc2hhZGluZyAgICA6ICBUSFJFRS5GbGF0U2hhZGluZyxcbiAgICAgICAgICAgIHRyYW5zcGFyZW50OiAxLFxuICAgICAgICAgICAgb3BhY2l0eSAgICA6IDFcbiAgICAgICAgfSk7XG4gICAgfVxufSIsImltcG9ydCBCYXNlR3JvdXAgZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3RyaXZyL3NyYy9iYXNlZ3JvdXAuZXM2JztcbmltcG9ydCBTdHlsZSBmcm9tICcuLi90aGVtZWluZy9zdHlsZS5lczYnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGbG9hdGluZ1BhcnRpY2xlcyBleHRlbmRzIEJhc2VHcm91cCB7XG4gICAgLyoqXG4gICAgICogb24gY3JlYXRlIHNjZW5lXG4gICAgICogQHBhcmFtIHNjZW5lXG4gICAgICogQHBhcmFtIGN1c3RvbVxuICAgICAqL1xuICAgIG9uQ3JlYXRlKHNjZW5lLCBjdXN0b20pIHtcbiAgICAgICAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XG4gICAgICAgIHZhciB0ZXh0dXJlTG9hZGVyID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKTtcbiAgICAgICAgdmFyIHNwcml0ZSA9IHRleHR1cmVMb2FkZXIubG9hZChTdHlsZS5mbG9hdGluZ3BhcnRpY2xlcy5zcHJpdGUpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTAwMDA7IGkgKyspIHtcbiAgICAgICAgICAgIHZhciB2ZXJ0ZXggPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICAgICAgICAgICAgdmVydGV4LnggPSBNYXRoLnJhbmRvbSgpICogMjAwMCAtIDEwMDA7XG4gICAgICAgICAgICB2ZXJ0ZXgueSA9IE1hdGgucmFuZG9tKCkgKiAyMDAwIC0gMTAwMDtcbiAgICAgICAgICAgIHZlcnRleC56ID0gTWF0aC5yYW5kb20oKSAqIDIwMDAgLSAxMDAwO1xuICAgICAgICAgICAgZ2VvbWV0cnkudmVydGljZXMucHVzaCggdmVydGV4ICk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1hdGVyaWFscyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDQ7IGkgKysgKSB7XG4gICAgICAgICAgICB0aGlzLm1hdGVyaWFsc1tpXSA9IG5ldyBUSFJFRS5Qb2ludHNNYXRlcmlhbCh7XG4gICAgICAgICAgICAgICAgc2l6ZTogTWF0aC5yYW5kb20oKSoxLjAgKyAuNzUsXG4gICAgICAgICAgICAgICAgbWFwOiBzcHJpdGUsXG4gICAgICAgICAgICAgICAgYmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcsXG4gICAgICAgICAgICAgICAgZGVwdGhUZXN0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICB0cmFuc3BhcmVudCA6IHRydWUgfSk7XG5cbiAgICAgICAgICAgIHRoaXMubWF0ZXJpYWxzW2ldLmNvbG9yLnNldChTdHlsZS5mbG9hdGluZ3BhcnRpY2xlcy5jb2xvcik7XG5cbiAgICAgICAgICAgIHZhciBwYXJ0aWNsZXMgPSBuZXcgVEhSRUUuUG9pbnRzKCBnZW9tZXRyeSwgdGhpcy5tYXRlcmlhbHNbaV0gKTtcblxuICAgICAgICAgICAgcGFydGljbGVzLnJvdGF0aW9uLnggPSBNYXRoLnJhbmRvbSgpICogNjtcbiAgICAgICAgICAgIHBhcnRpY2xlcy5yb3RhdGlvbi55ID0gTWF0aC5yYW5kb20oKSAqIDY7XG4gICAgICAgICAgICBwYXJ0aWNsZXMucm90YXRpb24ueiA9IE1hdGgucmFuZG9tKCkgKiA2O1xuICAgICAgICAgICAgdGhpcy5hZGQocGFydGljbGVzKTtcblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25SZW5kZXIoKSB7XG4gICAgICAgIHZhciB0aW1lID0gRGF0ZS5ub3coKSAqIDAuMDAwMDU7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgKyspIHtcbiAgICAgICAgICAgIHZhciBvYmplY3QgPSB0aGlzLmNoaWxkcmVuWyBpIF07XG4gICAgICAgICAgICBpZiAoIG9iamVjdCBpbnN0YW5jZW9mIFRIUkVFLlBvaW50cyApIHtcbiAgICAgICAgICAgICAgICBvYmplY3Qucm90YXRpb24ueSA9IHRpbWUgKiAoIGkgPCA0ID8gaSArIDEgOiAtICggaSArIDEgKSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLypmb3IgKCBpID0gMDsgaSA8IHRoaXMubWF0ZXJpYWxzLmxlbmd0aDsgaSArKyApIHtcbiAgICAgICAgICAgIHZhciBoID0gKCAzNjAgKiAoIDAgKyB0aW1lICkgJSAzNjAgKSAvIDM2MDtcbiAgICAgICAgICAgIHRoaXMubWF0ZXJpYWxzW2ldLmNvbG9yLnNldEhTTCggMSwgLjUsIGggKTtcbiAgICAgICAgfSovXG4gICAgfVxuXG59IiwiaW1wb3J0IEJhc2VHcm91cCBmcm9tICcuLi8uLi8uLi9ub2RlX21vZHVsZXMvdHJpdnIvc3JjL2Jhc2Vncm91cC5lczYnO1xuaW1wb3J0IElucHV0IGZyb20gJy4uLy4uL2lucHV0LmVzNic7XG5pbXBvcnQgTm90ZSBmcm9tICcuLi8uLi9tdXNpY3RoZW9yeS9ub3RlLmVzNic7XG5pbXBvcnQgU3R5bGUgZnJvbSAnLi4vLi4vdGhlbWVpbmcvc3R5bGUuZXM2JztcbmltcG9ydCBVdGlscyBmcm9tICcuLi8uLi91dGlscy5lczYnO1xuaW1wb3J0IFRvbmVQbGF5YmFjayBmcm9tICcuLi8uLi90b25lcGxheWJhY2suZXM2JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUtleWJvYXJkIGV4dGVuZHMgQmFzZUdyb3VwIHtcbiAgICBvbkluaXRpYWxpemUocGFyYW1zKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBob3cgbXVjaCByb3RhdGlvbiBvY2N1cnMgb24ga2V5cHJlc3NcbiAgICAgICAgICogQHR5cGUge251bWJlcn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3JvdGF0aW9uT25QcmVzcyA9IE1hdGguUEkvMTY7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIG51bWJlciBvZiBvY3RhdmVzXG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9udW1PY3RhdmVzID0gcGFyYW1zLm9jdGF2ZXMgPyBwYXJhbXMub2N0YXZlcyA6IDI7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIHN0YXJ0aW5nIG9jdGF2ZSAodG8gYmV0dGVyIG1hdGNoIHdpdGggTUlESSBpbnB1dClcbiAgICAgICAgICogQHR5cGUge251bWJlcn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3N0YXJ0aW5nT2N0YXZlID0gcGFyYW1zLnN0YXJ0b2N0YXZlID8gcGFyYW1zLnN0YXJ0b2N0YXZlIDogMDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogc3RhcnRpbmcgbm90ZSBvbiBrZXlib2FyZFxuICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fc3RhcnRpbmdOb3RlID0gJ0MnO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBrZXkgdmlzdWFsc1xuICAgICAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9rZXlzID0gW107XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIG1pZGkgY2hhbm5lbHMgdXNlZFxuICAgICAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9taWRpY2hhbm5lbHMgPSBbXTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogc3RhcnRpbmcgaW5kZXggYXQgd2hpY2ggcG9pbnQgdG8gYWxsb2NhdGUgTUlESSBjaGFubmVsc1xuICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fbWlkaUNoYW5uZWxTdGFydEluZGV4ID0gMTE7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGtleWJvYXJkL2tleSBpbnB1dFxuICAgICAgICAgKiBAdHlwZSB7JEVTNl9BTk9OWU1PVVNfQ0xBU1MkfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgLy90aGlzLl9pbnB1dCA9IG5ldyBJbnB1dChwYXJhbXMuaW5wdXQsIChrZXlzKSA9PiB0aGlzLm9uS2V5SW5wdXRDaGFuZ2Uoa2V5cykgKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogc3VnZ2VzdGVkIGtleXMgZnJvbSBrZXkgc2lnbmF0dXJlIHByZWRpY3Rpb25cbiAgICAgICAgICogQHR5cGUge0FycmF5fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5zdWdnZXN0ZWRLZXlzID0gW107XG4gICAgfVxuICAgIC8qKlxuICAgICAqIG9uIGNyZWF0ZSBzY2VuZSAob3IgZWFybGllc3QgcG9zc2libGUgb3Bwb3J0dW5pdHkpXG4gICAgICogQHBhcmFtIHNjZW5lXG4gICAgICogQHBhcmFtIGN1c3RvbVxuICAgICAqL1xuICAgIG9uQ3JlYXRlKHNjZW5lLCBjdXN0b20pIHtcbiAgICAgICAgLy9Ub25lUGxheWJhY2suYWRkRXZlbnRMaXN0ZW5lcignbWlkaWRhdGEnLCBkYXRhID0+IHRoaXMub25Tb25nRGF0YShkYXRhKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb24gcmVuZGVyIHNjZW5lXG4gICAgICogQHBhcmFtIHNjZW5lXG4gICAgICogQHBhcmFtIGN1c3RvbVxuICAgICAqL1xuICAgIG9uUmVuZGVyKHNjZW5lLCBjdXN0b20pIHtcbiAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCB0aGlzLl9rZXlzLmxlbmd0aDsgYysrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fa2V5c1tjXS5jb2xvcnR3ZWVuLmFuaW1hdGluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2tleXNbY10ub2JqZWN0Lm1hdGVyaWFsLmNvbG9yLnNldFJHQihcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fa2V5c1tjXS5jb2xvcnR3ZWVuLnJjb2xvci8xMDAsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2tleXNbY10uY29sb3J0d2Vlbi5nY29sb3IvMTAwLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9rZXlzW2NdLmNvbG9ydHdlZW4uYmNvbG9yLzEwMCApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb24gYXNzZXRzIGxvYWRlZFxuICAgICAqIEBwYXJhbSBnZW9tZXRyeVxuICAgICAqL1xuICAgIG9uQXNzZXRzTG9hZGVkKGdlb21ldHJ5KSB7XG4gICAgICAgIHZhciBtYXQgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoIHtcbiAgICAgICAgICAgIG1ldGFsbmVzczogMC43LFxuICAgICAgICAgICAgcm91Z2huZXNzOiAxLFxuICAgICAgICAgICAgc2lkZTogVEhSRUUuRnJvbnRTaWRlLFxuICAgICAgICAgICAgc2hhZGluZzogVEhSRUUuRmxhdFNoYWRpbmdcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc2V0dXBTY2VuZShnZW9tZXRyeSwgbWF0KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogZHluYW1pY2FsbHkgZ2VuZXJhdGUgY2lyY2xlIG9mIGtleXNcbiAgICAgKiBAcGFyYW0gZ2VvbWV0cnlcbiAgICAgKiBAcGFyYW0gbWF0ZXJpYWxcbiAgICAgKi9cbiAgICBzZXR1cFNjZW5lKGdlb21ldHJ5LCBtYXRlcmlhbCkge1xuICAgICAgICB2YXIgc3RhcnRPZmZzZXQgPSBOb3RlLmluZGV4T2ZOb3RhdGlvbih0aGlzLl9zdGFydGluZ05vdGUpO1xuICAgICAgICB2YXIgbnRpbmRleCA9IDA7XG4gICAgICAgIHZhciB0cmFuc2Zvcm1Qb3NpdGlvbiA9IDA7XG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgdGhpcy5fbnVtT2N0YXZlczsgYysrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBkID0gMDsgZCA8IE5vdGUuc2hhcnBOb3RhdGlvbnMubGVuZ3RoOyBkKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgbm90ZSA9IE5vdGUubm90YXRpb25BdEluZGV4KGQgKyBzdGFydE9mZnNldCk7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtUG9zaXRpb24gPSB0aGlzLmFkZEtleSh0cmFuc2Zvcm1Qb3NpdGlvbiwgbm90ZS5pbmRleE9mKCcjJykgPT09IC0xLCBub3RlLCBjLCBnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgICAgICAgICAgIG50aW5kZXggKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJhbnNmb3JtUG9zaXRpb247XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb24gaW5hY3Rpdml0eSAoZmFkZSBhd2F5IGtleXMgYW5kIGNsZWFyIGtleSBzaWcpXG4gICAgICovXG4gICAgcmVzZXRLZXlzKCkge1xuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IHRoaXMuX2tleXMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9rZXlzW2NdLnN1Z2dlc3RlZCkge1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50Q29sb3IgPSB0aGlzLl9rZXlzW2NdLm9iamVjdC5tYXRlcmlhbC5jb2xvci5nZXRIZXgoKTtcbiAgICAgICAgICAgICAgICBVdGlscy5jb3B5UHJvcHNUbyh0aGlzLl9rZXlzW2NdLmNvbG9ydHdlZW4sIFV0aWxzLmRlY1RvUkdCKGN1cnJlbnRDb2xvciwgMTAwKSwgJ2NvbG9yJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fa2V5c1tjXS5jb2xvcnR3ZWVuLmFuaW1hdGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IFV0aWxzLmNvcHlQcm9wc1RvKHt9LCBVdGlscy5kZWNUb1JHQihTdHlsZS5rZXlzLm5vcm1hbFt0aGlzLl9rZXlzW2NdLnR5cGVdLmNvbG9yLCAxMDApLCAnY29sb3InKTtcbiAgICAgICAgICAgICAgICBjcmVhdGVqcy5Ud2Vlbi5nZXQodGhpcy5fa2V5c1tjXS5jb2xvcnR3ZWVuKVxuICAgICAgICAgICAgICAgICAgICAudG8odGFyZ2V0LCAyMDAwKVxuICAgICAgICAgICAgICAgICAgICAud2FpdCgxMDApIC8vIHdhaXQgYSBmZXcgdGlja3MsIG9yIHRoZSByZW5kZXIgY3ljbGUgd29uJ3QgcGljayB1cCB0aGUgY2hhbmdlcyB3aXRoIHRoZSBmbGFnXG4gICAgICAgICAgICAgICAgICAgIC5jYWxsKCBmdW5jdGlvbigpIHsgdGhpcy5hbmltYXRpbmcgPSBmYWxzZTsgfSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY2hhbmdlIGtleSBzaWduYXR1cmUgdG8gbm90YXRpb24gZ2l2ZW5cbiAgICAgKiBAcGFyYW0gbm90YXRpb25cbiAgICAgKi9cbiAgICBjaGFuZ2VLZXlTaWduYXR1cmUobm90YXRpb24pIHtcbiAgICAgICAgdmFyIGM7XG4gICAgICAgIGZvciAoYyA9IDA7IGMgPCB0aGlzLnN1Z2dlc3RlZEtleXMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlS2V5U3VnZ2VzdGlvbih0aGlzLnN1Z2dlc3RlZEtleXNbY10sIG5vdGF0aW9uLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdWdnZXN0ZWRLZXlzID0gTm90ZS5rZXlzW25vdGF0aW9uXTtcblxuICAgICAgICBmb3IgKGMgPSAwOyBjIDwgdGhpcy5zdWdnZXN0ZWRLZXlzLmxlbmd0aDsgYysrKSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZUtleVN1Z2dlc3Rpb24odGhpcy5zdWdnZXN0ZWRLZXlzW2NdLCBub3RhdGlvbiwgdHJ1ZSwgYyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0b2dnbGUga2V5IHByZXNzZWRcbiAgICAgKiBAcGFyYW0ga2V5XG4gICAgICovXG4gICAgdG9nZ2xlS2V5UHJlc3NlZChrKSB7XG4gICAgICAgIHZhciBrZXkgPSB0aGlzLmZpbmRLZXlPYmplY3RGb3JOb3RhdGlvbihrLm5vdGF0aW9uLCBrLm9jdGF2ZSk7XG4gICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgIGlmIChrLnZlbG9jaXR5ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgVG9uZVBsYXliYWNrLm5vdGVPZmYoa2V5Lm5vdGF0aW9uLCBrZXkubWlkaWNoYW5uZWwsIDEvOCk7XG4gICAgICAgICAgICAgICAgdmFyIGNoYW5uZWxpbmRleCA9IHRoaXMuX21pZGljaGFubmVscy5pbmRleE9mKGtleS5taWRpY2hhbm5lbCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWlkaWNoYW5uZWxzLnNwbGljZShjaGFubmVsaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9pbmFjdGl2aXR5VGltZXIpO1xuICAgICAgICAgICAgICAgIGtleS5vYmplY3Qucm90YXRpb24uc2V0KGtleS5vcmlnaW5hbFJvdGF0aW9uLngsIGtleS5vcmlnaW5hbFJvdGF0aW9uLnksIGtleS5vcmlnaW5hbFJvdGF0aW9uLnopO1xuICAgICAgICAgICAgICAgIGtleS5jdXJyZW50Um90YXRpb24gPSAwO1xuICAgICAgICAgICAgICAgIGtleS5taWRpY2hhbm5lbCA9IC0xO1xuICAgICAgICAgICAgICAgIGtleS5kb3duID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX21pZGljaGFubmVscyA9IHRoaXMuX21pZGljaGFubmVscy5zb3J0KCk7XG4gICAgICAgICAgICAgICAgdmFyIG1pZGljaGFubmVsID0gdGhpcy5fbWlkaWNoYW5uZWxzW3RoaXMuX21pZGljaGFubmVscy5sZW5ndGgtMV0gKyAxO1xuICAgICAgICAgICAgICAgIGlmICghbWlkaWNoYW5uZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgbWlkaWNoYW5uZWwgPSB0aGlzLl9taWRpQ2hhbm5lbFN0YXJ0SW5kZXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFRvbmVQbGF5YmFjay5ub3RlT24oVG9uZVBsYXliYWNrLlBJQU5PLCBrZXkubm90YXRpb24sIG1pZGljaGFubmVsKTtcbiAgICAgICAgICAgICAgICBrZXkuY3VycmVudFJvdGF0aW9uID0gay52ZWxvY2l0eSAqIHRoaXMuX3JvdGF0aW9uT25QcmVzcztcbiAgICAgICAgICAgICAgICBrZXkub2JqZWN0LnJvdGF0ZVgoa2V5LmN1cnJlbnRSb3RhdGlvbik7XG4gICAgICAgICAgICAgICAga2V5Lm1pZGljaGFubmVsID0gbWlkaWNoYW5uZWw7XG4gICAgICAgICAgICAgICAga2V5LmRvd24gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdG9nZ2xlIGtleSBzdWdnZXN0aW9uXG4gICAgICogQHBhcmFtIG5vdGF0aW9uXG4gICAgICogQHBhcmFtIGtleXNpZ25vdGF0aW9uXG4gICAgICogQHBhcmFtIHRvZ2dsZVxuICAgICAqL1xuICAgIHRvZ2dsZUtleVN1Z2dlc3Rpb24obm90YXRpb24sIGtleXNpZ25vdGF0aW9uLCB0b2dnbGUpIHtcbiAgICAgICAgdmFyIG50SW5kZXggPSBOb3RlLmluZGV4T2ZOb3RhdGlvbihrZXlzaWdub3RhdGlvbik7XG4gICAgICAgIHZhciByb290Y2xyID0gU3R5bGUuY29sb3J3aGVlbFtudEluZGV4XTtcblxuICAgICAgICB2YXIga2V5cyA9IHRoaXMuZmluZEtleU9iamVjdHNGb3JOb3RhdGlvbihub3RhdGlvbik7XG5cbiAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCBrZXlzLmxlbmd0aDsgYysrKSB7XG4gICAgICAgICAgICBpZiAodG9nZ2xlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNscjtcbiAgICAgICAgICAgICAgICBpZiAoIG50SW5kZXg9PT0wIHx8IG50SW5kZXg9PT0yIHx8IG50SW5kZXg9PT00IHx8IG50SW5kZXg9PT02KSB7XG4gICAgICAgICAgICAgICAgICAgIGNsciA9IFN0eWxlLmtleXMuc3Ryb25nbHlTdWdnZXN0ZWRba2V5c1tjXS50eXBlXTtcbiAgICAgICAgICAgICAgICAgICAga2V5c1tjXS5zdWdnZXN0ZWQgPSAnc3Ryb25nbHlTdWdnZXN0ZWQnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNsciA9IFN0eWxlLmtleXMuc3VnZ2VzdGVkW2tleXNbY10udHlwZV07XG4gICAgICAgICAgICAgICAgICAgIGtleXNbY10uc3VnZ2VzdGVkID0gJ3N1Z2dlc3RlZCc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAga2V5c1tjXS5vYmplY3QubWF0ZXJpYWwuY29sb3Iuc2V0SGV4KHJvb3RjbHIpIDsvL2Nsci5jb2xvcik7XG4gICAgICAgICAgICAgIC8vICBrZXlzW2NdLm9iamVjdC5tYXRlcmlhbC5lbWlzc2l2ZS5zZXRIZXgocm9vdGNscikgOyAvL2Nsci5lbWlzc2l2ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGtleXNbY10ub2JqZWN0Lm1hdGVyaWFsLmNvbG9yLnNldEhleChTdHlsZS5rZXlzLm5vcm1hbFtrZXlzW2NdLnR5cGVdLmNvbG9yKTtcbiAgICAgICAgICAgICAgIC8vIGtleXNbY10ub2JqZWN0Lm1hdGVyaWFsLmVtaXNzaXZlLnNldEhleChTdHlsZS5rZXlzLm5vcm1hbFtrZXlzW2NdLnR5cGVdLmVtaXNzaXZlKTtcbiAgICAgICAgICAgICAgICBrZXlzW2NdLnN1Z2dlc3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY3JlYXRlIHdoaXRlIGtleSBnZW9tZXRyeVxuICAgICAqIEByZXR1cm5zIHtUSFJFRS5NZXNofVxuICAgICAqL1xuICAgIGNyZWF0ZVdoaXRlS2V5KGdlb21ldHJ5LCBtYXRlcmlhbCkge1xuICAgICAgICB2YXIga2V5Z2VvbSA9IGdlb21ldHJ5LmNsb25lKCk7XG4gICAgICAgIHZhciBtYXQgPSBtYXRlcmlhbC5jbG9uZSgpO1xuICAgICAgICBtYXQuY29sb3Iuc2V0SGV4KFN0eWxlLmtleXMubm9ybWFsLndoaXRlLmNvbG9yKTtcbiAgICAgICAgbWF0LmVtaXNzaXZlLnNldEhleChTdHlsZS5rZXlzLm5vcm1hbC53aGl0ZS5lbWlzc2l2ZSk7XG4gICAgICAgIGtleWdlb20udHJhbnNsYXRlKCAwLCAtMTAsIDAgKTtcbiAgICAgICAgdmFyIGtleSA9IG5ldyBUSFJFRS5NZXNoKCBrZXlnZW9tLCBtYXQpO1xuICAgICAgICByZXR1cm4ga2V5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNyZWF0ZSBibGFjayBrZXkgZ2VvbWV0cnlcbiAgICAgKiBAcmV0dXJucyB7VEhSRUUuTWVzaH1cbiAgICAgKi9cbiAgICBjcmVhdGVCbGFja0tleShnZW9tZXRyeSwgbWF0ZXJpYWwpIHtcbiAgICAgICAgdmFyIGtleWdlb20gPSBnZW9tZXRyeS5jbG9uZSgpO1xuICAgICAgICB2YXIgbWF0ID0gbWF0ZXJpYWwuY2xvbmUoKTtcbiAgICAgICAgbWF0LmNvbG9yLnNldEhleChTdHlsZS5rZXlzLm5vcm1hbC5ibGFjay5jb2xvcik7XG4gICAgICAgIG1hdC5lbWlzc2l2ZS5zZXRIZXgoU3R5bGUua2V5cy5ub3JtYWwuYmxhY2suZW1pc3NpdmUpO1xuICAgICAgICBrZXlnZW9tLnRyYW5zbGF0ZSggMCwgLTI1LCAwICk7XG4gICAgICAgIGtleWdlb20uc2NhbGUoMSwgLjUsIDEpO1xuICAgICAgICB2YXIga2V5ID0gbmV3IFRIUkVFLk1lc2goIGtleWdlb20sIG1hdCk7XG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY3JlYXRlIGFuZCBhZGQgYSBrZXlcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdHJhbnNmb3JtUG9zaXRpb25cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IHdoaXRlXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5vdGF0aW9uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9jdGF2ZVxuICAgICAqIEBwYXJhbSB7VEhSRUUuR2VvbWV0cnl9IGdlb21ldHJ5XG4gICAgICogQHBhcmFtIHtUSFJFRS5NYXRlcmlhbH0gbWF0ZXJpYWxcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IHRyYW5zZm9ybSBwb3NpdGlvblxuICAgICAqL1xuICAgIGFkZEtleSh0cmFuc2Zvcm1Qb3NpdGlvbiwgd2hpdGUsIG5vdGF0aW9uLCBvY3RhdmUsIGdlb21ldHJ5LCBtYXRlcmlhbCkge1xuICAgICAgICB2YXIga2V5LCBjb2xvciwgcm90YXRpb247XG4gICAgICAgIGlmICh3aGl0ZSkge1xuICAgICAgICAgICAgY29sb3IgPSAnd2hpdGUnO1xuICAgICAgICAgICAga2V5ID0gdGhpcy5jcmVhdGVXaGl0ZUtleShnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29sb3IgPSAnYmxhY2snO1xuICAgICAgICAgICAga2V5ID0gdGhpcy5jcmVhdGVCbGFja0tleShnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgICB9XG4gICAgICAgIHRyYW5zZm9ybVBvc2l0aW9uID0gdGhpcy5hcHBseUtleVRyYW5zZm9ybShrZXksIHRyYW5zZm9ybVBvc2l0aW9uLCB3aGl0ZSk7XG4gICAgICAgIHRoaXMuX2tleXMucHVzaCh7XG4gICAgICAgICAgICB0eXBlOiBjb2xvcixcbiAgICAgICAgICAgIG9iamVjdDoga2V5LFxuICAgICAgICAgICAgb2N0YXZlOiBvY3RhdmUgKyB0aGlzLl9zdGFydGluZ09jdGF2ZSxcbiAgICAgICAgICAgIGNvbG9ydHdlZW46IHt9LFxuICAgICAgICAgICAgbm90YXRpb246IG5vdGF0aW9uLFxuICAgICAgICAgICAgb3JpZ2luYWxSb3RhdGlvbjoge1xuICAgICAgICAgICAgICAgIHg6IGtleS5yb3RhdGlvbi54LFxuICAgICAgICAgICAgICAgIHk6IGtleS5yb3RhdGlvbi55LFxuICAgICAgICAgICAgICAgIHo6IGtleS5yb3RhdGlvbi56IH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuYWRkKGtleSwna2V5XycgKyBub3RhdGlvbik7XG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm1Qb3NpdGlvbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhcHBseSBrZXkgdHJhbnNmb3JtXG4gICAgICogQHBhcmFtIHtUSFJFRS5NZXNofSBrZXltZXNoXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHRyYW5zZm9ybVBvc2l0aW9uXG4gICAgICogQHBhcmFtIHtCb29sZWFufSB3aGl0ZWtleVxuICAgICAqL1xuICAgIGFwcGx5S2V5VHJhbnNmb3JtKGtleW1lc2gsIHRyYW5zZm9ybVBvc2l0aW9uLCB3aGl0ZWtleSkge31cblxuICAgIC8qKlxuICAgICAqIGZpbmQgdGhlIGtleSBmb3IgYSBzcGVjaWZpYyBub3RhdGlvblxuICAgICAqIEBwYXJhbSBub3RhdGlvblxuICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgKi9cbiAgICBmaW5kS2V5T2JqZWN0c0Zvck5vdGF0aW9uKG5vdGF0aW9uKSB7XG4gICAgICAgIHZhciBrZXlzID0gW107XG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgdGhpcy5fa2V5cy5sZW5ndGg7IGMrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2tleXNbY10ubm90YXRpb24gPT09IG5vdGF0aW9uKSB7XG4gICAgICAgICAgICAgICAga2V5cy5wdXNoKHRoaXMuX2tleXNbY10pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBrZXlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGZpbmQgc3BlY2lmaWMga2V5IG9iamVjdCBmb3Igbm90YXRpb24gYW5kIG9jdGF2ZVxuICAgICAqIEBwYXJhbSBub3RhdGlvblxuICAgICAqIEBwYXJhbSBvY3RhdmVcbiAgICAgKi9cbiAgICBmaW5kS2V5T2JqZWN0Rm9yTm90YXRpb24obm90YXRpb24sIG9jdGF2ZSkge1xuICAgICAgICB2YXIgbm90YXRpb25PZmZzZXQgPSBOb3RlLmluZGV4T2ZOb3RhdGlvbih0aGlzLl9zdGFydGluZ05vdGUpO1xuICAgICAgICB2YXIgaW5keCA9IG9jdGF2ZSAqIE5vdGUuc2hhcnBOb3RhdGlvbnMubGVuZ3RoICsgTm90ZS5zaGFycE5vdGF0aW9ucy5pbmRleE9mKG5vdGF0aW9uKSAtIG5vdGF0aW9uT2Zmc2V0O1xuICAgICAgICByZXR1cm4gdGhpcy5fa2V5c1tpbmR4XTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvbiBzb25nIGRhdGFcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqL1xuICAgIG9uU29uZ0RhdGEoZGF0YSkge1xuICAgICAgICB2YXIgbm90YXRpb24gPSBOb3RlLk1JREl0b05vdGF0aW9uKGRhdGEubm90ZSk7XG4gICAgICAgIHZhciBrZXkgPSB0aGlzLmZpbmRLZXlPYmplY3RzRm9yTm90YXRpb24obm90YXRpb24pO1xuICAgICAgICB0aGlzLnRvZ2dsZUtleVByZXNzZWQoa2V5WzBdLCBkYXRhLnZlbG9jaXR5IC8gMTI3KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgQmFzZUtleWJvYXJkIGZyb20gJy4vYmFzZWtleWJvYXJkLmVzNic7XG5pbXBvcnQgSW5wdXQgZnJvbSAnLi4vLi4vaW5wdXQuZXM2JztcbmltcG9ydCBOb3RlIGZyb20gJy4uLy4uL211c2ljdGhlb3J5L25vdGUuZXM2JztcbmltcG9ydCBTdHlsZSBmcm9tICcuLi8uLi90aGVtZWluZy9zdHlsZS5lczYnO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4uLy4uL3V0aWxzLmVzNic7XG5pbXBvcnQgVG9uZVBsYXliYWNrIGZyb20gJy4uLy4uL3RvbmVwbGF5YmFjay5lczYnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaXJjdWxhcktleWJvYXJkIGV4dGVuZHMgQmFzZUtleWJvYXJkIHtcbiAgICAvKipcbiAgICAgKiBhcHBseSBrZXkgdHJhbnNmb3JtXG4gICAgICogQHBhcmFtIHtUSFJFRS5NZXNofSBrZXltZXNoXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc2l0aW9uIGluIGtleWJvYXJkXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGtleWluZGV4XG4gICAgICogQHBhcmFtIHtCb29sZWFufSB3aGl0ZWtleVxuICAgICAqL1xuICAgIGFwcGx5S2V5VHJhbnNmb3JtKGtleW1lc2gsIHRyYW5zZm9ybVBvc2l0aW9uLCB3aGl0ZWtleSkge1xuICAgICAgICB2YXIgcm90YXRlID0gMDtcbiAgICAgICAgdmFyIGV4dHJhUm90YXRlID0gMDtcbiAgICAgICAgaWYgKHdoaXRla2V5KSB7XG4gICAgICAgICAgICByb3RhdGUgPSAoTWF0aC5QSSAqIDIpIC8gMTQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBleHRyYVJvdGF0ZSA9IChNYXRoLlBJICogMikgLyAyODtcbiAgICAgICAgfVxuICAgICAgICBrZXltZXNoLnJvdGF0aW9uLnogPSB0cmFuc2Zvcm1Qb3NpdGlvbiArIHJvdGF0ZSArIGV4dHJhUm90YXRlO1xuXG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm1Qb3NpdGlvbiArIHJvdGF0ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzZXR1cCBzY2VuZVxuICAgICAqIEBwYXJhbSBnZW9tZXRyeVxuICAgICAqIEBwYXJhbSBtYXRlcmlhbFxuICAgICAqL1xuICAgIHNldHVwU2NlbmUoZ2VvbWV0cnksIG1hdGVyaWFsKSB7XG4gICAgICAgIHN1cGVyLnNldHVwU2NlbmUoZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgICAgdGhpcy5ncm91cC5wb3NpdGlvbi56ID0gLTQwMDtcbiAgICAgICAgdGhpcy5ncm91cC5zY2FsZS5zZXQoMTAsIDEwLCAxMCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IEJhc2VLZXlib2FyZCBmcm9tICcuL2Jhc2VrZXlib2FyZC5lczYnO1xuaW1wb3J0IElucHV0IGZyb20gJy4uLy4uL2lucHV0LmVzNic7XG5pbXBvcnQgTm90ZSBmcm9tICcuLi8uLi9tdXNpY3RoZW9yeS9ub3RlLmVzNic7XG5pbXBvcnQgU3R5bGUgZnJvbSAnLi4vLi4vdGhlbWVpbmcvc3R5bGUuZXM2JztcbmltcG9ydCBVdGlscyBmcm9tICcuLi8uLi91dGlscy5lczYnO1xuaW1wb3J0IFRvbmVQbGF5YmFjayBmcm9tICcuLi8uLi90b25lcGxheWJhY2suZXM2JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhZGl0aW9uYWxLZXlib2FyZCBleHRlbmRzIEJhc2VLZXlib2FyZCB7XG4gICAgb25Jbml0aWFsaXplKHBhcmFtcykge1xuICAgICAgICBzdXBlci5vbkluaXRpYWxpemUocGFyYW1zKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogaG93IG11Y2ggcm90YXRpb24gb2NjdXJzIG9uIGtleXByZXNzXG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9yb3RhdGlvbk9uUHJlc3MgPSBNYXRoLlBJLzY0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFwcGx5IGtleSB0cmFuc2Zvcm1cbiAgICAgKiBAcGFyYW0ge1RIUkVFLk1lc2h9IGtleW1lc2hcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcG9zaXRpb24gaW4ga2V5Ym9hcmRcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IHdoaXRla2V5XG4gICAgICogQHJldHVybiB7TnVtYmVyfSBjdXJyZW50IHBvc2l0aW9uXG4gICAgICovXG4gICAgYXBwbHlLZXlUcmFuc2Zvcm0oa2V5bWVzaCwgdHJhbnNmb3JtUG9zaXRpb24sIHdoaXRla2V5KSB7XG4gICAgICAgIHZhciB0cmFuc2xhdGUgPSAyO1xuICAgICAgICBpZiAoIXdoaXRla2V5KSB7XG4gICAgICAgICAgICBrZXltZXNoLnBvc2l0aW9uLnkgPSA1O1xuICAgICAgICAgICAga2V5bWVzaC5wb3NpdGlvbi56ID0gMTtcbiAgICAgICAgICAgIGtleW1lc2gucG9zaXRpb24ueCA9IHRyYW5zZm9ybVBvc2l0aW9uICsxO1xuICAgICAgICAgICAgdHJhbnNsYXRlID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGtleW1lc2gucG9zaXRpb24ueCA9IHRyYW5zZm9ybVBvc2l0aW9uICsyO1xuICAgICAgICB9XG4gICAgICAgIGtleW1lc2gucm90YXRpb24ueCA9IDA7XG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm1Qb3NpdGlvbiArIHRyYW5zbGF0ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzZXR1cCBzY2VuZVxuICAgICAqIEBwYXJhbSBnZW9tZXRyeVxuICAgICAqIEBwYXJhbSBtYXRlcmlhbFxuICAgICAqL1xuICAgIHNldHVwU2NlbmUoZ2VvbWV0cnksIG1hdGVyaWFsKSB7XG4gICAgICAgIHZhciBsYXN0VHJhbnNmb3JtUG9zaXRpb24gPSBzdXBlci5zZXR1cFNjZW5lKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgICAgIHRoaXMuZ3JvdXAucG9zaXRpb24ueCA9IC1sYXN0VHJhbnNmb3JtUG9zaXRpb24vMiAqIDEwO1xuICAgICAgICB0aGlzLmdyb3VwLnBvc2l0aW9uLnogPSAtMjAwO1xuICAgICAgICB0aGlzLmdyb3VwLnBvc2l0aW9uLnkgPSAtMjAwO1xuICAgICAgICB0aGlzLmdyb3VwLnJvdGF0aW9uLnggPSAtTWF0aC5QSS8yO1xuICAgICAgICB0aGlzLmdyb3VwLnNjYWxlLnNldCgxMCwgMTAsIDEwKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgQmFzZUdyb3VwIGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy90cml2ci9zcmMvYmFzZWdyb3VwLmVzNic7XG5pbXBvcnQgU3R5bGUgZnJvbSAnLi4vdGhlbWVpbmcvc3R5bGUuZXM2JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGlnaHRpbmcgZXh0ZW5kcyBCYXNlR3JvdXAge1xuICAgIC8qKlxuICAgICAqIG9uIGNyZWF0ZSBzY2VuZSAob3IgZWFybGllc3QgcG9zc2libGUgb3Bwb3J0dW5pdHkpXG4gICAgICogQHBhcmFtIHNjZW5lXG4gICAgICogQHBhcmFtIGN1c3RvbVxuICAgICAqL1xuICAgIG9uQ3JlYXRlKHNjZW5lLCBjdXN0b20pIHtcbiAgICAgICAgdmFyIGxpZ2h0ID0gbmV3IFRIUkVFLkhlbWlzcGhlcmVMaWdodCggU3R5bGUubGlnaHRpbmcuaGVtaXNwaGVyZS50b3AsIFN0eWxlLmxpZ2h0aW5nLmhlbWlzcGhlcmUuYm90dG9tLCA0ICk7XG4gICAgICAgIHZhciBzcG90TGlnaHQgPSBuZXcgVEhSRUUuU3BvdExpZ2h0KCBTdHlsZS5saWdodGluZy5zcG90bGlnaHQgKTtcbiAgICAgICAgc3BvdExpZ2h0LnBvc2l0aW9uLnNldCggMCwgMCwgNDAwICk7XG4gICAgICAgIHNwb3RMaWdodC5yb3RhdGlvbi54ID0gTWF0aC5QSSAvIDI7XG5cbiAgICAgICAgc3BvdExpZ2h0LnNoYWRvdy5tYXBTaXplLndpZHRoID0gMTAyNDtcbiAgICAgICAgc3BvdExpZ2h0LnNoYWRvdy5tYXBTaXplLmhlaWdodCA9IDEwMjQ7XG5cbiAgICAgICAgc3BvdExpZ2h0LnNoYWRvdy5jYW1lcmEubmVhciA9IDEwMDtcbiAgICAgICAgc3BvdExpZ2h0LnNoYWRvdy5jYW1lcmEuZmFyID0gNDAwO1xuICAgICAgICBzcG90TGlnaHQuc2hhZG93LmNhbWVyYS5mb3YgPSAzMDtcblxuICAgICAgICB0aGlzLmFkZChzcG90TGlnaHQpO1xuICAgICAgICB0aGlzLmFkZChsaWdodCk7XG4gICAgfVxufSIsImltcG9ydCBTaGFkZXJzIGZyb20gJy4vLi4vc2hhZGVycy5lczYnO1xuaW1wb3J0IEJhc2VHcm91cCBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvdHJpdnIvc3JjL2Jhc2Vncm91cC5lczYnO1xuaW1wb3J0IFN0eWxlIGZyb20gJy4uL3RoZW1laW5nL3N0eWxlLmVzNic7XG5pbXBvcnQgVXRpbHMgZnJvbSAnLi4vdXRpbHMuZXM2JztcbmltcG9ydCBUb25lUGxheWJhY2sgZnJvbSAnLi4vdG9uZXBsYXliYWNrLmVzNic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1ldHJvbm9tZSBleHRlbmRzIEJhc2VHcm91cCB7XG4gICAgb25Jbml0aWFsaXplKCkge1xuICAgICAgICAvKipcbiAgICAgICAgICogbWV0cm9ub21lIGhhbW1lcnMgaW4gc2NlbmVcbiAgICAgICAgICogQHR5cGUge0FycmF5fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5faGFtbWVycyA9IFtdO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBzeW50aFxuICAgICAgICAgKiBAdHlwZSB7VG9uZX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIC8vdGhpcy5fc3ludGggPSBuZXcgVG9uZS5EcnVtU3ludGgoKS50b01hc3RlcigpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiB0d2VlbiB0YXJnZXRzXG4gICAgICAgICAqIEB0eXBlIHt7ZHJ1bToge2FuaW1hdGluZzogYm9vbGVhbiwgcHJvcHM6IHt9fX19XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl90d2VlblRhcmdldHMgPSB7XG4gICAgICAgICAgICBkcnVtOiB7IGFuaW1hdGluZzogZmFsc2UsIHByb3BzOiB7fSB9LFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25DcmVhdGUoc2NlbmVjb2xsZWN0aW9uLCBteWNvbGxlY3Rpb24pIHtcbiAgICAgICAgLy90aGlzLmFkZEhhbW1lcigncmlnaHQnLCBNYXRoLlBJLzY0LCBNYXRoLlBJICogMiwgJ0M0Jyk7XG4gICAgICAgIC8vdGhpcy5hZGRIYW1tZXIoJ2xlZnQnLCBNYXRoLlBJLzEyOCwgTWF0aC5QSS80LCAnQTQnKTtcbiAgICAgICAgdGhpcy5hZGRIYW1tZXIoJ3VwJywgTWF0aC5QSS8zMiwgTWF0aC5QSS8yLCAnRzQnKTtcbiAgICAgICAgdGhpcy5hZGRIYW1tZXIoJ2Rvd24nLCBNYXRoLlBJLzMyLCAwLCAnRjMnKTtcbiAgICAgICAgdGhpcy5hZGREcnVtKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb24gcmVuZGVyXG4gICAgICogQHBhcmFtIHNjZW5lY29sbGVjdGlvblxuICAgICAqIEBwYXJhbSBteWNvbGxlY3Rpb25cbiAgICAgKi9cbiAgICBvblJlbmRlcihzY2VuZWNvbGxlY3Rpb24sIG15Y29sbGVjdGlvbikge1xuICAgICAgICB0aGlzLmFuaW1hdGVIYW1tZXJzKCk7XG4gICAgICAgIHRoaXMuYW5pbWF0ZURydW0oKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZW5kZXIgY3ljbGUgZm9yIGRydW1cbiAgICAgKi9cbiAgICBhbmltYXRlRHJ1bSgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3R3ZWVuVGFyZ2V0cy5kcnVtLmFuaW1hdGluZykge1xuICAgICAgICAgICAgdGhpcy5kcnVtLnBvc2l0aW9uLnogPSB0aGlzLl90d2VlblRhcmdldHMuZHJ1bS5wcm9wcy56UG9zaXRpb247XG4gICAgICAgICAgICB0aGlzLmRydW0ubWF0ZXJpYWwuYnVtcFNjYWxlID0gdGhpcy5fdHdlZW5UYXJnZXRzLmRydW0ucHJvcHMuYnVtcHNjYWxlO1xuICAgICAgICAgICAgdGhpcy5kcnVtLm1hdGVyaWFsLmNvbG9yLnNldFJHQihcbiAgICAgICAgICAgICAgICB0aGlzLl90d2VlblRhcmdldHMuZHJ1bS5wcm9wcy5yLzEwMCxcbiAgICAgICAgICAgICAgICB0aGlzLl90d2VlblRhcmdldHMuZHJ1bS5wcm9wcy5nLzEwMCxcbiAgICAgICAgICAgICAgICB0aGlzLl90d2VlblRhcmdldHMuZHJ1bS5wcm9wcy5iLzEwMCApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmVuZGVyIGN5Y2xlIGZvciBoYW1tZXJzXG4gICAgICovXG4gICAgYW5pbWF0ZUhhbW1lcnMoKSB7XG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgdGhpcy5faGFtbWVycy5sZW5ndGg7IGMrKykge1xuICAgICAgICAgICAgdmFyIGhhbW1lciA9IHRoaXMuX2hhbW1lcnNbY107XG5cbiAgICAgICAgICAgIGlmIChoYW1tZXIuYW5pbWF0aW5nR2xvdykge1xuICAgICAgICAgICAgICAgIGhhbW1lci5nbG93Lm1hdGVyaWFsLmNvbG9yLnNldFJHQihcbiAgICAgICAgICAgICAgICAgICAgaGFtbWVyLmdsb3dDb2xvci5yLzEwMCxcbiAgICAgICAgICAgICAgICAgICAgaGFtbWVyLmdsb3dDb2xvci5nLzEwMCxcbiAgICAgICAgICAgICAgICAgICAgaGFtbWVyLmdsb3dDb2xvci5iLzEwMCApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbmV3cm90YXRpb24gPSBoYW1tZXIucGl2b3Qucm90YXRpb25baGFtbWVyLnJvdGF0aW9uYXhpc10gKyBoYW1tZXIuZGlyZWN0aW9uICogaGFtbWVyLnJhdGU7XG5cbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhuZXdyb3RhdGlvbikgPiBNYXRoLlBJIC0gTWF0aC5QSS8xNikge1xuICAgICAgICAgICAgICAgIGhhbW1lci5kaXJlY3Rpb24gKj0gLTE7XG4gICAgICAgICAgICAgICAgbmV3cm90YXRpb24gPSBNYXRoLmFicyhuZXdyb3RhdGlvbikvbmV3cm90YXRpb24gKiAoTWF0aC5QSSAtIE1hdGguUEkvMTYpO1xuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlckRydW0oaGFtbWVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGhhbW1lci5waXZvdC5yb3RhdGlvbltoYW1tZXIucm90YXRpb25heGlzXSA9IG5ld3JvdGF0aW9uO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc291bmQgdGhlIGRydW0sIHRoZSBoYW1tZXIgaGl0IGl0XG4gICAgICogQHBhcmFtIGhhbW1lclxuICAgICAqL1xuICAgIHRyaWdnZXJEcnVtKGhhbW1lcikge1xuICAgICAgICBUb25lUGxheWJhY2subm90ZU9uKFRvbmVQbGF5YmFjay5TWU5USERSVU0sIGhhbW1lci5ub3RlLCAxMCwgMS84KTtcbiAgICAgICAvLyB0aGlzLl9zeW50aC50cmlnZ2VyQXR0YWNrUmVsZWFzZShoYW1tZXIubm90ZSwgXCIxNm5cIik7XG4gICAgICAgIGhhbW1lci5hbmltYXRpbmdHbG93ID0gdHJ1ZTtcbiAgICAgICAgdmFyIHN0YXJ0Y29sb3IgPSBVdGlscy5kZWNUb1JHQihTdHlsZS5tZXRyb25vbWUuaGFtbWVyLmNvbG9yLCAxMDApO1xuICAgICAgICB2YXIgZW5kY29sb3IgPSBVdGlscy5kZWNUb1JHQihTdHlsZS5tZXRyb25vbWUuaGFtbWVyLmhpdGNvbG9yLCAxMDApO1xuICAgICAgICBoYW1tZXIuZ2xvd0NvbG9yLnIgPSBzdGFydGNvbG9yLnI7XG4gICAgICAgIGhhbW1lci5nbG93Q29sb3IuZyA9IHN0YXJ0Y29sb3IuZztcbiAgICAgICAgaGFtbWVyLmdsb3dDb2xvci5iID0gc3RhcnRjb2xvci5iO1xuICAgICAgICBjcmVhdGVqcy5Ud2Vlbi5nZXQoaGFtbWVyLmdsb3dDb2xvcilcbiAgICAgICAgICAgIC50byh7IHI6IGVuZGNvbG9yLnIsIGc6IGVuZGNvbG9yLmcsIGI6IGVuZGNvbG9yLmIgfSwgNTAwKVxuICAgICAgICAgICAgLnRvKHsgcjogc3RhcnRjb2xvci5yLCBnOiBzdGFydGNvbG9yLmcsIGI6IHN0YXJ0Y29sb3IuYiB9LCA1MDApXG4gICAgICAgICAgICAud2FpdCgxMDApIC8vIHdhaXQgYSBmZXcgdGlja3MsIG9yIHRoZSByZW5kZXIgY3ljbGUgd29uJ3QgcGljayB1cCB0aGUgY2hhbmdlcyB3aXRoIHRoZSBmbGFnXG4gICAgICAgICAgICAuY2FsbCggZnVuY3Rpb24gKHNjb3BlKSB7IHNjb3BlLmFuaW1hdGluZ0dsb3cgPSBmYWxzZTsgfSApO1xuXG4gICAgICAgIHZhciBzdGFydGNvbG9yID0gVXRpbHMuZGVjVG9SR0IoU3R5bGUubWV0cm9ub21lLmRydW0uY29sb3IsIDEwMCk7XG4gICAgICAgIHZhciBlbmRjb2xvciA9IFV0aWxzLmRlY1RvUkdCKFN0eWxlLm1ldHJvbm9tZS5kcnVtLmhpdGNvbG9yLCAxMDApO1xuICAgICAgICB0aGlzLl90d2VlblRhcmdldHMuZHJ1bS5wcm9wcy5yID0gc3RhcnRjb2xvci5yO1xuICAgICAgICB0aGlzLl90d2VlblRhcmdldHMuZHJ1bS5wcm9wcy5nID0gc3RhcnRjb2xvci5nO1xuICAgICAgICB0aGlzLl90d2VlblRhcmdldHMuZHJ1bS5wcm9wcy5iID0gc3RhcnRjb2xvci5iO1xuICAgICAgICB0aGlzLl90d2VlblRhcmdldHMuZHJ1bS5wcm9wcy56UG9zaXRpb24gPSAtNDAwO1xuICAgICAgICB0aGlzLl90d2VlblRhcmdldHMuZHJ1bS5wcm9wcy5idW1wc2NhbGUgPSAwO1xuICAgICAgICB0aGlzLl90d2VlblRhcmdldHMuZHJ1bS5hbmltYXRpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLl90d2VlblRhcmdldHMuZHJ1bS5jdXJyZW50VHdlZW4gPSBjcmVhdGVqcy5Ud2Vlbi5nZXQodGhpcy5fdHdlZW5UYXJnZXRzLmRydW0ucHJvcHMpXG4gICAgICAgICAgICAudG8oe1xuICAgICAgICAgICAgICAgIHI6IGVuZGNvbG9yLnIsIGc6IGVuZGNvbG9yLmcsIGI6IGVuZGNvbG9yLmIsXG4gICAgICAgICAgICAgICAgYnVtcHNjYWxlOiA1LFxuICAgICAgICAgICAgICAgIHpQb3NpdGlvbjogLTQwMCArIGhhbW1lci5kaXJlY3Rpb24gKiA1MCB9LCAxNTApXG4gICAgICAgICAgICAudG8oe1xuICAgICAgICAgICAgICAgIHI6IHN0YXJ0Y29sb3IuciwgZzogc3RhcnRjb2xvci5nLCBiOiBzdGFydGNvbG9yLmIsXG4gICAgICAgICAgICAgICAgYnVtcHNjYWxlOiAwLFxuICAgICAgICAgICAgICAgIHpQb3NpdGlvbjogLTQwMCB9LCAxNTApXG4gICAgICAgICAgICAud2FpdCgxMDApIC8vIHdhaXQgYSBmZXcgdGlja3MsIG9yIHRoZSByZW5kZXIgY3ljbGUgd29uJ3QgcGljayB1cCB0aGUgY2hhbmdlcyB3aXRoIHRoZSBmbGFnXG4gICAgICAgICAgICAuY2FsbCggKCkgPT4geyB0aGlzLl90d2VlblRhcmdldHMuZHJ1bS5hbmltYXRpbmcgPSBmYWxzZTsgfSApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFkZCBjZW50ZXIgZHJ1bVxuICAgICAqL1xuICAgIGFkZERydW0oKSB7XG4gICAgICAgIHZhciBkcnVtZ2VvbSA9IG5ldyBUSFJFRS5DaXJjbGVHZW9tZXRyeSggMzAsIDI0ICk7XG4gICAgICAgIGRydW1nZW9tLnNjYWxlKDEsMSwgMC43NSk7XG4gICAgICAgIHZhciBtYXBIZWlnaHQgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcigpLmxvYWQoU3R5bGUubWV0cm9ub21lLmRydW0uYnVtcG1hcCk7XG4gICAgICAgIG1hcEhlaWdodC5hbmlzb3Ryb3B5ID0gNDtcbiAgICAgICAgbWFwSGVpZ2h0LnJlcGVhdC5zZXQoMSwgMSk7XG4gICAgICAgIG1hcEhlaWdodC53cmFwUyA9IG1hcEhlaWdodC53cmFwVCA9IFRIUkVFLkNsYW1wVG9FZGdlV3JhcHBpbmc7XG4gICAgICAgIG1hcEhlaWdodC5mb3JtYXQgPSBUSFJFRS5SR0JGb3JtYXQ7XG5cbiAgICAgICAgdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKCB7XG4gICAgICAgICAgICBjb2xvcjogU3R5bGUubWV0cm9ub21lLmRydW0uY29sb3IsXG4gICAgICAgICAgICBlbWlzc2l2ZTogU3R5bGUubWV0cm9ub21lLmRydW0uZW1pc3NpdmUsXG4gICAgICAgICAgICBzcGVjdWxhcjogU3R5bGUubWV0cm9ub21lLmRydW0uc3BlY3VsYXIsXG4gICAgICAgICAgICBidW1wTWFwOiBtYXBIZWlnaHQsXG4gICAgICAgICAgICBidW1wU2NhbGU6IDAsXG4gICAgICAgIH0gKTtcblxuICAgICAgICB0aGlzLmRydW0gPSBuZXcgVEhSRUUuTWVzaCggZHJ1bWdlb20sIG1hdGVyaWFsICk7XG4gICAgICAgIHRoaXMuZHJ1bS5wb3NpdGlvbi56ID0gLTQwMDtcbiAgICAgICAgdGhpcy5hZGQodGhpcy5kcnVtLCAnZHJ1bScpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFkZCBtZXRyb25vbWUgaGFtbWVyXG4gICAgICogQHBhcmFtIG9yaWdpblxuICAgICAqIEBwYXJhbSByYXRlXG4gICAgICogQHBhcmFtIG9mZnNldFxuICAgICAqL1xuICAgIGFkZEhhbW1lcihvcmlnaW4sIHJhdGUsIG9mZnNldCwgdG9uZSkge1xuICAgICAgICB2YXIgaGFtbWVyZ2VvbSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSg1KTtcbiAgICAgICAgdmFyIGNlbnRlcnBpdm90ID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG5cbiAgICAgICAgdmFyIHRleHR1cmVDdWJlID0gbmV3IFRIUkVFLkN1YmVUZXh0dXJlTG9hZGVyKCkubG9hZChTdHlsZS5tZXRyb25vbWUuaGFtbWVyLnJlZnJhY3Rpb25jdWJlKTtcbiAgICAgICAgdGV4dHVyZUN1YmUubWFwcGluZyA9IFRIUkVFLkN1YmVSZWZyYWN0aW9uTWFwcGluZztcblxuICAgICAgICB2YXIgaW5uZXJtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgge1xuICAgICAgICAgICAgZW52TWFwOiB0ZXh0dXJlQ3ViZSB9ICk7XG5cbiAgICAgICAgdmFyIG91dGVybWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoIHtcbiAgICAgICAgICAgIGNvbG9yOiBTdHlsZS5tZXRyb25vbWUuaGFtbWVyLmNvbG9yLFxuICAgICAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICB3aXJlZnJhbWU6IHRydWUsXG4gICAgICAgICAgICBvcGFjaXR5OiAwLjUgfSApO1xuXG5cbiAgICAgICAgdmFyIGhhbW1lciA9IG5ldyBUSFJFRS5NZXNoKCBoYW1tZXJnZW9tLCBpbm5lcm1hdGVyaWFsICk7XG4gICAgICAgIGhhbW1lci5uYW1lID0gJ2JhbGwnO1xuICAgICAgICBjZW50ZXJwaXZvdC5hZGQoaGFtbWVyKTtcbiAgICAgICAgY2VudGVycGl2b3QucG9zaXRpb24ueiA9IC00MDA7XG5cbiAgICAgICAgdmFyIGdsb3cgPSBuZXcgVEhSRUUuTWVzaCggaGFtbWVyZ2VvbS5jbG9uZSgpLCBvdXRlcm1hdGVyaWFsICk7XG4gICAgICAgIGdsb3cubmFtZSA9ICdnbG93JztcbiAgICAgICAgZ2xvdy5zY2FsZS5tdWx0aXBseVNjYWxhcigxLjIpO1xuICAgICAgICBjZW50ZXJwaXZvdC5hZGQoZ2xvdyk7XG5cbiAgICAgICAgdmFyIHJvdGF0aW9uYXhpcztcbiAgICAgICAgc3dpdGNoIChvcmlnaW4pIHtcbiAgICAgICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICAgICAgICBnbG93LnBvc2l0aW9uLnggPSAtMTAwO1xuICAgICAgICAgICAgICAgIGNlbnRlcnBpdm90LnBvc2l0aW9uLnggPSAtMTAwO1xuICAgICAgICAgICAgICAgIGhhbW1lci5wb3NpdGlvbi54ID0gLTEwMDtcbiAgICAgICAgICAgICAgICByb3RhdGlvbmF4aXMgPSAneSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgICAgICAgIGdsb3cucG9zaXRpb24ueCA9IDEwMDtcbiAgICAgICAgICAgICAgICBjZW50ZXJwaXZvdC5wb3NpdGlvbi54ID0gMTAwO1xuICAgICAgICAgICAgICAgIGhhbW1lci5wb3NpdGlvbi54ID0gMTAwO1xuICAgICAgICAgICAgICAgIHJvdGF0aW9uYXhpcyA9ICd5JztcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnZG93bic6XG4gICAgICAgICAgICAgICAgZ2xvdy5wb3NpdGlvbi55ID0gMTAwO1xuICAgICAgICAgICAgICAgIGNlbnRlcnBpdm90LnBvc2l0aW9uLnkgPSAxMDA7XG4gICAgICAgICAgICAgICAgaGFtbWVyLnBvc2l0aW9uLnkgPSAxMDA7XG4gICAgICAgICAgICAgICAgcm90YXRpb25heGlzID0gJ3gnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICd1cCc6XG4gICAgICAgICAgICAgICAgZ2xvdy5wb3NpdGlvbi55ID0gLTEwMDtcbiAgICAgICAgICAgICAgICBjZW50ZXJwaXZvdC5wb3NpdGlvbi55ID0gLTEwMDtcbiAgICAgICAgICAgICAgICBoYW1tZXIucG9zaXRpb24ueSA9IC0xMDA7XG4gICAgICAgICAgICAgICAgcm90YXRpb25heGlzID0gJ3gnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY2VudGVycGl2b3Qucm90YXRpb25bcm90YXRpb25heGlzXSArPSBvZmZzZXQ7XG5cbiAgICAgICAgdGhpcy5faGFtbWVycy5wdXNoKCB7XG4gICAgICAgICAgICBhbmltYXRpbmdHbG93OiBmYWxzZSxcbiAgICAgICAgICAgIGdsb3c6IGdsb3csXG4gICAgICAgICAgICBnbG93Q29sb3I6IHt9LFxuICAgICAgICAgICAgaGFtbWVyOiBoYW1tZXIsXG4gICAgICAgICAgICBwaXZvdDogY2VudGVycGl2b3QsXG4gICAgICAgICAgICBkaXJlY3Rpb246IDEsXG4gICAgICAgICAgICByYXRlOiByYXRlLFxuICAgICAgICAgICAgcm90YXRpb25heGlzOiByb3RhdGlvbmF4aXMsXG4gICAgICAgICAgICBub3RlOiB0b25lIH1cbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmFkZChjZW50ZXJwaXZvdCwgJ2hhbW1lcicpO1xuICAgIH1cbn0iLCJpbXBvcnQgTm90ZSBmcm9tICcuL211c2ljdGhlb3J5L25vdGUuZXM2JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKHBhcmFtcywgY2IpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGV2ZW50IGNhbGxiYWNrXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9jYWxsYmFjayA9IGNiO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBKU09OIGNvbmZpZ1xuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fY29uZmlnID0gcGFyYW1zO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBrZXlzIGRvd25cbiAgICAgICAgICogQHR5cGUge0FycmF5fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fa2V5cyA9IFtdO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBwb3RlbnRpYWwga2V5cyBwcmVzc2VkIGluIG9yZGVyXG4gICAgICAgICAqIEB0eXBlIHtzdHJpbmdbXX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3BvdGVudGlhbEtleXMgPSBbXG4gICAgICAgICAgICAnYCcsICcxJywgJzInLCAnMycsICc0JywgJzUnLCAnNicsICc3JywgJzgnLCAnOScsICcwJywgJy0nLCAnKycsXG4gICAgICAgICAgICAncScsICd3JywgJ2UnLCAncicsICd0JywgJ3knLCAndScsICdpJywgJ28nLCAncCcsICdbJywgJ10nLCAnXFxcXCcsXG4gICAgICAgICAgICAnYScsICdzJywgJ2QnLCAnZicsICdnJywgJ2gnLCAnaicsICdrJywgJ2wnLCAnOycsICdcXCcnXG4gICAgICAgIF07XG5cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGV2ZW50ID0+IHRoaXMub25LZXlEb3duKGV2ZW50KSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZXZlbnQgPT4gdGhpcy5vbktleVVwKGV2ZW50KSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZ2V0IGtleXMgZG93blxuICAgICAqIEBwYXJhbSBtYXBwaW5nXG4gICAgICovXG4gICAgZ2V0S2V5c0Rvd24oKSB7XG4gICAgICAgIHZhciBkb3duID0gW107XG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgdGhpcy5fa2V5cy5sZW5ndGg7IGMrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2tleXNbY10gPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIG9jdGF2ZSA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKGMgPj0gdGhpcy5fa2V5cy5sZW5ndGgvMikgeyBvY3RhdmUgPSAxOyB9XG4gICAgICAgICAgICAgICAgZG93bi5wdXNoKCB7IG5vdGF0aW9uOiBOb3RlLm5vdGF0aW9uQXRJbmRleChjKSwgb2N0YXZlOiBvY3RhdmUgKyAyLCBpbmRleDogYywgdmVsb2NpdHk6IHRoaXMuX2tleXNbY119ICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRvd247XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb24ga2V5IGRvd25cbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKi9cbiAgICBvbktleURvd24oZXZlbnQpIHtcbiAgICAgICAgdmFyIGtleSA9IHRoaXMuX3BvdGVudGlhbEtleXMuaW5kZXhPZihldmVudC5rZXkudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgIGlmIChrZXkgIT09IC0xICYmICh0aGlzLl9rZXlzW2tleV0gPT09IDAgfHwgIXRoaXMuX2tleXNba2V5XSkpIHtcbiAgICAgICAgICAgIHRoaXMuX2tleXNba2V5XSA9IDEuMDsgLy8gb24gYW4gYWN0dWFsIE1JREkga2V5Ym9hcmQsIHdlJ2QgaGF2ZSBhIHZlbG9jaXR5XG4gICAgICAgICAgICB2YXIgb2N0YXZlID0gTWF0aC5mbG9vcihrZXkgLyBOb3RlLnNoYXJwTm90YXRpb25zLmxlbmd0aCk7XG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFjayh7XG4gICAgICAgICAgICAgICAgbm90YXRpb246IE5vdGUubm90YXRpb25BdEluZGV4KGtleSksXG4gICAgICAgICAgICAgICAgb2N0YXZlOiBvY3RhdmUgKyB0aGlzLl9jb25maWcuc3RhcnRvY3RhdmUsXG4gICAgICAgICAgICAgICAgLy9pbmRleDoga2V5LFxuICAgICAgICAgICAgICAgIHZlbG9jaXR5OiAxLjAsXG4gICAgICAgICAgICAgICAgYWN0aW9uOiAncHJlc3MnIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogb24ga2V5IGRvd25cbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKi9cbiAgICBvbktleVVwKGV2ZW50KSB7XG4gICAgICAgIHZhciBrZXkgPSB0aGlzLl9wb3RlbnRpYWxLZXlzLmluZGV4T2YoZXZlbnQua2V5LnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICBpZiAoa2V5ICE9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5fa2V5c1trZXldID0gMC4wOyAvLyBvbiBhbiBhY3R1YWwgTUlESSBrZXlib2FyZCwgd2UnZCBoYXZlIGEgdmVsb2NpdHlcbiAgICAgICAgICAgIHZhciBvY3RhdmUgPSBNYXRoLmZsb29yKGtleSAvIE5vdGUuc2hhcnBOb3RhdGlvbnMubGVuZ3RoKTtcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrKHtcbiAgICAgICAgICAgICAgICBub3RhdGlvbjogTm90ZS5ub3RhdGlvbkF0SW5kZXgoa2V5KSxcbiAgICAgICAgICAgICAgICBvY3RhdmU6IG9jdGF2ZSArIHRoaXMuX2NvbmZpZy5zdGFydG9jdGF2ZSxcbiAgICAgICAgICAgICAgICAvL2luZGV4OiBrZXksXG4gICAgICAgICAgICAgICAgdmVsb2NpdHk6IDAsXG4gICAgICAgICAgICAgICAgYWN0aW9uOiAncmVsZWFzZScgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCB7XG4gIFwiZXhwbG9zaW9uXCI6IHtcbiAgICBcImZyYWdtZW50XCI6IFwidmFyeWluZyBmbG9hdCBub2lzZTsgdW5pZm9ybSBzYW1wbGVyMkQgdEV4cGxvc2lvbjsgIGZsb2F0IHJhbmRvbSggdmVjMyBzY2FsZSwgZmxvYXQgc2VlZCApeyAgIHJldHVybiBmcmFjdCggc2luKCBkb3QoIGdsX0ZyYWdDb29yZC54eXogKyBzZWVkLCBzY2FsZSApICkgKiA0Mzc1OC41NDUzICsgc2VlZCApIDsgfSAgdm9pZCBtYWluKCkgeyAgICBmbG9hdCByID0gLjAxICogcmFuZG9tKCB2ZWMzKCAxMi45ODk4LCA3OC4yMzMsIDE1MS43MTgyICksIDAuMCApOyAgIHZlYzIgdFBvcyA9IHZlYzIoIDAsIDEuMCAtIDEuMyAqIG5vaXNlICsgciApOyAgIHZlYzQgY29sb3IgPSB0ZXh0dXJlMkQoIHRFeHBsb3Npb24sIHRQb3MgKTsgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KCBjb2xvci5yZ2IsIDEuMCApOyAgfVwiLFxuICAgIFwidmVydGV4XCI6IFwiICB2ZWMzIG1vZDI4OSh2ZWMzIHgpIHsgICByZXR1cm4geCAtIGZsb29yKHggKiAoMS4wIC8gMjg5LjApKSAqIDI4OS4wOyB9ICB2ZWM0IG1vZDI4OSh2ZWM0IHgpIHsgICByZXR1cm4geCAtIGZsb29yKHggKiAoMS4wIC8gMjg5LjApKSAqIDI4OS4wOyB9ICB2ZWM0IHBlcm11dGUodmVjNCB4KSB7ICAgcmV0dXJuIG1vZDI4OSgoKHgqMzQuMCkrMS4wKSp4KTsgfSAgdmVjNCB0YXlsb3JJbnZTcXJ0KHZlYzQgcikgeyAgIHJldHVybiAxLjc5Mjg0MjkxNDAwMTU5IC0gMC44NTM3MzQ3MjA5NTMxNCAqIHI7IH0gIHZlYzMgZmFkZSh2ZWMzIHQpIHsgICByZXR1cm4gdCp0KnQqKHQqKHQqNi4wLTE1LjApKzEwLjApOyB9ICBmbG9hdCBjbm9pc2UodmVjMyBQKSB7ICAgdmVjMyBQaTAgPSBmbG9vcihQKTsgICB2ZWMzIFBpMSA9IFBpMCArIHZlYzMoMS4wKTsgICBQaTAgPSBtb2QyODkoUGkwKTsgICBQaTEgPSBtb2QyODkoUGkxKTsgICB2ZWMzIFBmMCA9IGZyYWN0KFApOyAgIHZlYzMgUGYxID0gUGYwIC0gdmVjMygxLjApOyAgIHZlYzQgaXggPSB2ZWM0KFBpMC54LCBQaTEueCwgUGkwLngsIFBpMS54KTsgICB2ZWM0IGl5ID0gdmVjNChQaTAueXksIFBpMS55eSk7ICAgdmVjNCBpejAgPSBQaTAuenp6ejsgICB2ZWM0IGl6MSA9IFBpMS56enp6OyAgICB2ZWM0IGl4eSA9IHBlcm11dGUocGVybXV0ZShpeCkgKyBpeSk7ICAgdmVjNCBpeHkwID0gcGVybXV0ZShpeHkgKyBpejApOyAgIHZlYzQgaXh5MSA9IHBlcm11dGUoaXh5ICsgaXoxKTsgICAgdmVjNCBneDAgPSBpeHkwICogKDEuMCAvIDcuMCk7ICAgdmVjNCBneTAgPSBmcmFjdChmbG9vcihneDApICogKDEuMCAvIDcuMCkpIC0gMC41OyAgIGd4MCA9IGZyYWN0KGd4MCk7ICAgdmVjNCBnejAgPSB2ZWM0KDAuNSkgLSBhYnMoZ3gwKSAtIGFicyhneTApOyAgIHZlYzQgc3owID0gc3RlcChnejAsIHZlYzQoMC4wKSk7ICAgZ3gwIC09IHN6MCAqIChzdGVwKDAuMCwgZ3gwKSAtIDAuNSk7ICAgZ3kwIC09IHN6MCAqIChzdGVwKDAuMCwgZ3kwKSAtIDAuNSk7ICAgIHZlYzQgZ3gxID0gaXh5MSAqICgxLjAgLyA3LjApOyAgIHZlYzQgZ3kxID0gZnJhY3QoZmxvb3IoZ3gxKSAqICgxLjAgLyA3LjApKSAtIDAuNTsgICBneDEgPSBmcmFjdChneDEpOyAgIHZlYzQgZ3oxID0gdmVjNCgwLjUpIC0gYWJzKGd4MSkgLSBhYnMoZ3kxKTsgICB2ZWM0IHN6MSA9IHN0ZXAoZ3oxLCB2ZWM0KDAuMCkpOyAgIGd4MSAtPSBzejEgKiAoc3RlcCgwLjAsIGd4MSkgLSAwLjUpOyAgIGd5MSAtPSBzejEgKiAoc3RlcCgwLjAsIGd5MSkgLSAwLjUpOyAgICB2ZWMzIGcwMDAgPSB2ZWMzKGd4MC54LGd5MC54LGd6MC54KTsgICB2ZWMzIGcxMDAgPSB2ZWMzKGd4MC55LGd5MC55LGd6MC55KTsgICB2ZWMzIGcwMTAgPSB2ZWMzKGd4MC56LGd5MC56LGd6MC56KTsgICB2ZWMzIGcxMTAgPSB2ZWMzKGd4MC53LGd5MC53LGd6MC53KTsgICB2ZWMzIGcwMDEgPSB2ZWMzKGd4MS54LGd5MS54LGd6MS54KTsgICB2ZWMzIGcxMDEgPSB2ZWMzKGd4MS55LGd5MS55LGd6MS55KTsgICB2ZWMzIGcwMTEgPSB2ZWMzKGd4MS56LGd5MS56LGd6MS56KTsgICB2ZWMzIGcxMTEgPSB2ZWMzKGd4MS53LGd5MS53LGd6MS53KTsgICAgdmVjNCBub3JtMCA9IHRheWxvckludlNxcnQodmVjNChkb3QoZzAwMCwgZzAwMCksIGRvdChnMDEwLCBnMDEwKSwgZG90KGcxMDAsIGcxMDApLCBkb3QoZzExMCwgZzExMCkpKTsgICBnMDAwICo9IG5vcm0wLng7ICAgZzAxMCAqPSBub3JtMC55OyAgIGcxMDAgKj0gbm9ybTAuejsgICBnMTEwICo9IG5vcm0wLnc7ICAgdmVjNCBub3JtMSA9IHRheWxvckludlNxcnQodmVjNChkb3QoZzAwMSwgZzAwMSksIGRvdChnMDExLCBnMDExKSwgZG90KGcxMDEsIGcxMDEpLCBkb3QoZzExMSwgZzExMSkpKTsgICBnMDAxICo9IG5vcm0xLng7ICAgZzAxMSAqPSBub3JtMS55OyAgIGcxMDEgKj0gbm9ybTEuejsgICBnMTExICo9IG5vcm0xLnc7ICAgIGZsb2F0IG4wMDAgPSBkb3QoZzAwMCwgUGYwKTsgICBmbG9hdCBuMTAwID0gZG90KGcxMDAsIHZlYzMoUGYxLngsIFBmMC55eikpOyAgIGZsb2F0IG4wMTAgPSBkb3QoZzAxMCwgdmVjMyhQZjAueCwgUGYxLnksIFBmMC56KSk7ICAgZmxvYXQgbjExMCA9IGRvdChnMTEwLCB2ZWMzKFBmMS54eSwgUGYwLnopKTsgICBmbG9hdCBuMDAxID0gZG90KGcwMDEsIHZlYzMoUGYwLnh5LCBQZjEueikpOyAgIGZsb2F0IG4xMDEgPSBkb3QoZzEwMSwgdmVjMyhQZjEueCwgUGYwLnksIFBmMS56KSk7ICAgZmxvYXQgbjAxMSA9IGRvdChnMDExLCB2ZWMzKFBmMC54LCBQZjEueXopKTsgICBmbG9hdCBuMTExID0gZG90KGcxMTEsIFBmMSk7ICAgIHZlYzMgZmFkZV94eXogPSBmYWRlKFBmMCk7ICAgdmVjNCBuX3ogPSBtaXgodmVjNChuMDAwLCBuMTAwLCBuMDEwLCBuMTEwKSwgdmVjNChuMDAxLCBuMTAxLCBuMDExLCBuMTExKSwgZmFkZV94eXoueik7ICAgdmVjMiBuX3l6ID0gbWl4KG5fei54eSwgbl96Lnp3LCBmYWRlX3h5ei55KTsgICBmbG9hdCBuX3h5eiA9IG1peChuX3l6LngsIG5feXoueSwgZmFkZV94eXoueCk7ICAgcmV0dXJuIDIuMiAqIG5feHl6OyB9ICBmbG9hdCBwbm9pc2UodmVjMyBQLCB2ZWMzIHJlcCkgeyAgIHZlYzMgUGkwID0gbW9kKGZsb29yKFApLCByZXApOyAgIHZlYzMgUGkxID0gbW9kKFBpMCArIHZlYzMoMS4wKSwgcmVwKTsgICBQaTAgPSBtb2QyODkoUGkwKTsgICBQaTEgPSBtb2QyODkoUGkxKTsgICB2ZWMzIFBmMCA9IGZyYWN0KFApOyAgIHZlYzMgUGYxID0gUGYwIC0gdmVjMygxLjApOyAgIHZlYzQgaXggPSB2ZWM0KFBpMC54LCBQaTEueCwgUGkwLngsIFBpMS54KTsgICB2ZWM0IGl5ID0gdmVjNChQaTAueXksIFBpMS55eSk7ICAgdmVjNCBpejAgPSBQaTAuenp6ejsgICB2ZWM0IGl6MSA9IFBpMS56enp6OyAgICB2ZWM0IGl4eSA9IHBlcm11dGUocGVybXV0ZShpeCkgKyBpeSk7ICAgdmVjNCBpeHkwID0gcGVybXV0ZShpeHkgKyBpejApOyAgIHZlYzQgaXh5MSA9IHBlcm11dGUoaXh5ICsgaXoxKTsgICAgdmVjNCBneDAgPSBpeHkwICogKDEuMCAvIDcuMCk7ICAgdmVjNCBneTAgPSBmcmFjdChmbG9vcihneDApICogKDEuMCAvIDcuMCkpIC0gMC41OyAgIGd4MCA9IGZyYWN0KGd4MCk7ICAgdmVjNCBnejAgPSB2ZWM0KDAuNSkgLSBhYnMoZ3gwKSAtIGFicyhneTApOyAgIHZlYzQgc3owID0gc3RlcChnejAsIHZlYzQoMC4wKSk7ICAgZ3gwIC09IHN6MCAqIChzdGVwKDAuMCwgZ3gwKSAtIDAuNSk7ICAgZ3kwIC09IHN6MCAqIChzdGVwKDAuMCwgZ3kwKSAtIDAuNSk7ICAgIHZlYzQgZ3gxID0gaXh5MSAqICgxLjAgLyA3LjApOyAgIHZlYzQgZ3kxID0gZnJhY3QoZmxvb3IoZ3gxKSAqICgxLjAgLyA3LjApKSAtIDAuNTsgICBneDEgPSBmcmFjdChneDEpOyAgIHZlYzQgZ3oxID0gdmVjNCgwLjUpIC0gYWJzKGd4MSkgLSBhYnMoZ3kxKTsgICB2ZWM0IHN6MSA9IHN0ZXAoZ3oxLCB2ZWM0KDAuMCkpOyAgIGd4MSAtPSBzejEgKiAoc3RlcCgwLjAsIGd4MSkgLSAwLjUpOyAgIGd5MSAtPSBzejEgKiAoc3RlcCgwLjAsIGd5MSkgLSAwLjUpOyAgICB2ZWMzIGcwMDAgPSB2ZWMzKGd4MC54LGd5MC54LGd6MC54KTsgICB2ZWMzIGcxMDAgPSB2ZWMzKGd4MC55LGd5MC55LGd6MC55KTsgICB2ZWMzIGcwMTAgPSB2ZWMzKGd4MC56LGd5MC56LGd6MC56KTsgICB2ZWMzIGcxMTAgPSB2ZWMzKGd4MC53LGd5MC53LGd6MC53KTsgICB2ZWMzIGcwMDEgPSB2ZWMzKGd4MS54LGd5MS54LGd6MS54KTsgICB2ZWMzIGcxMDEgPSB2ZWMzKGd4MS55LGd5MS55LGd6MS55KTsgICB2ZWMzIGcwMTEgPSB2ZWMzKGd4MS56LGd5MS56LGd6MS56KTsgICB2ZWMzIGcxMTEgPSB2ZWMzKGd4MS53LGd5MS53LGd6MS53KTsgICAgdmVjNCBub3JtMCA9IHRheWxvckludlNxcnQodmVjNChkb3QoZzAwMCwgZzAwMCksIGRvdChnMDEwLCBnMDEwKSwgZG90KGcxMDAsIGcxMDApLCBkb3QoZzExMCwgZzExMCkpKTsgICBnMDAwICo9IG5vcm0wLng7ICAgZzAxMCAqPSBub3JtMC55OyAgIGcxMDAgKj0gbm9ybTAuejsgICBnMTEwICo9IG5vcm0wLnc7ICAgdmVjNCBub3JtMSA9IHRheWxvckludlNxcnQodmVjNChkb3QoZzAwMSwgZzAwMSksIGRvdChnMDExLCBnMDExKSwgZG90KGcxMDEsIGcxMDEpLCBkb3QoZzExMSwgZzExMSkpKTsgICBnMDAxICo9IG5vcm0xLng7ICAgZzAxMSAqPSBub3JtMS55OyAgIGcxMDEgKj0gbm9ybTEuejsgICBnMTExICo9IG5vcm0xLnc7ICAgIGZsb2F0IG4wMDAgPSBkb3QoZzAwMCwgUGYwKTsgICBmbG9hdCBuMTAwID0gZG90KGcxMDAsIHZlYzMoUGYxLngsIFBmMC55eikpOyAgIGZsb2F0IG4wMTAgPSBkb3QoZzAxMCwgdmVjMyhQZjAueCwgUGYxLnksIFBmMC56KSk7ICAgZmxvYXQgbjExMCA9IGRvdChnMTEwLCB2ZWMzKFBmMS54eSwgUGYwLnopKTsgICBmbG9hdCBuMDAxID0gZG90KGcwMDEsIHZlYzMoUGYwLnh5LCBQZjEueikpOyAgIGZsb2F0IG4xMDEgPSBkb3QoZzEwMSwgdmVjMyhQZjEueCwgUGYwLnksIFBmMS56KSk7ICAgZmxvYXQgbjAxMSA9IGRvdChnMDExLCB2ZWMzKFBmMC54LCBQZjEueXopKTsgICBmbG9hdCBuMTExID0gZG90KGcxMTEsIFBmMSk7ICAgIHZlYzMgZmFkZV94eXogPSBmYWRlKFBmMCk7ICAgdmVjNCBuX3ogPSBtaXgodmVjNChuMDAwLCBuMTAwLCBuMDEwLCBuMTEwKSwgdmVjNChuMDAxLCBuMTAxLCBuMDExLCBuMTExKSwgZmFkZV94eXoueik7ICAgdmVjMiBuX3l6ID0gbWl4KG5fei54eSwgbl96Lnp3LCBmYWRlX3h5ei55KTsgICBmbG9hdCBuX3h5eiA9IG1peChuX3l6LngsIG5feXoueSwgZmFkZV94eXoueCk7ICAgcmV0dXJuIDIuMiAqIG5feHl6OyB9ICB2YXJ5aW5nIGZsb2F0IG5vaXNlOyB1bmlmb3JtIGZsb2F0IHRpbWU7ICBmbG9hdCB0dXJidWxlbmNlKCB2ZWMzIHAgKSB7ICAgZmxvYXQgdyA9IDEwMC4wOyAgIGZsb2F0IHQgPSAtLjU7ICAgZm9yIChmbG9hdCBmID0gMS4wIDsgZiA8PSAxMC4wIDsgZisrICl7ICAgICBmbG9hdCBwb3dlciA9IHBvdyggMi4wLCBmICk7ICAgICB0ICs9IGFicyggcG5vaXNlKCB2ZWMzKCBwb3dlciAqIHAgKSwgdmVjMyggMTAuMCwgMTAuMCwgMTAuMCApICkgLyBwb3dlciApOyAgIH0gICByZXR1cm4gdDsgfSAgdm9pZCBtYWluKCkgeyAgIG5vaXNlID0gMTAuMCAqICAtLjEwICogdHVyYnVsZW5jZSggLjUgKiBub3JtYWwgKyB0aW1lICk7ICAgZmxvYXQgYiA9IDUuMCAqIHBub2lzZSggMC4wNSAqIHBvc2l0aW9uICsgdmVjMyggMi4wICogdGltZSApLCB2ZWMzKCAxMDAuMCApICk7ICAgZmxvYXQgZGlzcGxhY2VtZW50ID0gLSAxMC4gKiBub2lzZSArIGI7ICAgIHZlYzMgbmV3UG9zaXRpb24gPSBwb3NpdGlvbiArIG5vcm1hbCAqIGRpc3BsYWNlbWVudDsgICBnbF9Qb3NpdGlvbiA9IHByb2plY3Rpb25NYXRyaXggKiBtb2RlbFZpZXdNYXRyaXggKiB2ZWM0KCBuZXdQb3NpdGlvbiwgMS4wICk7ICB9XCJcbiAgfSxcbiAgXCJnbG93XCI6IHtcbiAgICBcImZyYWdtZW50XCI6IFwidW5pZm9ybSB2ZWMzIGdsb3dDb2xvcjsgdmFyeWluZyBmbG9hdCBpbnRlbnNpdHk7IHZvaWQgbWFpbigpICB7ICB2ZWMzIGdsb3cgPSBnbG93Q29sb3IgKiBpbnRlbnNpdHk7ICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KCBnbG93LCAxLjAgKTsgfVwiLFxuICAgIFwidmVydGV4XCI6IFwidW5pZm9ybSB2ZWMzIHZpZXdWZWN0b3I7IHVuaWZvcm0gZmxvYXQgYzsgdW5pZm9ybSBmbG9hdCBwOyB2YXJ5aW5nIGZsb2F0IGludGVuc2l0eTsgdm9pZCBtYWluKCkgIHsgICAgIHZlYzMgdk5vcm1hbCA9IG5vcm1hbGl6ZSggbm9ybWFsTWF0cml4ICogbm9ybWFsICk7ICB2ZWMzIHZOb3JtZWwgPSBub3JtYWxpemUoIG5vcm1hbE1hdHJpeCAqIHZpZXdWZWN0b3IgKTsgIGludGVuc2l0eSA9IHBvdyggYyAtIGRvdCh2Tm9ybWFsLCB2Tm9ybWVsKSwgcCApOyAgICAgICBnbF9Qb3NpdGlvbiA9IHByb2plY3Rpb25NYXRyaXggKiBtb2RlbFZpZXdNYXRyaXggKiB2ZWM0KCBwb3NpdGlvbiwgMS4wICk7IH1cIlxuICB9XG59IiwiZXhwb3J0IGRlZmF1bHQge1xuICAgIG5ldXRyYWw6IHtcbiAgICAgICAgcmVkOiAweDdBNjg2OSxcbiAgICAgICAgZGFya3JlZDogMHgyZDI2MjcsXG4gICAgICAgIC8vZ3JlZW46IDB4NjU4NzZFLFxuXG4gICAgICAgIGdyZWVuOiAweGMwYzRiNixcbiAgICAgICAgbGlnaHRyZWQ6IDB4ZWFkZmRiLFxuICAgICAgICBncmF5Ymx1ZTogMHhhZGFlYjAsXG4gICAgICAgIGJyb3duOiAweGQ4YzJiNSxcbiAgICAgICAgb3JhbmdlOiAweGYyY2ZiM1xuICAgIH0sXG5cbiAgICBuZW9uOiB7XG4gICAgICAgIGJsdWU6IDB4MDBlY2ZmLFxuICAgICAgICBncmVlbjogMHg3Y2ZmMDAsXG4gICAgICAgIHllbGxvdzogMHhlM2ZmMDAsXG4gICAgICAgIG9yYW5nZTogMHhmZmI0MDAsXG4gICAgICAgIHZpb2xldDogMHhmZDAwZmZcbiAgICB9LFxuXG4gICAgZ3JheXNjYWxlOiBbXG4gICAgICAgIDB4MDAwMDAwLFxuICAgICAgICAweDJhMmEyYSxcbiAgICAgICAgMHg1YTVhNWEsXG4gICAgICAgIDB4OGE4YThhLFxuICAgICAgICAweGFhYWFhYSxcbiAgICAgICAgMHhmZmZmZmZcbiAgICBdXG59IiwiaW1wb3J0IENvbG9ycyBmcm9tICcuL2NvbG9ycy5lczYnO1xuZXhwb3J0IGRlZmF1bHQge1xuICAgIGNvbG9yd2hlZWw6IFsgICAgICAgMHhmZmZhMDAsIDB4ZmZjZjAwLCAweGZmYTYwMCwgMHhmZjdkMDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAweGZmMjAwMCwgMHhmNDI0OTQsIDB4OGIyMGJiLCAweDAwMjRiYSxcbiAgICAgICAgICAgICAgICAgICAgICAgIDB4MDA3YWM3LCAweDAwYjJkNiwgMHgwMmI4MDEsIDB4ODRjZTAwIF0sXG5cblxuICAgIGtleXM6IHtcbiAgICAgICAgbm9ybWFsOiB7XG4gICAgICAgICAgICB3aGl0ZToge1xuICAgICAgICAgICAgICAgIGVtaXNzaXZlOiBDb2xvcnMuZ3JheXNjYWxlWzNdLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBDb2xvcnMubmV1dHJhbC5yZWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBibGFjazoge1xuICAgICAgICAgICAgICAgIGVtaXNzaXZlOiBDb2xvcnMuZ3JheXNjYWxlWzFdLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBDb2xvcnMubmV1dHJhbC5yZWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgc3VnZ2VzdGVkOiB7XG4gICAgICAgICAgICB3aGl0ZToge1xuICAgICAgICAgICAgICAgIGVtaXNzaXZlOiBDb2xvcnMuZ3JheXNjYWxlWzJdLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBDb2xvcnMubmVvbi5ncmVlblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJsYWNrOiB7XG4gICAgICAgICAgICAgICAgZW1pc3NpdmU6IENvbG9ycy5ncmF5c2NhbGVbMV0sXG4gICAgICAgICAgICAgICAgY29sb3I6IENvbG9ycy5uZW9uLmdyZWVuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHN0cm9uZ2x5U3VnZ2VzdGVkOiB7XG4gICAgICAgICAgICB3aGl0ZToge1xuICAgICAgICAgICAgICAgIGVtaXNzaXZlOiBDb2xvcnMuZ3JheXNjYWxlWzJdLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBDb2xvcnMubmVvbi5vcmFuZ2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBibGFjazoge1xuICAgICAgICAgICAgICAgIGVtaXNzaXZlOiBDb2xvcnMuZ3JheXNjYWxlWzFdLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBDb2xvcnMubmVvbi5vcmFuZ2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuXG4gICAgfSxcblxuICAgIG1ldHJvbm9tZToge1xuICAgICAgICBkcnVtOiB7XG4gICAgICAgICAgICBidW1wbWFwOiAnLi9hc3NldHMvaW1hZ2VzL3JpcHBsZW1hcC5qcGcnLFxuICAgICAgICAgICAgY29sb3I6IENvbG9ycy5uZXV0cmFsLmRhcmtyZWQsXG4gICAgICAgICAgICBoaXRjb2xvcjogQ29sb3JzLm5lb24uYmx1ZSxcbiAgICAgICAgICAgIGVtaXNzaXZlOiBDb2xvcnMuZ3JheXNjYWxlWzBdLFxuICAgICAgICAgICAgc3BlY3VsYXI6IENvbG9ycy5uZXV0cmFsLmdyYXlibHVlXG4gICAgICAgIH0sXG5cbiAgICAgICAgaGFtbWVyOiB7XG4gICAgICAgICAgICByZWZyYWN0aW9uY3ViZTogW1xuICAgICAgICAgICAgICAgICcuL2Fzc2V0cy9pbWFnZXMvbnguanBnJyxcbiAgICAgICAgICAgICAgICAnLi9hc3NldHMvaW1hZ2VzL255LmpwZycsXG4gICAgICAgICAgICAgICAgJy4vYXNzZXRzL2ltYWdlcy9uei5qcGcnLFxuICAgICAgICAgICAgICAgICcuL2Fzc2V0cy9pbWFnZXMvbnguanBnJyxcbiAgICAgICAgICAgICAgICAnLi9hc3NldHMvaW1hZ2VzL255LmpwZycsXG4gICAgICAgICAgICAgICAgJy4vYXNzZXRzL2ltYWdlcy9uei5qcGcnIF0sXG4gICAgICAgICAgICBjb2xvcjogQ29sb3JzLm5ldXRyYWwucmVkLFxuICAgICAgICAgICAgaGl0Y29sb3I6IENvbG9ycy5uZW9uLmJsdWVcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBkb21lOiB7XG4gICAgICAgIGNvbG9yOiBDb2xvcnMubmV1dHJhbC5kYXJrcmVkLFxuICAgICAgICBlbWlzc2l2ZTogQ29sb3JzLm5ldXRyYWwuZGFya3JlZCxcbiAgICAgICAgc3BlY3VsYXI6IENvbG9ycy5uZXV0cmFsLnJlZFxuICAgIH0sXG5cbiAgICBmbG9hdGluZ3BhcnRpY2xlczoge1xuICAgICAgICBzcHJpdGU6ICcuL2Fzc2V0cy9pbWFnZXMvc25vd2ZsYWtlMS5wbmcnLFxuICAgICAgICBjb2xvcjogQ29sb3JzLmdyYXlzY2FsZVsyXVxuICAgIH0sXG5cbiAgICBsaWdodGluZzoge1xuICAgICAgICBoZW1pc3BoZXJlOiB7XG4gICAgICAgICAgICB0b3A6IENvbG9ycy5uZXV0cmFsLmRhcmtyZWQsXG4gICAgICAgICAgICBib3R0b206IENvbG9ycy5uZXV0cmFsLmdyZWVuXG4gICAgICAgIH0sXG4gICAgICAgIHNwb3RsaWdodDogQ29sb3JzLmdyYXlzY2FsZVsxXVxuICAgIH1cbn1cbiIsImltcG9ydCBOb3RlIGZyb20gJy4vbXVzaWN0aGVvcnkvbm90ZS5lczYnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgU1lOVEhEUlVNOiAnc3ludGhfZHJ1bScsXG4gICAgUElBTk86ICAgICAnYWNvdXN0aWNfZ3JhbmRfcGlhbm8nLFxuXG4gICAgcGxheWVyU3RhdGU6ICdyZWFkeScsXG5cbiAgICAvKipcbiAgICAgKiBpbnN0cnVtZW50cyBsb2FkZWRcbiAgICAgKi9cbiAgICBfaW5zdHJ1bWVudHNMb2FkZWQ6IFtdLFxuXG4gICAgLyoqXG4gICAgICogcGxheSBtaWRpIGZpbGVcbiAgICAgKiBAcGFyYW0gdXJpIG9mIG1pZGllIGZpbGVcbiAgICAgKi9cbiAgICBwbGF5KHVyaSkge1xuICAgICAgICB0aGlzLnBsYXllclN0YXRlID0gJ2xvYWRpbmcnO1xuICAgICAgICBNSURJLlBsYXllci50aW1lV2FycCA9IDE7IC8vIHNwZWVkIHRoZSBzb25nIGlzIHBsYXllZCBiYWNrXG4gICAgICAgIE1JREkuUGxheWVyLmxvYWRGaWxlKHVyaSxcbiAgICAgICAgICAgICgpID0+IHRoaXMub25Mb2FkZWQoKSxcbiAgICAgICAgICAgICgpID0+IHRoaXMub25Qcm9ncmVzcygpLFxuICAgICAgICAgICAgKGVycikgPT4gdGhpcy5vbkVycm9yKGVycikpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBwYXVzZSBwbGF5aW5nIG1pZGkgZmlsZVxuICAgICAqL1xuICAgIHBhdXNlKCkge1xuICAgICAgICB0aGlzLnBsYXllclN0YXRlID0gJ3BhdXNlZCc7XG4gICAgICAgIE1JREkuUGxheWVyLnBhdXNlKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHJlc3VtZSBwbGF5aW5nIG1pZGkgZmlsZVxuICAgICAqL1xuICAgIHJlc3VtZSgpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJTdGF0ZSA9ICdwbGF5aW5nJztcbiAgICAgICAgTUlESS5QbGF5ZXIucmVzdW1lKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGNoZWNrIGlmIGluc3RydW1lbnQgaXMgbG9hZGVkXG4gICAgICogQHBhcmFtIGluc3RydW1lbnRcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBpc0luc3RydW1lbnRMb2FkZWQoaW5zdHJ1bWVudCkge1xuICAgICAgICBpZiAodGhpcy5faW5zdHJ1bWVudHNMb2FkZWQuaW5kZXhPZihpbnN0cnVtZW50KSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGxvYWQgaW5zdHJ1bWVudFxuICAgICAqIEBwYXJhbSBpbnN0cnVtZW50XG4gICAgICovXG4gICAgbG9hZEluc3RydW1lbnQoaW5zdHJ1bWVudCwgcGF0aCkge1xuICAgICAgICBNSURJLmxvYWRQbHVnaW4oe1xuICAgICAgICAgICAgc291bmRmb250VXJsOiBwYXRoLFxuICAgICAgICAgICAgaW5zdHJ1bWVudDogaW5zdHJ1bWVudCxcbiAgICAgICAgICAgIG9ucHJvZ3Jlc3M6IChzdGF0ZSwgcHJvZ3Jlc3MsIGluc3RydW1lbnQpID0+IHRoaXMub25JbnN0cnVtZW50TG9hZFByb2dyZXNzKHN0YXRlLCBwcm9ncmVzcywgaW5zdHJ1bWVudCksXG4gICAgICAgICAgICBvbnN1Y2Nlc3M6IChldmVudCkgPT4gdGhpcy5vbkluc3RydW1lbnRMb2FkZWQoZXZlbnQpLFxuICAgICAgICAgICAgb25lcnJvcjogKGVycikgPT4gdGhpcy5vbkluc3RydW1lbnRMb2FkZWRFcnJvcihlcnIpLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogcGxheSBhIHRvbmVcbiAgICAgKiBAcGFyYW0gaW5zdHJ1bWVudFxuICAgICAqIEBwYXJhbSBub3RhdGlvblxuICAgICAqIEBwYXJhbSBkdXJhdGlvblxuICAgICAqL1xuICAgIHBsYXlUb25lKGluc3RydW1lbnQsIG5vdGF0aW9uLCBtaWRpY2hhbm5lbCwgZHVyYXRpb24pIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzSW5zdHJ1bWVudExvYWRlZChpbnN0cnVtZW50KSkgeyByZXR1cm47IH1cblxuICAgICAgICBNSURJLnByb2dyYW1DaGFuZ2UoMCwgTUlESS5HTS5ieU5hbWVbaW5zdHJ1bWVudF0ubnVtYmVyKTtcbiAgICAgICAgdmFyIGRlbGF5ID0gMDsgLy8gcGxheSBvbmUgbm90ZSBldmVyeSBxdWFydGVyIHNlY29uZFxuICAgICAgICB2YXIgbm90ZSA9IE5vdGUubm90YXRpb25Ub01JREkobm90YXRpb24pOyAvLyB0aGUgTUlESSBub3RlXG4gICAgICAgIHZhciB2ZWxvY2l0eSA9IDEyNzsgLy8gaG93IGhhcmQgdGhlIG5vdGUgaGl0c1xuICAgICAgICAvLyBwbGF5IHRoZSBub3RlXG4gICAgICAgIE1JREkuc2V0Vm9sdW1lKDAsIDEyNyk7XG4gICAgICAgIE1JREkubm90ZU9uKDAsIG5vdGUsIHZlbG9jaXR5LCBkZWxheSk7XG5cbiAgICAgICAgaWYgKGR1cmF0aW9uKSB7XG4gICAgICAgICAgICBNSURJLm5vdGVPZmYoMCwgbm90ZSwgZGVsYXkgKyBkdXJhdGlvbik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogbm90ZSBvblxuICAgICAqIEBwYXJhbSBpbnN0cnVtZW50XG4gICAgICogQHBhcmFtIG5vdGF0aW9uXG4gICAgICogQHBhcmFtIG1pZGljaGFubmVsXG4gICAgICovXG4gICAgbm90ZU9uKGluc3RydW1lbnQsIG5vdGF0aW9uLCBtaWRpY2hhbm5lbCwgZHVyYXRpb24pIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzSW5zdHJ1bWVudExvYWRlZChpbnN0cnVtZW50KSkgeyByZXR1cm47IH1cbiAgICAgICAgdmFyIG5vdGUgPSBOb3RlLm5vdGF0aW9uVG9NSURJKG5vdGF0aW9uKTtcbiAgICAgICAgTUlESS5wcm9ncmFtQ2hhbmdlKG1pZGljaGFubmVsLCBNSURJLkdNLmJ5TmFtZVtpbnN0cnVtZW50XS5udW1iZXIpO1xuICAgICAgICB2YXIgdmVsb2NpdHkgPSAxMjc7IC8vIGhvdyBoYXJkIHRoZSBub3RlIGhpdHNcbiAgICAgICAgTUlESS5zZXRWb2x1bWUoMCwgMTI3KTtcbiAgICAgICAgTUlESS5ub3RlT24obWlkaWNoYW5uZWwsIG5vdGUsIHZlbG9jaXR5LCAwKTtcblxuICAgICAgICBpZiAoZHVyYXRpb24pIHtcbiAgICAgICAgICAgIE1JREkubm90ZU9mZihtaWRpY2hhbm5lbCwgbm90ZSwgZHVyYXRpb24pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIG5vdGUgb2ZmXG4gICAgICogQHBhcmFtIG5vdGF0aW9uXG4gICAgICogQHBhcmFtIG1pZGljaGFubmVsXG4gICAgICogQHBhcmFtIGRlbGF5XG4gICAgICovXG4gICAgbm90ZU9mZihub3RhdGlvbiwgbWlkaWNoYW5uZWwsIGRlbGF5KSB7XG4gICAgICAgIGlmICghZGVsYXkpIHsgZGVsYXkgPSAwOyB9XG4gICAgICAgIHZhciBub3RlID0gTm90ZS5ub3RhdGlvblRvTUlESShub3RhdGlvbik7XG4gICAgICAgIE1JREkubm90ZU9mZihtaWRpY2hhbm5lbCwgbm90ZSwgZGVsYXkpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBhZGQgZXZlbnQgbGlzdGVuZXJcbiAgICAgKiBAcGFyYW0gZXZlbnR0eXBlXG4gICAgICogQHBhcmFtIGNhbGxiYWNrXG4gICAgICovXG4gICAgYWRkRXZlbnRMaXN0ZW5lcihldmVudHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICghdGhpcy5fbGlzdGVuZXJzKSB7IHRoaXMuX2xpc3RlbmVycyA9IFtdOyB9XG4gICAgICAgIHRoaXMuX2xpc3RlbmVycy5wdXNoKCB7IHR5cGU6IGV2ZW50dHlwZSwgY2FsbGJhY2s6IGNhbGxiYWNrIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBvbiBpbnN0cnVtZW50IGxvYWRlZFxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqL1xuICAgIG9uSW5zdHJ1bWVudExvYWRlZCgpIHt9LFxuXG4gICAgLyoqXG4gICAgICogb24gaW5zdHJ1bWVudCBsb2FkIHByb2dyZXNzXG4gICAgICogQHBhcmFtIHN0YXRlXG4gICAgICogQHBhcmFtIHByb2dyZXNzXG4gICAgICogQHBhcmFtIGluc3RydW1lbnRcbiAgICAgKi9cbiAgICBvbkluc3RydW1lbnRMb2FkUHJvZ3Jlc3Moc3RhdGUsIHByb2dyZXNzLCBpbnN0cnVtZW50KSB7XG4gICAgICAgIGlmIChpbnN0cnVtZW50ICYmIHByb2dyZXNzID09PSAxKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpbnN0cnVtZW50ICsgJyBsb2FkZWQnKTtcbiAgICAgICAgICAgIHRoaXMuX2luc3RydW1lbnRzTG9hZGVkLnB1c2goaW5zdHJ1bWVudCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogb24gaW5zdHJ1bWVudCBsb2FkZWQgZXJyb3JcbiAgICAgKiBAcGFyYW0gZXJyXG4gICAgICovXG4gICAgb25JbnN0cnVtZW50TG9hZGVkRXJyb3IoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdJbnN0cnVtZW50IGxvYWRpbmcgZXJyb3InLCBlcnIpO1xuICAgIH0sXG5cbiAgICBvbkxvYWRlZCgpIHtcbiAgICAgICAgTUlESS5wcm9ncmFtQ2hhbmdlKDAsIE1JREkuR00uYnlOYW1lW3RoaXMuUElBTk9dLm51bWJlcik7XG4gICAgICAgIE1JREkuUGxheWVyLnN0YXJ0KCk7XG4gICAgICAgIHRoaXMucGxheWVyU3RhdGUgPSAncGxheWluZyc7XG4gICAgICAgIHRoaXMuaXNQbGF5aW5nID0gdHJ1ZTtcbiAgICAgICAgTUlESS5QbGF5ZXIuYWRkTGlzdGVuZXIoZGF0YSA9PiB0aGlzLm9uTUlESURhdGEoZGF0YSkpO1xuICAgIH0sXG5cbiAgICBvblByb2dyZXNzKCkge1xuICAgICAgICBjb25zb2xlLmxvZygncHJvZ3Jlc3MnKTtcbiAgICB9LFxuXG4gICAgb25FcnJvcihlcnIpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yJywgZXJyKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogb24gbWlkaSBkYXRhIGNhbGxiYWNrXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKi9cbiAgICBvbk1JRElEYXRhKGRhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMuX2xpc3RlbmVycykge1xuICAgICAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCB0aGlzLl9saXN0ZW5lcnMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbGlzdGVuZXJzW2NdLnR5cGUgPT09ICdtaWRpZGF0YScpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVyc1tjXS5jYWxsYmFjay5hcHBseSh0aGlzLCBbeyBub3RlOiBkYXRhLm5vdGUgLSAyMSwgdmVsb2NpdHk6IGRhdGEudmVsb2NpdHkgfV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgTm90ZSBmcm9tICcuL211c2ljdGhlb3J5L25vdGUuZXM2JztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIC8qKlxuICAgICAqIGFwcGx5IG4gbnVtYmVyIG9mIHByb3BlcnRpZXMgdG8gYW4gb2JqZWN0XG4gICAgICogQHBhcmFtIG9iamVjdFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wc1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2Ugb2YgcHJvcGVydHkgKHByZXBlbmQga2V5IG5hbWUpXG4gICAgICovXG4gICAgY29weVByb3BzVG8ob2JqZWN0LCBwcm9wcywgbmFtZXNwYWNlKSB7XG4gICAgICAgIGlmICghbmFtZXNwYWNlKSB7IG5hbWVzcGFjZSA9ICcnOyB9XG4gICAgICAgIGZvciAodmFyIGMgaW4gcHJvcHMpIHtcbiAgICAgICAgICAgIG9iamVjdFtjICsgbmFtZXNwYWNlXSA9IHByb3BzW2NdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHR1cm4gZGVjaW1hbCBjb2xvciB0byBSR0JcbiAgICAgKiBAcGFyYW0gZGVjXG4gICAgICogQHBhcmFtIG1heFxuICAgICAqIEByZXR1cm5zIHt7cjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlcn19XG4gICAgICovXG4gICAgZGVjVG9SR0IoZGVjLCBtYXgpIHtcbiAgICAgICAgaWYgKCFtYXgpIHsgbWF4ID0gMjU1OyB9XG4gICAgICAgIG1heCArPSAxOyAvLyBhaWRzIHdpdGggcm91bmRpbmdcbiAgICAgICAgdmFyIHIgPSBNYXRoLmZsb29yKGRlYyAvICgyNTYqMjU2KSk7XG4gICAgICAgIHZhciBnID0gTWF0aC5mbG9vcihkZWMgLyAyNTYpICUgMjU2O1xuICAgICAgICB2YXIgYiA9IGRlYyAlIDI1NjtcbiAgICAgICAgcmV0dXJuIHsgcjogci8yNTUgKiBtYXgsIGc6IGcvMjU1ICogbWF4LCBiOiBiLzI1NSAqIG1heCB9O1xuICAgIH0sXG5cbiAgICBSR0JUb0RlYyhyZ2IpIHtcbiAgICAgICAgcmV0dXJuIHJnYi5yIDw8IDE2ICsgcmdiLmcgPDwgMTYgKyByZ2IuYjtcbiAgICB9XG59Il19