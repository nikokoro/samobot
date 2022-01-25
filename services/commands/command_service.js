import {EventEmitter} from 'events';

import * as api from '../../gateway/request.js';

/** New Commands are registered as listeners with this CommandService. */
const CommandService = new EventEmitter();
CommandService.commands = [];
export default CommandService;

/** Command template class. */
export class Command {
  /**
    * Registers command and its handler with CommandService to be used.
    * @param {string} name - The keyword to call this command.
    * @param {object} help - Object with description and usage of command.
    * @param {string} help.usage - Usage of command.
    * @param {string} help.description - Description of command.
    * @param {function} callback - Function that returns a payload in the
    *   format of a Discord message object. Can be a Promise.
  */
  constructor(name, help, callback) {
    this.generateResponse = callback.bind(this);
    this.help = help;
    this.name = name;
    this.execute = this.execute.bind(this);
    CommandService.on(name, this.execute);
    CommandService.commands.push(this);
  }
  /**
   * Executes the command with the given parameters and message.
   *
   * @param {string} parameters - The parameters to call the command with.
   * @param {Object} message - The Discord message object calling the command.
   */
  async execute(parameters, message) {
    const payload = await this.generateResponse(parameters, message);

    // Passthrough data from generateResponse to postExecute
    let data;
    if ('data' in payload) {
      data = payload.data;
      delete payload.data;
    }

    // Make the message a reply
    payload.message_reference = {'message_id': message.id};

    api.post(`/channels/${message.channel_id}/messages`, payload);

    if (typeof this.postExecute === 'function') {
      this.postExecute(data);
    }
  }
}
