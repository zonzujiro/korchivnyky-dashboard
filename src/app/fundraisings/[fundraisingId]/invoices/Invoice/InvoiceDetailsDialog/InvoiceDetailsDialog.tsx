import Link from 'next/link';

import { Dialog, Button, FilePreviewer, useDialog } from '@/app/library';
import { toCurrency } from '@/app/toolbox';
import type { ExpenseRecord, ExpenseType, Invoice } from '@/app/types';

import styles from './InvoiceDetails.module.css';

type InvoiceDetailsDialogProps = {
  invoice: Invoice;
  expenseType: ExpenseType;
  payedSum: number;
  invoiceExpenses: Array<ExpenseRecord>;
  creationDate: string;
};

export const InvoiceDetailsDialog = (props: InvoiceDetailsDialogProps) => {
  const { payedSum, expenseType, invoice, invoiceExpenses, creationDate } =
    props;
  const { amount, fileUrl, description, name } = invoice;

  const { openDialog, dialogState } = useDialog();

  return (
    <Dialog
      dialogState={dialogState}
      title={`Рахунок: ${name}`}
      renderButton={() => <Button onClick={openDialog}>🧾</Button>}
      renderContent={() => (
        <div className={styles['invoice-dialog-content']}>
          <div className={styles['invoice-information']}>
            <div className={styles['invoice-image-frame']}>
              <FilePreviewer
                previewerState={{
                  src: fileUrl,
                  isPDF: fileUrl.includes('pdf'),
                }}
              />
            </div>
            <div className={styles['invoice-description']}>
              <p>
                <strong>Сума:</strong> {toCurrency(amount)}
              </p>
              <p>
                <strong>До сплати:</strong> {toCurrency(amount - payedSum)}
              </p>
              {description && (
                <p>
                  <strong>Опис:</strong> {description}
                </p>
              )}
              <p>
                <strong> Категорія:</strong> {expenseType.name}
              </p>
              <p>
                <strong>Створений:</strong> {creationDate}
              </p>
              <p>
                <strong>Створив:</strong> Вася Пупкін
              </p>
              <Link className={styles['invoice-link']} href={fileUrl}>
                💾 Завантажити інвойс
              </Link>
            </div>
          </div>
          <div className={styles['invoice-expenses']}>
            <div className={styles['expenses-header']}>
              <h4>Оплати</h4>
              <span>
                Оплат загалом: {invoiceExpenses.length} | Сплачено:{' '}
                {toCurrency(payedSum)}
              </span>
            </div>
            <div className={styles['expenses-list-wrapper']}>
              <ul className={styles['expenses-list']}>
                {invoiceExpenses.map((expense, index) => (
                  <li className={styles['expense-item']} key={index}>
                    <div className={styles['expense-info']}>
                      <p>Сума: {toCurrency(expense.sum)}</p>
                      <p>Дата: {creationDate}</p>
                      <p>Платник: Вася Пупкін</p>
                    </div>
                    <div className={styles['expense-actions']}>
                      <Link href={expense.receiptUrl}>
                        💾 Завантажити квитанцію
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    />
  );
};
