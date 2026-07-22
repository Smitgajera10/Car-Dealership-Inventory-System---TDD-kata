import { AppError } from './AppError';

export class OutOfStockError extends AppError {
  constructor(message = 'Vehicle is out of stock') {
    super(message, 400);
  }
}
