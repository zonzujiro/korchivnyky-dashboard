import classNames from 'classnames';

import type { Transaction, Invoice } from '@/types';
import { toCurrency } from '@/toolbox';

import styles from './InvoicesInfo.module.css';

type InvoiceInfoProps = {
  invoices: Array<Invoice>;
  transactions: Array<Transaction>;
};

const getPayedSum = (transactions: Array<Transaction>, invoiceId: number) => {
  return transactions
    .filter((transaction) => transaction.invoiceId === invoiceId)
    .reduce((acc, transaction) => {
      return acc + transaction.sum;
    }, 0);
};

export const InvoicesInfo = (props: InvoiceInfoProps) => {
  const { invoices, transactions } = props;

  const totalInvoicesSum = invoices.reduce(
    (acc, invoice) => acc + invoice.amount,
    0
  );

  const payedInvoices = invoices.filter((invoice) => {
    const payedSum = getPayedSum(transactions, invoice.id);

    return payedSum >= invoice.amount;
  });

  const activeDebt = invoices.reduce((acc, invoice) => {
    const payedSum = getPayedSum(transactions, invoice.id);

    return acc + (invoice.amount - payedSum);
  }, 0);

  return (
    <div className={styles['invoice-info']}>
      <h4>Інформація по рахункам</h4>
      <div className={classNames(styles['invoice-info-tag'])}>
        🧮 Створили рахунків на: {toCurrency(totalInvoicesSum)}
      </div>
      <div className={classNames(styles['invoice-info-tag'])}>
        📉 З них не сплатили: {toCurrency(activeDebt)}
      </div>
      <h4 className={styles['invoice-info-header']}>Рахунки</h4>
      <div className={styles['invoice-info-tag']}>
        🧾 Всього рахунків: {invoices.length}
      </div>
      <div className={styles['invoice-info-tag']}>
        📝 З них сплачено: {payedInvoices.length}
      </div>
    </div>
  );
};
