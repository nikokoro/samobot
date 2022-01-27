import {WebSocket} from 'ws';
import {EventEmitter} from 'events';

import {handleDisconnect} from './reconnect.js';
import {authenticate} from './authenticate.js';
import * as heartbeat from './heartbeat.js';


/** Performs real-time communication with Discord over WebSocket. */
export class Gateway extends EventEmitter {
  /**
   * Creates a new Gateway.
   * @param {ApiService} api
   */
  constructor(api) {
    super();
    this.webSocket = null;
    this.events = new EventEmitter();
    this.seq = null;
    this.supportedOpCodes = [1, 2, 3, 4, 6, 8];
    this.api = api;

    this.on(0, (type, data) => {
      if (!this.events.emit(type, data)) {
        console.log(`Received event ${type}.`);
      }
    });
    this.on(1, () => beat(gateway));
    this.on(7, () => this.reconnect(true));
    this.on(9, (type, data) => this.reconnect(data));
    this.once(10, () => authenticate(this));
    this.once(10, (type, data) =>
      heartbeat.setup(this, data.heartbeat_interval));
    this.on(11, heartbeat.ack);
  }

  /**
  * Initializes a connection without authenticating.
  *
  */
  async initConnection() {
    let {url} = await this.api.get('/gateway', false);
    url += '?v=9&encoding=json';
    // TODO: Add sharding support
    this.webSocket = new WebSocket(url);
    this.webSocket.on('message',
        (data) => {
          this.receiveEvent(data);
        });
    this.onDisconnect((code, reason) => handleDisconnect(this, code, reason));
    this.onDisconnect(heartbeat.stop);
    return new Promise((resolve, reject) => {
      this.webSocket.once('open', resolve);
      this.onDisconnect(reject);
    });
  };

  /**
  * Parses data from incoming gateway events, and emits a new event with the
  * provided opcode. Also updates cached last-received event sequence number
  * for heartbeating.
  * @param {string} data - The received raw payload.
  */
  receiveEvent(data) {
    data = JSON.parse(data);
    this.seq = data.s;
    if (!data.hasOwnProperty('op')) {
      console.error(data);
      throw new Error('Received gateway event with no opcode');
    }
    this.emit(data.op, data.t, data.d);
  };

  /**
  * Attempts to send the given data through the WebSocket.
  * @param {int} op
  * @param {Object} data
  * @return {boolean} Whether the attempt was successful or not.
  */
  send(op, data) {
    if (!this.webSocket) {
      console.warn('Tried to send data to gateway while disconnected.');
      return false;
    }
    if (typeof op !== 'number' || !(op in this.supportedOpCodes)) {
      console.warn('Tried to send invalid opcode to gateway.');
    }
    let payload = {op: op, d: data};
    payload = JSON.stringify(payload);
    this.webSocket.send(payload);
    return true;
  }

  /**
   * When this gateway disconnects, execute the following callback.
   * @param {function(int, string)} listener - Should take close code and
   *     reason as arguments.
   * @throws Will throw an Error if already disconnected.
   */
  onDisconnect(listener) {
    if (!this.webSocket) {
      throw new Error('Already disconnected');
    }
    this.webSocket.on('close', listener);
  }

  /**
  * Disconnect from the gateway, and attempt to reconnect and resume.
  * @param {boolean} resume - Whether to resume the session or not.
  */
  async reconnect(resume) {
    if (!this.webSocket) {
      console.warn('Already disconnected!');
      console.log('Attempting connection anyways...');
      return;
    }
    console.log('Received signal to reconnect '+
      (resume ? 'and resume.' : 'without resuming.'));
    if (!resume) {
      // Throw away this session to prevent attempts at resuming
      console.log('Throwing away session_id...');
      this.session_id = null;
    }
    console.log('Disconnecting gateway...');
    this.webSocket.close(4000);
    /* From here, the Gateway expects the disconnection to be handled as a
     * regular code-4000 disconnection, and resumed accordingly. */
  };
};
