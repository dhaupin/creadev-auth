import { describe, it, expect, beforeEach } from 'vitest';
import { Auth, createAuth, createSession, validateSession, validateToken } from '../src/index';

describe('Auth', () => {
  let auth: Auth;
  beforeEach(() => { auth = createAuth(); });
  it('creates instance', () => { expect(auth).toBeDefined(); });
  it('has validateToken', () => { expect(auth.validateToken).toBeDefined(); });
});

describe('createSession', () => {
  it('creates session object', () => {
    const session = createSession();
    expect(session.id).toBeDefined();
    expect(session.token).toBeDefined();
    expect(session.createdAt).toBeGreaterThan(0);
  });
});

describe('validateToken', () => {
  it('validates token format', () => {
    const result = validateToken('tok_xxxx');
    expect(result.valid).toBe(true);
  });
});
