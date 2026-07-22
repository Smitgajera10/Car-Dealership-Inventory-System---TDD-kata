import { AuthService } from '../../services/auth.service';
import { IUserRepository } from '../../repositories/user.repository';
import * as passwordUtils from '../../utils/password';
import * as jwtUtils from '../../utils/jwt';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUserRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
    };

    authService = new AuthService(mockUserRepository);
  });

  describe('register', () => {
    it('should register a new user successfully with hashed password', async () => {
      const registerDto = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
      };

      const mockHashedPassword = 'hashed_password123';
      jest.spyOn(passwordUtils, 'hashPassword').mockResolvedValue(mockHashedPassword);

      mockUserRepository.findByEmail.mockResolvedValue(null);

      const createdUser = {
        id: 'uuid-1',
        email: registerDto.email,
        password: mockHashedPassword,
        name: registerDto.name,
        role: 'USER' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.create.mockResolvedValue(createdUser);

      const result = await authService.register(registerDto);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(passwordUtils.hashPassword).toHaveBeenCalledWith(registerDto.password);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: registerDto.email,
        password: mockHashedPassword,
        name: registerDto.name,
        role: 'USER',
      });
      expect(result).toEqual(createdUser);
    });

    it('should throw an error if email is already registered', async () => {
      const registerDto = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User',
      };

      const existingUser = {
        id: 'uuid-existing',
        email: registerDto.email,
        password: 'somehashedpassword',
        name: 'Existing User',
        role: 'USER' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(authService.register(registerDto)).rejects.toThrow('User already exists');
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should normalize email to lowercase and trim whitespace before saving', async () => {
      const registerDto = {
        email: '  TestUser@Example.COM  ',
        password: 'password123',
        name: '  Test User  ',
      };

      const mockHashedPassword = 'hashed_password123';
      jest.spyOn(passwordUtils, 'hashPassword').mockResolvedValue(mockHashedPassword);
      mockUserRepository.findByEmail.mockResolvedValue(null);

      const createdUser = {
        id: 'uuid-2',
        email: 'testuser@example.com',
        password: mockHashedPassword,
        name: 'Test User',
        role: 'USER' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.create.mockResolvedValue(createdUser);

      await authService.register(registerDto);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('testuser@example.com');
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: 'testuser@example.com',
        password: mockHashedPassword,
        name: 'Test User',
        role: 'USER',
      });
    });
  });

  describe('login', () => {
    it('should login successfully and return user with token when credentials are valid', async () => {
      const loginDto = {
        email: 'user@example.com',
        password: 'password123',
      };

      const existingUser = {
        id: 'user-uuid-1',
        email: 'user@example.com',
        password: 'hashedPassword123',
        name: 'John Doe',
        role: 'USER' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(existingUser);
      jest.spyOn(passwordUtils, 'comparePassword').mockResolvedValue(true);
      jest.spyOn(jwtUtils, 'generateToken').mockReturnValue('mock-jwt-token');

      const result = await authService.login(loginDto);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('user@example.com');
      expect(passwordUtils.comparePassword).toHaveBeenCalledWith('password123', 'hashedPassword123');
      expect(jwtUtils.generateToken).toHaveBeenCalledWith({
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      });
      expect(result).toEqual({
        user: existingUser,
        token: 'mock-jwt-token',
      });
    });

    it('should throw an error when user is not found', async () => {
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow('Invalid email or password');
    });

    it('should throw an error when password verification fails', async () => {
      const loginDto = {
        email: 'user@example.com',
        password: 'wrongpassword',
      };

      const existingUser = {
        id: 'user-uuid-1',
        email: 'user@example.com',
        password: 'hashedPassword123',
        name: 'John Doe',
        role: 'USER' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(existingUser);
      jest.spyOn(passwordUtils, 'comparePassword').mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow('Invalid email or password');
    });
  });
});
