'use server';

import { createJarsTransaction } from '@/dal';
import { JarsTransactionPayload } from '../../types';

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
