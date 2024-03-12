import randomColor from 'randomcolor';
import type { Jar } from '@/types';

export const getTimeString = (value: string) => {
  const date = new Date(value);

  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');

  return `${hours}:${minutes}`;
};

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
  color: jar.color || randomColor(),
});

export const removeBase64DataPrefix = (base64: string) =>
  base64.replace('data:', '').replace(/^.+,/, '');

export const fileToBase64 = (file: File | Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file as Blob);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const getGatheredMoney = (jars: Array<Jar>) => {
  const byIds = groupBy(jars, (jar) => jar.id);

  return Object.values(byIds).reduce((acc, jars) => {
    const { accumulated, otherSourcesAccumulated } = jars[0];
    return acc + accumulated + otherSourcesAccumulated;
  }, 0);
};

export const identity = <T>(v: T) => v;

export const getFormValues = <InputsNames extends string>(formData: FormData) =>
  Object.fromEntries(formData.entries()) as Record<InputsNames, string>;
