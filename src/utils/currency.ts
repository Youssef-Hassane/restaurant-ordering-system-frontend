import { Currency, CURRENCY_SYMBOLS } from '../types';

export const formatPrice = (price: number, currency: Currency = 'EGP'): string => {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  
  // Format number with commas
  const formattedNumber = price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return `${symbol}${formattedNumber}`;
};

export const getCurrencySymbol = (currency: Currency): string => {
  return CURRENCY_SYMBOLS[currency] || currency;
};