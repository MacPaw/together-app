import mapboxgl, { LngLatBounds } from 'mapbox-gl';
import type { Feature, Point } from 'geojson';
import type { ProtectedMemberDto } from '../../entities';

export const getMemberBounds = (members: ProtectedMemberDto[]): LngLatBounds => {
  const bounds = new mapboxgl.LngLatBounds();

  members.forEach((member) => {
    if (!member.checkIn || !member.checkIn.longitude || !member.checkIn.latitude) return;

    bounds.extend([member.checkIn.longitude, member.checkIn.latitude]);
  });

  return bounds;
};

export const getFeaturesFromMembers = (members: ProtectedMemberDto[]): Feature<Point>[] => {
  const features: Feature<Point>[] = [];

  members.forEach((member) => {
    if (!member.checkIn || !member.checkIn.longitude || !member.checkIn.latitude) return;

    const coordinates = [member.checkIn.longitude, member.checkIn.latitude];
    const exists = features.find((f) => {
      return f.geometry.coordinates[0] === coordinates[0] && f.geometry.coordinates[1] === coordinates[1];
    });

    if (!exists) {
      features.push({
        type: 'Feature',
        properties: {
          lng: coordinates[0],
          lat: coordinates[1],
          count: 1,
        },
        geometry: {
          type: 'Point',
          coordinates,
        },
      });
    } else {
      exists.properties!.count += 1;
    }
  });

  return features;
}

export const filterMembersAtCoordinates = (coordinates: [number, number] | [], members: ProtectedMemberDto[]) => {
  return members.filter((member) => {
    if (!member.checkIn) {
      return false;
    }

    return member.checkIn.longitude === coordinates[0] && member.checkIn.latitude === coordinates[1];
  });
};
