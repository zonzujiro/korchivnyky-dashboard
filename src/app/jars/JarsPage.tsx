import styles from './JarsPage.module.css';

import { JarsList } from './JarsList/JarsList';
import { Progress } from './Progress/Progress';
import { Statistics } from './Statistics/Statistics';
import { CampaignDescription } from './CampaignDescription/CampaignDescription';
import { Suspense } from 'react';
import { StateProvider, getJarsPageData } from '../dal';

const GOAL = 2500000;

export const JarsPage = async () => {
  const { jars, expenseTypes, expenses, statistics } = await getJarsPageData();

  return (
    <StateProvider
      jars={jars}
      expenses={expenses}
      expenseTypes={expenseTypes}
      statistics={statistics}
    >
      <Suspense fallback={<p>🚙 Loading...</p>}>
        <div className={styles['general-info']}>
          <Progress goal={GOAL} jars={jars} />
          <CampaignDescription />
        </div>
        <JarsList />
        <Statistics />
      </Suspense>
    </StateProvider>
  );
};
