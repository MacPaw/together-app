import { ApplicationError } from './ApplicationError';

export class InvalidSlackRequestError extends ApplicationError {
  constructor() {
    super({
      status: 400,
      code: null,
      data: null,
      message: `This request is invalid.`,
    });
  }
}
