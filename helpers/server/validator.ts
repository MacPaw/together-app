import type { Session } from 'next-auth';
import {
  InvalidSessionError,
  InvalidCheckInTokenError,
  InsufficientPermissionsError,
  InvalidIsAttributeArgument,
  InvalidHttpMethodError,
  MemberNotFoundError,
} from '../../exceptions';
import type { Member } from '../../entities';
import type { Nullable } from '../../types';
import { JOBS_API_TOKEN } from '../../config';
import { InvalidAPITokenError } from '../../exceptions';


export const validateSessionIsValid = (session: Nullable<Session>): void | never => {
  if (!session || !session.user?.email) {
    throw new InvalidSessionError();
  }
};

export interface ValidateMemberCheckInTokenParams {
  checkInToken: Nullable<string>;
  member: Member;
}

export const validateMemberCheckInToken = (params: ValidateMemberCheckInTokenParams): void | never => {
  const { checkInToken, member } = params;

  if (!checkInToken || checkInToken !== member.checkInToken) {
    throw new InvalidCheckInTokenError();
  }
};

export const validateRequesterIsAdmin = (requester: Member): void | never => {
  if (!requester.isAdmin) {
    throw new InsufficientPermissionsError();
  }
};

export const validateMemberFound = (member: Nullable<Member>): void | never => {
  if (!member) {
    throw new MemberNotFoundError();
  }
}


export const validateIsAttributesArguments = (attribute: keyof Member, value: boolean): void | never => {
  const allowedKeys: Array<keyof Member> = [
    'isAdmin',
    'isMobilized',
    'isExemptFromCheckIn',
    'isOptedOutOfMap',
  ];

  if (!allowedKeys.includes(attribute) || !Boolean(!value || value)) {
    throw new InvalidIsAttributeArgument();
  }
};

export const validateHttpMethod = (allowed: string, actual: string): void | never => {
  if (allowed !== actual) {
    throw new InvalidHttpMethodError();
  }
};

export const validateJobsAPIToken = (token: string): void | never => {
  if (!JOBS_API_TOKEN || token !== JOBS_API_TOKEN) {
    throw new InvalidAPITokenError();
  }
};
