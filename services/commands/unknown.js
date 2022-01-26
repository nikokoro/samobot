export const unknownCommandPayload = (input) => {
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
