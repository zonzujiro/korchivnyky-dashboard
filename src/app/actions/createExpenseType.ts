'use server';

import {
  type ExpenseTypePayload,
  createExpenseType as postExpenseType,
} from '@/dal';
import { NetworkError } from '@/toolbox';

const createRepairPayload = (expenseTypeData: ExpenseTypePayload) => {
  return {
    fundraisingCampaignId: expenseTypeData.fundraisingCampaignId,
    targetSum: 40000,
    name: `Ремонт ${expenseTypeData.name}`,
  };
};

const createPaintingPayload = (expenseTypeData: ExpenseTypePayload) => {
  return {
    fundraisingCampaignId: expenseTypeData.fundraisingCampaignId,
    targetSum: 10000,
    name: `Фарбування ${expenseTypeData.name}`,
  };
};

export const createExpenseType = async (
  expenseTypeData: ExpenseTypePayload,
  isAuto: boolean
) => {
  try {
    if (isAuto) {
      await Promise.all([
        postExpenseType(expenseTypeData),
        postExpenseType(createRepairPayload(expenseTypeData)),
        postExpenseType(createPaintingPayload(expenseTypeData)),
      ]);
    } else {
      await postExpenseType(expenseTypeData);
    }

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
