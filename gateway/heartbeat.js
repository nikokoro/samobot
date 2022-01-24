let heartbeat;
let gateway;
let acknowledged = true;

/**
 * Use the given WebSocket to emit events.
 *
 * @param {WebSocket} socket - The WebSocket to use.
 */
const linkGateway = (socket) => {
  gateway = socket;
};

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
  if (!acknowledged) {
    console.error('Not acknowledged!');
    process.exit(1);
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
  console.log('Heartbeat acknowledged.');
  acknowledged = true;
};

const stop = () => {
  clearInterval(heartbeat);
};

export {linkGateway, setup, beat, ack, stop};
