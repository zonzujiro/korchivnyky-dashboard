'use server';

import { type JarsTransactionPayload, createJarsTransaction } from '@/dal';

export const transferMoneyBetweenJars = async (
  payload: JarsTransactionPayload
) => {
  try {
    await createJarsTransaction(payload);

    return 'Success';
  } catch (e) {
    console.log({ e });
    return 'Not success';
  }
};
