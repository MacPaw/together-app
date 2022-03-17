import { buffer } from 'micro';
import crypto from 'crypto';
import tsscmp from 'tsscmp';
import type { NextApiRequest } from 'next';
import { InvalidSlackRequestError } from '../exceptions';
import { getCheckInRedirectLink } from '../helpers/server';
import type {
  CheckboxesAction,
  UsersSelectAction,
  BlockAction,
} from '@slack/bolt';

import type {
  ISlackRequestService,
  IModalService,
  IMemberService,
  ActionHandlerParams,
  NonSlashCommandAction,
} from './interfaces';

export interface SlackRequestServiceParams {
  signingSecret: string;
  modalService: IModalService;
  memberService: IMemberService;
}

export class SlackRequestService implements ISlackRequestService {
  private readonly signingSecret: string;

  private readonly modalService: IModalService;

  private readonly memberService: IMemberService;

  constructor(params: SlackRequestServiceParams) {
    this.signingSecret = params.signingSecret;
    this.modalService = params.modalService;
    this.memberService = params.memberService;
  }

  public async validateSlackRequestAndReturnBuffer(req: NextApiRequest): Promise<Buffer> {
    const reqBuffer = await buffer(req);
    const requestSignature = req.headers['x-slack-signature'] as string;
    const requestTimestamp = req.headers['x-slack-request-timestamp'];
    const hmac = crypto.createHmac('sha256', this.signingSecret);
    const [version, hash] = requestSignature.split('=');
    const base = `${version}:${requestTimestamp}:${reqBuffer}`;

    hmac.update(base);

    const isValid = tsscmp(hash, hmac.digest('hex'));

    if (!isValid) {
      throw new InvalidSlackRequestError();
    }

    return reqBuffer as Buffer;
  }

  public async handleRenderMainMenu(params: ActionHandlerParams<BlockAction>): Promise<void> {
    const { body, member, modalServiceParams } = params;
    const containsCheckboxValue = Boolean((body.actions[0] as CheckboxesAction).selected_options);

    if (containsCheckboxValue) {
      const isOptedOutOfMap = !Boolean((body.actions[0] as CheckboxesAction).selected_options[0]);

      const updatedMember = await this.memberService.setIsAttribute({
        member,
        attribute: 'isOptedOutOfMap',
        value: isOptedOutOfMap,
      });

      return this.modalService.renderMainMenu({
        ...modalServiceParams,
        member: updatedMember,
        isFromSlashCommand: false,
      });
    }

    return this.modalService.renderMainMenu({
      ...modalServiceParams,
      member: member,
      isFromSlashCommand: false,
    });
  }

  public async handleRenderCheckInSelfConfirmation(params: ActionHandlerParams<NonSlashCommandAction>): Promise<void> {
    const { member, modalServiceParams } = params;
    const memberWithToken = await this.memberService.issueCheckInToken(member);
    const url = getCheckInRedirectLink({
      member: memberWithToken,
      isProxy: false,
    });

    return this.modalService.renderCheckInSelfConfirmation({
      ...modalServiceParams,
      url,
      member: memberWithToken,
      isFromRepeatCheckIn: false,
    });
  }

  public async handleRenderCheckInOtherMemberConfirmation(params: ActionHandlerParams<NonSlashCommandAction>): Promise<void> {
    const { body, member, modalServiceParams } = params;
    const memberId = body.type === 'block_actions' && body.actions[0]
      ? (body.actions[0] as UsersSelectAction).selected_user
      : null;
    const forMember = memberId
      ? await this.memberService.findBySlackId(memberId)
      : null;
    const memberWithToken = forMember
      ? await this.memberService.issueCheckInToken(forMember)
      : null;
    const hasError = Boolean(memberId && !memberWithToken);
    const url = memberWithToken
      ? getCheckInRedirectLink({
        member: memberWithToken,
        isProxy: true,
      })
      : null;

    return this.modalService.renderCheckInOtherMemberConfirmation({
      url,
      hasError,
      ...modalServiceParams,
      member: memberWithToken || null,
      requester: member,
    });
  }

  public async handleRenderRepeatCheckInConfirmation(params: ActionHandlerParams<NonSlashCommandAction>): Promise<void> {
    const { member, modalServiceParams } = params;

    if (!member.checkIn) {
      const memberWithToken = await this.memberService.issueCheckInToken(member);
      const url = getCheckInRedirectLink({
        member: memberWithToken,
        isProxy: false,
      });

      return this.modalService.renderCheckInSelfConfirmation({
        ...modalServiceParams,
        url,
        member: memberWithToken,
        isFromRepeatCheckIn: true,
      });
    }

    return this.modalService.renderRepeatCheckInConfirmation({ member, ...modalServiceParams });
  }

  public async handleClickConfirmAndRepeat(params: ActionHandlerParams<BlockAction>): Promise<void> {
    const { member, modalServiceParams } = params;

    await this.memberService.repeatCheckIn(member);

    return this.modalService.renderMainMenu({ member, ...modalServiceParams });
  }

  public async handleRenderSuccess(params: ActionHandlerParams<BlockAction>): Promise<void> {
    const { member, modalServiceParams } = params;

    return this.modalService.renderSuccess({ member, ...modalServiceParams });
  }
}
