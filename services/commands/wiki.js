import {Command} from './command_service.js';

export default new Command('wiki', (term, message) => {
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
    'message_reference': {
      'message_id': message.id,
    },
  };
});
