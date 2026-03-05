'use client';

import { CSSProperties, ReactNode } from 'react';
import styles from './styles.module.css';

interface DecorativeBoxProps {
  children?: ReactNode;
  style?: CSSProperties;
}

export const DecorativeBox = ({ children, style }: DecorativeBoxProps) => {
  return (
    <div className={styles.box} style={style}>
      {children}
    </div>
  );
};
