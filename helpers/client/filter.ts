import { checkInIsWithin24Hours, checkInIsCloserTo48HoursAgo } from './date';

import type { CheckInDto, MemberDto } from '../../entities';
import type { CheckInString, BooleanPropString } from '../../types';

export const filterMembersByCountry = (countryQuery: string, members: MemberDto[]): MemberDto[] => {
  return members.filter(({ checkIn }) => checkIn && checkIn.country === countryQuery);
};

export const filterMembersByState = (stateQuery: string, members: MemberDto[]): MemberDto[] => {
  return members.filter(({ checkIn }) => checkIn && checkIn.state === stateQuery);
};

export const filterMembersByCity = (cityQuery: string, members: MemberDto[]): MemberDto[] => {
  return members.filter(({ checkIn }) => checkIn && checkIn.city === cityQuery);
};

export const filterMembersByLastCheckInString = (query: CheckInString, members: MemberDto[]) => {
  switch (query) {
    case '24hrs':
      return members.filter((member) => checkInIsWithin24Hours(member.checkIn));
    case '48hrs':
      return members.filter((member) => checkInIsCloserTo48HoursAgo(member.checkIn));
    case 'never':
      return members.filter((member) => member.checkIn === null);
    case 'other':
      return members.filter((member) => {
        const isToday = checkInIsWithin24Hours(member.checkIn);
        const isYesterday = checkInIsCloserTo48HoursAgo(member.checkIn);
        const isNull = member.checkIn === null;

        return Boolean(!isToday && !isYesterday && !isNull);
      });
    default:
      return members;
  }
};

export const filterMembersByIsSafe = (isSafe: BooleanPropString, members: MemberDto[]): MemberDto[] => {
  return filterMembersByBoolCheckInValue({
    members,
    value: isSafe,
    prop: 'isSafe',
  });
};

export const filterMembersByCanWork = (canWork: BooleanPropString, members: MemberDto[]): MemberDto[] => {
  return filterMembersByBoolCheckInValue({
    members,
    value: canWork,
    prop: 'isAbleToWork',
  });
};

export const filterMembersByIsAbleToAssist = (isAbleToAssist: BooleanPropString, members: MemberDto[]): MemberDto[] => {
  return filterMembersByBoolCheckInValue({
    members,
    value: isAbleToAssist,
    prop: 'isAbleToAssist',
  });
};

type FilterMemberByBoolCheckInValueParams = {
  value: BooleanPropString;
  prop: keyof CheckInDto;
  members: MemberDto[];
}

const filterMembersByBoolCheckInValue = ({ value, prop, members }: FilterMemberByBoolCheckInValueParams): MemberDto[] => {
  switch (value) {
    case 'yes':
      return members.filter((member) => member.checkIn && member.checkIn[prop] === true);
    case 'no':
      return members.filter((member) => member.checkIn && member.checkIn[prop] === false);
    case 'both':
      return members;
    default:
      return members;
  }
};

export const filterMembersByIsMobilized = (isMobilized: BooleanPropString, members: MemberDto[]): MemberDto[] => {
  return filterMembersByBoolValue({
    members,
    value: isMobilized,
    prop: 'isMobilized',
  });
};

type FilterMemberByBoolValueParams = {
  value: BooleanPropString;
  prop: keyof MemberDto;
  members: MemberDto[];
}

const filterMembersByBoolValue = ({ value, prop, members }: FilterMemberByBoolValueParams): MemberDto[] => {
  switch (value) {
    case 'yes':
      return members.filter((member) => member[prop] === true);
    case 'no':
      return members.filter((member) => member[prop] === false);
    case 'both':
      return members;
    default:
      return members;
  }
}
