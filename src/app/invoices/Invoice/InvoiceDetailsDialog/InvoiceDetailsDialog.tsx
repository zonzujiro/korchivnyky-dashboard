import Link from 'next/link';

import { Dialog, Button } from '@/app/library';
import { toCurrency } from '@/app/toolbox';
import type { ExpenseRecord, ExpenseType, Invoice } from '@/app/types';

import styles from './InvoiceDetails.module.css';
import { ImagePreview } from '../ImagePreview/ImagePreview';

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

  return (
    <Dialog
      title={`Рахунок: ${name}`}
      renderButton={({ openDialog }) => (
        <Button onClick={openDialog}>🧾</Button>
      )}
      renderContent={() => (
        <div className={styles['invoice-dialog-content']}>
          <div className={styles['invoice-information']}>
            <div className={styles['invoice-image-frame']}>
              <ImagePreview src={fileUrl} />
            </div>
            <div className={styles['invoice-description']}>
              <p className={styles['invoice-description']}>
                <strong>Сума:</strong> {toCurrency(amount)}
              </p>
              <p className={styles['invoice-description']}>
                <strong>До сплати:</strong> {toCurrency(amount - payedSum)}
              </p>
              {description && (
                <p className={styles['invoice-description']}>
                  <strong>Опис:</strong> {description}
                </p>
              )}
              <p className={styles['invoice-description']}>
                <strong> Категорія:</strong> {expenseType.name}
              </p>
              <p className={styles['invoice-description']}>
                <strong>Створений:</strong> {creationDate}
              </p>
              <p className={styles['invoice-description']}>
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
                {[
                  ...invoiceExpenses,
                  ...invoiceExpenses,
                  ...invoiceExpenses,
                ].map((expense, index) => (
                  <li className={styles['expense-item']} key={index}>
                    <div className={styles['expense-info']}>
                      <p>Сума: {toCurrency(expense.sum)}</p>
                      <p>Дата: {creationDate}</p>
                      <p>Платник: Вася Пупкін</p>
                    </div>
                    <div className={styles['expense-actions']}>
                      <Link href={expense.receipt}>
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
