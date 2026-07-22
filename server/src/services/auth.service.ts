import { IUserRepository } from '../repositories/user.repository';
import { User, Role } from '../generated/prisma/client';
import { hashPassword } from '../utils/password';

export interface RegisterUserDto {
  email: string;
  password: string;
  name?: string;
  role?: Role;
}

export interface IAuthService {
  register(dto: RegisterUserDto): Promise<User>;
}

export class AuthService implements IAuthService {
  constructor(private userRepository: IUserRepository) {}

  async register(dto: RegisterUserDto): Promise<User> {
    const normalizedEmail = dto.email.trim().toLowerCase();

    const existingUser = await this.userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await hashPassword(dto.password);

    return this.userRepository.create({
      email: normalizedEmail,
      password: hashedPassword,
      name: dto.name?.trim(),
      role: dto.role || 'USER',
    });
  }
}
