export function capitalizeFirstLetter(str) {
  const result = `${str[0].toUpperCase()}${str.substring(1)}`;
  return result;
}
