import * as api from '../../gateway/request.js';

/**
 * Returns an 'unknown command' message payload.
 *
 * @param {string} input - The invalid command issued.
 * @return {object} The Discord message payload.
 */
const generatePayload = (input) => {
  if (input == '') {
    input = 'that';
  } else {
    input = `\`${input}\``;
  }
  return {
    'content': null,
    'embeds': [{
      'title': 'Unknown command',
      'description': `I'm not sure what ${input} means. Type \`s!help\` `+
        `for a list of commands.`,
      'color': 0xff3333,
    }],
  };
};

export default (command, message) => {
  const payload = generatePayload(command);
  // Make the message a reply
  payload.message_reference = {'message_id': message.id};

  api.post(`/channels/${message.channel_id}/messages`, payload);
};

export {generatePayload};
