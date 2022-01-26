import {unknownCommandPayload} from './commands/unknown.js';

/**
 * Service that parses commands, and routes them to the registered handler.
 */
export class CommandService {
  /** Constructs a new CommandService. */
  constructor() {
    this.commands = {};
  }

  /**
  * Parse and execute a command by redirecting to the appropriate handler.
  * @param {string} keyword - The command issued.
  * @param {string} parameters - The parameters issued to the command.
  * @param {object} message - The raw message object of the command.
  * @return {Message} The response of the command in message form.
  */
  async executeCommand(keyword, parameters, message) {
    if (!this.commands.hasOwnProperty(keyword)) {
      return unknownCommandPayload(keyword);
    }
    return await this.commands[keyword].execute();
  }

  /**
   * Register this command with the CommandService.
   * @param {string} keyword - The keyword to execute this command with.
   * @param {Command} command - The command to execute.
   */
  register(keyword, command) {
    if (this.commands[keyword]) {
      throw new Error('Tried to register duplicate command');
    }
    this.commands[keyword] = command;
  }
};

export {registerAllCommands} from './commands/index.js';
