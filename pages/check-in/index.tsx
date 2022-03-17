import React, { useEffect, useState } from 'react';
import { LatLongable, Maybe, ObjectLiteral } from '../../types';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FormRow, Select, Input, Button, Banner } from '@macpaw/macpaw-ui';
import { InputValueType } from '@macpaw/macpaw-ui/lib/types';
import { GetServerSideProps } from 'next';
import { memberService } from '../../services';
import {
  RefreshingIcon,
  CheckIcon,
  ErrorIcon,
  AccountIcon,
} from '@macpaw/macpaw-ui/lib/Icons/jsx';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import styles from './CheckIn.module.sass';
import { ALLOWED_REFERRER_ID, GOOGLE_PLACES_API_TOKEN, logger } from '../../config';
import { validateMemberCheckInToken } from '../../helpers/server';

import type { Nullable } from '../../types';
import { InvalidCheckInTokenError, MemberNotFoundError } from '../../exceptions';

interface CheckInProps {
  googleApiKey: Nullable<string>;
  name: Nullable<string>;
  email: Nullable<string>;
  error: Nullable<string>;
}

export default function CheckIn(props: CheckInProps) {
  const router = useRouter();
  const [isGeolocationAvailable, setIsGeolocationAvailable] = useState(true);
  const [coords, setCoords] = useState<Maybe<LatLongable>>(null);
  const [place, setPlace] = useState('');
  const [geoDisabledByUser, setGeoDisabledByUser] = useState(false);
  const [isSafeValue, setIsSafeValue] = useState('');
  const [isAbleToAssistValue, setIsAbleToAssistValue] = useState('');
  const [isAbleToWorkValue, setIsAbleToWorkValue] = useState('');
  const [safeError, setsafeError] = useState<boolean | string>(false);
  const [ableToAssistError, setAbleToAssistError] = useState<boolean | string>(
    false,
  );
  const [ableToWorkError, setAbleToWorkError] = useState<boolean | string>(
    false,
  );
  const [commentValue, setCommentValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const { memberId, checkInToken, defaultToSearch } = router.query;
  const [isManualMode, setIsManualMode] = useState(Boolean(defaultToSearch));
  const [placeId, setPlaceId] = useState(null);
  const [placeIdError, setPlaceIdError] = useState('');

  useEffect(() => {
    const isGeolocation = 'geolocation' in navigator;

    if (!isGeolocation) {
      setIsGeolocationAvailable(false);
    } else {
      if (!isManualMode && !props.error) {
        navigator.geolocation.getCurrentPosition((position) => {
            setCoords({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });

            axios
              .post('/api/get-place', {
                memberId,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              })
              .then((response) => {
                const { data } = response;

                setPlace(
                  `${[data.city, data.state, data.country]
                    .filter((data) => Boolean(data))
                    .join(', ')}`,
                );
              })
              .catch((error) => {
                setIsManualMode(true);
                setGlobalError('Sorry, we could not detect your location. Please search for your city manually.');
              });
          },
          (error) => {
            if (error.code === 1) {
              setGeoDisabledByUser(true);
            }
            if (error.code === 2 || error.code === 3) {
              setIsManualMode(true);
              setGlobalError('Sorry, we could not detect your location. Please search for your city manually.');
            }
          },
        );
      }
    }
  }, [defaultToSearch, isManualMode]);

  function isValid() {
    const errorMessage = 'This field is required.';

    if (!isSafeValue.length) {
      setsafeError(errorMessage);
    }

    if (!isAbleToAssistValue.length) {
      setAbleToAssistError(errorMessage);
    }

    if (!isAbleToWorkValue.length) {
      setAbleToWorkError(errorMessage);
    }

    if (isManualMode && !placeId) {
      setPlaceIdError('Please select a location.');
    }

    if (isManualMode) {
      return !Boolean(
        !isSafeValue.length ||
        !isAbleToAssistValue.length ||
        !isAbleToWorkValue.length ||
        !placeId,
      );
    } else {
      return !Boolean(!isSafeValue.length ||
        !isAbleToAssistValue.length ||
        !isAbleToWorkValue.length);
    }
  }

  const submit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (isValid()) {
      setIsSubmitting(true);
      axios
        .post('/api/submit-check-in', {
          memberId,
          checkInToken,
          latitude: coords?.latitude || null,
          longitude: coords?.longitude || null,
          isSafe: isSafeValue === 'yes',
          isAbleToAssist: isAbleToAssistValue === 'yes',
          isAbleToWork: isAbleToWorkValue === 'yes',
          comment: commentValue,
          placeId: placeId || null,
        })
        .then(() => {
          setIsSubmitting(false);
          setIsSubmitted(true);

          return router.push('/success');
        })
        .catch(<T extends Error>(error: T) => {
          if (axios.isAxiosError(error) && error.response && error.response.data) {
            setIsSubmitting(false);

            const errorCode = error.response.data.code ?? 400;
            const errorMessage = error.response.data.message ?? 'Something went wrong.';

            if (errorCode === 'couldNotFetchLocationData') {
              setIsManualMode(true);
              setGlobalError('Sorry, we could not detect your location. Please search for your city manually.');
            } else {
              setGlobalError(errorMessage);
            }
          } else {
            setGlobalError('Something went wrong. Please try again.');
          }
        });
    }
  };

  const isSafeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setsafeError(false);
    setIsSafeValue(event.target.value);
  };

  const isAbleToAssistChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setAbleToAssistError(false);
    setIsAbleToAssistValue(event.target.value);
  };

  const isAbleToWorkChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAbleToWorkError(false);
    setIsAbleToWorkValue(event.target.value);
  };

  const commentChange = (value: InputValueType) => {
    setCommentValue(value as string);
  };

  if (!memberId || !checkInToken) {
    return (
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <Banner icon={<ErrorIcon/>}>Invalid URL. Please try again through the Slack app.</Banner>;
        </div>
      </div>
    );
  }

  if (props.error) {
    const messages: ObjectLiteral = {
      invalidToken: 'Your session has expired. Please try again through the Slack application',
      notAuthed: 'You do not have permission to view this content.',
      unknownError: 'Something unexpectedly went wrong. Please try again.',
    };

    const message = messages[props.error] || messages.unknownError;

    return (
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <Banner icon={<ErrorIcon/>}>{message}</Banner>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        {globalError && (
          <Banner icon={<ErrorIcon/>} style={{ margin: '0 0 16px' }}>{globalError}</Banner>
        )}
        <Banner type="secondary" icon={<AccountIcon/>} style={{ margin: '0 0 16px' }}>
          <><strong>Checking In: </strong><span>{props.name} ({props.email})</span></>
        </Banner>
        {isGeolocationAvailable ? (
          !isManualMode && (
            geoDisabledByUser ? (
              <Banner
                icon={<ErrorIcon/>}
                style={{ margin: '0 0 16px' }}
                action={
                  <Button
                    scale="small"
                    color="secondary"
                    outline
                    onClick={() => setIsManualMode(true)}
                  >
                    Search Manually
                  </Button>
                }
              >
                Please, allow permission for this page to use your location, or search for a location manually.
              </Banner>
            ) : (
              place ? (
                <Banner
                  type="secondary"
                  icon={<CheckIcon/>}
                  style={{ margin: '0 0 16px' }}
                  action={
                    <Button
                      scale="small"
                      color="secondary"
                      outline
                      onClick={() => setIsManualMode(true)}
                    >
                      Search Manually
                    </Button>
                  }
                >
                  <strong>Current Location: </strong><span>{place}</span>
                </Banner>
              ) : (
                <Banner
                  type="secondary"
                  icon={<RefreshingIcon/>}
                  style={{ margin: '0 0 16px' }}
                  action={
                    <Button
                      scale="small"
                      color="secondary"
                      outline
                      onClick={() => setIsManualMode(true)}
                    >
                      Search Manually
                    </Button>
                  }
                >
                  Checking your location for the check in...
                </Banner>
              )
            )
          )
        ) : (
          <Banner>
            Your browser does not support geolocation.
            action={
            <Button
              scale="small"
              color="secondary"
              outline
              onClick={() => setIsManualMode(true)}
            >
              Search Manually
            </Button>
          }
          </Banner>
        )}
        {isManualMode && (
          <div style={{ margin: '0 0 16px' }}>
            <h6 className="h6">Which city and country are you in at the moment?</h6>
            <GooglePlacesAutocomplete
              apiKey={props.googleApiKey!}
              apiOptions={{ language: 'en' }}
              selectProps={{
                placeId,
                onChange: (value: any) => {
                  setPlaceId(value.value.place_id);
                  setPlaceIdError('');
                },
                placeholder: 'Begin typing your city’s name…',
              }}
            />
            {placeIdError && <p style={{ color: '#e13e3e', fontSize: '12px', margin: 0 }}>{placeIdError}</p>}
          </div>
        )}
        <form onSubmit={submit}>
          <FormRow>
            <Select
              error={safeError}
              name='isSafe'
              label='Are you in a safe place?'
              value={isSafeValue}
              selected=''
              onChange={isSafeChange}
            >
              <option disabled value=''>
                Select
              </option>
              <option value='yes'>Yes</option>
              <option value='no'>No</option>
            </Select>
          </FormRow>
          <FormRow>
            <Select
              error={ableToAssistError}
              name='isAbleToAssist'
              label='Are you able to help with anti-war initiatives?'
              value={isAbleToAssistValue}
              selected=''
              onChange={isAbleToAssistChange}
            >
              <option disabled value=''>
                Select
              </option>
              <option value='yes'>Yes</option>
              <option value='no'>No</option>
            </Select>
          </FormRow>
          <FormRow>
            <Select
              error={ableToWorkError}
              name='isAbleToWork'
              label='Are you able to work?'
              value={isAbleToWorkValue}
              selected=''
              onChange={isAbleToWorkChange}
            >
              <option disabled value=''>
                Select
              </option>
              <option value='yes'>Yes</option>
              <option value='no'>No</option>
            </Select>
          </FormRow>
          <FormRow>
            <Input
              value={commentValue}
              onChange={commentChange}
              multiline
              rows={5}
              name='comment'
              label='Comment'
              placeholder='Any additional information we need to know?'
            />
          </FormRow>
          <Button
            type='submit'
            color='secondary'
            style={{ width: 200 }}
            disabled={isSubmitting || !isManualMode && !coords}
          >
            Check In
          </Button>
        </form>
      </div>
    </div>
  );
}

