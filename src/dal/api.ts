'use server';

import { cookies } from 'next/headers';

import type {
  ExpenseType,
  FundraisingCampaign,
  Invoice,
  Jar,
  JarStatisticRecord,
  User,
  Primitive,
  ExpenseRecord,
} from '@/types';
import { NetworkError, ParsingError, addColorToJar, identity } from '@/toolbox';

import { deactivateInvoices, getFundraisingInvoices } from './dataModificators';
import type {
  CreateJarPayload,
  InvoiceTransactionPayload,
  JarsTransactionPayload,
  ExpenseTypePayload,
  CreateInvoicePayloadWithMissPrint,
} from './types';

const getAuthorization = () => ({
  Authorization: cookies().get('authorization')?.value || '',
});

const handleSearchParams = (
  baseUrl: string,
  paramsSource?: Partial<Record<string, Primitive>>
) => {
  if (!paramsSource || !Object.values(paramsSource).filter(identity).length) {
    return baseUrl;
  }

  const searchParams = new URLSearchParams();

  Object.entries(paramsSource).forEach(([key, value]) => {
    searchParams.append(key, `${value}`);
  });

  return `${baseUrl}?${searchParams.toString()}`;
};

const get = async (
  url: string,
  paramsSource?: Partial<Record<string, Primitive>>
) => {
  const response = await fetch(handleSearchParams(url, paramsSource), {
    headers: {
      ...getAuthorization(),
    },
  });

  if (response.status > 200) {
    throw new NetworkError(response);
  }

  const json = await response.json();

  return json;
};

const sendPayload = async (
  method: 'post' | 'put',
  url: string,
  payload?: Record<string, Primitive>
) => {
  const options = payload
    ? {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...getAuthorization(),
        },
        body: JSON.stringify(payload),
      }
    : {};

  const response = await fetch(url, {
    method,
    ...options,
  });

  const json = await response.json();

  if (!response.ok) {
    throw new NetworkError(response, json);
  }
};

const post = async (url: string, payload?: Record<string, Primitive>) => {
  return sendPayload('post', url, payload);
};

const put = async (url: string, payload?: Record<string, Primitive>) => {
  return sendPayload('put', url, payload);
};

export const getJars = async (
  fundraisingCampaignId?: string
): Promise<Array<Jar>> => {
  const jars = await get('https://jars.fly.dev/jars', {
    fundraisingCampaignId,
  });

  return jars.map(addColorToJar);
};

export const getStatistics = async (): Promise<Array<JarStatisticRecord>> => {
  return post('https://jars.fly.dev/statistics');
};

export const postJar = async (payload: CreateJarPayload): Promise<Jar> => {
  return post('https://jars.fly.dev/jars', payload);
};

export const putJar = async (payload: CreateJarPayload): Promise<Jar> => {
  return put('https://jars.fly.dev/jars', payload);
};

export const getExpensesTypes = (
  fundraisingCampaignId: string
): Promise<Array<ExpenseType>> => {
  return get('https://jars.fly.dev/expensive-types', {
    fundraisingCampaignId,
  });
};

export const createExpenseType = (payload: ExpenseTypePayload) => {
  return post('https://jars.fly.dev/expensive-types', payload);
};

export const getInvoices = async (): Promise<Array<Invoice>> => {
  const result = await get('https://jars.fly.dev/invoices');

  return result.map((invoice: Record<string, Primitive>) => ({
    ...invoice,
    expenseTypeId: invoice.expensiveTypeId,
  }));
};

export const getExpenses = (
  fundraisingCampaignId?: string
): Promise<Array<ExpenseRecord>> => {
  return get('https://jars.fly.dev/transactions', { fundraisingCampaignId });
};

export const signIn = async (payload: {
  email: string;
  password: string;
}): Promise<{ token: string }> => {
  return post('https://jars.fly.dev/sign-in', payload);
};

export const getFundraisingCampaigns = async (): Promise<
  Array<FundraisingCampaign>
> => {
  const response = (await get(
    'https://jars.fly.dev/fundraising-campaigns'
  )) as Array<FundraisingCampaign>;

  // Newest - first one
  return response.sort((first, second) => second.id - first.id);
};

export const createInvoiceTransaction = (
  payload: InvoiceTransactionPayload
) => {
  return post('https://jars.fly.dev/transactions/invoice', payload);
};

export const createJarsTransaction = (payload: JarsTransactionPayload) => {
  return post('https://jars.fly.dev/transactions/direct', payload);
};

export const createInvoice = (payload: CreateInvoicePayloadWithMissPrint) => {
  return post('https://jars.fly.dev/invoices', payload);
};

export const editInvoice = (
  invoiceId: number,
  payload: Partial<CreateInvoicePayloadWithMissPrint>
) => {
  return put(`https://jars.fly.dev/invoices/${invoiceId}`, payload);
};

export const getUsers = async (): Promise<Array<User>> => {
  return get('https://jars.fly.dev/users');
};

export const getJarsPageData = async ({
  fundraisingId,
}: {
  fundraisingId: string;
}) => {
  const [jars, expenses, expenseTypes, statistics, fundraisings, users] =
    await Promise.all([
      getJars(fundraisingId),
      getExpenses(fundraisingId),
      getExpensesTypes(fundraisingId),
      getStatistics(),
      getFundraisingCampaigns(),
      getUsers(),
    ]);

  return { jars, expenses, expenseTypes, statistics, fundraisings, users };
};

export const getCurrentUser = async (): Promise<User> => {
  return get('https://jars.fly.dev/users/current');
};

export const getInvoicesPageData = async ({
  fundraisingId,
}: {
  fundraisingId: string;
}) => {
  const [expensesTypes, expenses, invoices, jars, currentUser, users] =
    await Promise.all([
      getExpensesTypes(fundraisingId),
      getExpenses(fundraisingId),
      getInvoices(),
      getJars(fundraisingId),
      getCurrentUser(),
      getUsers(),
    ]);

  const fundraisingInvoices = getFundraisingInvoices(invoices, expensesTypes);
  const deactivatedInvoices = deactivateInvoices(fundraisingInvoices, expenses);

  return {
    expensesTypes,
    expenses,
    invoices: deactivatedInvoices,
    jars,
    currentUser,
    users,
  };
};

export const getFundraisingsPageData = async () => {
  const [fundraisings] = await Promise.all([getFundraisingCampaigns()]);

  return { fundraisings };
};

export const getFundraisingInfo = async ({
  fundraisingId,
}: {
  fundraisingId: string;
}) => {
  const [expensesTypes, expenses, invoices, jars, statistics] =
    await Promise.all([
      getExpensesTypes(fundraisingId),
      getExpenses(fundraisingId),
      getInvoices(),
      getJars(fundraisingId),
      getStatistics(),
    ]);

  const fundraisingInvoices = getFundraisingInvoices(invoices, expensesTypes);
  const deactivatedInvoices = deactivateInvoices(fundraisingInvoices, expenses);

  const jarsIds = jars.map((jar) => jar.id);
  const fundraisingStatistics = statistics.filter((record) =>
    jarsIds.includes(record.jarId)
  );

  return {
    expensesTypes,
    expenses,
    invoices: deactivatedInvoices,
    jars,
    statistics: fundraisingStatistics,
  };
};
