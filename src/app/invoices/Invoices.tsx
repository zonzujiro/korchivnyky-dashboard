import { getInvoicesPageData } from '../dal';

import { InvoiceItem } from './Invoice/Invoice';
import styles from './Invoices.module.css';

export const Invoices = async () => {
  const { expensesTypes, invoices } = await getInvoicesPageData();

  return (
    <div className={styles['invoices-content-wrapper']}>
      {invoices.map((invoice) => (
        <InvoiceItem
          key={invoice.id}
          invoice={invoice}
          expenseType={
            expensesTypes.find(
              (expense) => expense.id === invoice.expensiveTypeId
            )!
          }
        />
      ))}
    </div>
  );
};
