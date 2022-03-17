import { ApplicationError } from './ApplicationError';

export class MemberNotFoundError extends ApplicationError {
  constructor() {
    super({
      status: 400,
      code: null,
      data: null,
      message: 'Sorry, this member could be found.',
    });
  }
}
