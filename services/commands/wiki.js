import sendMessage from '../../gateway/send_message.js';

export default (term, message) => {
  // TODO: fuzzy matching for wiki terms
  const underscoredTerm = term.split(' ').join('_');
  const link = 'https://housamo.wiki/'+underscoredTerm;
  const payload = {
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
  sendMessage(message.channel_id, payload);
};
