import { childrenPropDefs, classNamePropDefs } from '@/utils/propDefs';
import type { PropDef } from '@/utils/propDefs';

export const dialogTriggerPropDefs: Record<string, PropDef> = {
  defaultOpen: {
    type: 'boolean',
    description: 'Whether the popover is open by default (uncontrolled).',
  },
  isOpen: {
    type: 'boolean',
    description: 'Whether the popover is open (controlled).',
  },
  onOpenChange: {
    type: 'enum',
    values: ['(isOpen: boolean) => void'],
    description: 'Handler called when the popover open state changes.',
  },
  ...childrenPropDefs,
};

export const popoverPropDefs: Record<string, PropDef> = {
  placement: {
    type: 'enum',
    values: ['top', 'right', 'bottom', 'left'],
    description:
      'The placement of the popover relative to the trigger element.',
  },
  offset: {
    type: 'number',
    default: '8',
    description:
      'The distance in pixels between the popover and the trigger element.',
  },
  containerPadding: {
    type: 'number',
    default: '12',
    description:
      'The minimum distance in pixels from the edge of the viewport.',
  },
  hideArrow: {
    type: 'boolean',
    default: 'false',
    description: 'Whether to hide the arrow pointing to the trigger element.',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
};
