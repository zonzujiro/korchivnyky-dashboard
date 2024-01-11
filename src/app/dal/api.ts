import type { Jar } from '../types';
import { jars, statistics } from './mocks';

type FoundersIds = number;

export const getJars = (): Promise<Array<Jar>> => Promise.resolve(jars);
export const getJarsStatistics = () => Promise.resolve(statistics);
export const addJar = async (post: {
  url: string;
  ownerName: 'Іра';
  parentJarId?: FoundersIds;
}) => {
  return post;
};
