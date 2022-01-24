const got = require('got');
const ws = require('ws');

const heartbeat = require('./heartbeat');

const connect = async () => {
  let gatewayURL;
  try {
    gatewayURL = await got.get('https://discord.com/api/gateway').json();
  } catch (err) {
    console.error(error.response.body);
    process.exit(1);
  }
  const gateway = new ws.WebSocket(gatewayURL.url + '?v=9&encoding=json');
  /** Parse gateway messages, and connect to appropriate endpoints */
  gateway.on('message', (data) => {
    try {
      data = JSON.parse(data);
      switch (data.op) {
        case 10:
          heartbeat.setup(data.d, gateway.send);
        case 1:
          heartbeat.respond(gateway.send);
          break;
        // TODO: implement more opcode responses
        default:
          console.error('Received message without opcode.');
          // TODO: handle this by restarting connection?
      }
    } catch (err) {
      console.error(err);
    }
  });
};

module.exports = connect;
