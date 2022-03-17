import type { MemberDto } from '../../entities';

export const findMembersByQuery = (query: string, members: MemberDto[]): MemberDto[] => {
  const normalizedQuery = query.toLowerCase();

  return members.filter(({ email, name }) => {
    const normalizedEmail = email.toLowerCase();
    const normalizedName = name.toLowerCase();

    return normalizedEmail.includes(normalizedQuery) || normalizedName.includes(normalizedQuery);
  });
};
