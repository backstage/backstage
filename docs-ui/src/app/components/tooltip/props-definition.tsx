import {
  childrenPropDefs,
  classNamePropDefs,
  stylePropDefs,
} from '@/utils/propDefs';
import type { PropDef } from '@/utils/propDefs';
import { Chip } from '@/components/Chip';

export const tooltipTriggerPropDefs: Record<string, PropDef> = {
  delay: {
    type: 'number',
    default: 600,
    description: 'Milliseconds before tooltip appears on hover.',
  },
  closeDelay: {
    type: 'number',
    default: 0,
    description: 'Milliseconds before tooltip hides after leaving trigger.',
  },
  trigger: {
    type: 'enum',
    values: ['focus'],
    description: (
      <>
        Set to <Chip>focus</Chip> for focus-only tooltips that do not appear on
        hover.
      </>
    ),
  },
  isOpen: {
    type: 'boolean',
    description: 'Controlled open state. Use with onOpenChange.',
  },
  defaultOpen: {
    type: 'boolean',
    description: 'Initial open state for uncontrolled usage.',
  },
  isDisabled: {
    type: 'boolean',
    description: 'Prevents the tooltip from appearing.',
  },
  ...childrenPropDefs,
};

export const tooltipPropDefs: Record<string, PropDef> = {
  placement: {
    type: 'enum',
    values: [
      'top',
      'top start',
      'top end',
      'bottom',
      'bottom start',
      'bottom end',
      'left',
      'left top',
      'left bottom',
      'right',
      'right top',
      'right bottom',
    ],
    default: 'top',
    description:
      'Position relative to the trigger element. Compound placements include alignment.',
  },
  offset: {
    type: 'number',
    default: 4,
    description: 'Distance in pixels from the trigger element.',
  },
  containerPadding: {
    type: 'number',
    default: 12,
    description: 'Padding from viewport edge when repositioning.',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};
