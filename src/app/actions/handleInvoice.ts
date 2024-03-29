'use server';

import {
  type CreateInvoicePayload,
  createInvoice as sendCreateRequest,
  editInvoice as sendEditRequest,
  EditInvoicePayload,
} from '@/dal';
import { NetworkError, ParsingError } from '@/toolbox';

export const createInvoice = async (invoiceData: CreateInvoicePayload) => {
  const { expenseTypeId, ...rest } = invoiceData;

  const payload = {
    ...rest,
    expensiveTypeId: expenseTypeId,
  };

  try {
    await sendCreateRequest(payload);

    return 'Success';
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
  } catch (e: any) {
    console.log({ e });

    const message = `${e.code}: ${e.message}`;

    if (e instanceof NetworkError) {
      return e.backendError ? e.backendError : message;
    }

    if (e instanceof ParsingError) {
      return `${e.code}: ${e.customMessage} > ${e.name}: ${e.message}`;
    }

    return message;
  }
};
