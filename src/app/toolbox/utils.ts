import randomColor from 'randomcolor';
import type { Jar } from '../types';

export const getDateString = (value: string) => {
  const date = new Date(value);

  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const toCurrency = (value: number) => {
  return `${value.toLocaleString('ua-UA').replaceAll(',', ' ')} ₴`;
};

export const groupBy = <TItem>(
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
