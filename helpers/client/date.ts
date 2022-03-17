import { ProtectedCheckInDto } from '../../entities';
import { isAfter, isBefore, subDays, subHours } from 'date-fns';

import type { Nullable } from '../../types';

export const checkInIsWithin24Hours = <T extends ProtectedCheckInDto>(checkIn: Nullable<T>): boolean => {
  if (!checkIn) {
    return false;
  }

  const date = new Date(checkIn.createdAt as unknown as string);

  return isWithin24Hours(date);
};

export const isWithin24Hours = (date: Nullable<Date>): boolean => {
  return isWithinNHours(date, 24);
}

export const isWithinNHours = (date: Nullable<Date>, hours: number): boolean => {
  if (!date) {
    return false;
  }

  const now = convertDateToUTC(new Date());
  const dateUTC = convertDateToUTC(date);
  const dateNHoursAgo = subHours(now, hours);

  return isAfter(dateUTC, dateNHoursAgo);
}

export const checkInIsCloserTo48HoursAgo = <T extends ProtectedCheckInDto>(checkIn: Nullable<T>): boolean => {
  if (!checkIn) {
    return false;
  }

  const date = new Date(checkIn.createdAt as unknown as string);
  const dateLocal = new Date();
  const dateUTC = convertDateToUTC(dateLocal);

  const date48HoursAgo = subDays(dateUTC, 2);
  const date24HoursAgo = subDays(dateUTC, 1);

  return Boolean(isAfter(date, date48HoursAgo) && isBefore(date, date24HoursAgo));
};

export const convertDateToUTC = (date: Date) => Date.UTC(
  date.getUTCFullYear(),
  date.getUTCMonth(),
  date.getUTCDate(),
  date.getUTCHours(),
  date.getUTCMinutes(),
  date.getUTCSeconds(),
);
