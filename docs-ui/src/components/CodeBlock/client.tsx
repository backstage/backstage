'use client';

import { CodeBlockProps } from '.';
import { Text } from '@backstage/ui';
import styles from './styles.module.css';
import parse from 'html-react-parser';

export const CodeBlockClient = ({
  out,
  title,
}: {
  out: string;
  title?: CodeBlockProps['title'];
}) => {
  return (
    <div className={styles.codeBlock}>
      {title && (
        <div className={styles.title}>
          <Text variant="body">{title}</Text>
        </div>
      )}
      <div className={styles.code}>{parse(out)}</div>
    </div>
  );
};
