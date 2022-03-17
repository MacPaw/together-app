import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { CloseIcon, SearchIcon } from '@macpaw/macpaw-ui/lib/Icons/jsx';
import styles from './Search.module.sass';
import { Button } from '@macpaw/macpaw-ui';
import debounce from 'lodash.debounce';

const Search = () => {
  const router = useRouter();
  const fieldRef = useRef<HTMLInputElement>(null);
  const searchQuery = router?.query?.search;
  const [isClearSearchDisabled, setIsClearSearchDisabled] = useState(!searchQuery);

  useEffect(() => {

    if(searchQuery) {
      fieldRef.current!.value = searchQuery as string;
    }
  }, [router?.query?.search]);

  const search = debounce(() => {
    const newUrl = fieldRef.current?.value ? `/members?search=${fieldRef.current?.value}` : '/members';
    router.push(newUrl, undefined, { shallow: true });
  }, 500);

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    search();
  };

  const onCloseButtonClear = () => {
    fieldRef.current!.value = '';
    search();
  };

  return (
    <div className={styles.search}>
      <form onSubmit={onSubmit} className={styles.form}>
        <SearchIcon className={styles.searchIcon} />
        <input
          type="text"
          ref={fieldRef}
          defaultValue={router.query.search || ''}
          onChange={(e) => {
            setIsClearSearchDisabled(!e.target.value.length);
          }}
          placeholder="Search by email or name…"
          className={styles.searchField}
        />
        <Button icon className={styles.searchClear} disabled={isClearSearchDisabled} onClick={onCloseButtonClear}>
          <CloseIcon />
        </Button>
      </form>
    </div>
  );
};

export default Search;
