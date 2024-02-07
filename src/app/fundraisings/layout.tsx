import type { ReactNode } from 'react';

import { getFundraisingCampaigns } from '@/app/dal';

import styles from './layout.module.css';
import { NavigationMenu, SiteLogo } from '../library';

const FundraisingsLayout = async ({ children }: { children: ReactNode }) => {
  const fundraisings = await getFundraisingCampaigns();

  return (
    <>
      <header className={styles.header}>
        <SiteLogo />
        <NavigationMenu fundraisings={fundraisings} />
      </header>

      <main className={styles.main}>{children}</main>
    </>
  );
};

export default FundraisingsLayout;
