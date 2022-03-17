import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import type { OAuthProviderType } from 'next-auth/providers';
import { Panel, Button } from '@macpaw/macpaw-ui';
import { HOST, authProviderConfig } from '../../config';

import together from '../../public/images/together.svg';
import styles from './Login.module.sass';
import { GetServerSideProps } from 'next';

export interface LogInProps {
  host: string;
  provider: OAuthProviderType;
}

const Login = ({ host, provider }: LogInProps) => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const router = useRouter();

  useEffect(() => {
    if (!loading && session) {
      router.push('/');
    }
  }, [session, loading, router]);

  if (typeof window !== 'undefined' && loading) return null;

  return (
    <div className={styles.container}>
      <Panel style={{ maxWidth: 480, width: '100%', margin: 'auto', textAlign: 'center' }}>
        <Image
          src={together}
          alt="MacPaw Logo"
          width={104}
          height={104}
        />
        <h3>Welcome!</h3>
        <p style={{ marginBottom: '32px' }}>Please sign in to access <strong>Together App</strong>.</p>
        <Button color="secondary" onClick={
          () => signIn(provider, { callbackUrl: host })
        }>
          Sign In With SSO
        </Button>
      </Panel>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      host: HOST,
      provider: authProviderConfig
        ? authProviderConfig.type
        : 'okta',
    },
  };
}

export default Login;
