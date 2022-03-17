import type { MemberRecord, CheckInRecord } from '@prisma/client';
import { PrismaService, PrismaServiceParams } from './PrismaService';
import { Member, MemberAttributes, CreatableEntityAttributes, CheckIn } from '../entities';

import type { IUniqueStringGenerator } from './interfaces';
import type { IMemberManager } from './interfaces';

type MemberWithCheckInRecord = MemberRecord & {
  checkins: CheckInRecord[];
};

export interface MemberManagerParams extends PrismaServiceParams {
  uniqueStringGenerator: IUniqueStringGenerator;
}

export class MemberManager extends PrismaService implements IMemberManager {
  private readonly uniqueStringGenerator: IUniqueStringGenerator;

  constructor(params: MemberManagerParams) {
    super(params);

    this.uniqueStringGenerator = params.uniqueStringGenerator;
  }

  public async create(attributes: CreatableEntityAttributes<MemberAttributes>): Promise<Member> {
    const { checkIn, ...rest } = attributes;
    const record = await this.connection.memberRecord.create({
      data: {
        ...rest,
        id: this.uniqueStringGenerator.generate(),
      },
      include: {
        checkins: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    return record && MemberManager.getMemberFromRecord(record);
  }

  public async update(member: Member): Promise<Member> {
    const data = Member.getSavableAttributes(member);
    const { checkIn, ...rest } = data;

    const record = await this.connection.memberRecord.update({
      data: { ...rest },
      where: { id: member.id },
      include: {
        checkins: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    return record && MemberManager.getMemberFromRecord(record);
  }

  public async delete(member: Member): Promise<void> {
    member.setIsDeleted(true);

    await this.update(member);
  }

  private static getMemberFromRecord(record: MemberWithCheckInRecord): Member {
    const { checkins, ...rest } = record;
    const checkInRecord = checkins[0];

    return new Member({
      ...rest,
      checkIn: checkInRecord ? new CheckIn(checkInRecord) : null,
    });
  }
}
