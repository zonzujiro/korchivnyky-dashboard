'use client';

import styles from './HomePage.module.css';

import { JarsList } from './JarsList/JarsList';
import { Progress } from './Progress/Progress';
import { Statistics } from './Statistics/Statistics';
import { CampaignDescription } from './CampaignDescription/CampaignDescription';

const GOAL = 2500000;

export const HomePage = async () => {
  return (
    <>
      <div className={styles['general-info']}>
        <Progress goal={GOAL} />
        <CampaignDescription />
      </div>
      <JarsList />
      <Statistics />
    </>
  );
};
