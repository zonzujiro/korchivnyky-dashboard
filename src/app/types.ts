export type Jar = {
  id: number;
  url: string;
  parentJarId: null | number;
  ownerName: string;
  jarName: string;
  description: null | string;
  goal: null | number;
  logo: null | string;
  isFinished: boolean;
  accumulated: number;
  color: string;
  fundraisingCampaignId: number;
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
  receipt: string;
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

export type InvoiceRequest = {
  name: string;
  amount: number;
  description: string;
  expensiveTypeId: number;
  fileName: string;
  file: string;
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
