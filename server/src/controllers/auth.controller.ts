import { Request, Response } from 'express';
import { IAuthService } from '../services/auth.service';

export class AuthController {
  constructor(private authService: IAuthService) {}

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password, name, role } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await this.authService.register({ email, password, name, role });

      return res.status(201).json({
        message: 'User registered successfully',
        user,
      });
    } catch (error: unknown) {
      const err = error as Error;
      if (err.message === 'User already exists') {
        return res.status(400).json({ error: err.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const authData = await this.authService.login({ email, password });

      return res.status(200).json({
        message: 'Login successful',
        ...authData,
      });
    } catch (error: unknown) {
      const err = error as Error;
      if (err.message === 'Invalid email or password') {
        return res.status(401).json({ error: err.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
