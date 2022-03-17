import type { NextApiRequest, NextApiResponse } from 'next';
import { validateHttpMethod } from '../../../helpers/server';
import { SlashCommand } from '@slack/bolt';
import qs from 'querystring';
import { slackRequestService, memberService, modalService } from '../../../services';
import { logger } from '../../../config/custom';

export default async function HandleCommand(req: NextApiRequest, res: NextApiResponse) {
  try {
    validateHttpMethod('POST', req.method!);

    const buffer = await slackRequestService.validateSlackRequestAndReturnBuffer(req);
    const body: SlashCommand = qs.parse(buffer.toString()) as SlashCommand;
    const slackId = body.user_id;
    const member = await memberService.findBySlackId(slackId);

    if (!member) {
      res.status(200).send(`Hm. I couldn't find you in the Together App.`);

      return;
    }

    res.status(200).end();

    await modalService.renderMainMenu({
      member,
      isFromSlashCommand: true,
      triggerId: body.trigger_id,
      viewId: null,
    });
  } catch (error) {
    logger
      ? logger.error(error)
      : console.log(error);

    if (!res.headersSent) {
      res.status(400).end();
    }
  }
}


export const config = {
  api: {
    bodyParser: false,
  },
}
