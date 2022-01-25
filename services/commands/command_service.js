import {EventEmitter} from 'events';

import * as api from '../../gateway/request.js';

/** New Commands are registered as listeners with this CommandService. */
const CommandService = new EventEmitter();
export default CommandService;

/** Command template class. */
export class Command {
  /**
    * Registers command and its handler with CommandService to be used.
    * @param {string} name - The keyword to call this command.
    * @param {function} callback - Function that returns a payload in the
    *   format of a Discord message object. Can be a Promise.
  */
  constructor(name, callback) {
    this.generateResponse = callback.bind(this);
    this.execute = this.execute.bind(this);
    CommandService.on(name, this.execute);
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

    api.post(`/channels/${message.channel_id}/messages`, payload);

    if (typeof this.postExecute === 'function') {
      this.postExecute(data);
    }
  }
}
