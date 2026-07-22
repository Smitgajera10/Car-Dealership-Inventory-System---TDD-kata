import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../errors/ForbiddenError';

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'ADMIN') {
    throw new ForbiddenError();
  }

  next();
}
