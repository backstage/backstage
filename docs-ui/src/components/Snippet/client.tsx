'use client';

import { useState } from 'react';
import { Collapsible } from '@base-ui-components/react/collapsible';
import styles from './styles.module.css';

interface SnippetProps {
  preview: JSX.Element;
  codeContent: JSX.Element;
  align?: 'left' | 'center';
  px?: number;
  py?: number;
  open?: boolean;
  height?: string | number;
}

export const SnippetClient = ({
  preview,
  codeContent,
  align = 'left',
  px = 2,
  py = 2,
  open = false,
  height = 'auto',
}: SnippetProps) => {
  const [isOpen, setIsOpen] = useState(open);

  return (
    <Collapsible.Root
      className={styles.container}
      defaultOpen={open}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <div className={styles.preview} style={{ height }}>
        <div
          className={`${styles.previewContent} ${styles[align]}`}
          style={{ padding: `${py}rem ${px}rem` }}
        >
          {preview}
        </div>
        <Collapsible.Trigger className={styles.trigger}>
          {isOpen ? 'Hide code' : 'View code'}
        </Collapsible.Trigger>
      </div>
      <Collapsible.Panel className={styles.panel}>
        {codeContent}
      </Collapsible.Panel>
    </Collapsible.Root>
  );
};
