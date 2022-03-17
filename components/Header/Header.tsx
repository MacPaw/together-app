import { useSession, signOut } from 'next-auth/react';
import styles from './Header.module.sass';
import { Button } from '@macpaw/macpaw-ui';

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className={styles.header}>
      <span className={styles.username}>Welcome, <strong>{session?.user?.name || 'Friend'}</strong></span>
      <Button color="secondary" scale="small" onClick={() => signOut()}>Sign Out</Button>
    </header>
  );
};

export default Header;
