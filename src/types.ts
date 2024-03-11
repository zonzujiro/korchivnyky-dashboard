export type Primitive = string | number | boolean;

export type Jar = {
  id: number;
  url: string;
  ownerName: string;
  jarName: string;
  description: string | null;
  goal: number | null;
  logo: string;
  isFinished: boolean;
  accumulated: number;
  color: string;
  fundraisingCampaignId: number;
  otherSourcesAccumulated: number;
  userId: number;
  spent: number;
  otherSourcesSpent: number;
};

export type JarStatisticRecord = {
  id: number;
  jarId: number;
  accumulated: number;
  createdAt: string;
};

export type ExpenseType = {
  id: number;
  fundraisingCampaignId: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  targetSum: number;
};

export type ExpenseRecord = {
  id: number;
  sum: number;
  jarId: number;
  createdAt: string;
  date: string;
  expenseTypeId: ExpenseType['id'];
  receiptUrl: string;
  invoiceId: number;
};

export type FundraisingCampaign = {
  id: number;
  name: string;
  description: string;
  goal: number;
  isFinished: boolean;
  startDate: string;
  createdAt: string;
};

export type Invoice = {
  id: number;
  userId: number;
  name: string;
  description: string;
  amount: number;
  isActive: boolean;
  fileUrl: string;
  createdAt: string;
  expensiveTypeId: number;
};

export type PageParams = {
  params: Record<'fundraisingId', string>;
};

export type User = {
  id: number;
  name: string;
  email: string;
};
