interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const Card = ({ children, onClick, className }: CardProps) => {
  return (
    <article
      onClick={onClick}
      className={`relative flex-shrink-0 snap-start rounded-2xl cursor-pointer ${className}`}
    >
      {children}
    </article>
  );
};
