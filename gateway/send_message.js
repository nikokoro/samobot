import got from 'got';

export default (channel, payload) => {
  try {
    got.post(`https://discord.com/api/channels/${channel}/messages`, {
      json: payload,
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
