import {Gateway} from '../../gateway/connect.js';

export default (state) => {
  Gateway.session_id = state.session_id;
  console.log('Successfully authenticated - received new session ID.');
};
