/**
 * Services that manages session state (Gateway seq, session_id, etc)
 */
export class SessionService {
  /**
   * Creates a new SessionService.
   * @param {string} [session] An existing session ID to use.
   */
  constructor(session) {
    this.seq = null;
    this.session = session || null;
  }

  /**
   * Update sequence number.
   * @param {number} seq
   */
  updateSeq(seq) {
    this.seq = seq;
  }

  /**
   * Store this session ID.
   * @param {string} session
   */
  useSession(session) {
    this.session = session;
  }

  /**
   * Get the stored session ID.
   * @param {string} session
   * @return {string|boolean} Returns false if no current session.
   */
  getSession(session) {
    return this.session || false;
  }

  /** Discards the current session. */
  discardSession() {
    this.session = null;
  }
};
