import type { ReactElement } from 'react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { getSession } from 'next-auth/react';
import { Button } from '@macpaw/macpaw-ui/lib/ui';
import Layout from '../components/Layout/Layout';
import BlockLayout from '../components/BlockLayout/BlockLayout';
import styles from './Home.module.css';
import { memberService } from '../services';
import React from 'react';
import type { MemberDto } from '../entities';
import { InvalidSessionError } from '../exceptions';
import { validateSessionIsValid, normalizeString } from '../helpers/server';
import { logger } from '../config';

interface HomeProps {
  user: MemberDto;
}

export default function Home({ user }: HomeProps) {
  return (
    <div className={styles.container}>
      <BlockLayout
        icon={<Image src="/images/members.svg" height={80} width={80} alt="Member Check Ins"/>}
        title="Member Check Ins"
        subtitle="Review organization members and their check ins."
        className={styles.blockCard}
        link={(
          <Button
            color='secondary'
            href='/members'
            outline
          >
            View
          </Button>
        )}
      />
      <BlockLayout
        icon={<Image src="/images/map.svg" height={80} width={80} alt="Member Map"/>}
        title="Organization Map"
        subtitle="Find members from the organization near you."
        className={styles.blockCard}
        link={(
          <Button
            color='secondary'
            href='/map'
            outline
          >
            View
          </Button>
        )}
      />
    </div>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const session = await getSession(context);

    validateSessionIsValid(session);

    const email = normalizeString(session!.user!.email!);
    const user = await memberService.getByEmail(email);

    return {
      props: { user: user.toDto() },
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

