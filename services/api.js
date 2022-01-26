import got from 'got';
import {EventEmitter} from 'events';

/**
 * Service that manages requests to the Discord REST API.
 */
export class ApiService extends EventEmitter {
  /**
   * Constructs a default APIService, which routes API calls to either the URL
   * specified in the environment variable API_URL, or the default Discord API
   * URL, 'https://discord.com/api'.
   * @param {boolean} testing - Doesn't send requests when this is enabled.
   */
  constructor(testing) {
    super();
    this.url = process.env.API_URL || 'https://discord.com/api';
    if (!testing) {
      this.on('GET', (endpoint, authenticated, resolve, reject) => {
        return got.get(
            (process.env.API_URL || 'https://discord.com/api') + endpoint,
            {
              headers: {
                'Authorization': authenticated ?
                `Bot ${process.env.dbot_token}` : '',
              },
            },
        ).json().then(resolve).catch(reject);
      });
      this.on('POST', (endpoint, payload, authenticated, res, rej) => {
        got.post(
            this.url+endpoint,
            {
              json: payload,
              headers: {
                'Authorization': authenticated ?
                `Bot ${process.env.dbot_token}` : '',
              },
            },
        ).json().then(resolve).catch(reject);
      });
    }
  }

  /**
   * Validates endpoint string.
   * @param {string} endpoint
   * @throws Will throw an error if endpoint is invalid.
   */
  validateEndpoint(endpoint) {
    // TODO: better endpoint validation
    if (typeof endpoint !== 'string') {
      throw new Error('Endpoint must be a string');
    }
  }

  /**
    * Sends a GET request to the Discord API.
    * @param {string} endpoint - The endpoint of the API to send to.
    *  Must start with a forward slash (/).
    * @param {string} [authenticated=true] - Whether to send authorization
    *  headers with this request.
    * @return {Promise}
    */
  get(endpoint, authenticated=true) {
    this.validateEndpoint(endpoint);
    return new Promise((res, rej) => {
      /**
        * GET API request.
        * @event APIService#GET
        * @param {string} endpoint - Endpoint starting with '/' to be appended
        *     on the API URL.
        * @param {boolean} authenticated
        * @param {function} resolve - Resolve the Promise of the caller.
        * @param {function} reject - Reject the Promise of the caller.
        */
      this.emit('GET', endpoint, authenticated, res, rej);
    });
  };

  /**
    * Sends a POST request to the Discord API.
    * @param {string} endpoint - The endpoint of the API to send to.
    *  Must start with a forward slash (/).
    * @param {string} payload - The JSON payload to send.
    * @param {string} [authenticated=true] - Whether to send authorization
    *  headers with this request.
    * @return {Promise}
    */
  post(endpoint, payload, authenticated=true) {
    this.validateEndpoint(endpoint);
    return new Promise((res, rej) => {
      /**
        * POST API request.
        * @event APIService#GET
        * @param {string} endpoint - Endpoint starting with '/' to be appended
        *  on the API URL.
        * @param {object} payload - The JSON payload to send.
        * @param {boolean} authenticated
        * @param {function} resolve - Resolve the Promise of the caller.
        * @param {function} reject - Reject the Promise of the caller.
        */
      this.emit('POST', endpoint, payload, authenticated, res, rej);
    });
  };
};
