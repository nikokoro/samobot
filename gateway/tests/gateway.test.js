import {Gateway} from '../services/gateway.js';
import {SessionService} from '../services/session.js';

let gw;

beforeAll(() => {
  gw = new Gateway();
  gw.connect();
  gw.webSocket.emit('open');
});

test('Gateway has SessionService by default',
    () => {
      expect(gw.session).toBeInstanceOf(SessionService);
    });
