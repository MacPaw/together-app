import { ApplicationError } from './ApplicationError';

export class MissingEnvironmentVariableError extends ApplicationError {
  constructor(name: string) {
    super({
      status: 500,
      code: null,
      data: null,
      message: `The environment variable ${name} is missing and is required for Together App to function correctly.`,
    });
  }
}
