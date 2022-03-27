import type { Nullable, AuthProviderConfig } from '../../types';
import SlackProvider from 'next-auth/providers/slack';

const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID!;
const SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET!;

export const authProviderConfig: Nullable<AuthProviderConfig> = {
  provider: SlackProvider({
    clientId: SLACK_CLIENT_ID,
    clientSecret: SLACK_CLIENT_SECRET,
  }),
  type: 'slack',
};