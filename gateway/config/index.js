import dotenv from 'dotenv';

import {defaults} from './defaults.js';

dotenv.config();

export const config = {
  defaults,
  token: process.env.DBOT_TOKEN,
};
