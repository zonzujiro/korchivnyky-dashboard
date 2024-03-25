import type {
  ExpenseRecord,
  ExpenseType,
  FundraisingCampaign,
  Invoice,
  Jar,
} from '@/types';

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

  return invoices.filter((invoice) => typesIds.includes(invoice.expenseTypeId));
};

// Backend is not doing this
export const deactivateInvoices = (
  invoices: Array<Invoice>,
  expenses: Array<ExpenseRecord>
) => {
  const isActiveInvoice = (
    invoice: Invoice,
    expenses: Array<ExpenseRecord>
  ) => {
    const invoiceExpenses = expenses.filter(
      (expense) => expense.invoiceId === invoice.id
    );

    const invoicePayments = invoiceExpenses.reduce(
      (acc, item) => acc + item.sum,
      0
    );

    return Boolean(invoice.amount - invoicePayments);
  };

  return invoices.map((invoice) => ({
    ...invoice,
    isActive: isActiveInvoice(invoice, expenses),
  }));
};
