import {WebSocket} from 'ws';

import * as eventHandler from './event_handler.js';
import * as api from './request.js';

import {handleDisconnect} from './reconnect.js';

let gateway = null;

/**
 * Initializes a connection without authenticating.
 * @return {Promise} Resolves when the connection is open.
 */
const initConnection = async () => {
  const gatewayURL = await api.get('/gateway', false).json();
  // TODO: Add sharding support
  gateway = new WebSocket(gatewayURL.url + '?v=9&encoding=json');

  gateway.on('message', eventHandler.receiveEvent);
  gateway.on('close', handleDisconnect);
  return new Promise((resolve) => {
    gateway.on('open', resolve);
  });
};

/** Begin first connection to Discord gateway. */
const connect = () => {
  initConnection().then(authenticate);
};

/** Send an IDENTIFY payload. */
const authenticate = () => {
  const token = process.env.DBOT_TOKEN;
  gateway.send(JSON.stringify({
    'op': 2,
    'd': {
      'token': token,
      'intents': 0b1000000001,
      'properties': {
        '$os': 'linux',
        '$browser': 'Samobot v' + process.env.SAMOBOT_VERSION,
        '$device': 'Samobot v' + process.env.SAMOBOT_VERSION,
      },
      'presence': {
        'since': (new Date()).getTime(),
        'status': 'online',
        'activities:': [{
          'name': 'Tokyo Afterschool Summoners',
          'type': 0,
        }],
        'afk': 'false',
      },
    },
  }));
};

export default connect;
export {gateway, authenticate, initConnection};
