export const delay = (task: () => void, ms: number) => {
  return () => setTimeout(task, ms);
};
