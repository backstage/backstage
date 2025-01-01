'use client';

import styles from './styles.module.css';
import IframeResizer from '@iframe-resizer/react';

interface FrameProps {
  url: string;
  border: boolean;
}

export const Frame = ({ url, border }: FrameProps) => {
  return (
    <IframeResizer
      src={url}
      license="GPLv3"
      checkOrigin={false}
      className={styles.container}
      style={{
        border: border ? '1px solid var(--canon-border-base)' : 'none',
      }}
    />
  );
};
