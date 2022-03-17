import { ApplicationError } from './ApplicationError';

export class SlackMemberProviderError extends ApplicationError {
  constructor() {
    super({
      status: 400,
      code: null,
      data: null,
      message: 'No Slack member was found, or the member had invalid data',
    });
  }
}
