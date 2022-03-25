import { HttpClient, HttpClientParams } from './HttpClient';
import { GoogleGeoCodingAPIError, LocationProviderError } from '../exceptions';
import { Location } from '../entities';

import type { ILocationProvider } from './interfaces';
import type { LatLongable, Nullable } from '../types';

type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
}

type GoogleGeoCodingResult = {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    location_type: string;
    viewport: {
      [key: string]: {
        lat: number;
        lng: number;
      }
    }
  }
  place_id: string;
  types: string[];
};

type GoogleGeoCodingByLatLongResponse = {
  results: Array<GoogleGeoCodingResult>;
  status: string;
  error_message: string;
}

type GoogleGeoCodingByPlaceIdResponse = {
  results: Array<GoogleGeoCodingResult & {
    plus_code: {
      compound_code: string;
      global_code: string;
    };
  }>;
  status: string;
  error_message: string;
}

type AnyGoogleGeoCodingResponse = GoogleGeoCodingByLatLongResponse | GoogleGeoCodingByPlaceIdResponse;

interface GeoCodingParams {
  language: string;
  key: string;
}

interface GeoCodingByLatLongParams extends GeoCodingParams {
  latlng: string;
}

interface GeoCodingByPlaceIdParams extends GeoCodingParams {
  place_id: string;
}

export interface LocationProviderParams extends HttpClientParams {
  language: string;
  token: string;
}

export class LocationService extends HttpClient implements ILocationProvider {
  private readonly language: string;

  private readonly token: string;

  constructor(params: LocationProviderParams) {
    super(params);

    this.language = params.language;
    this.token = params.token;
  }

  public async getApproximatedLocationByLatLong(params: LatLongable): Promise<Location> {
    const placeId = await this.findApproximatedPlaceIdByLatLong(params);

    if (placeId) {
      return this.getApproximatedLocationByPlaceId(placeId);
    }

    const response = await this.get<GeoCodingByLatLongParams, GoogleGeoCodingByLatLongResponse>({
      uri: '/geocode/json',
      query: {
        ...this.getCommonGeoCodingParams(),
        latlng: `${params.latitude},${params.longitude}`,
      },
    });

    LocationService.validateResponseHasNoErrors(response);

    const location = Boolean(response.results[0])
      ? LocationService.getLocationByGeoCodingResult(response.results[0])
      : null;

    if (!location || !location.isValid()) {
      throw new LocationProviderError();
    }

    return location;
  }

  public async getApproximatedLocationByPlaceId(placeId: string): Promise<Location> {
    const response = await this.get<GeoCodingByPlaceIdParams, GoogleGeoCodingByPlaceIdResponse>({
      uri: '/geocode/json',
      query: {
        ...this.getCommonGeoCodingParams(),
        place_id: placeId,
      },
    });

    LocationService.validateResponseHasNoErrors(response);

    const location = Boolean(response.results[0])
      ? LocationService.getLocationByGeoCodingResult(response.results[0])
      : null;

    if (!location || !location.isValid()) {
      throw new LocationProviderError();
    }

    return location;
  };

  private async findApproximatedPlaceIdByLatLong(params: LatLongable): Promise<Nullable<string>> {
    let placeId: Nullable<string> = null;

    const response = await this.get<GeoCodingByLatLongParams, GoogleGeoCodingByLatLongResponse>({
      uri: '/geocode/json',
      query: {
        ...this.getCommonGeoCodingParams(),
        latlng: `${params.latitude},${params.longitude}`,
      },
    });

    LocationService.validateResponseHasNoErrors(response);

    response.results.forEach((item: any) => {
      if (item.types.includes('locality')) {
        placeId = item.place_id;
      }
    });

    return placeId;
  }

  private static getLocationByGeoCodingResult(result: GoogleGeoCodingResult): Location {
    const location = new Location({
      country: null,
      state: null,
      city: null,
      latitude: null,
      longitude: null,
    });

    result.address_components.forEach((item) => {
      if (item.types.includes('country')) {
        location.setCountry(item.long_name);
      }

      if (item.types.includes('administrative_area_level_1')) {
        location.setState(item.long_name);
      }

      if (item.types.includes('locality')) {
        location.setCity(item.long_name);
      }
    });

    location.setLatitude(result.geometry.location.lat);
    location.setLongitude(result.geometry.location.lng);

    return location;
  }

  private getCommonGeoCodingParams(): GeoCodingParams {
    return { language: this.language, key: this.token };
  };

  private static validateResponseHasNoErrors(response: AnyGoogleGeoCodingResponse): void | never {
    if (response.status !== 'OK') {
      throw new GoogleGeoCodingAPIError({
        responseStatus: response.status,
        responseErrorMessage: response.error_message,
      });
    }
  }
}

