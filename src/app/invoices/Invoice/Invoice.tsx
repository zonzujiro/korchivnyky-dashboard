'use client';

import type {
  ExpenseRecord,
  ExpenseType,
  Invoice as InvoiceType,
} from '@/app/types';
import { toCurrency } from '@/app/toolbox';

import styles from './Invoice.module.css';
import { InvoiceDetailsDialog } from './InvoiceDetailsDialog/InvoiceDetailsDialog';
import { AddExpenseDialog } from './AddExpenseDialog/AddExpenseDialog';
import { ImagePreview } from './ImagePreview/ImagePreview';

type InvoiceProps = {
  invoice: InvoiceType;
  invoiceExpenses: Array<ExpenseRecord>;
  expenseType: ExpenseType;
};

const getDate = (value: string) => {
  const date = new Date(value);

  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const getSum = (expenses: Array<ExpenseRecord>) => {
  return expenses.reduce((acc, item) => acc + item.sum, 0);
};

export const InvoiceItem = ({
  invoice,
  expenseType,
  invoiceExpenses,
}: InvoiceProps) => {
  const { name, amount, fileUrl, isActive, createdAt } = invoice;

  const payedSum = getSum(invoiceExpenses);
  const creationDate = getDate(createdAt);

  return (
    <div className={styles.invoice}>
      <div className={styles['invoice-image-preview-frame']}>
        <ImagePreview src={fileUrl} />
      </div>
      <h4 className={styles['invoice-name']}>
        {isActive ? null : <span>✅</span>}
        {name}
      </h4>
      <p className={styles['invoice-preview-description']}>
        Сума: {toCurrency(amount)}
      </p>
      <p className={styles['invoice-preview-description']}>
        Категорія: {expenseType.name}
      </p>
      <p className={styles['invoice-preview-description']}>
        Створений: {creationDate}
      </p>
      <div className={styles['invoice-popups']}>
        <InvoiceDetailsDialog
          invoice={invoice}
          expenseType={expenseType}
          payedSum={payedSum}
          invoiceExpenses={invoiceExpenses}
          creationDate={creationDate}
        />
        <AddExpenseDialog />
      </div>
    </div>
  );
};
