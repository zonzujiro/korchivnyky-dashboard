import type { Jar, JarStatisticRecord } from '../types';
import { jars, statistics } from './mocks';

type FoundersIds = number;

const getData = async (url: string) => {
  const response = await fetch(url);
  const json = await response.json();

  return json;
};

const postData = async (url: string, payload?: Record<string, any>) => {
  const options = payload ? { body: JSON.stringify(payload) } : {};

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

export const postJar = async (post: {
  url: string;
  owner: string;
  parentJarId?: FoundersIds;
}) => {
  await new Promise((r) => {
    setTimeout(r, 500);
  });
  return { ...jars[0], ...post };
};
