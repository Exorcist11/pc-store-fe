export const calculateDiscountedPrice = (price: number, discount: number) => {
  if (discount) {
    return price * (1 - discount / 100);
  }
  return price;
};
