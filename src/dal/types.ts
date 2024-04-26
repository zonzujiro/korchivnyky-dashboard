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
  goal?: number | null;
  otherSourcesAccumulated: number;
  isFinished: boolean;
};

type CreateInvoicePayloadBase = {
  name: string;
  amount: number;
  description?: string;
  fileName: string;
  file: string;
};

export type CreateInvoicePayloadWithMissPrint = CreateInvoicePayloadBase & {
  // it's how it's called on server
  expensiveTypeId: number;
};

export type CreateInvoicePayload = CreateInvoicePayloadBase & {
  expenseTypeId: number;
};

export type EditInvoicePayload = Partial<CreateInvoicePayload>;

export type ExpenseTypePayload = {
  fundraisingCampaignId: number;
  name: string;
  targetSum: number;
  ownerId: number;
};
