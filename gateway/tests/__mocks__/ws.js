import {EventEmitter} from 'events';

const terminate = jest.fn();

export const WebSocket = jest.fn(() => {
  const emitter = new EventEmitter();
  const close = jest.fn(
      (code, reason) => {
        emitter.emit('close', code, reason);
      });
  const onCloseListener = (emitter) => {
    return (code, reason) => {
      emitter.onclose(code, reason);
    };
  };
  emitter.send = jest.fn(
      (payload, fn) => {
        fn();
      });
  emitter.close = close;
  emitter.onclose = jest.fn();
  emitter.on('close', onCloseListener(emitter));
  emitter.terminate = terminate;
  return emitter;
});
