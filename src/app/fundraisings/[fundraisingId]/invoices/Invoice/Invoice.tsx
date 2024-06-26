import type {
  Transaction,
  ExpenseType,
  Invoice as IInvoice,
  Jar,
  User,
} from '@/types';
import { getDateString, toCurrency } from '@/toolbox';
import { Button, FilePreviewer } from '@/library';

import styles from './Invoice.module.css';
import { InvoiceDetailsDialog } from './InvoiceDetailsDialog/InvoiceDetailsDialog';
import { AddExpenseDialog } from './AddExpenseDialog/AddExpenseDialog';
import { InvoiceDialog } from '../InvoiceDialog/InvoiceDialog';

type InvoiceProps = {
  invoice: IInvoice;
  transactions: Array<Transaction>;
  jars: Array<Jar>;
  users: Array<User>;
  expenseTypes: Array<ExpenseType>;
  invoices: Array<IInvoice>;
};

const getSum = (expenses: Array<Transaction>) => {
  return expenses.reduce((acc, item) => acc + item.sum, 0);
};

export const Invoice = ({
  invoice,
  expenseTypes,
  transactions,
  jars,
  users,
  invoices,
}: InvoiceProps) => {
  const { name, amount, fileUrl, createdAt, isActive } = invoice;

  const invoiceExpenses = transactions.filter(
    (transaction) => transaction.invoiceId === invoice.id
  );
  const expenseType = expenseTypes.find(
    (expenseType) => expenseType.id === invoice.expenseTypeId
  )!;

  const payedSum = getSum(invoiceExpenses);
  const creationDate = getDateString(createdAt);

  const invoiceOwner = users.find((user) => user.id === invoice.userId)!;

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
          invoiceTransactions={invoiceExpenses}
          creationDate={creationDate}
          owner={invoiceOwner}
          jars={jars}
        />
        <InvoiceDialog
          invoice={invoice}
          expenseTypes={expenseTypes}
          invoices={invoices}
          renderButton={(onClick) => (
            <Button title='Редагувати' onClick={onClick}>
              ✏️
            </Button>
          )}
        />
        {isActive && (
          <AddExpenseDialog invoice={invoice} jars={jars} users={users} />
        )}
      </div>
    </div>
  );
};
