import {parseCommand} from '../commands/index.js';

export default (message) => {
  /** Validate that this is a Samobot command. */
  if (message.content.length > 2) {
    if (message.content.slice(0, 2) == 's!') {
      const command = message.content.slice(2).split(' ');
      parseCommand(command, message);
    }
  }
};
