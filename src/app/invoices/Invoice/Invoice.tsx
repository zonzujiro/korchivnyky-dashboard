import Link from 'next/link';

import { Image } from '@/app/library';
import type { ExpenseType, Invoice as InvoiceType } from '@/app/types';

import styles from './Invoice.module.css';
import { toCurrency } from '@/app/toolbox';

type InvoiceProps = {
  invoice: InvoiceType;
  expenseType: ExpenseType;
};

export const InvoiceItem = ({ invoice, expenseType }: InvoiceProps) => {
  const { name, amount, fileUrl, isActive } = invoice;

  return (
    <div className={styles.invoice}>
      <Image src={fileUrl} alt='Invoice image' width={230} height={130} />
      <h4>
        {isActive ? null : <span>✅</span>}
        {name}
      </h4>
      <p>Сума: {toCurrency(amount)}</p>
      <p>Категорія: {expenseType.name}</p>
      <Link href={fileUrl}>💾 Завантажити інвойс</Link>
    </div>
  );
};
