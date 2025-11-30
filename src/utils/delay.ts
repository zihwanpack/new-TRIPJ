export const delay = (task: () => void, ms: number) => {
  return () => new Promise((resolve) => setTimeout(resolve, ms)).then(task);
};
