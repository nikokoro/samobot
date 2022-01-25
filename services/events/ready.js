import {gateway} from '../../gateway/connect.js';

export default (state) => {
  gateway.session_id = state.session_id;
  console.log('Successfully authenticated - received new session ID.');
};
