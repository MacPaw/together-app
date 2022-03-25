import { SlackMember } from '../entities';
import { SlackMemberProviderError } from '../exceptions';

import type { WebClient, UsersInfoResponse } from '@slack/web-api';
import type { ISlackMemberProvider } from './interfaces';

export interface SlackChatUserServiceInjections {
  httpClient: WebClient;
  teamId: string;
}

type SlackProfile = UsersInfoResponse['user'];
type ExistingSlackProfile = NonNullable<SlackProfile>;
type ValidatedSlackProfile = NonNullable<SlackProfile>;

export class SlackMemberService implements ISlackMemberProvider {
  private readonly httpClient: WebClient;

  private readonly teamId: string;

  constructor(params: SlackChatUserServiceInjections) {
    this.httpClient = params.httpClient;
    this.teamId = params.teamId;
  }

  public getAll(): Promise<SlackMember[]> {
    return this.fetchAllSlackProfiles()
      .then((result) => result.map(SlackMemberService.validateUserExists)
        .filter(SlackMemberService.filterBots)
        .map(SlackMemberService.getSlackMemberFromSlackProfile));
  }

  private async fetchAllSlackProfiles(fetchedUsers: SlackProfile[] = [], cursor?: string): Promise<SlackProfile[]> {
    const response = cursor
      ? await this.httpClient.users.list({ cursor, team_id: this.teamId })
      : await this.httpClient.users.list({ team_id: this.teamId });
    const nextCursor = response.response_metadata?.next_cursor;
    const users = response.members || null;

    if (!response.ok || !users) {
      throw new SlackMemberProviderError();
    }

    fetchedUsers.push(...users);

    return nextCursor
      ? this.fetchAllSlackProfiles(fetchedUsers, nextCursor)
      : fetchedUsers;
  }

  private static validateUserExists(user: SlackProfile): ExistingSlackProfile {
    if (!user) {
      throw new Error('No Slack user found.');
    }

    return user;
  }

  private static filterBots(profile: ExistingSlackProfile): boolean {
    return !Boolean(profile.is_bot || profile.name === 'slackbot');
  }

  private static getSlackMemberFromSlackProfile(user: ValidatedSlackProfile): SlackMember {
    if (!user.id || !user.profile || !user.profile.email || !user.profile.real_name) {
      throw new SlackMemberProviderError()
    }

    return new SlackMember({
      id: user.id,
      email: user.profile.email
        .toLowerCase()
        .trim(),
      name: user.profile.real_name,
      isDeleted: Boolean(user.deleted),
      isRestricted: Boolean(user.is_restricted),
      isUltraRestricted: Boolean(user.is_ultra_restricted),
    });
  }
}
