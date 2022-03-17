import { ObjectLiteral, Nullable} from '../../types';

interface HttpClientMethodParams<Q extends Nullable<ObjectLiteral>> {
  uri: string;
  query: Q;
}

export interface HttpClientGetParams<Q extends Nullable<ObjectLiteral>> extends HttpClientMethodParams<Q> {
}

export interface HttpClientPostParams<Q extends Nullable<ObjectLiteral>, B extends Nullable<ObjectLiteral>> extends HttpClientMethodParams<Q> {
  body: B;
}

export interface IHttpClient {
  get<Q extends Nullable<ObjectLiteral>, R>(params: HttpClientGetParams<Q>): Promise<R>;

  post<Q extends Nullable<ObjectLiteral>, B extends Nullable<ObjectLiteral>, R>(params: HttpClientPostParams<Q, B>): Promise<R>;
}
