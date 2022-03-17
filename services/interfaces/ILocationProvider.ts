import type { Location } from '../../entities';
import type { LatLongable } from '../../types';

export interface ILocationProvider {
  getApproximatedLocationByLatLong(params: LatLongable): Promise<Location>;

  getApproximatedLocationByPlaceId(placeId: string): Promise<Location>;
}
