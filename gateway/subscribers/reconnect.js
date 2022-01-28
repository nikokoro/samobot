/**
 * Reconnect this Gateway upon receiving operations requesting it, and on
 * certain close codes.
 * @param {Gateway} gateway
 */
const reconnectOnServerRequest = (gateway) => {
  gateway.operations.on(7, () => gateway.reconnect(true));
  gateway.operations.on(9, (type, data) => gateway.reconnect(data));
  gateway.on('CLOSE',
      (code, reason) => {
        handleDisconnect(gateway, code, reason);
      });
};

/**
 * Reconnect to and/or resume a Gateway depending on close code.
 *
 * @param {Gateway} gateway
 * @param {int} code - The close code received by the gateway.
 * @param {string} reason - The reason for closing the connection.
 * @throws Will throw an error if code is fatal and we shouldn't reconnect.
 */
const handleDisconnect = (gateway, code, reason) => {
  console.log('Disconnected from gateway with code '+code);
  if (reason.toString()) {
    console.log('Reason:', reason.toString());
  }
  if (gateway.closeCodes.fatal.includes(code)) {
    throw new Error(`CODE ${code}: ${reason.toString()}`);
  }
  if (!gateway.closeCodes.renewSession.includes(code)) {
    gateway.session.discardSession();
  }
  gateway.connect();
};

export {reconnectOnServerRequest, handleDisconnect};
