/** Commands */
import {wikiCommand} from './wiki.js';
import {helpCommand} from './help.js';

/**
 * Register all available commands with the given CommandService.
 * @param {CommandService} commands
 * @return {object} An object of the Commands that were registered.
 */
export const registerAllCommands = (commands) => {
  return {
    wiki: wikiCommand(commands),
    help: helpCommand(commands),
  };
};

/** Command template class. */
export class Command {
  /**
    * Registers command and its handler with CommandService to be used.
    * @param {string} name - The keyword to call this command.
    * @param {object} help
    * @param {string} help.usage - Usage of command.
    * @param {string} help.description - Description of command.
    * @param {CommandService} service
    * @param {function} callback - Function that returns a payload in the
    *     format of a Discord message object. Can be a Promise.
  */
  constructor(name, help, service, callback) {
    this.execute = callback.bind(this);
    this.help = help;
    this.name = name;

    service.register(this);
  }
}
