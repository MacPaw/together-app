import { Prisma, MemberRecord, CheckInRecord } from '@prisma/client';
import { PrismaService, PrismaServiceParams } from './PrismaService';
import { CheckIn, Member } from '../entities';
import { MemberNotFoundError } from '../exceptions';

import type { IMemberProvider } from './interfaces';
import type { Nullable, FilterSlackMemberRule } from '../types';

type MemberWithCheckInRecord = MemberRecord & {
  checkins?: CheckInRecord[];
};

export interface GlobalWhere {
  isDeleted: boolean;
  isRestricted?: boolean;
  isUltraRestricted?: boolean;
}

export interface MemberProviderParams extends PrismaServiceParams, FilterSlackMemberRule {
}

export class MemberProvider extends PrismaService implements IMemberProvider {
  private readonly globalWhere: GlobalWhere;

  private readonly globalInclude: Pick<Prisma.MemberRecordInclude, 'checkins'>;

  constructor(params: MemberProviderParams) {
    super(params);

    this.globalInclude = {
      checkins: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    };

    this.globalWhere = {
      isDeleted: false,
      ...params.filterRestricted ? { isRestricted: false } : {},
      ...params.filterUltraRestricted ? { isUltraRestricted: false } : {},
    };
  }

  public async getById(id: string): Promise<Member> {
    const record = await this.connection.memberRecord.findFirst({
      where: { id, ...this.globalWhere },
      include: { ...this.globalInclude },
    });

    if (!record) {
      throw new MemberNotFoundError();
    }

    return record && MemberProvider.getMemberFromRecord(record);
  }

  public async getByEmail(email: string): Promise<Member> {
    const record = await this.connection.memberRecord.findFirst({
      where: { email, ...this.globalWhere },
      include: { ...this.globalInclude },
    });

    if (!record) {
      throw new MemberNotFoundError();
    }

    return record && MemberProvider.getMemberFromRecord(record);
  }

  public async findBySlackId(slackId: string): Promise<Nullable<Member>> {
    const record = await this.connection.memberRecord.findFirst({
      where: { slackId, ...this.globalWhere },
      include: { ...this.globalInclude },
    });

    return record && MemberProvider.getMemberFromRecord(record);
  }

  public async findAnyInSystemBySlackId(slackId: string): Promise<Nullable<Member>> {
    const record = await this.connection.memberRecord.findFirst({
      where: { slackId },
      include: { ...this.globalInclude },
    });

    return record && MemberProvider.getMemberFromRecord(record);
  }

  public async getAll(): Promise<Member[]> {
    const records = await this.connection.memberRecord.findMany({
      where: { ...this.globalWhere },
      include: { ...this.globalInclude },
    });

    return MemberProvider.getMembersFromRecords(records);
  }

  public getAllCheckInNonNull(): Promise<Member[]> {
    return this.getAll()
      .then((members) => members
        .filter((member) => Boolean(member.checkIn)))
  }

  private static getMemberFromRecord(record: MemberWithCheckInRecord): Member {
    const { checkins, ...rest } = record;
    const checkInRecord = checkins ? checkins[0] : null;

    return new Member({
      ...rest,
      checkIn: checkInRecord ? new CheckIn(checkInRecord) : null,
    });
  }

  private static getMembersFromRecords(records: MemberWithCheckInRecord[]): Member[] {
    return records.map((record) => MemberProvider.getMemberFromRecord(record));
  }
}
