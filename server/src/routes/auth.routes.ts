import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { UserRepository } from '../repositories/user.repository';
import { asyncHandler } from '../middleware/async-handler';

const router = Router();

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post('/register', asyncHandler(authController.register.bind(authController)));

router.post('/login', asyncHandler(authController.login.bind(authController)));

export default router;
