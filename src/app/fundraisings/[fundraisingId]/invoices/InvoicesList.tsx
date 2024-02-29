'use client';

import { useContext } from 'react';

import type { ExpenseRecord, ExpenseType, Jar, User } from '@/types';
import { InvoicesPageContext } from '@/dal';

import { Invoice } from './Invoice/Invoice';

import styles from './InvoicesList.module.css';
import { AddInvoiceDialog } from './AddInvoiceDialog/AddInvoiceDialog';

type InvoicesListProps = {
  expenses: Array<ExpenseRecord>;
  expensesTypes: Array<ExpenseType>;
  jars: Array<Jar>;
  users: Array<User>;
};

export const InvoicesList = ({
  expenses,
  expensesTypes,
  jars,
  users,
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
            <Invoice
              key={invoice.id}
              invoice={invoice}
              invoiceExpenses={invoiceExpenses}
              jars={jars}
              users={users}
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
