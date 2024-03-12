import { use } from 'react';

import { getFundraisingInfo } from '@/dal';
import type { FundraisingCampaign } from '@/types';
import { getDateString } from '@/toolbox';
import { InvoicesInfo, Progress, JarsInfo, ExpensesTypesInfo } from '@/library';

import styles from './FundraisingInfo.module.css';
import Link from 'next/link';
import classNames from 'classnames';
import { ExpenseTypeDialog } from '../ExpenseTypeDialog/ExpenseTypeDialog';

type FundraisingInfoProps = {
  fundraisingInfoPromise: ReturnType<typeof getFundraisingInfo>;
  fundraising: FundraisingCampaign;
};

export const FundraisingInfo = (props: FundraisingInfoProps) => {
  const { fundraisingInfoPromise, fundraising } = props;

  const { jars, statistics, expensesTypes, expenses, invoices } = use(
    fundraisingInfoPromise
  );

  return (
    <div className={styles['fundraising-info']}>
      <div className={styles.column}>
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles['general-info']}>
              <h2>{fundraising.name}</h2>
              <p>{fundraising.description}</p>
              <p>{getDateString(fundraising.createdAt)}</p>
            </div>
          </div>
          <div className={classNames(styles.column, styles.links)}>
            <Link href={`./${fundraising.id}/jars`}>🫙 До банок</Link>
            <Link href={`./${fundraising.id}/invoices`}>🧾 До рахунків</Link>
          </div>
        </div>
        <div className={styles['progress-wrapper']}>
          <Progress jars={jars} goal={fundraising.goal} />
        </div>
        <div className={styles['jar-and-invoices-wrapper']}>
          <JarsInfo jars={jars} newestRecord={statistics[0]} />
          <InvoicesInfo
            expensesTypes={expensesTypes}
            expenses={expenses}
            invoices={invoices}
          />
        </div>
      </div>
      <div className={styles.column}>
        <div className={styles['expense-types-wrapper']}>
          <ExpenseTypeDialog fundraisingCampaignId={fundraising.id} />
          <ExpensesTypesInfo
            expensesTypes={expensesTypes}
            expenses={expenses}
            invoices={invoices}
          />
        </div>
      </div>
    </div>
  );
};
