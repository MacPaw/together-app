import type { SlackMember } from '../../entities';

export interface ISlackMemberProvider {
  getAll(): Promise<SlackMember[]>;
}
