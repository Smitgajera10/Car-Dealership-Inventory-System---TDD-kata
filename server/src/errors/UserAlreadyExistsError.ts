import { AppError } from "./AppError";

export class UserAlreadyExistsError extends AppError {
  constructor() {
    super("User already exists", 409);
  }
}