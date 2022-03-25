import { ALLOWED_REFERRER_ID, HOST } from '../../config';
import { CheckInPageQuery, CheckInRedirectLinkParams, getQueryString } from '../client/link';

export const getCheckInRedirectLink = (params: CheckInRedirectLinkParams): string => {
  const { member, isProxy } = params;
  const queryString = getQueryString<CheckInPageQuery>({
    memberId: member.id,
    checkInToken: member.checkInToken,
    referrerId: ALLOWED_REFERRER_ID,
    ...isProxy ? { defaultToSearch: true } : {},
  });

  return `${HOST}/check-in${queryString}`;
};
