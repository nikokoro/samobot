import {EventEmitter} from 'events';

import messageCreate from './message_create.js';

/**
 * Service to redirect events to their proper handlers.
 */
class EventService extends EventEmitter {
  /**
   * Constructs a new EventService.
   */
  constructor() {
    super();
    this.on('MESSAGE_CREATE', messageCreate);
  }
}

export default new EventService();
