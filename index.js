import dotenv from 'dotenv';
import {createRequire} from 'module';

import {load} from './loaders/index.js';

const require = createRequire(import.meta.url);
const pjson = require('./package.json');
process.env['SAMOBOT_VERSION'] = pjson.version;

dotenv.config();

console.log('Samobot v' + process.env.SAMOBOT_VERSION);
console.log('Initializing.');
load();
