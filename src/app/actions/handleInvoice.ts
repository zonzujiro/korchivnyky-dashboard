'use server';

import {
  type CreateInvoicePayload,
  createInvoice as sendCreateRequest,
  editInvoice as sendEditRequest,
  EditInvoicePayload,
} from '@/dal';
import { NetworkError } from '@/toolbox';

export const createInvoice = async (invoiceData: CreateInvoicePayload) => {
  const { expenseTypeId, ...rest } = invoiceData;

  const payload = {
    ...rest,
    expensiveTypeId: expenseTypeId,
  };

  try {
    await sendCreateRequest(payload);

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

export const editInvoice = async (
  invoiceId: number,
  invoiceData: EditInvoicePayload
) => {
  const { expenseTypeId, ...rest } = invoiceData;

  const payload =
    expenseTypeId !== undefined
      ? {
          ...rest,
          expensiveTypeId: expenseTypeId,
        }
      : rest;

  try {
    await sendEditRequest(invoiceId, payload);

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
