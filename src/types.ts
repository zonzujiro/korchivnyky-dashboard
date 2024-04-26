export type Primitive = string | number | boolean | null | Array<any>;

export type Jar = {
  id: number;
  url: string;
  ownerName: string;
  jarName: string;
  description: string | null;
  goal: number | null;
  logo: string;
  isFinished: boolean;
  debit: number;
  credit: number;
  isTechnical: boolean;
  longJarId: string;
  color: string;
  fundraisingCampaignId: number;
  userId: number;
  checkedAt: string;
  createdAt: string;
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
  ownerId: number;
};

export type Transaction = {
  id: number;
  sum: number;
  fromJarId: number;
  toJarId: number | null;
  createdAt: string;
  receiptUrl: string;
  invoiceId: number;
  type: 'InvoicePayment';
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
  expenseTypeId: number;
};

export type PageParams = {
  params: Record<'fundraisingId', string>;
};

export type User = {
  id: number;
  name: string;
  email: string;
};
