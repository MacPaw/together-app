import type { NextApiRequest, NextApiResponse } from 'next';
import { memberService } from '../../../services';
import { handleAPIErrors, validateHttpMethod, validateJobsAPIToken } from '../../../helpers/server';
import { TOGETHER_ADMINISTRATOR_SLACK_USER_ID } from '../../../config';
import { MemberNotFoundError } from '../../../exceptions';

interface Payload {
  token: string;
}

export default async function Initialize(req: NextApiRequest, res: NextApiResponse) {
  try {
    validateHttpMethod('GET', req.method!);

    const { token } = req.query as unknown as Payload;

    validateJobsAPIToken(token);

    await memberService.syncAllWithSlack();

    const administrator = await memberService.findBySlackId(TOGETHER_ADMINISTRATOR_SLACK_USER_ID);

    if (!administrator) {
      throw new MemberNotFoundError();
    }

    await memberService.setIsAttribute({
      member: administrator,
      attribute: 'isAdmin',
      value: true,
    });

    res.status(200).json({});
  } catch (error) {
    handleAPIErrors(error, res);
  }
}
