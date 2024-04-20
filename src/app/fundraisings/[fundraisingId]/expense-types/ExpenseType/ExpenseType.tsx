'use client';

import { Button } from '@/library';
import { toCurrency } from '@/toolbox';
import type {
  Invoice,
  Transaction,
  ExpenseType as IExpenseType,
} from '@/types';

import styles from './ExpenseType.module.css';

export const ExpenseType = ({
  expenseType,
  transactions,
  invoices,
}: {
  expenseType: IExpenseType;
  invoices: Array<Invoice>;
  transactions: Array<Transaction>;
}) => {
  const { id, targetSum, name } = expenseType;

  const currentInvoicesIds = invoices
    .filter((invoice) => invoice.expenseTypeId === id)
    .map((invoice) => invoice.id);

  const currentExpenses = transactions.filter((transaction) =>
    currentInvoicesIds.includes(transaction.invoiceId)
  );

  const payedSum = currentExpenses.reduce((acc, item) => acc + item.sum, 0);

  const leftover = targetSum - payedSum;

  const percentageValue = Math.floor((100 * payedSum) / targetSum);

  return (
    <div key={id} className={styles['expense-type']}>
      <h4>{name}</h4>
      <div className={styles['expense-type-info']}>
        <p>Заплановано: {toCurrency(targetSum)}</p>
        <p>
          Сплачено: {toCurrency(payedSum)}, {percentageValue}%
        </p>
        <p>До сплати: {leftover >= 0 ? toCurrency(leftover) : 0}</p>
      </div>
      <Button className={styles['edit-button']}>✏️ Редагувати</Button>
    </div>
  );
};
