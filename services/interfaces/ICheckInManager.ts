import type { CheckIn, CheckInAttributes, CreatableEntityAttributes, Member } from '../../entities';

export interface ICheckInManager {
  create(attributes: CreatableEntityAttributes<CheckInAttributes>): Promise<CheckIn>;

  deleteAllByMember(member: Member): Promise<void>;
}
