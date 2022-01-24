import * as heartbeat from './heartbeat.js';

let gateway = null;

/**
 * Use the given WebSocket to emit events.
 *
 * @param {WebSocket} socket - The WebSocket to use.
 */
const linkGateway = (socket) => {
  gateway = socket;
  heartbeat.linkGateway(socket);
};

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
      console.log(`Event of type "${data.t}" received`);
      break;
    case 10:
      heartbeat.setup(data.d, gateway.send);
    case 1:
      // TODO: reconnect on no heartbeat ack
      heartbeat.beat(gateway.send);
      break;
    // TODO: implement more opcode responses
    case 11:
      heartbeat.ack();
      break;
    default:
      // TODO: handle this by restarting connection?
      console.error('Received message without opcode.');
  }
};

/**
 * Handles a closed connection.
 */
const close = () => {
  gateway = null;
};

export {linkGateway, receiveEvent, close};
