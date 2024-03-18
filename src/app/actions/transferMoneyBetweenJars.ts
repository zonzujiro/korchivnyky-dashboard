'use server';

import { type JarsTransactionPayload, createJarsTransaction } from '@/dal';
import { NetworkError } from '@/toolbox';

export const transferMoneyBetweenJars = async (
  payload: JarsTransactionPayload
) => {
  try {
    await createJarsTransaction(payload);

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
