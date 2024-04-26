import type { MouseEvent } from 'react';

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

export const uniqueBy = <TItem>(
  array: Array<TItem>,
  dataGetter: (value: TItem) => string | number
) => {
  const grouped = groupBy(array, dataGetter);

  return Object.values(grouped).flat();
};

export const diff = <
  TSource extends Record<string, any>,
  TTarget extends Record<string, any>
>(
  source: TSource,
  target: TTarget
) => {
  const changes = {} as Record<string, any>;

  Object.keys(source).forEach((key) => {
    if (source[key] !== target[key]) {
      changes[key] = source[key];
    }
  });

  return changes as Partial<TSource>;
};

export const isEmpty = (maybeEmpty: Record<string, any>) => {
  return !Object.keys(maybeEmpty).length;
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
  return jars.reduce((acc, jar) => {
    return acc + jar.debit;
  }, 0);
};

export const getPayedMoney = (jars: Array<Jar>) => {
  return jars.reduce((acc, jar) => {
    return acc + jar.credit;
  }, 0);
};

export const getAvailableMoney = (jars: Array<Jar>) => {
  return getGatheredMoney(jars) - getPayedMoney(jars);
};

export const identity = <T>(v: T) => v;

export const getFormValues = <InputsNames extends string>(formData: FormData) =>
  Object.fromEntries(formData.entries()) as Record<InputsNames, string>;

export class NetworkError extends Error {
  code: number;
  customMessage: string;
  backendError?: any;
  traceId: string | null;

  constructor(response: Response) {
    super();

    this.customMessage = `(${response.url}): ${response.statusText}}`;
    this.code = response.status;
    this.traceId = response.headers.get('trace-id');

    console.error(`${this.code}: ${this.customMessage} - ${this.traceId}`);

    if (this.code === 400) {
      response.json().then((body) => {
        console.error(body);
      });
    }
  }
}

export class ParsingError extends SyntaxError {
  customMessage: string;
  code: number;

  constructor(response: Response, error: SyntaxError) {
    super();

    this.customMessage = `(${response.url}): ${response.statusText}}`;
    this.code = response.status;
    this.cause = error.cause;
    this.message = error.message;

    console.log(`${this.code}: ${this.customMessage}`);
  }
}

export const getJarLeftovers = (jar: Jar) => {
  return jar.debit - jar.credit;
};

export const stopEvent = (ev: MouseEvent<any, any>) => {
  ev.stopPropagation();
  ev.preventDefault();
};
