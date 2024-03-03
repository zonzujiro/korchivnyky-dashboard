import { Suspense, type ReactNode } from 'react';

import { getFundraisingCampaigns } from '@/dal';
import { Loader, NavigationMenu, SiteLogo } from '@/library';

import styles from './layout.module.css';

const FundraisingsLayout = async ({ children }: { children: ReactNode }) => {
  const fundraisings = await getFundraisingCampaigns();

  return (
    <>
      <header className={styles.header}>
        <SiteLogo className={styles.logo} />
        <NavigationMenu fundraisings={fundraisings} />
      </header>

      <main className={styles.main}>
        <Suspense fallback={<Loader />}>{children}</Suspense>
      </main>
    </>
  );
};

export default FundraisingsLayout;
