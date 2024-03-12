'use server';

import { type InvoicePayload, createInvoice as sendRequest } from '@/dal';

export const createInvoice = async (invoiceData: InvoicePayload) => {
  try {
    await sendRequest(invoiceData);

    return 'Success';
  } catch (e) {
    console.log({ e });
    return 'Not success';
  }
};
