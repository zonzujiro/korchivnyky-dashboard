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
  const { expensesTypes, expenses } = props;

  if (!expensesTypes.length) {
    return (
      <div className={styles['expenses-types-info']}>
        <h4>Заплановані витрати</h4>
        <div>Відсутні</div>
      </div>
    );
  }

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
      </div>
      {expensesTypes.map((expenseType) => {
        const currentExpenses = expenses.filter(
          (expense) => expense.expenseTypeId === expenseType.id
        );

        const payedSum = currentExpenses.reduce(
          (acc, item) => acc + item.sum,
          0
        );

        return (
          <div key={expenseType.id} className={styles['expense-type-info']}>
            <p>{expenseType.name}</p>
            <p>{toCurrency(expenseType.targetSum)}</p>
            <p>{toCurrency(expenseType.targetSum - payedSum)}</p>
          </div>
        );
      })}
    </div>
  );
};
