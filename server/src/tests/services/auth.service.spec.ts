import { AuthService } from '../../services/auth.service';
import { IUserRepository } from '../../repositories/user.repository';
import * as passwordUtils from '../../utils/password';

describe('AuthService - register', () => {
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
