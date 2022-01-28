const FATAL_CLOSE_CODES = [4004, 4006, 4010, 4011, 4012, 4013, 4014];
const RENEW_SESSION_CLOSE_CODES = [4003, 4007, 4009];
const SUPPORTED_OPCODES = [1, 2, 3, 4, 6, 8];

export const defaults = {
  name: 'A Discord Bot',
  intents: 0,
  closeCodes: {
    fatal: FATAL_CLOSE_CODES,
    renewSession: RENEW_SESSION_CLOSE_CODES,
  },
  supportedOpCodes: SUPPORTED_OPCODES,
};
