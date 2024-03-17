'use client';

import { useState } from 'react';

import type {
  ExpenseRecord,
  ExpenseType,
  Jar,
  User,
  Invoice as IInvoice,
} from '@/types';

import { Invoice } from './Invoice/Invoice';
import styles from './InvoicesList.module.css';
import { AddInvoiceDialog } from './AddInvoiceDialog/AddInvoiceDialog';

type InvoicesListProps = {
  expenses: Array<ExpenseRecord>;
  expensesTypes: Array<ExpenseType>;
  jars: Array<Jar>;
  users: Array<User>;
  invoices: Array<IInvoice>;
};

const defaultValue = 'all';

export const InvoicesList = ({
  expenses,
  expensesTypes,
  jars,
  users,
  invoices,
}: InvoicesListProps) => {
  const [selectedExpenseType, selectExpenseType] = useState<'all' | string>(
    defaultValue
  );

  const usedInvoices =
    selectedExpenseType !== 'all'
      ? invoices.filter(
          (invoice) => invoice.expenseTypeId === Number(selectedExpenseType)
        )
      : invoices;

  return (
    <div className={styles['invoices-list-wrapper']}>
      <div className={styles['invoices-toolbox']}>
        <AddInvoiceDialog expensesTypes={expensesTypes} />
        <label className={styles['expense-types-select']}>
          Тип витрат:
          <select
            onChange={(ev) => selectExpenseType(ev.currentTarget.value)}
            defaultValue={defaultValue}
          >
            <option value='all'>Всі</option>
            {expensesTypes.map((expenseType) => (
              <option key={expenseType.id} value={expenseType.id}>
                {expenseType.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className={styles['invoices-list']}>
        {usedInvoices.map((invoice) => {
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
                  (expenseType) => expenseType.id === invoice.expenseTypeId
                )!
              }
            />
          );
        })}
      </div>
    </div>
  );
};
