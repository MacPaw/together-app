import { Nullable } from '../types';

export interface LocationAttributes {
  country: Nullable<string>;
  state: Nullable<string>;
  city: Nullable<string>;
  latitude: Nullable<number>;
  longitude: Nullable<number>;
}

export class Location {
  public country: Nullable<string>;

  public state: Nullable<string>;

  public city: Nullable<string>;

  public latitude: Nullable<number>;

  public longitude: Nullable<number>;

  constructor(params: LocationAttributes) {
    this.country = params.country;
    this.state = params.state;
    this.city = params.city;
    this.latitude = params.latitude;
    this.longitude = params.longitude;
  }

  setCountry(country: string): void {
    this.country = country;
  }

  setState(state: string): void {
    this.state = state;
  }

  setCity(city: string): void {
    this.city = city;
  }

  setLatitude(latitude: number): void {
    this.latitude = latitude;
  }

  setLongitude(longitude: number): void {
    this.longitude = longitude;
  }

  isValid(): boolean {
    return Boolean(this.latitude && this.longitude && this.country);
  }
}
