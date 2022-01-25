import CommandService from './command_service.js';
import {Command} from './command_service.js';

import {generatePayload as generateUnknownCommandPayload} from './unknown.js';

export default new Command(
    'help',
    {
      usage: 's!help [Name of command]',
      description: 'Print usages of each command. '+
        // 'Use reactions to navigate between pages. (WIP)\n'+
        'Query with a specific command to get a more detailed description.',
    },
    (command, message) => {
      command = command.split(' ')[0];
      if (command != '') {
        // Display help page for individual command
        const c = CommandService.commands.find((c) => c.name == command);
        if (c === undefined) {
          return generateUnknownCommandPayload(command);
        }
        // Display list of commands and usages
        // TODO: Be able to paginate this in the future
        return {
          'content': null,
          'embeds': [{
            'title': `s!${c.name}`,
            'color': 3579903,
            'fields': [
              {
                'name': 'Usage:',
                'value': `\`${c.help.usage}\``,
              },
              {
                'name': 'Description:',
                'value': c.help.description,
              },
            ],
          }],
        };
      }
      // Display command list and usages
      const commandList = CommandService.commands.map((c) => {
        return {
          'name': `s!${c.name}`,
          'value': `Usage: \`${c.help.usage}\``,
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
