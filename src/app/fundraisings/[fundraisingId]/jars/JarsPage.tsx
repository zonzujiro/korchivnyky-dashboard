import {
  JarsPageStateProvider,
  getJarsPageData,
  getCurrentFundraising,
} from '@/dal';
import { Progress } from '@/library';
import { PageParams } from '@/types';

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
    <>
      <div className={styles['general-info']}>
        <Progress goal={fundraising.goal} jars={jars} />
        <CampaignDescription
          description={fundraising.description}
          startDate={fundraising.startDate}
          name={fundraising.name}
        />
      </div>
      <JarsPageStateProvider
        jars={jars}
        expenses={expenses}
        expenseTypes={expenseTypes}
        statistics={statistics}
        users={users}
      >
        <JarsList fundraisingId={fundraisingId} />
        <Statistics />
      </JarsPageStateProvider>
    </>
  );
};
