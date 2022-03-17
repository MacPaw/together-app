import type { Provider, OAuthProviderType } from 'next-auth/providers';
import type { Member } from '../entities';

export type Maybe<T> = null | undefined | T;

export type Nullable<T> = T | null;

export type ObjectLiteral = Record<string, any>;

export type CheckInString = '24hrs' | '48hrs' | 'never' | 'other';

export type BooleanPropString = 'yes' | 'no' | 'both';

export type TagColor = 'primary' | 'secondary' | 'warning' | 'custom';

export interface LatLongable {
  latitude: number;
  longitude: number;
}

export interface FilterSlackMemberRule {
  filterRestricted: boolean;
  filterUltraRestricted: boolean;
}

export type MemberIsAtRiskRule = (member: Member) => boolean;

export interface NotifyOfLateCheckInRule {
  hours: number;
}

export interface RemindMemberOfLateCheckInRule {
  hours: number;
}

export interface AuthProviderConfig {
  provider: Provider;
  type: OAuthProviderType;
}

export interface CheckInRequestRule {
  requestCheckInOrganizationChannel: boolean;
  requestCheckInDirectMessage: boolean;
}
