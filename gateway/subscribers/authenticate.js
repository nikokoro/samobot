/**
  * Authenticate the given Gateway upon receiving the opcode 10 'Hello',
  * or resume if there's a stored session ID.
  * @param {Gateway} gateway
  */
const authenticateOnHello = (gateway) => {
  gateway.operations.on(10, () => authenticate(gateway));
};

/**
  * Attempts to resume, otherwise sends a fresh 'IDENTIFY' payload.
  * @param {Gateway} gateway
  */
function authenticate(gateway) {
  if (!gateway.token) {
    throw new Error(`No Gateway token set! Please set to a valid Discord bot
        authentication token, or provide a token through the DBOT_TOKEN
        environment variable.`);
  }
  if (gateway.session.getSession()) {
    gateway.send(6,
        {
          'token': config.token,
          'session_id': id,
          'seq': seq,
        });
    // TEMP: Log once finished resuming.
    gateway.once('RESUMED', () => {
      console.log('Playback of missed events finished. Resuming '+
        'business-as-usual.');
    });
    return;
  } else {
    gateway.send(2,
        {
          'token': gateway.token,
          'intents': gateway.intents,
          'properties': {
            '$os': 'linux',
            '$browser': gateway.name,
            '$device': gateway.name,
          },
        });
  }
};

export {authenticateOnHello, authenticate};
