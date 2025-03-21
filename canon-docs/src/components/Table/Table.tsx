import React from 'react';
import styles from './styles.module.css';

export const Root = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>{children}</table>
    </div>
  );
};

export const Header = ({ children }: { children: React.ReactNode }) => {
  return <thead>{children}</thead>;
};

export const Body = ({ children }: { children: React.ReactNode }) => {
  return <tbody>{children}</tbody>;
};

export const HeaderRow = ({ children }: { children: React.ReactNode }) => {
  return <tr>{children}</tr>;
};

export const HeaderCell = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
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

export const Row = ({ children }: { children: React.ReactNode }) => {
  return <tr className={styles.tableRow}>{children}</tr>;
};

export const Cell = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => {
  return (
    <td className={styles.tableCell} style={style}>
      {children}
    </td>
  );
};
