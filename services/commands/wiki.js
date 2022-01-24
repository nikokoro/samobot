import * as api from '../../gateway/request.js';

const createPayload = (term, message) => {
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
};

export default (term, message) => {
  const payload = createPayload(term, message);
  api.post(`/${channel}/messages`, payload);
};

export {createPayload as response};
