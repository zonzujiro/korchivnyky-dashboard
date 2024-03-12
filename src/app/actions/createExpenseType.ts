'use server';

import {
  type ExpenseTypePayload,
  createExpenseType as postExpenseType,
} from '@/dal';

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
  } catch (e) {
    console.log({ e });
    return 'Not success';
  }
};
