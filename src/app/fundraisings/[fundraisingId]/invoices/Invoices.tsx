import type { PageParams } from '@/types';
import { getInvoicesPageData } from '@/dal';
import { ExpensesTypesInfo, InvoicesInfo } from '@/library';

import { InvoicesList } from './InvoicesList';
import styles from './Invoices.module.css';

export const Invoices = async ({ params }: PageParams) => {
  const { fundraisingId } = params;
  const { expensesTypes, invoices, expenses, jars, users } =
    await getInvoicesPageData({ fundraisingId });

  return (
    <div className={styles['invoices-wrapper']}>
      <div className={styles['invoices-list']}>
        <InvoicesList
          expenses={expenses}
          jars={jars}
          expensesTypes={expensesTypes}
          users={users}
          invoices={invoices}
        />
      </div>
      <div className={styles['invoices-info']}>
        <ExpensesTypesInfo
          expenses={expenses}
          invoices={invoices}
          expensesTypes={expensesTypes}
        />
        <div className={styles['invoices-info-wrapper']}>
          <InvoicesInfo
            expenses={expenses}
            invoices={invoices}
            expensesTypes={expensesTypes}
          />
        </div>
      </div>
    </div>
  );
};
