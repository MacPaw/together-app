import { ApplicationError } from './ApplicationError';

export class InvalidSessionError extends ApplicationError {
  constructor() {
    super({
      status: 401,
      code: null,
      data: null,
      message: 'We could not verify your identity. Please trying signing in again.',
    });
  }
}
