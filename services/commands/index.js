import wiki from './wiki.js';

/**
 * Parse and execute a command by redirecting to the appropriate handler.
 *
 * @param {array} parameters - The full command issued, split by spaces.
 * @param {object} message - The raw message object of the command.
 */
const parseCommand = (parameters, message) => {
  if (parameters.length == 0) {
    // TODO: Display help on empty command
    return;
  }
  const command = parameters.shift();
  switch (command) {
    case 'wiki':
      wiki(parameters.join(' '), message);
      break;
    default:
  }
};

export {parseCommand};
