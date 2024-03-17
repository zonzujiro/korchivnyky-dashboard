import classNames from 'classnames';

import { toCurrency } from '@/toolbox';
import type { ExpenseRecord, ExpenseType, Invoice } from '@/types';

import styles from './ExpensesTypesInfo.module.css';

type ExpensesTypesInfoProps = {
  expensesTypes: Array<ExpenseType>;
  invoices: Array<Invoice>;
  expenses: Array<ExpenseRecord>;
};

export const ExpensesTypesInfo = (props: ExpensesTypesInfoProps) => {
  const { expensesTypes, expenses, invoices } = props;

  if (!expensesTypes.length) {
    return (
      <div className={styles['expenses-types-info']}>
        <h4>Заплановані витрати</h4>
        <div>Відсутні</div>
      </div>
    );
  }

  const byDate = expensesTypes.toSorted(
    (first, second) =>
      new Date(first.createdAt).valueOf() - new Date(second.createdAt).valueOf()
  );

  return (
    <div className={styles['expenses-types-info']}>
      <h4>Заплановані витрати</h4>
      <div
        className={classNames(
          styles['expense-type-info'],
          styles['expense-type-info-header']
        )}
      >
        <p>Назва</p>
        <p>Сума</p>
        <p>До сплати</p>
        <p>Сплачено</p>
      </div>
      {byDate.map((expenseType) => {
        const currentInvoicesIds = invoices
          .filter((invoice) => invoice.expenseTypeId === expenseType.id)
          .map((invoice) => invoice.id);

        const currentExpenses = expenses.filter((expense) =>
          currentInvoicesIds.includes(expense.invoiceId)
        );

        const payedSum = currentExpenses.reduce(
          (acc, item) => acc + item.sum,
          0
        );

        const percentageValue = (100 * payedSum) / expenseType.targetSum;

        return (
          <div key={expenseType.id} className={styles['expense-type-info']}>
            <p>{expenseType.name}</p>
            <p>{toCurrency(expenseType.targetSum)}</p>
            <p>{toCurrency(expenseType.targetSum - payedSum)}</p>
            <p>{Math.round(percentageValue)}%</p>
          </div>
        );
      })}
    </div>
  );
};
