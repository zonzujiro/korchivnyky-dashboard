import Link from 'next/link';

import { Dialog, Button, FilePreviewer, useDialog } from '@/library';
import { toCurrency } from '@/toolbox';
import type { Transaction, ExpenseType, Invoice, Jar, User } from '@/types';

import styles from './InvoiceDetails.module.css';

type InvoiceDetailsDialogProps = {
  invoice: Invoice;
  expenseType: ExpenseType;
  payedSum: number;
  invoiceTransactions: Array<Transaction>;
  creationDate: string;
  owner: User;
  jars: Array<Jar>;
};

export const InvoiceDetailsDialog = (props: InvoiceDetailsDialogProps) => {
  const {
    payedSum,
    expenseType,
    invoice,
    invoiceTransactions,
    creationDate,
    owner,
    jars,
  } = props;

  const { amount, fileUrl, description, name } = invoice;

  const { openDialog, dialogState } = useDialog();

  const getJarName = (transaction: Transaction) => {
    const jar = jars.find((jar) => transaction.fromJarId === jar.id);

    return jar?.ownerName;
  };

  return (
    <Dialog
      dialogState={dialogState}
      title={`Рахунок: ${name}`}
      renderButton={() => (
        <Button title='Відкрити рахунок' onClick={openDialog}>
          🧾
        </Button>
      )}
      renderContent={() => (
        <div className={styles['invoice-dialog-content']}>
          <div className={styles['invoice-information']}>
            <div className={styles['invoice-image-frame']}>
              <FilePreviewer
                previewerState={{
                  src: fileUrl,
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
              {owner && (
                <p>
                  <strong>Створив:</strong> {owner.name}
                </p>
              )}
              <Link className={styles['invoice-link']} href={fileUrl}>
                💾 Завантажити інвойс
              </Link>
            </div>
          </div>
          <div className={styles['invoice-expenses']}>
            <div className={styles['expenses-header']}>
              <h4>Оплати</h4>
              <span>
                Оплат загалом: {invoiceTransactions.length} | Сплачено:{' '}
                {toCurrency(payedSum)}
              </span>
            </div>
            <div className={styles['expenses-list-wrapper']}>
              <ul className={styles['expenses-list']}>
                {invoiceTransactions.map((transaction, index) => (
                  <li className={styles['expense-item']} key={index}>
                    <div className={styles['expense-info']}>
                      <p>Сума: {toCurrency(transaction.sum)}</p>
                      <p>Дата: {creationDate}</p>
                      <p>
                        Платник: <span>{getJarName(transaction)}</span>
                      </p>
                    </div>
                    <div className={styles['expense-actions']}>
                      <Link href={transaction.receiptUrl}>
                        {transaction.receiptUrl.includes('.zip')
                          ? '📦 Завантажити квитанції'
                          : '💾 Завантажити квитанцію'}
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
