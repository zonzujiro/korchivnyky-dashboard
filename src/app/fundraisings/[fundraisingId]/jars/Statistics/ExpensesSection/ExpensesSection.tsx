import type { Jar, ExpenseRecord, ExpenseType } from '@/app/types';

import styles from './ExpensesSection.module.css';

type StatisticsProps = {
  jars: Array<Jar>;
  expenses: Array<ExpenseRecord>;
  expensesTypes: Array<ExpenseType>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ExpensesSection = (props: StatisticsProps) => {
  return <div className={styles['expenses-section']}></div>;
};
