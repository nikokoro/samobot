let heartbeat;
let acknowledged = true;

/**
 * Send a heartbeat signal through the given Gateway.
 * @param {Gateway} gateway
 */
const beat = (gateway) => {
  if (!acknowledged) {
    console.warn('Heartbeat not acknowledged. Connection possibly dead; '+
      'reconnecting.');
    gateway.reconnect(true);
  }
  gateway.send(1, gateway.seq);
  gateway.send(3,
      {
        'since': null,
        'activities': [{
          'name': 'Tokyo Afterschool Summoners',
          'type': 0,
        }],
        'status': 'online',
        'afk': false,
      },
  );
  acknowledged = false;
};

/**
 * Sets up heartbeating to the given Gateway.
 *
 * @param {Gateway} gateway
 * @param {int} interval - The time in milliseconds to wait in between beats.
 */
const setup = (gateway, interval) => {
  console.log('Heartbeat established: updating every ' +
      interval + 'ms.');
  heartbeat = setInterval(() => beat(gateway), interval);
};

const ack = () => {
  acknowledged = true;
};

const stop = () => {
  clearInterval(heartbeat);
};

export {beat, setup, ack, stop};
