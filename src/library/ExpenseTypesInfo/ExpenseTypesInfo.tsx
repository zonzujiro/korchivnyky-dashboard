import classNames from 'classnames';

import { getPayedMoney, toCurrency } from '@/toolbox';
import type { Transaction, ExpenseType, Invoice, Jar } from '@/types';

import styles from './ExpenseTypesInfo.module.css';

type ExpenseTypesInfoProps = {
  expenseTypes: Array<ExpenseType>;
  invoices: Array<Invoice>;
  transactions: Array<Transaction>;
  jars: Array<Jar>;
};

const getExpenseTypeExpenses = (
  expenseType: ExpenseType,
  invoices: Array<Invoice>,
  expenses: Array<Transaction>
) => {
  const expenseTypeInvoices = invoices
    .filter((invoice) => invoice.expenseTypeId === expenseType.id)
    .map((invoice) => invoice.id);

  return expenses.filter((expense) =>
    expenseTypeInvoices.includes(expense.invoiceId)
  );
};

const getExpenseTypePayedSum = (
  expenseType: ExpenseType,
  invoices: Array<Invoice>,
  expenses: Array<Transaction>
) => {
  const expenseTypeExpenses = getExpenseTypeExpenses(
    expenseType,
    invoices,
    expenses
  );

  return expenseTypeExpenses.reduce((acc, item) => acc + item.sum, 0);
};

export const ExpenseTypesInfo = (props: ExpenseTypesInfoProps) => {
  const { expenseTypes, transactions, invoices, jars } = props;

  if (!expenseTypes.length) {
    return (
      <div className={styles['expense-types-info']}>
        <h4>Заплановані витрати</h4>
        <div>Відсутні</div>
      </div>
    );
  }

  const totalSum = expenseTypes.reduce((acc, expenseType) => {
    return acc + expenseType.targetSum;
  }, 0);

  const overPayed = expenseTypes.reduce((acc, expenseType) => {
    const payedSum = getExpenseTypePayedSum(
      expenseType,
      invoices,
      transactions
    );

    if (payedSum > expenseType.targetSum) {
      return acc + (payedSum - expenseType.targetSum);
    }

    return acc;
  }, 0);

  const registeredPaymentsSum = expenseTypes.reduce((acc, expenseType) => {
    const payedSum = getExpenseTypePayedSum(
      expenseType,
      invoices,
      transactions
    );

    return acc + payedSum;
  }, 0);

  const totalPayedSum = getPayedMoney(jars);

  return (
    <div className={styles['expense-types-info']}>
      <h4>Заплановані витрати</h4>
      <div className={classNames(styles['expense-types-info-tag'])}>
        💸 Заплановані витрати: {toCurrency(totalSum || 0)}
      </div>
      <div className={classNames(styles['expense-types-info-tag'])}>
        🪙 Залишок до сплати: {toCurrency(totalSum - totalPayedSum)}
      </div>
      <h4 className={styles['expense-types-info-header']}>Нєстиковочкі</h4>
      <div className={classNames(styles['expense-types-info-tag'])}>
        🤑 Переплачено: {toCurrency(overPayed)}
        <div className={classNames(styles['expense-types-info-tag'])}>
          😲 Невнесені платежі:{' '}
          {toCurrency(totalPayedSum - registeredPaymentsSum)}
        </div>
      </div>
    </div>
  );
};
