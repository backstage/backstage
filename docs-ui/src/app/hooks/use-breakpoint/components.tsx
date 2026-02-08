'use client';

import { useBreakpoint } from '@backstage/ui';
import { useEffect, useState } from 'react';

export function UseBreakpointExample() {
  const { breakpoint, up, down } = useBreakpoint();
  const [isMounted, setIsMounted] = useState(false);

  // prevent hydration mismatch by rendering only on the client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <p>Current Breakpoint: {breakpoint}</p>
      {(up('md') && <p>The viewport is larger than 1024px.</p>) ||
        (down('sm') && <p>The viewport is smaller than 768px.</p>) || (
          <p>The viewport is between 768px and 1024px.</p>
        )}
    </div>
  );
}
