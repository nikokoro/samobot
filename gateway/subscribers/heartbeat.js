let heartbeat;
let acknowledged = true;

/**
 * Subscribe to and set up heartbeating operations on the given Gateway.
 * @param {Gateway} gateway
 */
const subscribeToHeartbeatOperations = (gateway) => {
  gateway.operations.on(1, () => beat(gateway));
  gateway.operations.once(10, (type, data) =>
    setup(gateway, data.heartbeat_interval));
  gateway.operations.on(11, ack);
  gateway.once('CLOSE', stop);
};

/**
 * Sends a heartbeat to the given gateway. Also updates presence.
 * @param {Gateway} gateway
 */
const beat = (gateway) => {
  if (!acknowledged) {
    gateway.reconnect(true, 'Heartbeat not acknowledged');
    return;
  }
  gateway.send(1, gateway.seq);
  if (gateway.presence) {
    gateway.send(3, gateway.presence);
  }
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

export {subscribeToHeartbeatOperations, setup, beat, ack, stop};
