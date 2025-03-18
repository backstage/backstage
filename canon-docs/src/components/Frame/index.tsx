/* eslint-disable @next/next/no-css-tags */
'use client';

import { useEffect, useState } from 'react';
import ReactFrame from 'react-frame-component';

export const Frame = ({ children }: { children: React.ReactNode }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  if (!show) return null;

  return (
    <ReactFrame
      loading="lazy"
      style={{ width: '100%', height: '100%' }}
      initialContent={`<!DOCTYPE html><html data-theme="light"><head></head><body><div class="frame-root"></div></body></html>`}
      mountTarget=".frame-root"
      head={
        <>
          <link rel="stylesheet" href="/core.css" />
          <link rel="stylesheet" href="/components.css" />
          <link rel="stylesheet" href="/backstage.css" />
        </>
      }
    >
      {children}
    </ReactFrame>
  );
};
