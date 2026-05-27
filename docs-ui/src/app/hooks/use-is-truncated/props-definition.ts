import { type PropDef } from '@/utils/propDefs';

export const useIsTruncatedReturnDefs: Record<string, PropDef> = {
  ref: {
    type: 'enum',
    values: ['RefObject<HTMLElement>'],
    description:
      'Ref to attach to the element you want to monitor for truncation.',
  },
  truncated: {
    type: 'boolean',
    description:
      'Whether the element is currently truncated (scrollWidth exceeds clientWidth).',
  },
  checkTruncation: {
    type: 'enum',
    values: ['() => void'],
    description:
      'Call this on hover or focus to re-check truncation state. Kept on-demand to avoid layout thrashing.',
  },
};
