import { Member } from '../../entities';
import { Nullable, ObjectLiteral } from '../../types';

export type AnyModalServiceMethodParams = UpdateModalParams | OpenModalParams;

export type MemberableModalServiceMethodParams<T extends ObjectLiteral = ObjectLiteral> =
  AnyModalServiceMethodParams
  & WithMember
  & T;

export type NullableMemberableModalServiceMethodParams<T extends ObjectLiteral = ObjectLiteral> =
  AnyModalServiceMethodParams
  & WithNullableMember
  & T;

export type ModalServiceParams<T extends ObjectLiteral> = T & AnyModalServiceMethodParams;

export type WithMember = { member: Member };

export type WithNullableMember = { member: Nullable<Member> };

export type UpdateModalParams = {
  triggerId: null;
  viewId: string;
};

export type OpenModalParams = {
  triggerId: string;
  viewId: null;
};

export type RenderCheckInSelfConfirmationParams = MemberableModalServiceMethodParams<{
  url: string;
  isFromRepeatCheckIn: boolean;
}>;

export type RenderCheckInOtherMemberConfirmationParams = NullableMemberableModalServiceMethodParams<{
  url: Nullable<string>;
  requester: Member;
  hasError: boolean;
}>;

export type RenderErrorParams = AnyModalServiceMethodParams
  & { message: string };

export interface IModalService {
  renderMainMenu(params: MemberableModalServiceMethodParams): Promise<void>;

  renderCheckInSelfConfirmation(params: RenderCheckInSelfConfirmationParams): Promise<void>;

  renderCheckInOtherMemberConfirmation(params: RenderCheckInOtherMemberConfirmationParams): Promise<void>;

  renderRepeatCheckInConfirmation(params: MemberableModalServiceMethodParams): Promise<void>;

  renderSuccess(params: MemberableModalServiceMethodParams): Promise<void>;

  renderError(params: RenderErrorParams): Promise<void>;
}
