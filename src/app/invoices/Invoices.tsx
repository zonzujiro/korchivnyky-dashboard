import { Suspense } from 'react';
import { getInvoicesPageData } from '../dal';

import { InvoiceItem } from './Invoice/Invoice';
import styles from './Invoices.module.css';

export const Invoices = async () => {
  const { expensesTypes, invoices, expenses } = await getInvoicesPageData();

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
