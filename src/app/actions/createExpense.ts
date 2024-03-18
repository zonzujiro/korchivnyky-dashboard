'use server';

import { InvoiceTransactionPayload, createInvoiceTransaction } from '@/dal';
import { NetworkError } from '@/toolbox';

export const createExpense = async (expenseData: InvoiceTransactionPayload) => {
  try {
    await createInvoiceTransaction(expenseData);

    return 'Success';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log({ e });

    const message = `${e.code}: ${e.message}`;

    if (e instanceof NetworkError) {
      return e.backendError ? e.backendError : message;
    }

    return message;
  }
};
