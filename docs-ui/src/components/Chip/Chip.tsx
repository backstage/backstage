import { ReactNode } from 'react';
import styles from './styles.module.css';

export const Chip = ({
  children,
  head = false,
}: {
  children: ReactNode;
  head?: boolean;
}) => {
  return (
    <span className={`${styles.chip} ${head ? styles.head : ''}`}>
      {children}
    </span>
  );
};
