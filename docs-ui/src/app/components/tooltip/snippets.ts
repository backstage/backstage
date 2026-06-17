export const tooltipUsageSnippet = `import { TooltipTrigger, Tooltip, Button } from '@backstage/ui';

<TooltipTrigger>
  <Button>Hover me</Button>
  <Tooltip>Helpful information</Tooltip>
</TooltipTrigger>`;

export const defaultSnippet = `<TooltipTrigger>
  <Button>Hover me</Button>
  <Tooltip>Helpful information</Tooltip>
</TooltipTrigger>`;

export const placementSnippet = `<Flex gap="4">
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
</Flex>`;
