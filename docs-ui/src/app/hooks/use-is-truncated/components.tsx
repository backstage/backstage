'use client';

import { useIsTruncated } from '../../../../../packages/ui/src/hooks/useIsTruncated';
import {
  Tooltip,
  TooltipTrigger,
} from '../../../../../packages/ui/src/components/Tooltip';
import { Focusable } from 'react-aria';

export function UseIsTruncatedExample() {
  const { ref, truncated } = useIsTruncated();

  return (
    <div style={{ maxWidth: 150 }}>
      <TooltipTrigger delay={300} isDisabled={!truncated}>
        <Focusable>
          <span
            ref={ref as React.Ref<HTMLSpanElement>}
            style={{
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            This is a long label that will be truncated
          </span>
        </Focusable>
        <Tooltip>This is a long label that will be truncated</Tooltip>
      </TooltipTrigger>
    </div>
  );
}
