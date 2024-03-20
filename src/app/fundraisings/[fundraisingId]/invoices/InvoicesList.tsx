'use client';

import { useState } from 'react';

import type {
  ExpenseRecord,
  ExpenseType,
  Jar,
  User,
  Invoice as IInvoice,
} from '@/types';
import { Button } from '@/library';

import { Invoice } from './Invoice/Invoice';
import styles from './InvoicesList.module.css';
import { InvoiceDialog } from './InvoiceDialog/InvoiceDialog';

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
        <InvoiceDialog
          expensesTypes={expensesTypes}
          renderButton={(onClick) => (
            <Button onClick={onClick}>➕ Додати рахунок</Button>
          )}
        />
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
          return (
            <Invoice
              key={invoice.id}
              invoice={invoice}
              expenses={expenses}
              jars={jars}
              users={users}
              expensesTypes={expensesTypes}
            />
          );
        })}
      </div>
    </div>
  );
};
