import { ApplicationError } from './ApplicationError';

export class InvalidIsAttributeArgument extends ApplicationError {
  constructor() {
    super({
      status: 400,
      code: null,
      data: null,
      message: `Sorry, something went wrong. It's us. Not you.`,
    });
  }
}
