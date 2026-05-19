import { ReactNode } from 'react';
import styles from './styles.module.css';

export const Chip = ({
  children,
  head = false,
  deprecated = false,
}: {
  children: ReactNode;
  head?: boolean;
  deprecated?: boolean;
}) => {
  return (
    <span
      className={`${styles.chip} ${head ? styles.head : ''} ${
        deprecated ? styles.deprecated : ''
      }`}
    >
      {children}
    </span>
  );
};
