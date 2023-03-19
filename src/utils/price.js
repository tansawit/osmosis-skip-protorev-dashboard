export function getValue(amount, precision, price) {
  return ((amount / Math.pow(10, precision)) * price).toFixed(2);
}
