import { ApplicationError } from './ApplicationError';

export class InvalidHttpMethodError extends ApplicationError {
  constructor() {
    super({
      status: 400,
      code: null,
      data: null,
      message: 'This is not an allowed HTTP method.',
    });
  }
}
