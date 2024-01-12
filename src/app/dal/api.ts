import type { Jar, JarStatisticRecord } from '../types';
import { jars, statistics } from './mocks';

type FoundersIds = number;

const getData = async (url: string) => {
  const response = await fetch(url);
  const json = await response.json();

  return json;
};

const postData = async (url: string, payload?: Record<string, any>) => {
  const options = payload
    ? {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    : {};

  const response = await fetch(url, {
    method: 'post',
    ...options,
  });

  const json = await response.json();

  return json;
};

export const getJars = async (): Promise<Array<Jar>> => {
  return getData('https://jars.fly.dev/jars');
};

export const getStatistics = (): Promise<Array<JarStatisticRecord>> => {
  return postData('https://jars.fly.dev/statistics');
};

export const postJar = async (payload: {
  url: string;
  ownerName: string;
  parentJarId?: FoundersIds;
}) => {
  return postData('https://jars.fly.dev/jars', payload);
};
