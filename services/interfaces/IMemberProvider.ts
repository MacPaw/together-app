import type { Member } from '../../entities';
import type { Nullable } from '../../types';

export interface IMemberProvider {
  getById(id: string): Promise<Member>;

  getByEmail(email: string): Promise<Member>;

  findBySlackId(slackId: string): Promise<Nullable<Member>>;

  findAnyInSystemBySlackId(slackId: string): Promise<Nullable<Member>>;

  getAll(): Promise<Member[]>;

  getAllCheckInNonNull(): Promise<Member[]>;
}
