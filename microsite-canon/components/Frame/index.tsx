import { useEffect, useState } from 'react';
import ReactFrame from 'react-frame-component';
import '@backstage/canon/src/css/core.css';
import '@backstage/canon/src/css/components.css';

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
      head={
        <>
          <link rel="stylesheet" href="/core.css" />
          <link rel="stylesheet" href="/components.css" />
        </>
      }
    >
      {children}
    </ReactFrame>
  );
};
