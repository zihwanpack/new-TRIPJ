type ProgressBarProps = {
  progress: number;
  steps: number;
};

export const ProgressBar = ({ progress, steps }: ProgressBarProps) => {
  const percentage = Math.min((progress / steps) * 100, 100);

  return (
    <div className="w-full px-4 mt-4">
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-base transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mt-2 text-right text-xs text-gray-500">
        {progress} / {steps}
      </div>
    </div>
  );
};
