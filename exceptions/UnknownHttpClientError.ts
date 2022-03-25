import { ApplicationError } from './ApplicationError';

import type { Nullable } from '../types';

export interface UnknownHttpClientErrorParams {
  response: Nullable<unknown>;
  responseStatus: Nullable<number>;
}

export class UnknownHttpClientError extends ApplicationError {
  public readonly response: Nullable<unknown>;

  public readonly responseStatus: Nullable<number>;

  constructor(params: UnknownHttpClientErrorParams) {
    super({
      status: 500,
      code: null,
      data: null,
      message: 'An unknown error occurred with an external HTTP request.',
    });

    this.response = params.response;
    this.responseStatus = params.responseStatus;
  }
}
