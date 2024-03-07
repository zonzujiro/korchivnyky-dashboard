'use server';

import type {
  ExpenseType,
  FundraisingCampaign,
  Invoice,
  InvoiceTransactionPayload,
  Jar,
  JarStatisticRecord,
  User,
  Primitive,
  CreateJarPayload,
  ExpenseRecord,
  InvoicePayload,
  JarsTransactionPayload,
} from '@/types';
import { addColorToJar, identity } from '@/toolbox';
import { cookies } from 'next/headers';
import { getFundraisingInvoices } from './dataModificators';

class NetworkError extends Error {
  code: number;
  message: string;

  constructor(code: number, message: string) {
    super();

    this.message = message;
    this.code = code;

    console.log(`${code}: ${message}`);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const throwError = (response: Response, body: Record<string, any>) => {
  const message = `${response.status} (${response.url}): ${
    response.statusText
  } - ${body.error.message || ''}`;
  const code = body.error.code;

  throw new NetworkError(code, message);
};

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
      Authorization: cookies().get('authorization')?.value || '',
    },
  });

  const json = await response.json();

  if (response.status > 200) {
    throwError(response, json);
  }

  return json;
};

const post = async (url: string, payload?: Record<string, Primitive>) => {
  const options = payload
    ? {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: cookies().get('authorization')?.value || '',
        },

        body: JSON.stringify(payload),
      }
    : {};

  const response = await fetch(url, {
    method: 'post',
    ...options,
  });

  const json = await response.json();

  if (response.status > 200) {
    throwError(response, json);
  }

  return json;
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

export const postJar = async (payload: CreateJarPayload) => {
  return post('https://jars.fly.dev/jars', payload);
};

export const getExpensesTypes = (
  fundraisingCampaignId: string
): Promise<Array<ExpenseType>> => {
  return get('https://jars.fly.dev/expensive-types', {
    fundraisingCampaignId,
  });
};

export const getInvoices = (): Promise<Array<Invoice>> => {
  return get('https://jars.fly.dev/invoices');
};

export const getExpenses = (
  fundraisingCampaignId: string
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

export const createInvoice = (payload: InvoicePayload) => {
  return post('https://jars.fly.dev/invoices', payload);
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

  return {
    expensesTypes,
    expenses,
    invoices: fundraisingInvoices,
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

  const jarsIds = jars.map((jar) => jar.id);
  const fundraisingStatistics = statistics.filter((record) =>
    jarsIds.includes(record.jarId)
  );

  return {
    expensesTypes,
    expenses,
    invoices: fundraisingInvoices,
    jars,
    statistics: fundraisingStatistics,
  };
};
