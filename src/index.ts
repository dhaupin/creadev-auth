/**
 * @creadev.org/auth
 *
 * Auth - token validation, session management.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface AuthOptions {
  /** Max failed attempts before lockout */
  maxAttempts?: number;
  /** Lockout duration in ms */
  lockoutDuration?: number;
}

export interface AuthSession {
  id: string;
  token: string;
  createdAt: number;
  expiresAt: number;
  data: Record<string, unknown>;
}

// ============================================================================
// AUTH
// ============================================================================

export class Auth {
  private sessions = new Map<string, AuthSession>();
  private failedAttempts = new Map<string, number>();
  private maxAttempts: number;
  private lockoutDuration: number;

  constructor(options: AuthOptions = {}) {
    this.maxAttempts = options.maxAttempts ?? 5;
    this.lockoutDuration = options.lockoutDuration ?? 300000; // 5 min
  }

  /** Create session */
  createSession(token: string, expiresIn: number = 86400000, data?: Record<string, unknown>): string {
    const id = this.generateId();
    const session: AuthSession = {
      id,
      token,
      createdAt: Date.now(),
      expiresAt: Date.now() + expiresIn,
      data: data ?? {},
    };

    this.sessions.set(id, session);
    return id;
  }

  /** Validate session */
  validateSession(id: string): boolean {
    const session = this.sessions.get(id);
    if (!session) return false;
    if (Date.now() > session.expiresAt) {
      this.sessions.delete(id);
      return false;
    }
    return true;
  }

  /** Get session */
  getSession(id: string): AuthSession | undefined {
    return this.sessions.get(id);
  }

  /** Delete session */
  deleteSession(id: string): boolean {
    return this.sessions.delete(id);
  }

  /** Validate token */
  validateToken(token: string): string | undefined {
    for (const [id, session] of this.sessions) {
      if (session.token === token && this.validateSession(id)) {
        return id;
      }
    }
    return undefined;
  }

  /** Record failed attempt */
  recordFailure(id: string): void {
    const attempts = (this.failedAttempts.get(id) ?? 0) + 1;
    this.failedAttempts.set(id, attempts);
  }

  /** Check locked out */
  isLockedOut(id: string): boolean {
    const attempts = this.failedAttempts.get(id) ?? 0;
    return attempts >= this.maxAttempts;
  }

  /** Clear failure */
  clearFailure(id: string): void {
    this.failedAttempts.delete(id);
  }

  /** List sessions */
  listSessions(): AuthSession[] {
    return Array.from(this.sessions.values());
  }

  /** Clean expired sessions */
  clean(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [id, session] of this.sessions) {
      if (now > session.expiresAt) {
        this.sessions.delete(id);
        cleaned++;
      }
    }

    return cleaned;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}

// ============================================================================
// FACTORY
// ============================================================================

export function createAuth(options?: AuthOptions): Auth {
  return new Auth(options);
}

// ============================================================================
// DEFAULT AUTH
// ============================================================================

const defaultAuth = new Auth();

/** Create default session */
export function createSession(token: string, expiresIn?: number, data?: Record<string, unknown>): string {
  return defaultAuth.createSession(token, expiresIn, data);
}

/** Validate session */
export function validateSession(id: string): boolean {
  return defaultAuth.validateSession(id);
}

/** Validate token */
export function validateToken(token: string): string | undefined {
  return defaultAuth.validateToken(token);
}