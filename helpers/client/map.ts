import { filterMembersByCountry, filterMembersByState } from './filter';

import type { CheckInDto, MemberDto } from '../../entities';

const getUniqueNonNullCheckInValuesByMembers = (key: keyof CheckInDto, members: MemberDto[]): string[] => {
  const withDuplicates = members
    .filter((member) => Boolean(member.checkIn))
    .map((member) => member!.checkIn![key]);

  const unique = new Set([...withDuplicates]);

  return Array.from(unique)
    .filter(Boolean)
    .sort() as string[];
};

export const getCountriesForFilterByMembers = (members: MemberDto[]): string[] => {
  return getUniqueNonNullCheckInValuesByMembers('country', members);
};

export const getStatesForFilterByMembers = (members: MemberDto[]): string[] => {
  return getUniqueNonNullCheckInValuesByMembers('state', members);
};

export const getStatesForFiltersByCountry = (country: string, members: MemberDto[]): string[] => {
  const filteredByCountry = filterMembersByCountry(country, members);

  return getStatesForFilterByMembers(filteredByCountry);
};

export const getCitiesForFilterByEmployees = (members: MemberDto[]): string[] => {
  return getUniqueNonNullCheckInValuesByMembers('city', members);
};

export const getCitiesForFiltersByCountryOrState = (country: string, state: string, members: MemberDto[]): string[] => {
  const filteredByCountry = filterMembersByCountry(country, members);

  return getCitiesForFilterByEmployees(state
    ? filterMembersByState(state, filteredByCountry)
    : filteredByCountry);
};
