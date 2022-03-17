import { ApplicationError } from './ApplicationError';

export class InvalidAPITokenError extends ApplicationError {
  constructor() {
    super({
      status: 400,
      code: null,
      data: null,
      message: 'The provided API token is not valid.',
    });
  }
}
