import type { WebClient } from '@slack/web-api';
import type {
  IModalService,
  AnyModalServiceMethodParams,
  RenderCheckInSelfConfirmationParams,
  RenderCheckInOtherMemberConfirmationParams,
  RenderErrorParams,
  MemberableModalServiceMethodParams,
} from './interfaces';
import {
  Modal,
  Blocks,
  Elements,
  Bits,
  SlackViewDto,
  setIfFalsy,
  user,
  bold,
  setIfTruthy,
} from 'slack-block-builder';
import { getShortLocationStringByMember, getDisplayTextFromCheckInBoolByMember } from '../helpers/client';
import { SlackAction } from '../constants';

type OpenOrUpdateViewParams = AnyModalServiceMethodParams & { view: SlackViewDto };

export interface ModalServiceParams {
  httpClient: WebClient;
  host: string;
}

export class ModalService implements IModalService {
  private readonly httpClient: WebClient;

  private readonly host: string;

  constructor(params: ModalServiceParams) {
    this.httpClient = params.httpClient;
    this.host = params.host;
  }

  public async renderMainMenu(params: MemberableModalServiceMethodParams): Promise<void> {
    const { member, ...rest } = params;
    const isOptedOutOfMapOption = Bits.Option({
      text: 'Display Me On Organization Map',
      description: 'Allow other members to see which city you are in on the map. Note that Together App stores only your city, not your exact coordinates.',
      value: member.isOptedOutOfMap.toString(),
    });

    const modal = Modal({ title: 'Together App' })
      .blocks(
        Blocks.Section({ text: `Hi, ${user(member.slackId)} :wave::skin-tone-4:` }),
        Blocks.Section({ text: `It's important to stay together and help each other in difficult times. This app is a way to help our organization do just that.` }),
        Blocks.Divider(),
        Blocks.Section({ text: bold('Check In') }),
        Blocks.Actions()
          .elements(
            Elements.Button({
              text: 'Check In',
              actionId: SlackAction.RenderCheckInSelfConfirmation,
            }),
            Elements.Button({
              text: 'Repeat Last Check In',
              actionId: SlackAction.RenderRepeatCheckInConfirmation,
            }),
            Elements.Button({
              text: 'Check In Someone Else',
              actionId: SlackAction.RenderCheckInOtherMemberConfirmation,
            }),
          ),
        Blocks.Divider(),
        Blocks.Section({ text: bold('Visit The Web App') }),
        Blocks.Actions()
          .elements(
            Elements.Button({
              text: 'View Check Ins',
              actionId: SlackAction.ClickViewCheckIns,
              url: `${this.host}/members`,
            }),
            Elements.Button({
              text: 'View Organization Map',
              actionId: SlackAction.ClickViewOrganizationMap,
              url: `${this.host}/map`,
            }),
          ),
        Blocks.Divider(),
        Blocks.Section({ text: bold('Settings') }),
        Blocks.Actions()
          .elements(
            Elements.Checkboxes({
              actionId: SlackAction.RenderMainMenu,
            })
              .options(isOptedOutOfMapOption)
              .initialOptions(setIfFalsy(member.isOptedOutOfMap, isOptedOutOfMapOption)),
          ),
      );

    await this.openOrUpdateView({ ...rest, view: modal.buildToObject() });
  }

  public async renderCheckInSelfConfirmation(params: RenderCheckInSelfConfirmationParams): Promise<void> {
    const { url, member, isFromRepeatCheckIn, ...rest } = params;

    const modal = Modal({ title: 'Check In' })
      .blocks(
        setIfTruthy(isFromRepeatCheckIn,
          Blocks.Section({ text: `:warning: Sorry, ${user(member.slackId)}, you haven't previously checked in, so you need to check in manually.` }),
        ),
        Blocks.Section({ text: `Please let us know how and where you are so to help us provide you with assistance and make important security-related decisions for our organization.` }),
        Blocks.Section({ text: `Upon clicking this button, you will be redirected to a secure website to check in.` })
          .accessory(
            Elements.Button({
              url,
              text: ':link:  Go To Check In',
              actionId: SlackAction.RenderMainMenu,
            }),
          ),
      )
      .close('Cancel');

    await this.openOrUpdateView({ ...rest, view: modal.buildToObject() });
  }

