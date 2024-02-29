'use server';

import type { Invoice, InvoicePayload } from '../../types';
import { createInvoice as sendRequest } from '@/dal';

export const createInvoice = async (
  invoiceData: InvoicePayload
): Promise<string | Invoice> => {
  try {
    const response = await sendRequest(invoiceData);

    return response;
  } catch (e) {
    return 'Not success';
  }
};
