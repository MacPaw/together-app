import { PrismaService, PrismaServiceParams } from './PrismaService';
import { CheckIn, CreatableEntityAttributes, Member } from '../entities';

import type { IUniqueStringGenerator } from './interfaces';
import type { ICheckInManager } from './interfaces';

export interface MemberManagerParams extends PrismaServiceParams {
  uniqueStringGenerator: IUniqueStringGenerator;
}

export class CheckInManager extends PrismaService implements ICheckInManager {
  private readonly uniqueStringGenerator: IUniqueStringGenerator;

  constructor(params: MemberManagerParams) {
    super(params);

    this.uniqueStringGenerator = params.uniqueStringGenerator;
  }

  public async create(attributes: CreatableEntityAttributes<CheckIn>): Promise<CheckIn> {
    const record = await this.connection.checkInRecord.create({
      data: {
        ...attributes,
        id: this.uniqueStringGenerator.generate(),
      },
    });

    return new CheckIn(record);
  }

  public async deleteAllByMember(member: Member): Promise<void> {
    await this.connection.checkInRecord.deleteMany({
      where: { memberId: member.id },
    });
  }
}
