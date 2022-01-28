import {WebSocket} from 'ws';
import {EventEmitter} from 'events';

import {SessionService} from './session.js';
import {config} from '../config';

/** Performs real-time communication with Discord over WebSocket. */
export class Gateway extends EventEmitter {
  /**
   * Creates a new Gateway, optionally specifying additional configuration.
   * @param {string} url
   * @param {Object} [gatewayConfig]
   * @param {string} [gatewayConfig.name]
   * @param {string} [gatewayConfig.token] If none provided, will use the
   *     DBOT_TOKEN environment variable.
   * @param {SessionService} [gatewayConfig.session]
   * @param {number} [gatewayConfig.intents] A number describing this gateway's
   *     intents.
   * @see {@link https://discord.com/developers/docs/topics/gateway#gateway-intents Gateway intents}
   * @param {Object} [gatewayConfig.closeCodes]
   * @param {number[]} [gatewayConfig.closeCodes.fatal] Fatal close codes.
   * @param {number[]} [gatewayConfig.closeCodes.renewSession]
   *     Close codes indicating we shouldn't attempt to resume.
   * @param {number[]} [gatewayConfig.supportedOpCodes]
   *     Opcodes this Gateway can send.
   */
  constructor(url, gatewayConfig) {
    super();
    if (gatewayConfig && !gatewayConfig.closeCodes) {
      gatewayConfig.closeCodes = {};
    } else if (!gatewayConfig) {
      gatewayConfig = {closeCodes: {}};
    }
    /** {string} */
    this.url = url;
    /** {string} */
    this.name = gatewayConfig.name || config.defaults.name;
    /** {string} */
    this.token = gatewayConfig.token || config.token;
    /** {number} */
    this.intents = gatewayConfig.intents || 0;
    /** {?WebSocket} */
    this.webSocket = null;
    /** {!EventEmitter} */
    this.operations = new EventEmitter();
    /** {!SessionService} */
    this.session = gatewayConfig.session || new SessionService();
    /** {function(string, object)} */
    this.defaultOnEvent = (event, data) => {};
    /** {!number[]} */
    this.supportedOpCodes = gatewayConfig.supportedOpCodes ||
        config.defaults.supportedOpCodes;
    this.closeCodes = {};
    /** {!number[]} */
    this.closeCodes.fatal = gatewayConfig.closeCodes.fatal ||
          config.defaults.closeCodes.fatal;
    /** {!number[]} */
    this.closeCodes.renewSession = gatewayConfig.closeCodes.renewSession ||
          config.defaults.closeCodes.renewSession;
  }

  /**
   * Initializes the WebSocket connection.
   */
  async connect() {
    // TODO: Be able to configure version and encoding
    // this.url += '?v=9&encoding=json';
    // TODO: Add sharding support
    this.webSocket = new WebSocket(this.url);
    this.webSocket.on('message',
        (data) => {
          this.receiveOperation(data);
        });
    this.webSocket.onclose = (code, reason) => {
      this.webSocket.terminate();
      this.emit('CLOSE', code, reason);
    };
    return new Promise((resolve, reject) => {
      this.webSocket.once('open', resolve);
      this.webSocket.once('close', reject);
    });
  };

  /**
   * Parses data from incoming gateway messages, and emits a new operation with
   * the provided opcode. Also updates cached last-received sequence number
   * for heartbeating.
   * @param {string} data - The received raw payload.
   */
  receiveOperation(data) {
    data = JSON.parse(data);
    if (data.s) {
      this.session.updateSeq(data.s);
    }
    if (!data.hasOwnProperty('op')) {
      console.error(data);
      throw new Error('Received gateway event with no opcode');
    }
    if (data.op === 0) {
      if (!this.emit(data.t, data.d)) {
        this.defaultOnEvent(data.t, data.d);
      }
    }
    this.operations.emit(data.op, data.t, data.d);
  };

  /**
   * Attempts to send the given data through the WebSocket.
   * @param {int} op
   * @param {Object} data
   */
  send(op, data) {
    if (!this.webSocket) {
      throw new Error('Tried to send data to gateway while disconnected.');
    }
    if (typeof op !== 'number' || !this.supportedOpCodes.includes(op)) {
      throw new Error('Tried to send invalid opcode to gateway.');
    }
    let payload = {op: op, d: data};
    payload = JSON.stringify(payload);
    this.webSocket.send(payload,
        (error) => {
          if (error) {
            throw error;
          }
        });
  }

  /**
   * Disconnect from the gateway, and attempt to reconnect and possibly resume.
   * @param {boolean} resume - Whether to resume the session or not.
   * @param {string} [reason]
   */
  async reconnect(resume, reason) {
    if (!resume) {
      // Throw away this session to prevent attempts at resuming
      this.session.discardSession();
    }
    // Overwrite onclose handler so we don't trigger the 'CLOSE' event
    this.webSocket.onclose = () => {
      this.webSocket.terminate();
      this.connect();
    };
    this.webSocket.close(4000, reason);
  };
};
