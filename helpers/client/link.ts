import type { AnyMemberDto } from '../../entities';
import type { Nullable, ObjectLiteral } from '../../types';
import type { Member } from '../../entities';

export const getGoogleMapsUrlByMember = (member: AnyMemberDto): Nullable<string> => member.checkIn
  ? `https://www.google.com/maps/place/${member.checkIn.latitude},${member.checkIn.longitude}/@${member.checkIn.latitude},${member.checkIn.longitude},10z`
  : null;

export const getOrganizationMapUrlByMember = (member: AnyMemberDto) => member.checkIn
  ? `/map?lng=${member.checkIn.longitude}&lat=${member.checkIn.latitude}`
  : null;

export const getSlackUrlByMember = (member: AnyMemberDto, teamId: string): string => `slack://user?team=${teamId}&id=${member.slackId}`;

export interface CheckInRedirectLinkParams {
  member: Member;
  isProxy: boolean;
}

export interface CheckInPageQuery {
  memberId: string;
  checkInToken: Nullable<string>;
  referrerId: string;
  defaultToSearch?: boolean;
}

export const getQueryString = <T extends ObjectLiteral>(params: T): string => {
  return `?${Object.keys(params).map(key => key + '=' + params[key]).join('&')}`;
}
