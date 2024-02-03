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
  title: string;
};

export type ExpenseRecord = {
  id: number;
  sum: number;
  jarId: number;
  createdAt: string;
  date?: string;
  expenseTypeId: ExpenseType['id'];
  receipt: string;
};
