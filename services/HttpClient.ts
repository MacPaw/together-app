import axios from 'axios';
import { UnknownHttpClientError } from '../exceptions';

import type { IHttpClient, HttpClientGetParams, HttpClientPostParams } from './interfaces';
import type { ObjectLiteral, Nullable } from '../types';

export interface HttpClientParams<H extends ObjectLiteral = {}> {
  baseUrl: string;
}

export class HttpClient<H extends ObjectLiteral = ObjectLiteral> implements IHttpClient {
  private readonly baseUrl: string;

  constructor(params: HttpClientParams<H>) {
    this.baseUrl = params.baseUrl;
  }

  public get<Q extends Nullable<ObjectLiteral>, R>(params: HttpClientGetParams<Q>): Promise<R> {
    const { uri, query } = params;

    return axios.get(`${this.baseUrl}${uri}`, { params: query || {} })
      .then((response) => response.data)
      .catch((error) => this.handleErrors(error));
  }

  public post<Q extends Nullable<ObjectLiteral>, B extends Nullable<ObjectLiteral>, R>(params: HttpClientPostParams<Q, B>): Promise<R> {
    const { uri, query, body } = params;

    return axios.post(`${this.baseUrl}${uri}`, body, { params: query || {} })
      .then((response) => response.data)
      .catch((error) => this.handleErrors(error));
  }

  private handleErrors(error: unknown): never {
    if (axios.isAxiosError(error) && error.response) {
      throw new UnknownHttpClientError({
        responseStatus: error.response.status || null,
        response: error.response || null,
      });
    }

    throw (error);
  }
}
