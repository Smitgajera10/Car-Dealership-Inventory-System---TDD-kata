import { generateToken, verifyToken } from '../../utils/jwt';

describe('JWT Utility', () => {
  const payload = {
    id: 'user-uuid-123',
    email: 'user@example.com',
    role: 'USER' as const,
  };

  it('should generate a valid JWT token string', () => {
    const token = generateToken(payload);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  it('should successfully verify and decode a valid token', () => {
    const token = generateToken(payload);
    const decoded = verifyToken(token);

    expect(decoded.id).toBe(payload.id);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe(payload.role);
  });

  it('should throw an error for an invalid token', () => {
    expect(() => verifyToken('invalid-token-string')).toThrow();
  });
});
