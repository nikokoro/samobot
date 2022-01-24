import got from 'got';

/**
 * Sends a POST request to the Discord API.
 *
 * @param {string} endpoint - The endpoint of the API to send to.
 *  Must start with a forward slash (/).
 * @param {string} payload - The JSON payload to send.
 * @param {string} [authenticated=true] - Whether to send authorization
 *  headers with this request.
 * @return {Promise}
 */
const post = (endpoint, payload, authenticated=true) => {
  if (typeof endpoint !== 'string') {
    throw new Error('Endpoint must be a string');
  }
  return got.post(
      (process.env.API_URL || 'https://discord.com/api')+endpoint,
      {
        json: payload,
        headers: {
          'authorization': authenticated ?
            `bot ${process.env.dbot_token}` : '',
        },
      },
  ).json();
};

/**
 * Sends a GET request to the Discord API.
 *
 * @param {string} endpoint - The endpoint of the API to send to.
 *  Must start with a forward slash (/).
 * @param {string} [authenticated=true] - Whether to send authorization
 *  headers with this request.
 * @return {Promise}
 */
const get = (endpoint, authenticated=true) => {
  if (typeof endpoint !== 'string') {
    throw new Error('Endpoint must be a string');
  }
  return got.get(
      (process.env.API_URL || 'https://discord.com/api')+endpoint,
      {
        headers: {
          'authorization': authenticated ?
            `bot ${process.env.dbot_token}` : '',
        },
      },
  ).json();
};

export {post, get};
