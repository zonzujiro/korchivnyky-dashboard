import { getJarsPageData, getCurrentFundraising } from '@/dal';
import { Progress } from '@/library';
import { PageParams } from '@/types';

import styles from './JarsPage.module.css';
import { JarsList } from './JarsList/JarsList';
import { CampaignDescription } from './CampaignDescription/CampaignDescription';

export const JarsPage = async ({ params }: PageParams) => {
  const { fundraisingId } = params;

  const { jars, statistics, fundraisings, users } = await getJarsPageData({
    fundraisingId,
  });

  const fundraising = getCurrentFundraising(fundraisings, fundraisingId);

  return (
    <>
      <div className={styles['general-info']}>
        <div className={styles['goals-wrapper']}>
          <Progress
            goal={fundraising.goal}
            jars={jars}
            newestRecord={statistics[0]}
          />
        </div>
        <div className={styles['campaign-description-wrapper']}>
          <CampaignDescription
            description={fundraising.description}
            startDate={fundraising.startDate}
            name={fundraising.name}
          />
        </div>
      </div>

      <JarsList
        fundraisingId={fundraisingId}
        statistics={statistics}
        users={users}
        jars={jars}
      />
    </>
  );
};
