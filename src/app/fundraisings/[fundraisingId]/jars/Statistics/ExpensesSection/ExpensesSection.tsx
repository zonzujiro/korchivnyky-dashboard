import type { Jar, Transaction, ExpenseType } from '@/types';

import styles from './ExpensesSection.module.css';

type StatisticsProps = {
  jars: Array<Jar>;
  transactions: Array<Transaction>;
  expensesTypes: Array<ExpenseType>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ExpensesSection = (props: StatisticsProps) => {
  return <div className={styles['expenses-section']}>🪹 Скоро буде</div>;
};
