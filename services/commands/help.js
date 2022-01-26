import {Command} from './index.js';
import {unknownCommandPayload} from './unknown.js';

const keyword = 'help';
const help = {
  usage: 's!help [Name of command]',
  description: 'Print usages of each command. '+
  // 'Use reactions to navigate between pages. (WIP)\n'+
  'Query with a specific command to get a more detailed description.',
};

/**
 * Create the 'help' command and register it with the given CommandService.
 * @param {CommandService} service
 * @return {Command}
 */
export const helpCommand = (service) => {
  return new Command(
      keyword,
      help,
      service,
      (command, message) => {
        command = command.split(' ')[0];
        if (command != '') {
        // Display help page for individual command
          const c = events.commands.find((c) => c.name == command);
          if (c === undefined) {
            return unknownCommandPayload(command);
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
};
