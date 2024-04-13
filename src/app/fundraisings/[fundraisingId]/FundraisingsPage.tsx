import { Suspense } from 'react';
import classNames from 'classnames';
import Link from 'next/link';

import type { PageParams } from '@/types';
import { Loader } from '@/library';
import { getFundraisingInfo, getFundraisingsPageData } from '@/dal';
import { toCurrency } from '@/toolbox';

import styles from './FundraisingsPage.module.css';
import { FundraisingInfo } from './components/FundraisingInfo/FundraisingInfo';

export const FundraisingsPage = async (props: PageParams) => {
  const { fundraisingId } = props.params;
  const { fundraisings } = await getFundraisingsPageData();

  const selectedFundraising = fundraisings.find(
    (fundraising) => fundraising.id === Number(fundraisingId)
  )!;

  const fundraisingInfoPromise = getFundraisingInfo({ fundraisingId });

  return (
    <div className={styles['fundraisings-page']}>
      <nav className={styles['fundraisings-mobile-list-wrapper']}>
        <ul className={styles['fundraisings-mobile-list']}>
          {fundraisings.map((item) => {
            return (
              <li
                key={item.id}
                className={classNames({
                  [styles['current-item']]: item.id === Number(fundraisingId),
                })}
              >
                <Link href={`./${item.id}`}>{item.name}</Link>
              </li>
            );
          })}
        </ul>
      </nav>
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
