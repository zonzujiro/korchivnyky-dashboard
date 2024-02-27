'use server';

import type { InvoiceTransactionPayload } from '../types';
import { createInvoiceTransaction } from '../dal';

export const createExpense = async (expenseData: InvoiceTransactionPayload) => {
  try {
    await createInvoiceTransaction(expenseData);

    return 'Success';
  } catch (e) {
    console.log({ e });
    return 'Not success';
  }
};
