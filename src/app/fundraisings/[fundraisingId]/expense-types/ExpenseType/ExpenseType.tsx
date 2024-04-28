'use client';

import { Button } from '@/library';
import { toCurrency } from '@/toolbox';
import type {
  Invoice,
  Transaction,
  ExpenseType as IExpenseType,
  User,
} from '@/types';

import styles from './ExpenseType.module.css';
import { ExpenseTypeDialog } from '../ExpenseTypeDialog/ExpenseTypeDialog';

export const ExpenseType = ({
  expenseType,
  transactions,
  invoices,
  fundraisingId,
  users,
}: {
  expenseType: IExpenseType;
  invoices: Array<Invoice>;
  transactions: Array<Transaction>;
  fundraisingId: string;
  users: Array<User>;
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
        <p>
          Від кого:{' '}
          {users.find((user) => user.id === expenseType.ownerId)?.name ||
            'John Doe'}
        </p>
        <p>Заплановано: {toCurrency(targetSum)}</p>
        <p>
          Сплачено: {toCurrency(payedSum)}, {percentageValue}%
        </p>
        <p>До сплати: {leftover >= 0 ? toCurrency(leftover) : 0}</p>
      </div>
      <ExpenseTypeDialog
        title='Редагувати витрати'
        fundraisingId={fundraisingId}
        renderButton={(openDialog) => (
          <Button onClick={openDialog}>✏️ Редагувати</Button>
        )}
        expenseType={expenseType}
        users={users}
      />
    </div>
  );
};
