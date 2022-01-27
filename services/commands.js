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
    return await this.commands[keyword].execute(parameters, message);
  }

  /**
   * Register this command with the CommandService.
   * @param {Command} command - The command to register.
   */
  register(command) {
    if (this.commands[command.name]) {
      throw new Error('Tried to register duplicate command');
    }
    this.commands[command.name] = command;
  }
};

export {registerAllCommands} from './commands/index.js';
