'use client';

import { CodeBlockProps } from '.';
import styles from './styles.module.css';
import parse from 'html-react-parser';

// Convert markdown-style backticks to HTML code tags
function parseMarkdownInlineCode(text: string): string {
  return text.replace(/`([^`]+)`/g, '<code>$1</code>');
}

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
          {parse(parseMarkdownInlineCode(title))}
        </div>
      )}
      <div className={styles.code}>{parse(out)}</div>
    </div>
  );
};
