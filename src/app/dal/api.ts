'use server';

import type { Jar, JarStatisticRecord } from '../types';
import { addColorToJar } from '../toolbox/utils';
import { expenseTypes, expenses } from './mocks';
import { cookies } from 'next/headers';

const getData = async (url: string) => {
  const response = await fetch(url);
  const json = await response.json();

  return json;
};

const postData = async (url: string, payload?: FormData) => {
  const options = payload
    ? {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(Object.fromEntries(payload.entries())),
      }
    : {};

  const response = await fetch(url, {
    method: 'post',
    ...options,
  });

  if (response.status > 200) {
    throw new Error(response.statusText);
  }

  const json = await response.json();

  return json;
};

export const getJars = async (): Promise<Array<Jar>> => {
  const jars = await getData('https://jars.fly.dev/jars');

  return jars.map(addColorToJar);
};

export const getStatistics = async (): Promise<Array<JarStatisticRecord>> => {
  const statistics = (await postData(
    'https://jars.fly.dev/statistics'
  )) as Array<JarStatisticRecord>;

  return statistics.map((item) => {
    return {
      ...item,
      created_at: item.createdAt.slice(0, 10),
    };
  });
};

export const postJar = async (payload: FormData) => {
  return postData('https://jars.fly.dev/jars', payload);
};

export const getExpensesTypes = () => Promise.resolve(expenseTypes);
export const getExpenses = () => Promise.resolve(expenses);

export const signIn = async (
  formData: FormData
): Promise<{ token: string }> => {
  const response = await postData('https://jars.fly.dev/sign-in', formData);
  // const response = {
  //   token:
  //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjo3fSwiaWF0IjoxNzA2NzkxNzM5LCJleHAiOjE3MDY3OTUzMzl9.1eGap-AqE3KleVnHNGaJ1hr9AQfr3t3XuIIq9LdOEkk',
  // };

  if (response.token) {
    cookies().set({
      name: 'authorization',
      value: response.token,
      httpOnly: true,
    });
  }

  return response;
};

export const getInitialData = async () => {
  const [jars, expenses, expenseTypes, statistics] = await Promise.all([
    getJars(),
    getExpenses(),
    getExpensesTypes(),
    getStatistics(),
  ]);

  return { jars, expenses, expenseTypes, statistics };
};
