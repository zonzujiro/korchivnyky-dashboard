'use client';

import { useState } from 'react';

import type {
  Transaction,
  ExpenseType,
  Jar,
  User,
  Invoice as IInvoice,
} from '@/types';
import { Button } from '@/library';

import { InvoiceDialog } from './InvoiceDialog/InvoiceDialog';
import { Invoice } from './Invoice/Invoice';
import styles from './InvoicesList.module.css';

type InvoicesListProps = {
  transactions: Array<Transaction>;
  expenseTypes: Array<ExpenseType>;
  jars: Array<Jar>;
  users: Array<User>;
  invoices: Array<IInvoice>;
};

const defaultValue = 'all';

export const InvoicesList = ({
  transactions,
  expenseTypes,
  jars,
  users,
  invoices,
}: InvoicesListProps) => {
  const [selectedExpenseType, selectExpenseType] = useState<'all' | string>(
    defaultValue
  );
  const [isOnlyActiveInvoices, setIsOnlyActiveInvoices] = useState(false);

  const byExpenseType =
    selectedExpenseType !== 'all'
      ? invoices.filter(
          (invoice) => invoice.expenseTypeId === Number(selectedExpenseType)
        )
      : invoices;

  const byVisibility = isOnlyActiveInvoices
    ? byExpenseType.filter((invoice) => invoice.isActive)
    : byExpenseType;

  return (
    <div className={styles['invoices-list-wrapper']}>
      <div className={styles['invoices-toolbox']}>
        <InvoiceDialog
          expenseTypes={expenseTypes}
          invoices={invoices}
          renderButton={(onClick) => (
            <Button onClick={onClick}>➕ Додати рахунок</Button>
          )}
        />
        <Button
          onClick={() => setIsOnlyActiveInvoices(!isOnlyActiveInvoices)}
          disabled={invoices.every((invoice) => invoice.isActive)}
        >
          {isOnlyActiveInvoices ? 'Приховали неактивні 🫣' : 'Показуємо все 👀'}
        </Button>
        <label className={styles['expense-types-select']}>
          Тип витрат:
          <select
            onChange={(ev) => selectExpenseType(ev.currentTarget.value)}
            defaultValue={defaultValue}
          >
            <option value='all'>Всі</option>
            {expenseTypes.map((expenseType) => (
              <option key={expenseType.id} value={expenseType.id}>
                {expenseType.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className={styles['invoices-list']}>
        {byVisibility.map((invoice) => {
          return (
            <Invoice
              key={invoice.id}
              invoice={invoice}
              transactions={transactions}
              jars={jars}
              users={users}
              expenseTypes={expenseTypes}
              invoices={invoices}
            />
          );
        })}
      </div>
    </div>
  );
};
