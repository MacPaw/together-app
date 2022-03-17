import { GetServerSideProps } from 'next';
import { Feature, Point } from 'geojson';
import { useEffect, useRef, useState, useCallback, Fragment, ReactElement } from 'react';
import { getSession } from 'next-auth/react';
import { Dialog, DialogContent, Tag, Button } from '@macpaw/macpaw-ui';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { logger, MAPBOX_MAP_TOKEN, SLACK_WORKSPACE_ID } from '../../config';
import { memberService } from '../../services';
import {
  getMemberBounds,
  getFeaturesFromMembers,
  filterMembersAtCoordinates,
  getLastCheckInStringByMember,
  getShortLocationStringByMember,
  getLastCheckInTagColorByMember,
  getSlackUrlByMember,
} from '../../helpers/client';
import { validateSessionIsValid } from '../../helpers/server';
import styles from './Map.module.scss';
import type { ProtectedMemberDto } from '../../entities';
import { InvalidSessionError } from '../../exceptions';
import Layout from '../../components/Layout/Layout';
import Success from '../success';

interface MapProps {
  members: ProtectedMemberDto[];
  teamId: string;
  token: string;
  lnglat: [number, number];
}

const SOURCE_ID = 'source_employees';
const LAYER_ID = 'layer_employees';

export default function Map({ members, token, teamId, lnglat }: MapProps) {
  const map = useRef<mapboxgl.Map | null>(null);
  const [features, setFeatures] = useState<Feature<Point>[] | []>([]);
  const [selectedCoordinates, setSelectedCoordinates] = useState<[number, number] | []>([]);

  const addSource = useCallback(() => {
    map.current!.addSource(SOURCE_ID, {
      type: 'geojson',
      data: { type: 'FeatureCollection', features },
    });
  }, [features]);

  const addLayer = () => {
    map.current?.addLayer({
      id: LAYER_ID,
      type: 'circle',
      source: SOURCE_ID,
      paint: {
        'circle-radius': [
          'interpolate', ['linear'], ['get', 'count'],
          0, 5,
          10, 14,
        ],
        'circle-color': '#06c668',
        'circle-stroke-color': '#fff',
        'circle-stroke-width': 2,
      },
    });
  };

  const renderInitialDialogIfCan = () => {
    if (Boolean(lnglat.length)) {
      const memberMatches = filterMembersAtCoordinates(lnglat, members);
      const canRender = Boolean(memberMatches.length)

      canRender && setSelectedCoordinates(lnglat);
    }
  }

  const attachEvents = useCallback(() => {
    map.current?.on('mousemove', LAYER_ID, () => {
      map.current!.getCanvas().style.cursor = 'pointer';
    });

    map.current?.on('mouseleave', LAYER_ID, () => {
      map.current!.getCanvas().style.cursor = '';
    });

    map.current?.on('click', LAYER_ID, (event) => {
      if (!event.features || event.features.length === 0) return;

      const { lng, lat } = event.features[0].properties as { lng: number, lat: number };

      setSelectedCoordinates([lng, lat]);
    });
  }, []);

  useEffect(() => {
    setFeatures(getFeaturesFromMembers(members));
  }, [members]);

  useEffect(() => {
    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      ...members.length
        ? { bounds: getMemberBounds(members) }
        : {},
      fitBoundsOptions: { padding: 10 },
    });

    map.current.on('load', () => {
      addSource();
      addLayer();
      attachEvents();
      console.log('loaded');
      renderInitialDialogIfCan();
    });

    return () => {
      map.current?.remove();
    };
  }, [token, members, addSource, attachEvents]);

  return (
    <div>
      <div id="map" className={styles.map}/>
      <Dialog
        isOpen={selectedCoordinates.length > 0}
        onRequestClose={() => setSelectedCoordinates([])}
      >
        {selectedCoordinates.length && <DialogContent>
          <h4 className={styles.title}>
            {getShortLocationStringByMember(filterMembersAtCoordinates(selectedCoordinates, members)[0])}
          </h4>
          <div className={styles.employees}>
            <h6>Name</h6>
            <h6>Last Check In</h6>
            <h6>Message In Slack</h6>
            {filterMembersAtCoordinates(selectedCoordinates, members).map((member) => (
              <Fragment key={member.id}>
                <div>{`${member.name}`}</div>
                <Tag color={getLastCheckInTagColorByMember(member)} style={{ borderRadius: 20 }}>
                  {getLastCheckInStringByMember(member)}
                </Tag>
                <Button color='secondary' href={getSlackUrlByMember(member, teamId)} outline scale="small">Message in
                  Slack</Button>
              </Fragment>
            ))}
          </div>
        </DialogContent>}
      </Dialog>
    </div>
  );
};

export interface QueryParams {
  lng: string;
  lat: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { lng, lat } = context.query as unknown as QueryParams;
    const session = await getSession(context);

    validateSessionIsValid(session);

    const members = await memberService.getAllCheckInNonNull();

    return {
      props: {
        lnglat: Boolean(lng && lat) ? [parseFloat(lng), parseFloat(lat)] : [],
        token: MAPBOX_MAP_TOKEN,
        teamId: SLACK_WORKSPACE_ID,
        members: members
          .filter((member) => !member.isOptedOutOfMap)
          .map((member) => member.toProtectedDto()),
      },
    };
  } catch (error) {
    if (error instanceof InvalidSessionError) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    logger
      ? logger.error(error)
      : console.log(error);

    throw new Error('Something went wrong. Try again later.');
  }
};
