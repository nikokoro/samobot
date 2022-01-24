const connect = require('./api/connect');
const package = require('./package.json');

console.log('Samobot v' + package.version);
console.log('Initializing Discord gateway client.');
connect();
