export type InvoiceTransactionPayload = {
  receipts: Array<{ receiptName: string; receipt: string }>;
  fromJarId: number;
  invoiceId: number;
  jarSourceAmount: number;
  otherSourcesAmount: number;
};

export type JarsTransactionPayload = {
  fromJarId: number;
  toJarId: number;
  jarSourceAmount: number;
  otherSourcesAmount: number;
  receiptName: string;
  receipt: string;
};

export type CreateJarPayload = {
  url: string;
  ownerName?: string;
  fundraisingCampaignId: number;
  color: string;
};

export type InvoicePayload = {
  name: string;
  amount: number;
  description?: string;
  expensiveTypeId: number;
  fileName: string;
  file: string;
};

export type ExpenseTypePayload = {
  fundraisingCampaignId: number;
  name: string;
  targetSum: number;
};
