import type { PageParams } from '@/types';
import { getInvoicesPageData } from '@/dal';

import { InvoicesList } from './InvoicesList';

export const Invoices = async ({ params }: PageParams) => {
  const { fundraisingId } = params;
  const { expensesTypes, invoices, expenses, jars, users } =
    await getInvoicesPageData({ fundraisingId });

  return (
    <InvoicesList
      expenses={expenses}
      jars={jars}
      expensesTypes={expensesTypes}
      users={users}
      invoices={invoices}
    />
  );
};
