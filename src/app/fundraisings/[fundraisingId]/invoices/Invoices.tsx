import { Suspense } from 'react';

import type { PageParams } from '@/app/types';
import { getInvoicesPageData } from '@/app/dal';

import { InvoiceItem } from './Invoice/Invoice';
import styles from './Invoices.module.css';

export const Invoices = async ({ params }: PageParams) => {
  const { fundraisingId } = params;
  const { expensesTypes, invoices, expenses, jars, currentUser } =
    await getInvoicesPageData({ fundraisingId });

  const userJars = jars.filter((jar) => jar.userId === currentUser.id);

  return (
    <Suspense fallback={<p>🚙 Loading...</p>}>
      <div className={styles['invoices-content-wrapper']}>
        {invoices.map((invoice) => {
          const invoiceExpenses = expenses.filter(
            (expense) => expense.invoiceId === invoice.id
          );

          return (
            <InvoiceItem
              key={invoice.id}
              invoice={invoice}
              invoiceExpenses={invoiceExpenses}
              jars={userJars}
              expenseType={
                expensesTypes.find(
                  (expense) => expense.id === invoice.expensiveTypeId
                )!
              }
            />
          );
        })}
      </div>
    </Suspense>
  );
};
