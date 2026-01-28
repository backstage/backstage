'use client';

import {
  TooltipTrigger,
  Tooltip,
} from '../../../../../packages/ui/src/components/Tooltip/Tooltip';
import { Button } from '../../../../../packages/ui/src/components/Button/Button';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';

export const Default = () => {
  return (
    <TooltipTrigger>
      <Button>Hover me</Button>
      <Tooltip>Helpful information</Tooltip>
    </TooltipTrigger>
  );
};

export const Placement = () => {
  return (
    <Flex gap="4">
      <TooltipTrigger>
        <Button>Top</Button>
        <Tooltip placement="top">Top tooltip</Tooltip>
      </TooltipTrigger>
      <TooltipTrigger>
        <Button>Right</Button>
        <Tooltip placement="right">Right tooltip</Tooltip>
      </TooltipTrigger>
      <TooltipTrigger>
        <Button>Bottom</Button>
        <Tooltip placement="bottom">Bottom tooltip</Tooltip>
      </TooltipTrigger>
      <TooltipTrigger>
        <Button>Left</Button>
        <Tooltip placement="left">Left tooltip</Tooltip>
      </TooltipTrigger>
    </Flex>
  );
};
