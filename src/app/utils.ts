export const toCurrency = (value: number) => {
  return `${value.toLocaleString('ua-UA').replaceAll(',', ' ')} ₴`;
};
