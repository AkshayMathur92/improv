import Note from './note.es6';

export default class {
    constructor() {
        /**
         * key mapping
         * @type {Array.<string>}
         * @private
         */
        this._keyMapping = Note.sharpNotations.concat(Note.sharpNotations);

        /**
         * key signature score history
         * @type {Array}
         * @private
         */
        this._keySignatureScoreHistory = [];

        /**
         * weight for current keys pressed (to set apart and be stronger scoring from past keys pressed)
         * @type {number}
         */
        this.currentKeyScoreWeight = 2;

        /**
         * history decay rate
         * @type {Number}
         * @private
         */
        this._keySignatureDecayRate = 0.9;

        Note.generateKeySignatureLookup();
    }

    /**
     * update keys pressed
     * @param {Array} keys
     */
    update(keys) {
        if (keys.length === 0) { return this._keySignatureScoreHistory; }
        var keysigScores = {};
        for (var sig in Note.keys) {
            for (var d = 0; d < keys.length; d++) {
                if (Note.keys[sig].indexOf(keys[d].notation) !== -1) {
                    if (!keysigScores[sig]) { keysigScores[sig] = 0; }
                    keysigScores[sig] ++;
                }
            }
        }

        var scores = [];
        for (var score in keysigScores) {
            scores.push( { score: keysigScores[score], key: score, timestamp: Date.now() });
        }

        this.decayHistoricalScores();
        return this.applyCurrentScoreToHistory(scores);
    }

    /**
     * slowly decay current historical scores
     */
    decayHistoricalScores() {
        for (var c = 0; c < this._keySignatureScoreHistory.length; c++) {
            this._keySignatureScoreHistory[c].score *= this._keySignatureDecayRate;
        }
    }

    /**
     * apply scores to history (aggregate all scores: current and past)
     * @param scores
     */
    applyCurrentScoreToHistory(scores) {
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
        return this._keySignatureScoreHistory.sort(function(a, b) { return (a.score < b.score ) ? 1 : ((b.score < a.score) ? -1 : 0); });
    }
}