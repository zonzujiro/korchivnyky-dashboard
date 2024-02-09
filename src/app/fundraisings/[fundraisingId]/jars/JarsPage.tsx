import { Suspense } from 'react';

import {
  StateProvider,
  getJarsPageData,
  getCurrentFundraising,
} from '@/app/dal';
import { Progress } from '@/app/library';
import { PageParams } from '@/app/types';

import styles from './JarsPage.module.css';
import { JarsList } from './JarsList/JarsList';
import { Statistics } from './Statistics/Statistics';
import { CampaignDescription } from './CampaignDescription/CampaignDescription';

export const JarsPage = async ({ params }: PageParams) => {
  const { fundraisingId } = params;

  const { jars, expenseTypes, expenses, statistics, fundraisings, users } =
    await getJarsPageData({ fundraisingId });

  const fundraising = getCurrentFundraising(fundraisings, fundraisingId);

  return (
    <Suspense fallback={<p>🚙 Loading...</p>}>
      <StateProvider
        jars={jars}
        expenses={expenses}
        expenseTypes={expenseTypes}
        statistics={statistics}
        users={users}
      >
        <div className={styles['general-info']}>
          <Progress goal={fundraising.goal} jars={jars} />
          <CampaignDescription
            description={fundraising.description}
            startDate={fundraising.startDate}
            name={fundraising.name}
          />
        </div>
        <JarsList />
        <Statistics />
      </StateProvider>
    </Suspense>
  );
};
