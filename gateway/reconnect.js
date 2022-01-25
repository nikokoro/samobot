import {EventEmitter} from 'events';

import {gateway, authenticate, initConnection} from './connect.js';

const tryResume = async (seq, id) => {
  console.log('Attempting to reconnect...');
  await initConnection();
  if (id) {
    const resumePayload = {
      'op': 6,
      'd': {
        'token': process.env.DBOT_TOKEN,
        'session_id': id,
        'seq': seq,
      },
    };
    gateway.send(JSON.stringify(resumePayload));
  } else {
    console.log('No stored session ID. Re-authenticating...');
    authenticate();
  }
};

const forceNewSession = async () => {
  console.log('Attempting to reconnect, forcing new session...');
  await initConnection();
  console.log('Re-authenticating...');
  authenticate();
};

const ReconnectHandler = new EventEmitter();

ReconnectHandler.on(4000, tryResume);
ReconnectHandler.on(4001, tryResume);
ReconnectHandler.on(4002, tryResume);
ReconnectHandler.on(4003, forceNewSession);
ReconnectHandler.on(4005, tryResume);
ReconnectHandler.on(4007, forceNewSession);
ReconnectHandler.on(4008, tryResume);
ReconnectHandler.on(4009, forceNewSession);

/**
 * Disconnect from the gateway, and attempt to reconnect and resume.
 * @param {boolean} resume - Whether to resume the session or not.
 */
export const reconnect = async (resume) => {
  console.log('Received signal to reconnect '+
    resume ? 'and resume.' : 'without resuming.');
  if (!resume) {
    // Throw away this session to prevent attempts at resuming
    console.log('Throwing away session_id...');
    gateway.session_id = null;
  }
  console.log('Disconnecting gateway...');
  gateway.close(4000);
};

/**
 * Handle a disconnection, and emit the close code to the ReconnectHandler
 * @param {number} code - The close code received by the gateway.
 * @param {string} reason - The reason for closing the connection.
 */
export const handleDisconnect = (code, reason) => {
  console.log('Disconnected from gateway with code '+code);
  const seq = gateway.seq;
  const sessionId = gateway.session_id;
  if (reason) {
    console.warn('Reason:', reason);
  }
  if (!ReconnectHandler.emit(code, seq, sessionId)) {
    console.error('Cannot reconnect.');
    throw new Error(reason);
  }
};
