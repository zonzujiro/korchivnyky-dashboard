import type {
  ExpenseRecord,
  ExpenseType,
  Invoice as InvoiceType,
  Jar,
  User,
} from '@/types';
import { getDateString, toCurrency } from '@/toolbox';
import { FilePreviewer } from '@/library';

import styles from './Invoice.module.css';
import { InvoiceDetailsDialog } from './InvoiceDetailsDialog/InvoiceDetailsDialog';
import { AddExpenseDialog } from './AddExpenseDialog/AddExpenseDialog';

type InvoiceProps = {
  invoice: InvoiceType;
  invoiceExpenses: Array<ExpenseRecord>;
  expenseType: ExpenseType;
  jars: Array<Jar>;
  users: Array<User>;
};

const getSum = (expenses: Array<ExpenseRecord>) => {
  return expenses.reduce((acc, item) => acc + item.sum, 0);
};

export const Invoice = ({
  invoice,
  expenseType,
  invoiceExpenses,
  jars,
  users,
}: InvoiceProps) => {
  const { name, amount, fileUrl, createdAt } = invoice;

  const payedSum = getSum(invoiceExpenses);
  const creationDate = getDateString(createdAt);

  const invoiceOwner = users.find((user) => user.id === invoice.userId)!;

  const isActive = Boolean(amount - payedSum);

  return (
    <div className={styles.invoice}>
      <div className={styles['invoice-image-preview-frame']}>
        <FilePreviewer
          previewerState={{
            src: fileUrl,
          }}
        />
      </div>
      <h4 className={styles['invoice-name']}>{name} </h4>

      <p className={styles['invoice-preview-description']}>
        Сума: {toCurrency(amount)}
      </p>
      <p className={styles['invoice-preview-description']}>
        {isActive
          ? `До сплати: ${toCurrency(amount - payedSum)}`
          : '✅ Cплачено'}
      </p>
      <div className={styles['invoice-additional-info']}>
        <p className={styles['invoice-preview-description']}>
          Категорія: {expenseType.name}
        </p>
        <p className={styles['invoice-preview-description']}>
          Створений: {creationDate}
        </p>
      </div>
      <div className={styles['invoice-popups']}>
        <InvoiceDetailsDialog
          invoice={invoice}
          expenseType={expenseType}
          payedSum={payedSum}
          invoiceExpenses={invoiceExpenses}
          creationDate={creationDate}
          owner={invoiceOwner}
          jars={jars}
        />
        <AddExpenseDialog invoice={invoice} jars={jars} />
      </div>
    </div>
  );
};
