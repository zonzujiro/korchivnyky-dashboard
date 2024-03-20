import type {
  ExpenseRecord,
  ExpenseType,
  Invoice as InvoiceType,
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
  invoice: InvoiceType;
  expenses: Array<ExpenseRecord>;
  jars: Array<Jar>;
  users: Array<User>;
  expensesTypes: Array<ExpenseType>;
};

const getSum = (expenses: Array<ExpenseRecord>) => {
  return expenses.reduce((acc, item) => acc + item.sum, 0);
};

export const Invoice = ({
  invoice,
  expensesTypes,
  expenses,
  jars,
  users,
}: InvoiceProps) => {
  const { name, amount, fileUrl, createdAt } = invoice;

  const invoiceExpenses = expenses.filter(
    (expense) => expense.invoiceId === invoice.id
  );
  const expenseType = expensesTypes.find(
    (expenseType) => expenseType.id === invoice.expenseTypeId
  )!;

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
        {isActive && (
          <AddExpenseDialog invoice={invoice} jars={jars} expenses={expenses} />
        )}
        <InvoiceDialog
          invoice={invoice}
          expensesTypes={expensesTypes}
          renderButton={(onClick) => (
            <Button title='Редагувати' onClick={onClick}>
              ✏️
            </Button>
          )}
        />
      </div>
    </div>
  );
};
