export function capitalizeFirstLetter(str) {
  const result = `${str[0].toUpperCase()}${str.substring(1)}`;
  return result;
}

// Leave a certain number of decimal digits, without any rounding
export function formatDecimalNumber(num, numberOfDecimals) {
  // Leave 3 decimals by default
  if (!numberOfDecimals) numberOfDecimals = 3;
  const aux = Math.pow(10, numberOfDecimals);
  const formattedNum = Math.floor(num * aux) / aux;
  return formattedNum;
}
