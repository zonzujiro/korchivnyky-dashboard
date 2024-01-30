export type Jar = {
  id: number;
  url: string;
  parent_jar_id: null | number;
  owner_name: string;
  jar_name: string;
  description: null | string;
  goal: null | number;
  logo: null | string;
  is_finished: boolean;
  accumulated: number;
  color: string;
};

export type JarStatisticRecord = {
  id: number;
  jar_id: number;
  accumulated: number;
  created_at: string;
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
  date: string;
  expenseTypeId: ExpenseType['id'];
  receipt: string;
};
