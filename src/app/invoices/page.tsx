'use server';

import { getInitialData } from '../dal';
import { StateProvider } from '../dal/StateProvider';
import { Invoices } from './Invoices';

const InvoicePage = async () => {
  const { jars, statistics, expenseTypes, expenses } = await getInitialData();

  return (
    <StateProvider>
      <Invoices />
    </StateProvider>
  );
};

export default InvoicePage;
