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
                this._metronome.setHitColor(_style2.default.colorwheel[_note2.default.indexOfNotation(event.predictedKey[0].key)]);
                this._particles.setColor(_style2.default.colorwheel[_note2.default.indexOfNotation(event.predictedKey[0].key)]);
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
            this._metronome = new _metronome2.default(config.metronome);
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

},{"./input.es6":3,"./musictheory/note.es6":6,"./objects/dome.es6":7,"./objects/floatingparticles.es6":8,"./objects/keyboards/circularkeyboard.es6":10,"./objects/keyboards/traditionalkeyboard.es6":11,"./objects/lighting.es6":12,"./objects/metronome.es6":13,"./objects/particleflock.es6":14,"./themeing/style.es6":18,"./toneplayback.es6":19}],3:[function(require,module,exports){
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

},{"./midikeymanager.es6":4,"./musictheory/keysignatureprediction.es6":5,"./qwertykeymanager.es6":15,"./websocketmidikeymanager.es6":21}],4:[function(require,module,exports){
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

},{"../../node_modules/trivr/src/basegroup.es6":1,"../themeing/style.es6":18,"../toneplayback.es6":19}],8:[function(require,module,exports){
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

},{"../../node_modules/trivr/src/basegroup.es6":1,"../themeing/style.es6":18,"../utils.es6":20}],9:[function(require,module,exports){
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

},{"../../../node_modules/trivr/src/basegroup.es6":1,"../../input.es6":3,"../../musictheory/note.es6":6,"../../themeing/style.es6":18,"../../toneplayback.es6":19,"../../utils.es6":20}],10:[function(require,module,exports){
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

},{"../../input.es6":3,"../../musictheory/note.es6":6,"../../themeing/style.es6":18,"../../toneplayback.es6":19,"../../utils.es6":20,"./basekeyboard.es6":9}],11:[function(require,module,exports){
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
            this.group.position.z = -230;
            this.group.position.y = -200;
            this.group.rotation.x = -Math.PI / 2;
            this.group.scale.set(10, 10, 10);
        }
    }]);

    return TraditionalKeyboard;
}(_basekeyboard2.default);

exports.default = TraditionalKeyboard;

},{"../../input.es6":3,"../../musictheory/note.es6":6,"../../themeing/style.es6":18,"../../toneplayback.es6":19,"../../utils.es6":20,"./basekeyboard.es6":9}],12:[function(require,module,exports){
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

},{"../../node_modules/trivr/src/basegroup.es6":1,"../themeing/style.es6":18}],13:[function(require,module,exports){
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
            //this.addHammer('right', Math.PI/64, Math.PI * 2, 'C4');
            //this.addHammer('left', Math.PI/128, Math.PI/4, 'A4');
            this.addHammer('up', Math.PI / this._config.rate, Math.PI / 2, this._config.notation);
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

},{"../../node_modules/trivr/src/basegroup.es6":1,"../themeing/style.es6":18,"../toneplayback.es6":19,"../utils.es6":20,"./../shaders.es6":16}],14:[function(require,module,exports){
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

},{"../../node_modules/trivr/src/basegroup.es6":1,"../shaders.es6":16,"../themeing/style.es6":18,"../utils.es6":20}],15:[function(require,module,exports){
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

},{"./musictheory/note.es6":6}],16:[function(require,module,exports){
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

},{"./musictheory/note.es6":6}],20:[function(require,module,exports){
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

},{"./musictheory/note.es6":6}],21:[function(require,module,exports){
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

},{"./midikeymanager.es6":4,"./musictheory/note.es6":6}]},{},[2])(2)
});


//# sourceMappingURL=improv.js.map
