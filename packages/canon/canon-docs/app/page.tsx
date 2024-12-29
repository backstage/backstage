'use client';

import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';

export default function Home() {
  const searchParams = useSearchParams();
  const theme = searchParams.get('theme') === 'dark' ? 'Dark' : 'Light';
  const chromaticId = '67584b7e8c2eb09c0422c27e-dmfbzicnkw';
  const chromaticUrl = `https://${chromaticId}.chromatic.com/iframe.html`;
  const iframeUrl = `${chromaticUrl}?globals=theme%3A${theme}&args=&id=components-button--primary`;

  return (
    <div className={styles.page}>
      <iframe src={iframeUrl} id="canon-iframe" />
    </div>
  );
}
