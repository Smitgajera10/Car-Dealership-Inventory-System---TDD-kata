import { Request, Response } from 'express';
import { IAuthService } from '../services/auth.service';

export class AuthController {
  constructor(private authService: IAuthService) { }

  async register(req: Request, res: Response): Promise<Response> {

    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await this.authService.register({ email, password, name, role: "USER" });

    return res.status(201).json({
      success: true,
      data: user,
    });
  }

  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const authData = await this.authService.login({ email, password });

    return res.json({
      success: true,
      data: authData,
    });
  }
}
