import type { FundraisingCampaign } from '@/types';
import { getDateString } from '@/toolbox';

import styles from './CampaignDescription.module.css';

type CampaignDescription = Pick<
  FundraisingCampaign,
  'name' | 'startDate' | 'description'
>;

export const CampaignDescription = ({
  name,
  description,
  startDate,
}: CampaignDescription) => {
  return (
    <div className={styles['campaign-description-wrapper']}>
      <h3>{name}</h3>
      <span>{description}</span>
      <span>
        <strong>Дата початку:</strong> {getDateString(startDate)}
      </span>
    </div>
  );
};
