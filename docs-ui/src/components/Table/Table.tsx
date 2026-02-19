import { CSSProperties, ReactNode } from 'react';
import styles from './styles.module.css';

export const Root = ({ children }: { children: ReactNode }) => {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>{children}</table>
    </div>
  );
};

export const Header = ({ children }: { children: ReactNode }) => {
  return <thead>{children}</thead>;
};

export const Body = ({ children }: { children: ReactNode }) => {
  return <tbody>{children}</tbody>;
};

export const HeaderRow = ({ children }: { children: ReactNode }) => {
  return <tr>{children}</tr>;
};

export const HeaderCell = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) => {
  return (
    <th
      className={`${styles.tableCell} ${styles.tableHeaderCell}`}
      style={style}
    >
      {children}
    </th>
  );
};

export const Row = ({ children }: { children: ReactNode }) => {
  return <tr className={styles.tableRow}>{children}</tr>;
};

export const Cell = ({
  children,
  style,
  colSpan,
}: {
  children: ReactNode;
  style?: CSSProperties;
  colSpan?: number;
}) => {
  return (
    <td className={styles.tableCell} style={style} colSpan={colSpan}>
      {children}
    </td>
  );
};
