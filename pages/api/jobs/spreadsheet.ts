import type { NextApiRequest, NextApiResponse } from 'next';
import { memberService } from '../../../services';
import { handleAPIErrors, validateHttpMethod, validateJobsAPIToken } from '../../../helpers/server';
import { logger } from '../../../config/custom';
import axios, { AxiosError } from 'axios';

interface Payload {
  token: string;
}

export default async function Spreadsheet(req: NextApiRequest, res: NextApiResponse) {
  try {
    validateHttpMethod('GET', req.method!);

    const { token } = req.query as unknown as Payload;

    validateJobsAPIToken(token);
  } catch (error) {
    handleAPIErrors(error, res);

    return;
  }

  try {
    res.status(200).json({});

    let members = await memberService.getAllCheckInNonNull();

    const GOOGLESCRIPT_URL = process.env.GOOGLESCRIPT_URL!;
    const token = process.env.JOBS_API_TOKEN!;


    axios.post(`${GOOGLESCRIPT_URL}?action=postAbsense&token=${token}`, members)
    .then(() => console.log(`Data sent`))
    .catch((error) => {
      const hasErrorTextInResponse = axios.isAxiosError(error)
        && error.response
        && error.response.data
        && error.response.data.message;

      if (hasErrorTextInResponse) {
        console.log((error as AxiosError).response!.data!.message!);

        return;
      }

      const hasOtherErrorText = error instanceof Error && error.message;

      console.log(hasOtherErrorText ? (error as Error).message : 'Something went wrong. Try again.');
    });


    const message = 'The job `spreadsheet` has been completed successfully.';

    logger
      ? logger.info(message)
      : console.log(message);
  } catch (error) {
    const message = 'An error occurred while running the `spreadsheet` job.';

    logger
      ? logger.info(message)
      : console.log(message);

    logger
      ? logger.error(error)
      : console.log(error);
  }
};
