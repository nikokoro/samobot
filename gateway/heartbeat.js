let heartbeat;

const setup = (data, send) => {
  heartbeat = setInterval(respond(send), data.heartbeat_interval);
};

const respond = (send) => {
  send({'op': 1});
};

const stop = () => {
  clearInterval(heartbeat);
};

exports.setup = setup;
exports.respond = respond;
exports.stop = stop;
