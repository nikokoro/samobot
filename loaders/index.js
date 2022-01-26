import {Gateway} from '../gateway/index.js';

import {ApiService} from '../services/api.js';
import {CommandService, registerAllCommands} from '../services/commands.js';

import {subscribeToEvents} from '../subscribers/events.js';

export const load = async () => {
  const api = new ApiService();
  const gateway = new Gateway(api);
  await gateway.initConnection();
  const commands = new CommandService();
  registerAllCommands(commands);
  subscribeToEvents(gateway.events, commands, api);
  return gateway;
};
