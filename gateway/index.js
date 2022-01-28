import * as load from './loaders';

/**
 * Creates and returns a new Gateway.
 * @param {Object} [config] - See Gateway constructor for configuration options.
 * @see Gateway#constructor
 * @returns
 */
const createGateway = (url, config) => {
  return load.loadDefault(url, config);
};

/**
 * Creates and returns a new Gateway with an existing session.
 * @param {string} session
 * @param {Object} [config]
 * @returns
 */
const createGatewayWithSession = (url, session, config) => {
  if (!config) {
    config = {};
  }
  config.session = new SessionService(session);
  return load.loadDefault(url, config);
};

/**
 * Creates and returns a new Gateway, using the given Redis client to manage
 * the session state.
 * @param {RedisClient} client
 * @param {Object} [config]
 * @see {@link https://github.com/redis/node-redis node-redis}
 * @returns
 */
const createGatewayWithRedis = (url, client, config) => {
  // TODO: Create RedisSessionService
  if (!config) {
    config = {};
  }
  // config.session = new RedisSessionService(client);
  return load.loadDefault(url, config);
};

export {Gateway} from './services/gateway.js';
export {createGateway, createGatewayWithSession, createGatewayWithRedis};
