export const formatDateToYearMonth = (date: string) => {
  const [year, month] = date.split('T')[0].split('-');
  return `${year}년 ${month}월`;
};
