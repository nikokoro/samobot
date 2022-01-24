import got from 'got';

// TODO: create template for outgoing API requests
export default (channel, payload) => {
  try {
    got.post(`https://discord.com/api/channels/${channel}/messages`, {
      json: payload,
      headers: {
        'Authorization': `Bot ${process.env.DBOT_TOKEN}`,
      },
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
