import { v4 } from 'uuid';
import { WebClient } from '@slack/web-api';
import { CheckInManager } from './CheckInManager';
import { Uuid4IdGenerator } from './Uuid4IdGenerator';
import { LocationService } from './LocationService';
import { MemberManager } from './MemberManager';
import { MemberProvider } from './MemberProvider';
import { MemberService } from './MemberService';
import { MessageService } from './MessageService';
import { SlackMemberService } from './SlackMemberService';
import { SlackRequestService } from './SlackRequestService';
import { connection, validateAndReturnConnection } from '../db';
import {
  HOST,
  ENV,
  SLACK_TOGETHER_APP_TOKEN,
  SLACK_TOGETHER_APP_SIGNING_SECRET,
  GOOGLE_GEOCODING_API_TOKEN,
  SLACK_MONITORING_CHANNEL_ID,
  SLACK_ORGANIZATION_CHANNEL_ID,
  SLACK_WORKSPACE_ID,
  filterSlackMemberRule,
  memberIsAtRiskRule,
  remindIfNotCheckedInWithinRule,
  notifyIfNotCheckedInWithinRule,
  logger,
  checkInRequestRule,
} from '../config';
import { ModalService } from './ModalService';
import { isWithin24Hours } from '../helpers/client';

import type { Member } from '../entities';

const slackClient = new WebClient(SLACK_TOGETHER_APP_TOKEN);

export const locationService = new LocationService({
  baseUrl: 'https://maps.googleapis.com/maps/api',
  token: GOOGLE_GEOCODING_API_TOKEN,
  language: 'en',
});

const slackMemberService = new SlackMemberService({
  httpClient: slackClient,
  teamId: SLACK_WORKSPACE_ID,
});

const uniqueStringGenerator = new Uuid4IdGenerator({ generator: v4 });

const checkInManager = new CheckInManager({
  uniqueStringGenerator,
  connection: validateAndReturnConnection(connection),
});

const memberManager = new MemberManager({
  uniqueStringGenerator,
  connection: validateAndReturnConnection(connection),
});

const memberProvider = new MemberProvider({
  connection: validateAndReturnConnection(connection),
  filterRestricted: filterSlackMemberRule
    ? filterSlackMemberRule.filterRestricted
    : true,
  filterUltraRestricted: filterSlackMemberRule
    ? filterSlackMemberRule.filterUltraRestricted
    : true,
});

export const messageService = new MessageService({
  httpClient: slackClient,
  organizationChannel: SLACK_ORGANIZATION_CHANNEL_ID,
  monitoringChannel: SLACK_MONITORING_CHANNEL_ID,
  host: HOST,
});

export const memberService = new MemberService({
  memberManager,
  memberProvider,
  checkInManager,
  uniqueStringGenerator,
  messageService,
  logger,
  slackMemberProvider: slackMemberService,
  memberIsAtRisk: memberIsAtRiskRule || ((member: Member): boolean => {
    const isSafe = member.checkIn && member.checkIn.isSafe;
    const isNotMobilized = !member.isMobilized;
    const hasCheckedInRecently = member.checkIn && isWithin24Hours(member.checkIn.createdAt);

    return !Boolean(isSafe && isNotMobilized && hasCheckedInRecently);
  }),
  hoursBeforeReminder: remindIfNotCheckedInWithinRule
    ? remindIfNotCheckedInWithinRule.hours
    : 24,
  hoursBeforeNotification: notifyIfNotCheckedInWithinRule
    ? notifyIfNotCheckedInWithinRule.hours
    : 24,
  requestCheckInDirectMessage: checkInRequestRule
    ? checkInRequestRule.requestCheckInDirectMessage
    : true,
  requestCheckInOrganizationChannel: checkInRequestRule
    ? checkInRequestRule.requestCheckInOrganizationChannel
    : true,
});

export const modalService = new ModalService({
  httpClient: slackClient,
  host: HOST,
});

export const slackRequestService = new SlackRequestService({
  modalService,
  memberService,
  signingSecret: SLACK_TOGETHER_APP_SIGNING_SECRET,
});




