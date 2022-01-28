import {Gateway} from '../services/gateway.js';
import * as reconnect from '../subscribers/reconnect.js';
import {config} from '../config';

let gw;

beforeAll(() => {
  gw = new Gateway();
  reconnect.reconnectOnServerRequest(gw);
  gw.connect();
  gw.webSocket.emit('open');
});

test('Reconnect terminates connection',
    async () => {
      gw.reconnect();
      expect(gw.webSocket.terminate).toBeCalled();
    });

test('Natural close terminates connection',
    () => {
      gw.webSocket.emit('open');
      gw.webSocket.emit('close', 1000, '');
      expect(gw.webSocket.terminate).toBeCalled();
    });

test('Resume on WebSocket close',
    () => {
      const connect = jest.spyOn(gw, 'connect');
      connect.mockReset();
      gw.webSocket.emit('open');
      gw.webSocket.emit('close', 1000, '');
      expect(connect).toBeCalledTimes(1);
    });

test.each(config.defaults.closeCodes.renewSession)(
    'Renew session upon receiving close code %i',
    (code) => {
      const connect = jest.spyOn(gw, 'connect');
      connect.mockReset();
      gw.webSocket.emit('open');
      gw.webSocket.emit('close', code, '');
      expect(connect).toBeCalledTimes(1);
      expect(gw.session.getSession()).toBeFalsy();
    });
