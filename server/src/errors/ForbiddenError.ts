import { AppError } from './AppError';

export class ForbiddenError extends AppError {
  constructor(message = 'Access denied. Admin privileges required') {
    super(message, 403);
  }
}
