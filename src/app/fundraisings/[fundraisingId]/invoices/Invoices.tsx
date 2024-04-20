import type { PageParams } from '@/types';
import { getInvoicesPageData } from '@/dal';
import { ExpenseTypesInfo, InvoicesInfo } from '@/library';

import { InvoicesList } from './InvoicesList';
import styles from './Invoices.module.css';

export const Invoices = async ({ params }: PageParams) => {
  const { fundraisingId } = params;
  const { expenseTypes, invoices, transactions, jars, users } =
    await getInvoicesPageData({ fundraisingId });

  return (
    <div className={styles['invoices-wrapper']}>
      <div className={styles['invoices-list']}>
        <InvoicesList
          transactions={transactions}
          jars={jars}
          expenseTypes={expenseTypes}
          users={users}
          invoices={invoices}
        />
      </div>
      <div className={styles['invoices-info']}>
        <InvoicesInfo transactions={transactions} invoices={invoices} />
        <ExpenseTypesInfo
          transactions={transactions}
          invoices={invoices}
          expenseTypes={expenseTypes}
          jars={jars}
        />
      </div>
    </div>
  );
};
