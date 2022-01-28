import {createGateway} from '../gateway';

import {ApiService} from '../services/api.js';
import {CommandService, registerAllCommands} from '../services/commands.js';

import {subscribeToEvents} from '../subscribers/events.js';

export const load = async () => {
  const api = new ApiService();
  const gateway = createGateway(
      (await api.get('/gateway', false)).url + '?v=9&encoding=json',
      {
        name: 'Samobot',
        intents: 0b1000000001,
      });
  await gateway.connect();
  const commands = new CommandService();
  registerAllCommands(commands);
  subscribeToEvents(gateway, commands, api);
  // gateway.send(3,
  //     {
  //       'since': null,
  //       'activities': [{
  //         'name': 'Tokyo Afterschool Summoners',
  //         'type': 0,
  //       }],
  //       'status': 'online',
  //       'afk': false,
  //     },
  // );
  return gateway;
};

// TODO: implement app-specific functions
