import {gateway} from 'connect.js';

let heartbeat;
let acknowledged = true;

/**
 * Setup heartbeat on specified interval from 'Hello' event.
 *
 * @param {object} data - The raw payload received from the event.
 */
const setup = (data) => {
  console.log('Heartbeat established: updating every ' +
    data.heartbeat_interval + 'ms.');
  heartbeat = setInterval(beat, data.heartbeat_interval);
};

const beat = () => {
  if (!gateway) {
    throw new Error('Tried to send heartbeat, but gateway is not set up');
  }
  if (!acknowledged) {
    throw new Error('Heartbeat not acknowledged by server');
    // TODO: Actually reconnect to the gateway
  }
  gateway.send(JSON.stringify({'op': 1, 'd': gateway.seq}));
  gateway.send(JSON.stringify({
    'op': 3,
    'd': {
      'since': null,
      'activities': [{
        'name': 'Tokyo Afterschool Summoners',
        'type': 0,
      }],
      'status': 'online',
      'afk': false,
    },
  }));
  acknowledged = false;
};

const ack = () => {
  acknowledged = true;
};

const stop = () => {
  clearInterval(heartbeat);
};

export {setup, beat, ack, stop};
