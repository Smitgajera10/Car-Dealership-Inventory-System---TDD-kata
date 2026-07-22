import { UserRepository } from '../../repositories/user.repository';
import { prisma } from '../../prisma/client';

jest.mock('../../prisma/client', () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    userRepository = new UserRepository();
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      const mockUserData = {
        email: 'test@example.com',
        password: 'hashedpassword123',
        name: 'Test User',
        role: 'USER' as const,
      };

      const mockCreatedUser = {
        id: 'user-uuid-123',
        ...mockUserData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.user.create as jest.Mock).mockResolvedValue(mockCreatedUser);

      const result = await userRepository.create(mockUserData);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: mockUserData,
      });
      expect(result).toEqual(mockCreatedUser);
    });
  });

  describe('findByEmail', () => {
    it('should return user when found by email', async () => {
      const mockUser = {
        id: 'user-uuid-123',
        email: 'test@example.com',
        password: 'hashedpassword123',
        name: 'Test User',
        role: 'USER' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.findByEmail('test@example.com');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found by email', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await userRepository.findByEmail('nonexistent@example.com');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return user when found by id', async () => {
      const mockUser = {
        id: 'user-uuid-123',
        email: 'test@example.com',
        password: 'hashedpassword123',
        name: 'Test User',
        role: 'USER' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.findById('user-uuid-123');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-uuid-123' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found by id', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await userRepository.findById('invalid-id');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'invalid-id' },
      });
      expect(result).toBeNull();
    });
  });
});
