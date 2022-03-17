import { NextApiResponse } from 'next';
import { ApplicationError } from '../../exceptions';
import { logger } from '../../config/custom';

export const handleAPIErrors = (error: unknown, res: NextApiResponse): void => {
  logger
    ? logger.error(error)
    : console.log(error);

  if (error instanceof ApplicationError) {
    res.status(error.status).json({ code: error.code, message: error.message });

    return;
  }

  res.status(500).json({ code: null, message: 'Something went wrong. Please try again.' });
}
