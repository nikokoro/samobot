import {WebSocket} from 'ws';

import * as eventHandler from './event_handler.js';
import * as api from './request.js';

let gateway = null;

const connect = async () => {
  let gatewayURL;
  try {
    gatewayURL = await api.get('/gateway', false).json();
  } catch (err) {
    console.error(error.response.body);
    process.exit(1);
  }
  gateway = new WebSocket(gatewayURL.url + '?v=9&encoding=json');
  gateway.seq = null;

  gateway.on('message', eventHandler.receiveEvent);
  gateway.on('close', eventHandler.close);
  gateway.on('open', sendIdentify);

  return gateway;
};

const sendIdentify = () => {
  console.log('Initialized connection; authenticating.');
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
export {gateway};
