'use client';

import { useTheme } from 'next-themes';
import styles from './styles.module.css';
export const Story = ({ id, height }: { id: string; height?: number }) => {
  const { theme } = useTheme();

  const localTheme = theme === 'dark' ? 'Dark' : 'Light';
  const chromaticId = '67584b7e8c2eb09c0422c27e-dmfbzicnkw';
  const chromaticUrl = `https://${chromaticId}.chromatic.com/iframe.html`;
  const iframeUrl = `${chromaticUrl}?globals=theme%3A${localTheme}&args=&id=${id}`;

  return (
    <div
      className={styles.container}
      style={{ height: height ? `${height}px` : '120px' }}
    >
      <iframe src={iframeUrl} width="100%" height="100%" />
    </div>
  );
};
