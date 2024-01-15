export const toCurrency = (value: number) => {
  return `${value.toLocaleString('ua-UA').replaceAll(',', ' ')} ₴`;
};

export const groupBy = (
  collection: Record<string, any>,
  callback: (value: any) => string | number
) => {
  //@ts-expect-error
  return Object.groupBy(collection, callback);
};
