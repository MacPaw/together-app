import type { MemberDto } from '../../entities';

enum SortString {
  ASC = 'asc',
  DESC = 'desc',
}

interface SortByKeyParams<T> {
  items: T[];
  sortString: SortString;
  key: keyof T;
}

const sortObjectsByKey = <T>(params: SortByKeyParams<T>): T[] => {
  const { items, sortString, key } = params;

  return items.sort((left, right) => {
    if (sortString === SortString.ASC) {
      return sortAsc(left[key], right[key]);
    }

    return sortDesc(left[key], right[key]);
  });
};

const sortAsc = <T>(left: T, right: T): number => {
  if (left === right) {
    return 0;
  }

  return left < right ? -1 : 1;
};

const sortDesc = <T>(left: T, right: T): number => {
  if (right === left) {
    return 0;
  }

  return right < left ? -1 : 1;
};

export const sortMembersByEmailAsc = (members: MemberDto[]): MemberDto[] => sortObjectsByKey({
  items: members,
  sortString: SortString.ASC,
  key: 'email',
});
