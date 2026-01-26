'use client';

import {
  TooltipTrigger,
  Tooltip,
} from '../../../../../packages/ui/src/components/Tooltip/Tooltip';
import { Button } from '../../../../../packages/ui/src/components/Button/Button';

export const Default = () => {
  return (
    <TooltipTrigger>
      <Button>Button</Button>
      <Tooltip>I am a tooltip</Tooltip>
    </TooltipTrigger>
  );
};
