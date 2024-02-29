import type { ExpenseType, FundraisingCampaign, Invoice, Jar } from '@/types';

export const getCurrentFundraising = (
  fundraisings: Array<FundraisingCampaign>,
  fundraisingId: string
) => fundraisings.find((item) => `${item.id}` === fundraisingId)!;

export const getFundraisingJars = (jars: Array<Jar>, fundraisingId: string) => {
  return jars.filter(
    (item) => `${item.fundraisingCampaignId}` === fundraisingId
  );
};

export const getFundraisingInvoices = (
  invoices: Array<Invoice>,
  expensesTypes: Array<ExpenseType>
) => {
  const typesIds = expensesTypes.map((expense) => expense.id);

  return invoices.filter((invoice) =>
    typesIds.includes(invoice.expensiveTypeId)
  );
};
