'use client';

import { useTheme } from 'next-themes';
import styles from './styles.module.css';
import IframeResizer from '@iframe-resizer/react';

interface StoryProps {
  id: string;
  border?: boolean;
}

export const Story = ({ id, border = true }: StoryProps) => {
  const { theme } = useTheme();

  const localTheme = theme === 'dark' ? 'Dark' : 'Light';
  const chromaticId = '67584b7e8c2eb09c0422c27e-dmfbzicnkw';
  const chromaticUrl = `https://${chromaticId}.chromatic.com/iframe.html`;
  const localUrl = 'http://localhost:6006/iframe.html';
  const url = process.env.NODE_ENV === 'development' ? localUrl : chromaticUrl;
  const iframeUrl = `${url}?globals=theme%3A${localTheme}&args=&id=${id}`;

  return (
    <IframeResizer
      src={iframeUrl}
      license="GPLv3"
      checkOrigin={false}
      className={styles.container}
      style={{
        border: border ? '1px solid var(--canon-border-base)' : 'none',
      }}
    />
  );
};
