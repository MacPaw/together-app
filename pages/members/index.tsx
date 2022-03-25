import type { ReactElement } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Layout from '../../components/Layout/Layout';
import styles from './Members.module.css';
import {
  filterMembersByCity,
  filterMembersByCountry,
  filterMembersByLastCheckInString,
  filterMembersByIsSafe,
  filterMembersByIsMobilized,
  filterMembersByIsAbleToAssist,
  filterMembersByState,
  filterMembersByCanWork,
  getCitiesForFiltersByCountryOrState,
  getStatesForFiltersByCountry,
  sortMembersByEmailAsc,
} from '../../helpers/client';
import { normalizeString, validateSessionIsValid } from '../../helpers/server';
import MemberList from '../../components/MemberList/MemberList';
import Search from '../../components/Search/Search';
import Filters from '../../components/Filters/Filters';
import { memberService } from '../../services';
import { InvalidSessionError } from '../../exceptions';
import type { MemberDto } from '../../entities';
import type { CheckInString, BooleanPropString } from '../../types';
import { SLACK_WORKSPACE_ID, logger } from '../../config';

interface MembersProps {
  teamId: string;
  members: MemberDto[];
}

export default function Employees({ members, teamId }: MembersProps) {
  const [upToDateMembers, setUpToDateMembers] = useState<MemberDto[]>(members);
  const [filterByCountry, setFilterByCountry] = useState('');
  const [filterByState, setFilterByState] = useState('');
  const [filterByCity, setFilterByCity] = useState('');
  const [filterIsSafe, setFilterIsSafe] = useState<BooleanPropString>('both');
  const [filterIsMobilized, setFilterIsMobilized] = useState<BooleanPropString>('both');
  const [filterCanWork, setFilterCanWork] = useState<BooleanPropString>('both');
  const [filterAbleToAssist, setFilterAbleToAssist] = useState<BooleanPropString>('both');
  const [filterByCheckIn, setFilterByCheckIn] = useState<CheckInString | ''>('');
  const [filteredMembers, setFilteredMembers] = useState<MemberDto[]>(members);

  const handleClearFilters = () => {
    setFilterByCountry('');
    setFilterByState('');
    setFilterByCity('');
    setFilterIsSafe('both');
    setFilterIsMobilized('both');
    setFilterCanWork('both');
    setFilterAbleToAssist('both');
    setFilterByCheckIn('');
  };

  const replaceMember = (member: MemberDto): void => {
    const updated = upToDateMembers.map((memberDto) => {
      if (memberDto.id === member.id) {
        return member;
      }

      return memberDto;
    });

    setUpToDateMembers(updated);
  };

  const getFilteredMembers = () => {
    let filteredList = upToDateMembers;

    if (filterByCountry) {
      filteredList = filterMembersByCountry(filterByCountry, filteredList);
    }

    if (filterByState) {
      filteredList = filterMembersByState(filterByState, filteredList);
    }

    if (filterByCity) {
      filteredList = filterMembersByCity(filterByCity, filteredList);
    }

    if (filterByCheckIn) {
      filteredList = filterMembersByLastCheckInString(filterByCheckIn, filteredList);
    }

    if (filterIsSafe) {
      filteredList = filterMembersByIsSafe(filterIsSafe, filteredList);
    }

    if (filterCanWork) {
      filteredList = filterMembersByCanWork(filterCanWork, filteredList);
    }

    if (filterIsMobilized) {
      filteredList = filterMembersByIsMobilized(filterIsMobilized, filteredList);
    }

    if (filterAbleToAssist) {
      filteredList = filterMembersByIsAbleToAssist(filterAbleToAssist, filteredList);
    }

    return filteredList;
  };

  const memoizedFilteredEmployees = useMemo(
    () => getFilteredMembers(),
    [
      upToDateMembers,
      filterByCountry,
      filterByState,
      filterByCity,
      filterByCheckIn,
      filterIsSafe,
      filterCanWork,
      filterIsMobilized,
      filterAbleToAssist,
    ]);

  const handleCountryFilter = (country: string) => {
    setFilterByCountry(country);
    setFilterByState('');
  };

  useEffect(() => {
    setFilteredMembers(memoizedFilteredEmployees);
  }, [memoizedFilteredEmployees]);

  const handleStateFilter = (state: string) => {
    setFilterByState(state);
    setFilterByCity('');
  };

  const handleCityFilter = (city: string) => {
    setFilterByCity(city);
  };

  const handleCheckInFilter = (checkedIn: CheckInString | '') => {
    setFilterByCheckIn(checkedIn);
  };

  const handleIsSafeFilter = (isSafe: BooleanPropString) => {
    setFilterIsSafe(isSafe);
  };

  const handleCanWorkFilter = (canWork: BooleanPropString) => {
    setFilterCanWork(canWork);
  };

  const handleIsMobilizedFilter = (isMobilized: BooleanPropString) => {
    setFilterIsMobilized(isMobilized);
  };

  const handleAbleToAssistFilter = (isAbleToAssist: BooleanPropString) => {
    setFilterAbleToAssist(isAbleToAssist);
  };

  const memoizedStates = useMemo(() => getStatesForFiltersByCountry(filterByCountry, upToDateMembers), [filterByCountry]);
  const memoizedCities = useMemo(() => getCitiesForFiltersByCountryOrState(filterByCountry, filterByState, upToDateMembers), [filterByCountry, filterByState]);

  return (
    <div className={styles.container}>
      <Filters
        members={upToDateMembers}
        states={memoizedStates}
        cities={memoizedCities}
        filterByCountry={filterByCountry}
        handleCountryFilter={handleCountryFilter}
        filterByState={filterByState}
        handleStateFilter={handleStateFilter}
        filterByCity={filterByCity}
        handleCityFilter={handleCityFilter}
        filterByCheckIn={filterByCheckIn}
        handleCheckInFilter={handleCheckInFilter}
        filterIsSafe={filterIsSafe}
        handleIsSafeFilter={handleIsSafeFilter}
        filterIsMobilized={filterIsMobilized}
        handleIsMobilizedFilter={handleIsMobilizedFilter}
        filterAbleToAssist={filterAbleToAssist}
        handleAbleToAssistFilter={handleAbleToAssistFilter}
        filterCanWork={filterCanWork}
        handleCanWorkFilter={handleCanWorkFilter}
        handleClearFilters={handleClearFilters}
      />
      <Search/>
      <MemberList
        teamId={teamId}
        members={filteredMembers}
        total={upToDateMembers.length}
        replaceMember={replaceMember}
      />
    </div>
  );
}

Employees.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const session = await getSession(context);

    validateSessionIsValid(session);

    const email = normalizeString(session!.user!.email!);
    const user = await memberService.getByEmail(email);
    const members = user.isAdmin
      ? await memberService.getAll()
      : [];
    const dtos = members.map((member) => member.toDto());

    return {
      props: {
        teamId: SLACK_WORKSPACE_ID,
        members: sortMembersByEmailAsc(dtos),
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
