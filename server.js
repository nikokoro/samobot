import connect from './gateway/connect.js';
import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const pjson = require('./package.json');

require('dotenv').config();
if (!process.env.DBOT_TOKEN) {
  console.error(`No TOKEN environment variable set! Please set to a valid
    Discord bot authentication token.`);
  process.exit(1);
}

process.env['SAMOBOT_VERSION'] = pjson.version;
console.log('Samobot v' + process.env.SAMOBOT_VERSION);
console.log('Initializing Discord gateway client.');
connect();
