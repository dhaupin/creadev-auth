import { describe, it, expect } from 'vitest';
import { Auth, createAuth, validateToken } from '../src/index';

describe('Auth', () => {
  it('creates instance', () => {
    const auth = createAuth();
    expect(auth).toBeDefined();
  });
});

describe('validateToken', () => {
  it('validates token', () => {
    const result = validateToken('tok_test');
    expect(typeof result === 'string' || result === undefined).toBe(true);
  });
});
