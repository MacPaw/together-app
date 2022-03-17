import type { NextApiRequest, NextApiResponse } from 'next';
import { memberService, locationService } from '../../services';
import { NoLocationParamsProvidedError } from '../../exceptions';
import { handleAPIErrors, validateHttpMethod, validateMemberCheckInToken } from '../../helpers/server';
import type { Location } from '../../entities';
import type { Nullable } from '../../types';

interface Payload {
  memberId: string;
  checkInToken: string;
  latitude: Nullable<number>;
  longitude: Nullable<number>;
  isSafe: boolean;
  isAbleToAssist: boolean;
  isAbleToWork: boolean;
  comment: string;
  placeId: Nullable<string>;
}

export default async function SubmitCheckIn(req: NextApiRequest, res: NextApiResponse) {
  try {
    validateHttpMethod('POST', req.method!);

    const {
      memberId,
      checkInToken,
      latitude,
      longitude,
      placeId,
      isSafe,
      isAbleToAssist,
      isAbleToWork,
      comment,
    }: Payload = req.body;

    const member = await memberService.getById(memberId);

    validateMemberCheckInToken({ member, checkInToken });

    let location: Nullable<Location> = null;

    if (placeId) {
      location = await locationService.getApproximatedLocationByPlaceId(placeId);
    }

    if (!placeId && latitude && longitude) {
      location = await locationService.getApproximatedLocationByLatLong({ latitude, longitude });
    }

    if (!location) {
      throw new NoLocationParamsProvidedError();
    }

    await memberService.checkIn({
      member,
      attributes: {
        ...location,
        isSafe,
        isAbleToAssist,
        isAbleToWork,
        comment: !!comment.length ? comment : null,
      },
    });

    res.status(200).json({ data: null });
  } catch (error) {
    handleAPIErrors(error, res);
  }
}
