import { ApplicationError } from './ApplicationError';

export class InvalidCheckInTokenError extends ApplicationError {
  constructor() {
    super({
      status: 401,
      code: null,
      data: null,
      message: 'Your session has expired. Please try again from the Slack application.',
    });
  }
}
