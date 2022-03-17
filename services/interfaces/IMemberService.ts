import type { Member, CheckInAttributes, CreatableEntityAttributes } from '../../entities';
import type { IMemberManager } from './IMemberManager';
import type { IMemberProvider } from './IMemberProvider';

export interface SetIsAttributeParams {
  member: Member;
  attribute: keyof Member;
  value: boolean;
}

export interface CheckInParams {
  member: Member;
  attributes: Omit<CreatableEntityAttributes<CheckInAttributes>, 'memberId'>;
}

export interface IMemberService extends IMemberProvider, IMemberManager {
  checkIn(params: CheckInParams): Promise<Member>;

  repeatCheckIn(member: Member): Promise<Member>;

  setIsAttribute(params: SetIsAttributeParams): Promise<Member>;

  issueCheckInToken(member: Member): Promise<Member>;

  syncAllWithSlack(): Promise<void>;

  notifyOfLateCheckIns(): Promise<void>;

  remindMembersOfLateCheckIn(): Promise<void>;

  requestCheckIns(): Promise<void>;
}
