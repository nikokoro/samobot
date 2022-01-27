/**
 * Subscribes to the given EventEmitter.
 * @param {EventEmitter} events
 * @param {CommandService} commands
 * @param {ApiService} api
 */
export const subscribeToEvents = (events, commands, api) => {
  /** Validate new messages as potential commands. */
  events.on('MESSAGE_CREATE', async (message) => {
    if (message.content.length > 2) {
      if (message.content.slice(0, 2) == 's!') {
        const parameters = message.content.slice(2).split(' ');
        const command = parameters.shift();
        const response =
            await commands
                .executeCommand(command, parameters.join(' '), message);
        // Make the response a reply
        response.message_reference = {
          message_id: message.id,
        };
        api.post(`/channels/${message.channel_id}/messages`, response);
      }
    }
  });
};
