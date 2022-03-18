export * from './custom';
export const ENV = process.env.NODE_ENV!;
export const PORT = process.env.PORT!;
export const HOST = process.env.HOST!;
export const NEXTAUTH_URL = process.env.NEXTAUTH_URL!;
export const SLACK_TOGETHER_APP_TOKEN = process.env.SLACK_TOGETHER_APP_TOKEN!;
export const SLACK_TOGETHER_APP_SIGNING_SECRET = process.env.SLACK_TOGETHER_APP_SIGNING_SECRET!;
export const SLACK_MONITORING_CHANNEL_ID = process.env.SLACK_MONITORING_CHANNEL_ID!;
export const SLACK_ORGANIZATION_CHANNEL_ID = process.env.SLACK_ORGANIZATION_CHANNEL_ID!;
export const TOGETHER_ADMINISTRATOR_SLACK_USER_ID = process.env.TOGETHER_ADMINISTRATOR_SLACK_USER_ID!;
export const SLACK_WORKSPACE_ID = process.env.SLACK_WORKSPACE_ID!;
export const GOOGLE_GEOCODING_API_TOKEN = process.env.GOOGLE_GEOCODING_API_TOKEN!;
export const GOOGLE_PLACES_API_TOKEN = process.env.GOOGLE_PLACES_API_TOKEN!;
export const ALLOWED_REFERRER_ID = process.env.ALLOWED_REFERRER_ID!;
export const OKTA_CLIENT_ID = process.env.OKTA_CLIENT_ID!;
export const OKTA_CLIENT_SECRET = process.env.OKTA_CLIENT_SECRET!;
export const OKTA_ISSUER = process.env.OKTA_ISSUER!;
export const MAPBOX_MAP_TOKEN = process.env.MAPBOX_MAP_TOKEN!;
export const JOBS_API_TOKEN = process.env.JOBS_API_TOKEN!;

import { MissingEnvironmentVariableError } from '../exceptions';

const validateEnvVariable = (variable: string, name: string): void | never => {
  if (!variable) {
    throw new MissingEnvironmentVariableError(name);
  }
};

validateEnvVariable(ENV, 'ENV');
validateEnvVariable(HOST, 'HOST');
validateEnvVariable(NEXTAUTH_URL, 'NEXTAUTH_URL');
validateEnvVariable(SLACK_TOGETHER_APP_TOKEN, 'SLACK_TOGETHER_APP_TOKEN');
validateEnvVariable(SLACK_TOGETHER_APP_SIGNING_SECRET, 'SLACK_TOGETHER_APP_SIGNING_SECRET');
validateEnvVariable(SLACK_MONITORING_CHANNEL_ID, 'SLACK_MONITORING_CHANNEL_ID');
validateEnvVariable(SLACK_ORGANIZATION_CHANNEL_ID, 'SLACK_ORGANIZATION_CHANNEL_ID');
validateEnvVariable(TOGETHER_ADMINISTRATOR_SLACK_USER_ID, 'TOGETHER_ADMINISTRATOR_SLACK_USER_ID');
validateEnvVariable(SLACK_WORKSPACE_ID, 'SLACK_WORKSPACE_ID');
validateEnvVariable(GOOGLE_GEOCODING_API_TOKEN, 'GOOGLE_GEOCODING_API_TOKEN');
validateEnvVariable(GOOGLE_PLACES_API_TOKEN, 'GOOGLE_PLACES_API_TOKEN');
validateEnvVariable(ALLOWED_REFERRER_ID, 'ALLOWED_REFERRER_ID');
validateEnvVariable(MAPBOX_MAP_TOKEN, 'JOBS_API_TOKEN');
validateEnvVariable(process.env.DATABASE_URL!, 'DATABASE_URL');
validateEnvVariable(process.env.NEXTAUTH_SECRET!, 'NEXTAUTH_SECRET');
