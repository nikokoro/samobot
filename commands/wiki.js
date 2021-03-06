import {Command} from './index.js';

const keyword = 'wiki';
const help = {
  usage: 's!wiki <Name of housamo.wiki page | Name/alias of unit>',
  description: 'Pulls up a link to the specified page on  '+
    '`housamo.wiki`. Will match queries like `s!wiki Wakan`, '+
    '`s!wiki wakantanka`, and `s!wiki wAkAN tAnkA` to the appropriate '+
    'page. (WIP)\n\n'+
    'Use `s!alias` to add new aliases to match to transients.',
};

/**
 * Create the 'wiki' command and register it with the given CommandService.
 *
 * @param {CommandService} service
 * @return {Command}
 */
export const wikiCommand = (service) => {
  return new Command(
      keyword,
      help,
      service,
      (term, message) => {
        // TODO: fuzzy matching for wiki terms
        const underscoredTerm = term.split(' ').join('_');
        const link = 'https://housamo.wiki/'+underscoredTerm;
        return {
          'content': null,
          'embeds': [{
            'title': 'Link to wiki page',
            'description': `Click to redirect to [${term}](${link})`,
            'url': link,
            'color': 5814783,
          }],
        };
      });
};
