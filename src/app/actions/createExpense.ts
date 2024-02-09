'use server';

import type { InvoiceTransactionPayload } from '../types';
import { createInvoiceTransaction } from '../dal';

export const createExpense = async (expenseData: InvoiceTransactionPayload) => {
  try {
    const response = await createInvoiceTransaction(expenseData);

    console.log({ response });

    return 'Success';
  } catch (e) {
    console.log({ e });
    return 'Not success';
  }
};
