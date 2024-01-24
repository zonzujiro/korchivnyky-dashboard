import type { Jar, JarStatisticRecord } from '../types';
import { addColorToJar } from '../utils';

type FoundersIds = number;

const getData = async (url: string) => {
  const response = await fetch(url);
  const json = await response.json();

  return json;
};

const postData = async (
  url: string,
  payload?: Record<string, string | number | boolean>
) => {
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

export const postJar = async (payload: {
  url: string;
  ownerName: string;
  parentJarId?: FoundersIds;
}) => {
  return postData('https://jars.fly.dev/jars', payload);
};
