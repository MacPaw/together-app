import type { NextApiRequest, NextApiResponse } from 'next';
import { memberService, locationService } from '../../services';
import { handleAPIErrors, validateHttpMethod } from '../../helpers/server';

interface Payload {
  memberId: string;
  latitude: number;
  longitude: number;
}

export default async function GetPlace(req: NextApiRequest, res: NextApiResponse) {
  try {
    validateHttpMethod('POST', req.method!);

    const { latitude, longitude, memberId }: Payload = req.body;

    await memberService.getById(memberId); // Throws an error if the member is not found

    const location = await locationService.getApproximatedLocationByLatLong({ latitude, longitude });
    const { country, state, city } = location;

    res.status(200).json({ country, state, city });
  } catch (error) {
    handleAPIErrors(error, res);
  }
}
