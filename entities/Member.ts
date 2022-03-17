import { RecordableEntity, RecordableEntityAttributes, SerializableTimestamps } from './RecordableEntity';

import type { IDtoable, IProtectedDtoable } from './interfaces';
import type { Nullable } from '../types';
import type { CheckIn, CheckInDto, ProtectedCheckInDto } from './CheckIn';

export interface MemberAttributes extends RecordableEntityAttributes {
  slackId: string;
  name: string;
  email: string;
  isDeleted: boolean;
  isRestricted: boolean;
  isUltraRestricted: boolean;
  isAdmin: boolean;
  isMobilized: boolean;
  isExemptFromCheckIn: boolean;
  isOptedOutOfMap: boolean;
  checkInToken: Nullable<string>;
  checkIn: Nullable<CheckIn>;
}

export type MemberDto = Omit<MemberAttributes, 'createdAt' | 'updatedAt'>
  & SerializableTimestamps
  & { checkIn: Nullable<CheckInDto> };

export type ProtectedMemberDto = Omit<MemberAttributes, 'isMobilized'
  | 'isAdmin'
  | 'checkInToken'
  | 'isExemptFromCheckIn'
  | 'isOptedOutOfMap'>
  & { checkIn: Nullable<ProtectedCheckInDto> };

export type AnyMemberDto = MemberDto | ProtectedMemberDto;

export type MemberIsAttribute = keyof Pick<Member, 'isAdmin'
  | 'isMobilized'
  | 'isExemptFromCheckIn'
  | 'isOptedOutOfMap'>;

export class Member extends RecordableEntity implements IDtoable<MemberDto>, IProtectedDtoable<ProtectedMemberDto> {
  public readonly slackId: string;

  public name: string;

  public email: string;

  public isDeleted: boolean;

  public isRestricted: boolean;

  public isUltraRestricted: boolean;

  public isAdmin: boolean;

  public isMobilized: boolean;

  public isExemptFromCheckIn: boolean;

  public isOptedOutOfMap: boolean;

  public checkInToken: Nullable<string>;

  public readonly checkIn: Nullable<CheckIn>;

  constructor(params: MemberAttributes) {
    super(params);

    this.slackId = params.slackId;
    this.name = params.name;
    this.email = params.email;
    this.isDeleted = params.isDeleted;
    this.isRestricted = params.isRestricted;
    this.isUltraRestricted = params.isUltraRestricted;
    this.isAdmin = params.isAdmin;
    this.isMobilized = params.isMobilized;
    this.isExemptFromCheckIn = params.isExemptFromCheckIn;
    this.isOptedOutOfMap = params.isOptedOutOfMap;
    this.checkInToken = params.checkInToken;
    this.checkIn = params.checkIn;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public setEmail(email: string): void {
    this.email = email;
  }

  public setIsAdmin(bool: boolean): void {
    this.isAdmin = bool;
  }

  public setIsRestricted(isRestricted: boolean): void {
    this.isRestricted = isRestricted;
  }

  public setIsUltraRestricted(isUltraRestricted: boolean): void {
    this.isUltraRestricted = isUltraRestricted;
  }

  public setIsDeleted(isDeleted: boolean): void {
    this.isDeleted = isDeleted;
  }

  public setIsMobilized(bool: boolean): void {
    this.isMobilized = bool;
  }

  public setIsExemptFromCheckIn(isExemptFromCheckIn: boolean): void {
    this.isExemptFromCheckIn = isExemptFromCheckIn;
  }

  public setIsOptedOutOfMap(isOptedOutOfMap: boolean): void {
    this.isOptedOutOfMap = isOptedOutOfMap;
  }

  public setCheckInToken(checkInToken: Nullable<string>): void {
    this.checkInToken = checkInToken;
  }

  public toDto(): MemberDto {
    const { checkIn, createdAt, updatedAt, ...rest } = this;
    return Object.freeze({
      ...rest,
      ...this.getSerializableTimestamps(),
      checkIn: checkIn ? checkIn.toDto() : null,
    });
  }

  public toProtectedDto(): ProtectedMemberDto {
    const {
      isAdmin,
      isMobilized,
      isExemptFromCheckIn,
      isOptedOutOfMap,
      checkInToken,
      checkIn,
      ...rest
    } = this;

    return Object.freeze({
      ...rest,
      ...this.getSerializableTimestamps(),
      checkIn: checkIn ? checkIn.toProtectedDto() : null,
    });
  }
}
