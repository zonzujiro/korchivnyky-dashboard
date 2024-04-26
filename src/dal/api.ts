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
  Transaction,
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

const sendRequest = async (
  method: 'post' | 'put' | 'delete' | 'get',
  url: string,
  payload?: Record<string, Primitive>
) => {
  const authorization = {
    Authorization: cookies().get('authorization')?.value || '',
  };

  const contentHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const config = payload
    ? {
        headers: {
          ...authorization,
          ...contentHeaders,
        },
        body: JSON.stringify(payload),
      }
    : {
        headers: authorization,
      };

  const response = await fetch(url, {
    method,
    ...config,
  });

  if (!response.ok) {
    throw new NetworkError(response);
  }

  return response;
};

const handleBody = async (response: Response) => {
  try {
    const json = await response.json();

    return json;
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new ParsingError(response, e);
    }
  }
};

const get = async (
  url: string,
  paramsSource?: Partial<Record<string, Primitive>>
) => {
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

  const response = await sendRequest(
    'get',
    handleSearchParams(url, paramsSource)
  );

  return handleBody(response);
};

const post = async (url: string, payload?: Record<string, Primitive>) => {
  const response = await sendRequest('post', url, payload);

  return handleBody(response);
};

const put = async (url: string, payload?: Record<string, Primitive>) => {
  const response = await sendRequest('put', url, payload);

  return handleBody(response);
};

const remove = async (url: string) => {
  await sendRequest('delete', url);

  return true;
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

export const createJar = async (payload: CreateJarPayload): Promise<Jar> => {
  return post('https://jars.fly.dev/jars', payload);
};

export const editJar = async (
  jarId: number,
  payload: Partial<CreateJarPayload>
): Promise<Jar> => {
  return put(`https://jars.fly.dev/jars/${jarId}`, payload);
};

export const getExpenseTypes = (
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

export const getTransactions = (
  fundraisingCampaignId?: string
): Promise<Array<Transaction>> => {
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

export const createInvoice = (
  payload: CreateInvoicePayloadWithMissPrint
): Promise<Invoice> => {
  return post('https://jars.fly.dev/invoices', payload);
};

export const editInvoice = (
  invoiceId: number,
  payload: Partial<CreateInvoicePayloadWithMissPrint>
) => {
  return put(`https://jars.fly.dev/invoices/${invoiceId}`, payload);
};

export const deleteInvoice = (invoiceId: number) => {
  return remove(`https://jars.fly.dev/invoices/${invoiceId}`);
};

export const getUsers = async (): Promise<Array<User>> => {
  return get('https://jars.fly.dev/users');
};

export const getJarsPageData = async ({
  fundraisingId,
}: {
  fundraisingId: string;
}) => {
  const [jars, transactions, expenseTypes, statistics, fundraisings, users] =
    await Promise.all([
      getJars(fundraisingId),
      getTransactions(fundraisingId),
      getExpenseTypes(fundraisingId),
      getStatistics(),
      getFundraisingCampaigns(),
      getUsers(),
    ]);

  return { jars, transactions, expenseTypes, statistics, fundraisings, users };
};

export const getCurrentUser = async (): Promise<User> => {
  return get('https://jars.fly.dev/users/current');
};

export const getInvoicesPageData = async ({
  fundraisingId,
}: {
  fundraisingId: string;
}) => {
  const [expenseTypes, transactions, invoices, jars, currentUser, users] =
    await Promise.all([
      getExpenseTypes(fundraisingId),
      getTransactions(fundraisingId),
      getInvoices(),
      getJars(fundraisingId),
      getCurrentUser(),
      getUsers(),
    ]);

  const fundraisingInvoices = getFundraisingInvoices(invoices, expenseTypes);
  const deactivatedInvoices = deactivateInvoices(
    fundraisingInvoices,
    transactions
  );

  return {
    expenseTypes,
    transactions,
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

export const getExpenseTypesPageData = async (fundraisingId: string) => {
  const [expensesTypes, invoices, transactions, jars] = await Promise.all([
    getExpenseTypes(fundraisingId),
    getInvoices(),
    getTransactions(fundraisingId),
    getJars(fundraisingId),
  ]);

  const fundraisingInvoices = getFundraisingInvoices(invoices, expensesTypes);

  return { expensesTypes, transactions, invoices: fundraisingInvoices, jars };
};

export const getFundraisingInfo = async ({
  fundraisingId,
}: {
  fundraisingId: string;
}) => {
  const [expensesTypes, transactions, invoices, jars, statistics] =
    await Promise.all([
      getExpenseTypes(fundraisingId),
      getTransactions(fundraisingId),
      getInvoices(),
      getJars(fundraisingId),
      getStatistics(),
    ]);

  const fundraisingInvoices = getFundraisingInvoices(invoices, expensesTypes);
  const deactivatedInvoices = deactivateInvoices(
    fundraisingInvoices,
    transactions
  );

  const jarsIds = jars.map((jar) => jar.id);
  const fundraisingStatistics = statistics.filter((record) =>
    jarsIds.includes(record.jarId)
  );

  return {
    expensesTypes,
    transactions,
    invoices: deactivatedInvoices,
    jars,
    statistics: fundraisingStatistics,
  };
};
