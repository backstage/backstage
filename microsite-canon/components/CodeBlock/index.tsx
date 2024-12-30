import { ReactNode } from 'react';
import type { BundledLanguage } from 'shiki';
import { codeToHtml } from 'shiki';
import React from 'react';
import styles from './styles.module.css';

interface CodeBlockProps {
  lang?: BundledLanguage;
  title?: string;
  code?: string;
}

export async function CodeBlock({ lang, title, code }: CodeBlockProps) {
  const out = await codeToHtml(code || '', {
    lang: lang || 'ts',
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
  });

  return (
    <div className={styles.codeBlock}>
      {title && <div className={styles.title}>{title}</div>}
      <div dangerouslySetInnerHTML={{ __html: out }} className={styles.code} />
    </div>
  );
}
