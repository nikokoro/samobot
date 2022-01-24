import * as heartbeat from './heartbeat.js';
import EventHandler from '../services/events/index.js';
import {gateway} from './connect.js';
import {EventEmitter} from 'events';
import {TestGatewayHandler} from '../test/gateway/event_handler.js';

const GatewayHandler = process.env.ENVIRONMENT === 'test' ?
  TestGatewayHandler :
  new EventEmitter();

if (process.env.ENVIRONMENT !== 'test') {
  GatewayHandler.on(0, (type, data) => {
    if (!EventHandler.emit(type, data)) {
      console.log(`Received event of type ${type}; doing nothing.`);
    }
  });
  GatewayHandler.on(1, heartbeat.beat);
  GatewayHandler.on(10, (type, data) => heartbeat.setup(data));
  GatewayHandler.on(11, heartbeat.ack);
  // TODO: Handle all receivable opcodes
}

/**
 * Parses data from incoming gateway events, and emits a new event with the
 * provided opcode.
 *
 * Also updates cached last-received event sequence number for heartbeating.
 *
 * @param {string} data - The received raw payload.
 * @return {integer} The opcode of the event.
 */
const receiveEvent = (data) => {
  if (!gateway) {
    console.error('Tried to receive event, but no WebSocket connected');
    return;
  }
  data = JSON.parse(data);
  gateway.seq = data.s;
  if (!GatewayHandler.emit(data.op, data.t, data.d)) {
    console.log('Received message without opcode.');
    console.log(data.d);
    // TODO: Handle this by reconnecting.
  }
  return data.op;
};

const close = (code, reason) => {
  // TODO: Reconnect based on close code
};

export {receiveEvent, close};
