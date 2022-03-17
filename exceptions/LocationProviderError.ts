import { ApplicationError } from './ApplicationError';

export class LocationProviderError<T extends unknown = null> extends ApplicationError {
  constructor() {
    super({
      status: 400,
      code: 'couldNotFetchLocationData',
      data: null,
      message: 'Sorry, no place could be found. Please try again.',
    });
  }
}
