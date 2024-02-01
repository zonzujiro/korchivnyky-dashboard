'use server';

import { getHomePageData } from '../dal';
import { StateProvider } from '../dal/StateProvider';
import { Invoices } from './Invoices';

const InvoicePage = async () => {
  const { jars, statistics, expenseTypes, expenses } = await getHomePageData();

  return (
    <StateProvider>
      <Invoices />
    </StateProvider>
  );
};

export default InvoicePage;
