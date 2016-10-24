import MidiKeyManager from './midikeymanager.es6';
import Note from './musictheory/note.es6';

export default class extends MidiKeyManager {
    /**
     * initialize midi device
     */
    initializeDevice() {
        this.socket = new WebSocket('ws://localhost:8080');
        this.socket.onerror = function (error) { console.log('WebSocket Error ' + error); };

        this.socket.onmessage = (e) => {
            var msg = JSON.parse(e.data);
            this.onMIDIMessage(msg);
        };

        this.socket.onopen = (e) => {
            this.socket.send('connect');
        }
    }
}