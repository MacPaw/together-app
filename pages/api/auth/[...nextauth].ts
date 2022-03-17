import NextAuth from 'next-auth';
import OktaProvider from 'next-auth/providers/okta';
import {
  OKTA_CLIENT_ID,
  OKTA_CLIENT_SECRET,
  OKTA_ISSUER,
  authProviderConfig,
} from '../../../config';

export default NextAuth({
  providers: [
    authProviderConfig
      ? authProviderConfig.provider
      : OktaProvider({
        clientId: OKTA_CLIENT_ID,
        clientSecret: OKTA_CLIENT_SECRET,
        issuer: OKTA_ISSUER,
      }),
  ],
});
