import {Gateway} from '../services/gateway.js';
import {reconnectOnServerRequest} from '../subscribers/reconnect.js';
import {subscribeToHeartbeatOperations} from '../subscribers/heartbeat.js';
import {authenticateOnHello} from '../subscribers/authenticate.js';
// TODO: Plain loader
// TODO: Redis loader (for existing session state, sharding, etc.)

export const loadDefault = (url, config) => {
  const gw = new Gateway(url, config);
  reconnectOnServerRequest(gw);
  subscribeToHeartbeatOperations(gw);
  authenticateOnHello(gw);
  return gw;
};
