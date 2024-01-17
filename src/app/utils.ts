import randomColor from 'randomcolor';
import type { Jar } from './types';

export const toCurrency = (value: number) => {
  return `${value.toLocaleString('ua-UA').replaceAll(',', ' ')} ₴`;
};

export const groupBy = <TItem = any>(
  collection: Array<TItem>,
  callback: (value: TItem) => string | number
) => {
  return collection.reduce((acc: Record<string, Array<TItem>>, item: TItem) => {
    const key = callback(item);

    const items = acc[key] ? [...acc[key], item] : [item];

    return { ...acc, [key]: items };
  }, {} as Record<string, Array<TItem>>);
};

export const addColorToJar = (jar: Jar) => ({
  ...jar,
  color: randomColor(),
});
