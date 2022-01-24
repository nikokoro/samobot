import {EventEmitter} from 'events';

/**
 * Handler that emits gateway events as opcodes. For testing purposes.
 */
const TestGatewayHandler = new EventEmitter();

export default TestGatewayHandler;
