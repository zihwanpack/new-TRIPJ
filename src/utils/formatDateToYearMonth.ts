export const formatDateToYearMonth = (date: string) => {
  const [year, month] = date.split('.');
  return `${year}년 ${month}월`;
};
