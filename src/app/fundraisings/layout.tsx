import { Suspense, type ReactNode } from 'react';

import { Loader, NavigationSubMenu, SiteLogo } from '@/library';

import styles from './layout.module.css';

const FundraisingsLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <>
      <header className={styles.header}>
        <SiteLogo className={styles.logo} />
        <NavigationSubMenu />
      </header>

      <main className={styles.main}>
        <Suspense fallback={<Loader />}>{children}</Suspense>
      </main>
    </>
  );
};

export default FundraisingsLayout;
