import * as api from '../../gateway/request.js';

export default (command, message) => {
  const payload = {
    'content': null,
    'embeds': [{
      'title': 'Unknown command',
      'description': `I'm not sure what ${command} means. Type \`s!help\` `+
        `for a list of commands.`,
      'color': 0xff3333,
    }],
    'message_reference': {
      'message_id': message.id,
    },
  };
  api.post(`/channels/${message.channel_id}/messages`, payload);
};