export interface QueryParams {
  referrerId: string;
  memberId: string;
  checkInToken: string;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    const { referrerId, memberId, checkInToken } = query as unknown as QueryParams;
    const hasAllParams = Boolean(referrerId && memberId && checkInToken);
    const hasValidReferrerId = ALLOWED_REFERRER_ID === referrerId;
    const idIsValidType = typeof memberId === 'string';
    const checkInTokenIsValidType = typeof checkInToken === 'string';

    if (!hasAllParams || !hasValidReferrerId || !idIsValidType || !checkInTokenIsValidType) {
      return { props: { error: 'notAuthed' } };
    }

    const member = await memberService.getById(memberId);

    validateMemberCheckInToken({ member, checkInToken });

    const props: CheckInProps = {
      googleApiKey: GOOGLE_PLACES_API_TOKEN,
      name: member.name,
      email: member.email,
      error: null,
    };

    return { props };
  } catch (error) {
    logger
      ? logger.error(error)
      : console.log(error);

    const props: CheckInProps = {
      googleApiKey: null,
      name: null,
      email: null,
      error: 'unknownError',
    };

    if (error instanceof MemberNotFoundError) {
      props.error = 'notAuthed';
    }

    if (error instanceof InvalidCheckInTokenError) {
      props.error = 'invalidToken';
    }

    return { props };
  }
};
