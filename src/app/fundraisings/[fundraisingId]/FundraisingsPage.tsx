import { Suspense } from 'react';
import classNames from 'classnames';
import Link from 'next/link';

import type { PageParams } from '@/types';
import { Loader } from '@/library';
import { getFundraisingInfo, getFundraisingsPageData } from '@/dal';
import { toCurrency } from '@/toolbox';

import styles from './FundraisingsPage.module.css';
import { FundraisingInfo } from './components/FundrasingInfo/FundrasingInfo';

export const FundraisingsPage = async (props: PageParams) => {
  const { fundraisingId } = props.params;
  const { fundraisings } = await getFundraisingsPageData();

  const selectedFundraising = fundraisings.find(
    (fundraising) => fundraising.id === Number(fundraisingId)
  )!;

  const fundraisingInfoPromise = getFundraisingInfo({ fundraisingId });

  return (
    <div className={styles['fundraisings-page']}>
      {/* <div className={styles['fundraisings-mobile-list-wrapper']}>
        <select
          className={styles['fundraising-select']}
          defaultValue={fundraisingId}
        >
          {fundraisings.map((item) => {
            return (
              <option value={item.id} key={item.id}>
                <Link href={`./${item.id}`}>{item.name}</Link>
              </option>
            );
          })}
        </select>
      </div> */}
      <div className={styles['fundraisings-list-wrapper']}>
        <h3>Актуальні збори</h3>
        <ul className={styles['fundraisings-list']}>
          {fundraisings.map((campaign) => (
            <li key={campaign.id}>
              <Link
                href={`./${campaign.id}`}
                className={classNames(styles['list-item-link'], {
                  [styles.selected]: campaign.id === Number(fundraisingId),
                })}
              >
                <h4>{campaign.name}</h4>
                <p>{toCurrency(campaign.goal)}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles['fundraisings-info-wrapper']}>
        <h3>Опис збору</h3>
        <Link href={`./${fundraisingId}/jars`}>Перейти до збору</Link>
        <Suspense fallback={<Loader />}>
          <FundraisingInfo
            fundraisingInfoPromise={fundraisingInfoPromise}
            fundraising={selectedFundraising}
          />
        </Suspense>
      </div>
    </div>
  );
};
