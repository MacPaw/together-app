import { ApplicationError } from './ApplicationError';

export interface GoogleGeoCodingAPIErrorParams {
  responseErrorMessage: string;
  responseStatus: string;
}

export class GoogleGeoCodingAPIError extends ApplicationError {
  public readonly responseErrorMessage: string;

  public readonly responseStatus: string;

  constructor(params: GoogleGeoCodingAPIErrorParams) {
    super({
      status: 500,
      code: null,
      data: null,
      message: 'An error occurred with the Google Geocoding API.',
    });

    this.responseErrorMessage = params.responseErrorMessage;
    this.responseStatus = params.responseStatus;
  }
}
