import { ApplicationError } from './ApplicationError';

export class MemberCannotRepeatCheckInError extends ApplicationError {
  constructor() {
    super({
      status: 400,
      code: null,
      data: null,
      message: 'Sorry, to repeat a check in, an initial check in must have been done.',
    });
  }
}
