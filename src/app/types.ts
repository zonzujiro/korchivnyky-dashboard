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

// {
//   id: 3,
//   fundraisingCampaignId: 2,
//   name: 'Машини',
//   isActive: true,
//   createdAt: '2024-01-31T08:55:41.082Z',
//   targetSum: 1500000
// }
// ] [

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
