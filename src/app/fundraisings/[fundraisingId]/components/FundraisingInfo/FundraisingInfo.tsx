import { use } from 'react';
import Link from 'next/link';
import classNames from 'classnames';

import type { FundraisingCampaign } from '@/types';
import { getFundraisingInfo } from '@/dal';
import { getDateString } from '@/toolbox';
import { InvoicesInfo, Progress, JarsInfo, ExpenseTypesInfo } from '@/library';

import styles from './FundraisingInfo.module.css';

type FundraisingInfoProps = {
  fundraisingInfoPromise: ReturnType<typeof getFundraisingInfo>;
  fundraising: FundraisingCampaign;
};

export const FundraisingInfo = (props: FundraisingInfoProps) => {
  const { fundraisingInfoPromise, fundraising } = props;

  const { jars, statistics, expensesTypes, transactions, invoices } = use(
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
            <Link href={`./${fundraising.id}/expense-types`}>🧮 До витрат</Link>
          </div>
        </div>
        <div className={styles['progress-wrapper']}>
          <Progress
            jars={jars}
            goal={fundraising.goal}
            newestRecord={statistics[0]}
          />
        </div>
        <div className={styles['jar-and-invoices-wrapper']}>
          <JarsInfo jars={jars} />
          <ExpenseTypesInfo
            expenseTypes={expensesTypes}
            transactions={transactions}
            invoices={invoices}
            jars={jars}
          />
          <InvoicesInfo transactions={transactions} invoices={invoices} />
        </div>
      </div>
    </div>
  );
};
