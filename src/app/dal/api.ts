import type { Jar } from '../types';
import { jars, statistics } from './mocks';

type FoundersIds = number;

const getData = async (url: string) => {
  const response = await fetch(url);
  const json = await response.json();

  return json;
};

export const getJars = async (): Promise<Array<Jar>> => {
  return getData('https://jars.fly.dev/jars');
};

export const getStatistics = () => {
  return Promise.resolve(statistics);
  // return getData('https://jars.fly.dev/statistics');
};

export const addJar = async (post: {
  url: string;
  ownerName: 'Іра';
  parentJarId?: FoundersIds;
}) => {
  return post;
};
