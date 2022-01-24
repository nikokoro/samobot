import {EventEmitter} from 'events';

import wiki from './wiki.js';
import unknown from './unknown.js';

/** Register commands and their handlers with CommandService to be used. */
const CommandService = new EventEmitter();
CommandService.on('wiki', wiki);
// CommandService.on('help', help);
// CommandService.on('', help);

/**
 * Parse and execute a command by redirecting to the appropriate handler.
 *
 * @param {string} command - The command keyword issued.
 * @param {string} parameters - The parameters issued to the command.
 * @param {object} message - The raw message object of the command.
 */
const parseCommand = (command, parameters, message) => {
  if (!CommandService.emit(command, parameters, message)) {
    unknown(command, message);
  }
};

export {parseCommand};
