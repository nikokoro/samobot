import {authenticate} from './authenticate.js';

// TODO: Following close codes should be in configuration..?

/**
  * Fatal close codes.
  * @type {!Array<number>}
  */
const FATAL_CLOSE_CODES = [4004, 4006, 4010, 4011, 4012, 4013, 4014];

/**
  * Close codes indicating we shouldn't attempt to resume.
  * @type {!Array<number>}
  */
const RENEW_SESSION_CLOSE_CODES = [4003, 4007, 4009];

const tryResume = async (gateway) => {
  const seq = gateway.seq;
  const id = gateway.session_id;
  console.log('Attempting to reconnect...');
  await gateway.initConnection();
  if (id) {
    gateway.send(6, {
      'token': process.env.DBOT_TOKEN,
      'session_id': id,
      'seq': seq,
    });
    gateway.events.once('RESUME', () => {
      console.log('Playback of missed events finished. Resuming '+
        'business-as-usual.');
    });
  } else {
    console.log('No stored session ID. Re-authenticating...');
    authenticate(gateway);
  }
};

const forceNewSession = async (gateway) => {
  console.log('Attempting to reconnect, forcing new session...');
  await gateway.initConnection();
  console.log('Re-authenticating...');
  authenticate(gateway);
};

/**
 * Reconnect to and/or resume a Gateway depending on close code.
 *
 * @param {Gateway} gateway
 * @param {int} code - The close code received by the gateway.
 * @param {string} reason - The reason for closing the connection.
 * @throws Will throw an error if code is fatal and we shouldn't reconnect.
 */
export const handleDisconnect = (gateway, code, reason) => {
  console.log('Disconnected from gateway with code '+code);
  if (reason) {
    console.warn('Reason:', reason.toString());
  }
  if (FATAL_CLOSE_CODES.includes(code)) {
    throw new Error(reason);
  }
  if (RENEW_SESSION_CLOSE_CODES.includes(code)) {
    forceNewSession(gateway);
  } else {
    tryResume(gateway);
  }
};
