export const getTotal = (arr: number[]) => {
  return arr.reduce((acc, curr) => acc + curr, 0);
};