  public async renderCheckInOtherMemberConfirmation(params: RenderCheckInOtherMemberConfirmationParams): Promise<void> {
    const { requester, member, url, hasError, ...rest } = params;

    const modal = Modal({ title: 'Check In' })
      .blocks(
        Blocks.Section({ text: `Hi, ${user(requester.slackId)} :wave::skin-tone-4:` }),
        Blocks.Section({ text: `Thanks for being willing to help. It's super important for us to know how and where our colleagues are so that we can make important decisions and assist in any way possible.` }),
        Blocks.Input({
          label: 'Which member do you wish to check in?',
          blockId: 'memberId',
        })
          .dispatchAction()
          .element(
            Elements.UserSelect({
              placeholder: 'Please select an employee...',
              actionId: SlackAction.RenderCheckInOtherMemberConfirmation,
            }),
          ),
        setIfTruthy(hasError && !member,
          Blocks.Context()
            .elements(':warning:  Could not find this member in the Together App.'),
        ),
        setIfTruthy(requester && url && !hasError, [
          Blocks.Section({ text: `Upon clicking this button, you will be redirected to a secure MacPaw website to check ${member ? user(member.slackId) : null} in.` })
            .accessory(
              Elements.Button({
                url: url!,
                text: ':link:  Go To Check In',
                actionId: SlackAction.RenderMainMenu,
              }),
            ),
        ]),
      )
      .close('Cancel');

    await this.openOrUpdateView({ ...rest, view: modal.buildToObject() });
  }

  public async renderRepeatCheckInConfirmation(params: MemberableModalServiceMethodParams): Promise<void> {
    const { member, ...rest } = params;
    const memberDto = member.toDto();

    const modal = Modal({ title: 'Repeat Check In' })
      .blocks(
        Blocks.Section({ text: `Please review your previous check in to before repeating it to make sure all of the data is correct.` }),
        Blocks.Section({ text: `If something has changed, please manually check in.` }),
        Blocks.Divider(),
        Blocks.Section({ text: `${bold('Location:')} ${getShortLocationStringByMember(memberDto)}` })
          .fields(
            `${bold('Is Safe:')} ${getDisplayTextFromCheckInBoolByMember(memberDto, 'isSafe')}`,
            `${bold('Can Work:')} ${getDisplayTextFromCheckInBoolByMember(memberDto, 'isAbleToWork')}`,
            `${bold('Can Assist:')} ${getDisplayTextFromCheckInBoolByMember(memberDto, 'isAbleToAssist')}`,
          ),
        Blocks.Section({ text: `${bold('Comment:')} ${memberDto.checkIn!.comment || 'N/A'}` }),
        Blocks.Divider(),
        Blocks.Actions()
          .elements(
            Elements.Button({
              text: 'Check In Manually',
              actionId: SlackAction.RenderCheckInSelfConfirmation,
            }),
            Elements.Button({
              text: 'Confirm and Repeat',
              actionId: SlackAction.ClickConfirmAndRepeat,
            }),
          ),
      )
      .close('Cancel');

    await this.openOrUpdateView({ ...rest, view: modal.buildToObject() });
  }

  public async renderSuccess(params: MemberableModalServiceMethodParams): Promise<void> {
    const { member, ...rest } = params;

    const modal = Modal({ title: 'Checked In!' })
      .blocks(
        Blocks.Section({ text: `Thanks for checking in, ${user(member.slackId)}!` }),
        Blocks.Section({ text: `Stay safe. Stay strong. And слава Україні!  :yellow_heart: :blue_heart:` }),
      )
      .close('Done');

    await this.openOrUpdateView({ ...rest, view: modal.buildToObject() });
  }

  public async renderError(params: RenderErrorParams): Promise<void> {
    const { message, ...rest } = params;
    const modal = Modal({ title: 'Oops' })
      .blocks(
        Blocks.Section({ text: message }),
      );

    await this.openOrUpdateView({ ...rest, view: modal.buildToObject() });
  }

  private async openOrUpdateView(params: OpenOrUpdateViewParams): Promise<void> {
    const { triggerId, viewId, view } = params;

    if (triggerId) {
      await this.httpClient.views.open({
        view,
        trigger_id: triggerId!,
      });

      return;
    }

    await this.httpClient.views.update({
      view,
      view_id: viewId!,
    });
  }
}
