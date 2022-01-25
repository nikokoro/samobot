import CommandService from './command_service.js';
import {Command} from './command_service.js';

export default new Command(
    'help',
    {
      usage: 's!help [Name of command]',
      description: 'Print usages of each command. '+
        'Use reactions to navigate between pages.\n'+
        'Query with a specific command to get a more detailed description.',
    },
    (command, message) => {
      // TODO: Print help page
      const commandList = CommandService.commands.map((c) => {
        return {
          'name': `\`${c.name}\``,
          'value': c.help.usage,
        };
      });
      return {
        'content': null,
        'embeds': [{
          'title': 'List of available commands:',
          'color': 3579903,
          'fields': commandList,
        }],
      };
    });
