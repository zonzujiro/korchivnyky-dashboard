'use client';

import styles from './HomePage.module.css';

import { JarsList } from './JarsList/JarsList';
import { Progress } from './Progress/Progress';
import { Statistics } from './Statistics/Statistics';
import { CampaignDescription } from './CampaignDescription/CampaignDescription';
import { Suspense } from 'react';

const GOAL = 2500000;

export const HomePage = async () => {
  return (
    <Suspense fallback={<p>🚙 Loading...</p>}>
      <div className={styles['general-info']}>
        <Progress goal={GOAL} />
        <CampaignDescription />
      </div>
      <JarsList />
      <Statistics />
    </Suspense>
  );
};
