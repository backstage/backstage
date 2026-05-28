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
};
