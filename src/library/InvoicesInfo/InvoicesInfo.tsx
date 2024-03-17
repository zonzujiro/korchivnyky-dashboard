import classNames from 'classnames';

import type { ExpenseRecord, ExpenseType, Invoice } from '@/types';
import { toCurrency } from '@/toolbox';

import styles from './InvoicesInfo.module.css';

type InvoiceInfoProps = {
  expensesTypes: Array<ExpenseType>;
  invoices: Array<Invoice>;
  expenses: Array<ExpenseRecord>;
};

const getPayedSum = (expenses: Array<ExpenseRecord>, invoiceId: number) => {
  return expenses
    .filter((expense) => expense.invoiceId === invoiceId)
    .reduce((acc, expense) => {
      return acc + expense.sum;
    }, 0);
};

export const InvoicesInfo = (props: InvoiceInfoProps) => {
  const { expensesTypes, invoices, expenses } = props;

  const plannedExpenses = expensesTypes?.reduce((acc, expenseType) => {
    return acc + expenseType.targetSum;
  }, 0);

  const totalInvoicesSum = invoices.reduce(
    (acc, invoice) => acc + invoice.amount,
    0
  );

  const payedInvoices = invoices.filter((invoice) => {
    const payedSum = getPayedSum(expenses, invoice.id);

    return payedSum >= invoice.amount;
  });

  const activeDebt = invoices.reduce((acc, invoice) => {
    const payedSum = getPayedSum(expenses, invoice.id);

    return acc + (invoice.amount - payedSum);
  }, 0);

  return (
    <div className={styles['invoice-info']}>
      <h4>Інформація по витратах</h4>
      <div className={classNames(styles['invoice-info-tag'])}>
        💸 Заплановані витрати - {toCurrency(plannedExpenses || 0)}
      </div>
      <div className={classNames(styles['invoice-info-tag'])}>
        🧮 Створили рахунків на - {toCurrency(totalInvoicesSum)}
      </div>
      <div className={classNames(styles['invoice-info-tag'])}>
        📉 З них не сплатили - {toCurrency(activeDebt)}
      </div>
      <h4 className={styles['invoice-info-header']}>Рахунки</h4>
      <div className={styles['invoice-info-tag']}>
        🧾 Всього рахунків - {invoices.length}
      </div>
      <div className={styles['invoice-info-tag']}>
        📝 З них сплачено - {payedInvoices.length}
      </div>
    </div>
  );
};
