import React, { useMemo } from 'react';
import { getCountriesForFilterByMembers } from '../../helpers/client';
import { Button, Select } from '@macpaw/macpaw-ui';
import styles from './Filters.module.sass';
import type { BooleanPropString, CheckInString } from '../../types';
import type { MemberDto } from '../../entities';

interface FiltersProps {
  members: MemberDto[];
  states: string[];
  cities: string[];
  filterByCountry: string;
  handleCountryFilter: (country: string) => void;
  filterByState: string;
  handleStateFilter: (state: string) => void;
  filterByCity: string;
  handleCityFilter: (city: string) => void;
  filterByCheckIn: CheckInString | '';
  handleCheckInFilter: (checkedIn: CheckInString | '') => void;
  filterIsSafe: BooleanPropString;
  handleIsSafeFilter: (isSafe: BooleanPropString) => void;
  filterCanWork: BooleanPropString;
  handleCanWorkFilter: (canWork: BooleanPropString) => void;
  filterIsMobilized: BooleanPropString;
  handleIsMobilizedFilter: (isMobilized: BooleanPropString) => void;
  filterAbleToAssist: BooleanPropString;
  handleAbleToAssistFilter: (isAbleToAssist: BooleanPropString) => void;
  handleClearFilters: () => void;
}

const Filters: React.FC<FiltersProps> = ({
                                           members,
                                           states,
                                           cities,
                                           filterByCountry,
                                           handleCountryFilter,
                                           filterByState,
                                           handleStateFilter,
                                           filterByCity,
                                           handleCityFilter,
                                           filterByCheckIn,
                                           handleCheckInFilter,
                                           filterIsSafe,
                                           handleIsSafeFilter,
                                           filterIsMobilized,
                                           handleIsMobilizedFilter,
                                           filterCanWork,
                                           handleCanWorkFilter,
                                           filterAbleToAssist,
                                           handleAbleToAssistFilter,
                                           handleClearFilters,
                                         }: FiltersProps) => {
  const memoizedCountries = useMemo(() => getCountriesForFilterByMembers(members), [members]);

  const changeCountryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = e.target.value;
    handleCountryFilter(selectedCountry);
  };

  const changeStateFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedState = e.target.value;

    handleStateFilter(selectedState);
  };

  const changeCityFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = e.target.value;

    handleCityFilter(selectedCity);
  };

  const changeCheckedInFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCheckedIn: any = e.target.value;

    handleCheckInFilter(selectedCheckedIn.toLowerCase());
  };

  const changeIsSafeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleIsSafeFilter(e.target.value as BooleanPropString);
  };

  const changeCanWorkFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleCanWorkFilter(e.target.value as BooleanPropString);
  };

  const changeIsMobilizedFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleIsMobilizedFilter(e.target.value as BooleanPropString);
  };

  const changeAbleToAssistFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleAbleToAssistFilter(e.target.value as BooleanPropString);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.filters}>
        <div className={styles.filtersRow}>
          <Select
            scale='small'
            label='Is Safe'
            value={filterIsSafe}
            onChange={changeIsSafeFilter}
            className={styles.select}
          >
            <option value='both'>All</option>
            <option value='yes'>Yes</option>
            <option value='no'>No</option>
          </Select>
          <Select
            scale='small'
            label='Can Work'
            value={filterCanWork}
            onChange={changeCanWorkFilter}
            className={styles.select}
          >
            <option value='both'>All</option>
            <option value='yes'>Yes</option>
            <option value='no'>No</option>
          </Select>
          <Select
            scale='small'
            label='Able To Assist'
            value={filterAbleToAssist}
            onChange={changeAbleToAssistFilter}
            className={styles.select}
          >
            <option value='both'>All</option>
            <option value='yes'>Yes</option>
            <option value='no'>No</option>
          </Select>
          <Select
            scale='small'
            label='Is Mobilized'
            value={filterIsMobilized}
            onChange={changeIsMobilizedFilter}
            className={styles.select}
          >
            <option value='both'>All</option>
            <option value='yes'>Yes</option>
            <option value='no'>No</option>
          </Select>
          <Select
            scale='small'
            label='Last Check In'
            value={filterByCheckIn}
            onChange={changeCheckedInFilter}
            className={styles.select}
          >
            <option value=''>All</option>
            <option value="24hrs">Past 24 Hours</option>
            <option value="48hrs">Past 48 Hours</option>
            <option value="never">Never</option>
            <option value="other">Other</option>
          </Select>
          <div className={styles.filtersRow}>
            <Select
              scale='small'
              label='Country'
              value={filterByCountry}
              onChange={changeCountryFilter}
              className={styles.select}
            >
              <option value=''>All</option>
              {memoizedCountries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </Select>
            <Select
              scale='small'
              label='State'
              value={filterByState}
              onChange={changeStateFilter}
              disabled={!filterByCountry}
              className={styles.select}
            >
              <option value=''>All</option>
              {states.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </Select>
            <Select
              scale='small'
              label='City'
              value={filterByCity}
              onChange={changeCityFilter}
              disabled={!filterByCountry}
              className={styles.select}
            >
              <option value=''>All</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </Select>
            <div className={styles.clearFilters}>
              <Button onClick={handleClearFilters} color="warning" outline scale="small">Clear All Filters</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
