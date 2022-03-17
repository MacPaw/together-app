import type { Nullable } from '../types';

export interface ApplicationErrorParams<T extends unknown = null> {
  status: number;
  code: Nullable<string | number>;
  data: Nullable<T>;
  message: string;
}

export class ApplicationError<T extends unknown = null> extends Error {
  public readonly status: number;

  public readonly code: Nullable<string | number>;

  public readonly data: Nullable<T>;

  constructor(params: ApplicationErrorParams<T>) {
    super(params.message);

    this.name = this.constructor.name;
    this.status = params.status;
    this.code = params.code;
    this.data = params.data;

    Error.captureStackTrace(this, this.constructor);
  }
}
