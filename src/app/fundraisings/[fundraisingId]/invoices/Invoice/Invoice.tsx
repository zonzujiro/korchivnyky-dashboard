'use client';

import type {
  ExpenseRecord,
  ExpenseType,
  Invoice as InvoiceType,
  Jar,
} from '@/app/types';
import { getDateString, toCurrency } from '@/app/toolbox';

import styles from './Invoice.module.css';
import { InvoiceDetailsDialog } from './InvoiceDetailsDialog/InvoiceDetailsDialog';
import { AddExpenseDialog } from './AddExpenseDialog/AddExpenseDialog';
import { ImagePreview } from './ImagePreview/ImagePreview';

type InvoiceProps = {
  invoice: InvoiceType;
  invoiceExpenses: Array<ExpenseRecord>;
  expenseType: ExpenseType;
  jars: Array<Jar>;
};

const getSum = (expenses: Array<ExpenseRecord>) => {
  return expenses.reduce((acc, item) => acc + item.sum, 0);
};

export const InvoiceItem = ({
  invoice,
  expenseType,
  invoiceExpenses,
  jars,
}: InvoiceProps) => {
  const { name, amount, fileUrl, isActive, createdAt } = invoice;

  const payedSum = getSum(invoiceExpenses);
  const creationDate = getDateString(createdAt);

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
        <AddExpenseDialog invoiceId={invoice.id} jars={jars} />
      </div>
    </div>
  );
};
