/**
  * Send an IDENTIFY payload through the given gateway.
  * @param {Gateway} gateway
  */
export async function authenticate(gateway) {
  const token = process.env.DBOT_TOKEN;
  const sent = gateway.send(2,
      {
        'token': token,
        'intents': 0b1000000001,
        'properties': {
          '$os': 'linux',
          '$browser': 'Samobot v' + process.env.SAMOBOT_VERSION,
          '$device': 'Samobot v' + process.env.SAMOBOT_VERSION,
        },
      });
  if (sent) {
    console.log('Sent IDENTITY, awaiting authentication.');
  }
  return new Promise((resolve, reject) => {
    gateway.events.once('READY', (state) => {
      gateway.session_id = state.session_id;
      console.log('Successfully authenticated - received new session ID.');
      resolve();
    });
  });
};
