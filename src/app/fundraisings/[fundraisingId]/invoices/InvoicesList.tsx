'use client';

import { useContext } from 'react';

import type { ExpenseRecord, ExpenseType, Jar } from '@/app/types';
import { InvoicesPageContext } from '@/app/dal';

import { InvoiceItem } from './Invoice/Invoice';

import styles from './InvoicesList.module.css';
import { AddInvoiceDialog } from './AddInvoiceDialog/AddInvoiceDialog';

type InvoicesListProps = {
  expenses: Array<ExpenseRecord>;
  expensesTypes: Array<ExpenseType>;
  jars: Array<Jar>;
};

export const InvoicesList = ({
  expenses,
  expensesTypes,
  jars,
}: InvoicesListProps) => {
  const { invoices, addInvoice } = useContext(InvoicesPageContext);

  return (
    <div className={styles['invoices-content-wrapper']}>
      <div className={styles['invoices-toolbox']}>
        <AddInvoiceDialog
          expensesTypes={expensesTypes}
          addInvoice={addInvoice}
        />
      </div>
      <div className={styles['invoices-list']}>
        {invoices.map((invoice) => {
          const invoiceExpenses = expenses.filter(
            (expense) => expense.invoiceId === invoice.id
          );

          return (
            <InvoiceItem
              key={invoice.id}
              invoice={invoice}
              invoiceExpenses={invoiceExpenses}
              jars={jars}
              expenseType={
                expensesTypes.find(
                  (expense) => expense.id === invoice.expensiveTypeId
                )!
              }
            />
          );
        })}
      </div>
    </div>
  );
};
