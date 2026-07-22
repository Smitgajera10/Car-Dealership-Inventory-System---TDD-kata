import request from 'supertest';
import { app } from '../../app';
import { AuthService } from '../../services/auth.service';

describe('Auth API Endpoints (/api/auth)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user and return 201 Created', async () => {
      const mockCreatedUser = {
        id: 'user-uuid-1',
        email: 'john@example.com',
        name: 'John Doe',
        role: 'USER' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      jest.spyOn(AuthService.prototype, 'register').mockResolvedValue(mockCreatedUser as any);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'john@example.com',
          password: 'password123',
          name: 'John Doe',
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: 'User registered successfully',
        user: mockCreatedUser,
      });
    });

    it('should return 400 Bad Request when email or password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 Bad Request when email already exists', async () => {
      jest.spyOn(AuthService.prototype, 'register').mockRejectedValue(new Error('User already exists'));

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'existing@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate user and return 200 OK with token', async () => {
      const mockAuthResponse = {
        user: {
          id: 'user-uuid-1',
          email: 'john@example.com',
          name: 'John Doe',
          role: 'USER' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        token: 'mock-jwt-token-string',
      };

      jest.spyOn(AuthService.prototype, 'login').mockResolvedValue(mockAuthResponse as any);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Login successful',
        ...mockAuthResponse,
      });
    });

    it('should return 400 Bad Request when email or password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 401 Unauthorized when credentials are invalid', async () => {
      jest.spyOn(AuthService.prototype, 'login').mockRejectedValue(new Error('Invalid email or password'));

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid email or password');
    });
  });
});
