import CommandService from './command_service.js';

/** Commands */
import './wiki.js';
import issueUnknownCommand from './unknown.js';

/**
 * Parse and execute a command by redirecting to the appropriate handler.
 *
 * @param {string} command - The command keyword issued.
 * @param {string} parameters - The parameters issued to the command.
 * @param {object} message - The raw message object of the command.
 */
const parseCommand = (command, parameters, message) => {
  if (!CommandService.emit(command, parameters, message)) {
    issueUnknownCommand(command, message);
  }
};

export {parseCommand};
