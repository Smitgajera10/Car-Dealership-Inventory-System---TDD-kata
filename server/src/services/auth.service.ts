import { IUserRepository } from '../repositories/user.repository';
import { User, Role } from '../generated/prisma/client';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

export interface RegisterUserDto {
  email: string;
  password: string;
  name?: string;
  role?: Role;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface IAuthService {
  register(dto: RegisterUserDto): Promise<User>;
  login(dto: LoginUserDto): Promise<AuthResponse>;
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

  async login(dto: LoginUserDto): Promise<AuthResponse> {
    const normalizedEmail = dto.email.trim().toLowerCase();

    const user = await this.userRepository.findByEmail(normalizedEmail);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await comparePassword(dto.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user,
      token,
    };
  }
}
