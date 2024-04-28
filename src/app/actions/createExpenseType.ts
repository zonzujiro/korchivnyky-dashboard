'use server';

import {
  type ExpenseTypePayload,
  createExpenseType as postExpenseType,
  editExpenseType as putExpenseType,
} from '@/dal';
import { NetworkError } from '@/toolbox';

const createRepairPayload = (expenseTypeData: ExpenseTypePayload) => {
  return {
    fundraisingCampaignId: expenseTypeData.fundraisingCampaignId,
    targetSum: 40000,
    name: `Ремонт ${expenseTypeData.name}`,
    ownerId: expenseTypeData.ownerId,
  };
};

const createPaintingPayload = (expenseTypeData: ExpenseTypePayload) => {
  return {
    fundraisingCampaignId: expenseTypeData.fundraisingCampaignId,
    targetSum: 20000,
    name: `Тюнінг ${expenseTypeData.name}`,
    ownerId: expenseTypeData.ownerId,
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
  } catch (e: any) {
    console.log({ e });

    const message = `${e.code}: ${e.message}`;

    if (e instanceof NetworkError) {
      return e.backendError ? e.backendError : message;
    }

    return message;
  }
};

export const editExpenseType = async (
  id: number,
  expenseTypeData: ExpenseTypePayload
) => {
  try {
    await putExpenseType(id, expenseTypeData);

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
