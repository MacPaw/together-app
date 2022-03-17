import { format } from 'date-fns';
import { checkInIsWithin24Hours, checkInIsCloserTo48HoursAgo } from './date';
import type { CheckInDto, MemberDto, AnyMemberDto } from '../../entities';
import type { Nullable, TagColor } from '../../types';

type NullableStringArray = Array<string | null>;

const unsafeCountries: NullableStringArray = ['Ukraine', 'Russia', 'Belarus'];
const unsafeCities: NullableStringArray = [];
const unsafeStates: NullableStringArray = [];

export const getLocationStringByMember = (member: AnyMemberDto): string => member.checkIn
  ? `${[member.checkIn.city, member.checkIn.state, member.checkIn.country]
    .filter((data) => Boolean(data))
    .join(', ')}`
  : 'Unknown';

export const getShortLocationStringByMember = (member: AnyMemberDto): string => member.checkIn
  ? `${[member.checkIn.city, member.checkIn.country]
    .filter((data) => Boolean(data))
    .join(', ')}`
  : 'Unknown';

export const getCountryTagColorByMember = (member: AnyMemberDto): TagColor => {
  if (!member.checkIn || member.checkIn.country === null) {
    return 'warning';
  }

  return unsafeCountries.includes(member.checkIn.country)
    ? 'custom'
    : 'primary';
};

export const getTagColorByCriticalBoolean = (bool: Nullable<boolean>): TagColor => Boolean(bool) ? 'primary' : 'warning';

export const getTagColorByWarningBoolean = (bool: Nullable<boolean>): TagColor => Boolean(bool) ? 'primary' : 'custom';

export const getTagColorFromCheckInCriticalBoolByMember = (member: MemberDto, key: keyof CheckInDto): TagColor => {
  return Boolean(member.checkIn && member.checkIn[key]) ? 'primary' : 'warning';
};

export const getTagColorFromCheckInWarningBoolByMember = (member: MemberDto, key: keyof CheckInDto): TagColor => {
  return Boolean(member.checkIn && member.checkIn[key]) ? 'primary' : 'warning';
};

export const getReversedTagColorFromCheckInBoolByMember = (member: MemberDto, key: keyof CheckInDto): TagColor => {
  return Boolean(member.checkIn && member.checkIn[key]) ? 'primary' : 'custom';
};

export const getLastCheckInTagColorByMember = (member: AnyMemberDto): TagColor => {
  if (!member.checkIn === null) {
    return 'warning';
  }

  if (checkInIsCloserTo48HoursAgo(member.checkIn)) {
    return 'custom';
  }

  if (checkInIsWithin24Hours(member.checkIn)) {
    return 'primary';
  }

  return 'warning';
};

export const getLastCheckInStringByMember = (member: AnyMemberDto): string => {
  if (member.checkIn === null) {
    return 'Never';
  }

  const date = new Date(member.checkIn.createdAt as unknown as string);

  if (checkInIsCloserTo48HoursAgo(member.checkIn)) {
    return 'Past 48 Hours';
  }

  if (checkInIsWithin24Hours(member.checkIn)) {
    return 'Past 24 Hours';
  }

  return format(date, 'MMMM do');
};

export const getDisplayTextFromBool = (bool: Nullable<boolean>): string => {
  if (bool === null) {
    return 'Unknown';
  }

  return bool ? 'Yes' : 'No';
};

export const getDisplayTextFromCheckInBoolByMember = (member: MemberDto, key: keyof CheckInDto): string => {
  if (!member.checkIn || !member.checkIn[key] === null) {
    return 'Unknown';
  }

  return member.checkIn[key] ? 'Yes' : 'No';
};
