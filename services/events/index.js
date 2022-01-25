import {EventEmitter} from 'events';

import messageCreate from './message_create.js';
import ready from './ready.js';
import resume from './resume.js';

/**
 * Handler that receives Discord events like messages, DMs, Guild updates, etc.
 * and emits them to different event listeners.
 */
const EventHandler = new EventEmitter();

EventHandler.on('MESSAGE_CREATE', messageCreate);
EventHandler.on('READY', ready);
EventHandler.on('RESUME', resume);

export default EventHandler;
