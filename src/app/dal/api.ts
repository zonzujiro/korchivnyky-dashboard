import type { Jar, JarStatisticRecord } from '../types';
import { addColorToJar } from '../utils';
import { expenseTypes } from './mocks';

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
        body: payload,
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

export const getStatistics = (): Promise<Array<JarStatisticRecord>> => {
  return postData('https://jars.fly.dev/statistics');
};

// export const postJar = async (payload: {
//   url: string;
//   ownerName: string;
//   parentJarId?: FoundersIds;
// }) => {
//   return postData('https://jars.fly.dev/jars', payload);
// };

export const postJar = async (payload: FormData) => {
  return postData('https://jars.fly.dev/jars', payload);
};

export const getExpensesTypes = () => Promise.resolve(expenseTypes);
