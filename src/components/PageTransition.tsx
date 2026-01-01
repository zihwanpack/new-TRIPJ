import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  key: string;
}

export const PageTransition = ({ children, key }: PageTransitionProps) => {
  return (
    <motion.div
      key={key}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};
