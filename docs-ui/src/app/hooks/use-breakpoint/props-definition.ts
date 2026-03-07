import { type PropDef } from '@/utils/propDefs';

const Breakpoint = ['"initial"', '"xs"', '"sm"', '"md"', '"lg"', '"xl"'];

export const useBreakpointReturnDefs: Record<string, PropDef> = {
  breakpoint: {
    type: 'enum',
    values: Breakpoint,
    description: 'The current active breakpoint based on screen width',
  },
  up: {
    type: 'enum',
    values: [`(breakpoint: ${Breakpoint.join(' | ')}) => boolean`],
    description:
      'Function that takes a breakpoint and returns true if the screen width is at or above that breakpoint',
  },
  down: {
    type: 'enum',
    values: [`(breakpoint: ${Breakpoint.join(' | ')}) => boolean`],
    description:
      'Function that takes a breakpoint and returns true if the screen width is at or below that breakpoint',
  },
};
