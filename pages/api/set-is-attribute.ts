import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { memberService } from '../../services';
import {
  validateSessionIsValid,
  validateRequesterIsAdmin,
  validateIsAttributesArguments,
  validateHttpMethod,
  handleAPIErrors,
  normalizeString,
} from '../../helpers/server';
import type { Member } from '../../entities';

export interface Payload {
  memberId: string;
  attribute: keyof Member;
  value: boolean;
}

export default async function SetIsAttribute(req: NextApiRequest, res: NextApiResponse) {
  try {
    validateHttpMethod('POST', req.method!);

    const session = await getSession({ req });

    validateSessionIsValid(session);

    const email = normalizeString(session!.user!.email!);
    const { memberId, attribute, value }: Payload = req.body;

    validateIsAttributesArguments(attribute, value);

    const [member, requester] = await Promise.all([
      memberService.getById(memberId),
      memberService.getByEmail(email),
    ]);

    validateRequesterIsAdmin(requester);

    const updated = await memberService.setIsAttribute({ member, attribute, value });

    res.status(200).json({ ...updated.toDto() });
  } catch (error) {
    handleAPIErrors(error, res);
  }
}
