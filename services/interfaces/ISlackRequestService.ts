import type { NextApiRequest } from 'next';
import type { BlockAction, GlobalShortcut, SlashCommand } from '@slack/bolt';
import type { Member } from '../../entities';
import type { AnyModalServiceMethodParams } from './IModalService';

export interface ActionHandlerBaseParams<T extends AnyAction> {
  body: T;
  member: Member;
  modalServiceParams: AnyModalServiceMethodParams;
}

export type NonSlashCommandAction = BlockAction | GlobalShortcut;

export type NonShortcutEvent = SlashCommand | BlockAction;

export type AnyAction = SlashCommand | BlockAction | GlobalShortcut;

export type ActionHandlerParams<T extends AnyAction> = ActionHandlerBaseParams<T>;

export interface ISlackRequestService {
  validateSlackRequestAndReturnBuffer(req: NextApiRequest): Promise<Buffer>;

  handleRenderMainMenu(params: ActionHandlerParams<NonShortcutEvent>): Promise<void>;

  handleRenderCheckInSelfConfirmation(params: ActionHandlerParams<NonSlashCommandAction>): Promise<void>

  handleRenderCheckInOtherMemberConfirmation(params: ActionHandlerParams<NonSlashCommandAction>): Promise<void>;

  handleRenderRepeatCheckInConfirmation(params: ActionHandlerParams<NonSlashCommandAction>): Promise<void>;

  handleClickConfirmAndRepeat(params: ActionHandlerParams<BlockAction>): Promise<void>;

  handleRenderSuccess(params: ActionHandlerParams<BlockAction>): Promise<void>;
}
