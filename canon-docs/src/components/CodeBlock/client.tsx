'use client';

import { CodeBlockProps } from '.';
import { Text } from '../../../../packages/canon';
import styles from './styles.module.css';

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
      <div dangerouslySetInnerHTML={{ __html: out }} className={styles.code} />
    </div>
  );
};
