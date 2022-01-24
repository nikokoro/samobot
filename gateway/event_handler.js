import * as heartbeat from './heartbeat.js';
import EventService from '../services/events/index.js';
import {gateway} from './connect.js';

/**
 * Parses data from incoming gateway events, and routes them to the appropriate
 * handler module.
 * @param {string} data - The received raw payload.
 */
const receiveEvent = (data) => {
  if (!gateway) {
    console.error('Tried to receive event, but no WebSocket connected');
    return;
  }
  try {
    data = JSON.parse(data);
    handleDispatch(data);
  } catch (err) {
    console.error(err);
  }
};

/**
 * Handles a default event dispatch of opcode 0.
 *
 * @param {object} data - The event payload.
 */
const handleDispatch = (data) => {
  gateway.seq = data.s;
  switch (data.op) {
    case 0:
      if (!EventService.emit(data.t, data.d)) {
        console.log(`Received event of type ${data.t}; doing nothing.`);
      }
      break;
    case 10:
      heartbeat.setup(data.d);
    case 1:
      // TODO: reconnect on no heartbeat ack
      heartbeat.beat();
      break;
    // TODO: implement more opcode responses
    case 11:
      heartbeat.ack();
      break;
    default:
      // TODO: handle this by restarting connection?
      console.error('Received message without opcode.');
      console.error(data);
  }
};

/**
 * Handles a closed connection.
 */
const close = () => {
  gateway = null;
};

export {receiveEvent, close};
