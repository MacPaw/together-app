import { ApplicationError } from './ApplicationError';

export class NoLocationParamsProvidedError<T extends unknown = null> extends ApplicationError<T> {
  constructor() {
    super({
      status: 400,
      code: 'couldNotFetchLocationData',
      data: null,
      message: 'Sorry, there is not enough information to fetch your location.',
    });
  }
}
