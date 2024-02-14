export type Primitive = string | number | boolean;

export type Jar = {
  id: number;
  url: string;
  userId: null | number;
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

export type InvoicePayload = {
  name: string;
  amount: number;
  description?: string;
  expensiveTypeId: number;
  fileName: string;
  file: string;
};

export type PageParams = {
  params: Record<'fundraisingId', string>;
};

export type User = {
  id: number;
  name: string;
  email: string;
};

export type InvoiceTransactionPayload = {
  receiptName: string;
  receipt: string;
  fromJarId: number;
  invoiceId: number;
  jarSourceAmount: number;
  otherSourcesAmount: number;
};

export type CreateJarPayload = {
  url: string;
  ownerName?: string;
  fundraisingCampaignId: number;
  color: string;
};
