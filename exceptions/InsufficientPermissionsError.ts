import { ApplicationError } from './ApplicationError';

export class InsufficientPermissionsError extends ApplicationError {
  constructor() {
    super({
      status: 401,
      code: null,
      data: null,
      message: 'You do not have permission to do this. Please contact your administrator to get permission.',
    });
  }
}
