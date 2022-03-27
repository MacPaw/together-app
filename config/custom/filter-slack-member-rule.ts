import type { Nullable, FilterSlackMemberRule } from '../../types';

export const filterSlackMemberRule: Nullable<FilterSlackMemberRule> = {
  filterRestricted: false, // Restricted members will also be in Together App
  filterUltraRestricted: false,
};