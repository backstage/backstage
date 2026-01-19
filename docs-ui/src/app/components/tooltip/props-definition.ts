import {
  childrenPropDefs,
  classNamePropDefs,
  stylePropDefs,
} from '@/utils/propDefs';
import type { PropDef } from '@/utils/propDefs';

export const tooltipTriggerPropDefs: Record<string, PropDef> = {
  isDisabled: {
    type: 'boolean',
  },
  delay: {
    type: 'number',
    default: '600',
  },
  closeDelay: {
    type: 'number',
    default: '500',
  },
  isOpen: {
    type: 'boolean',
  },
  defaultOpen: {
    type: 'boolean',
  },
  ...childrenPropDefs,
};

export const tooltipPropDefs: Record<string, PropDef> = {
  triggerRef: {
    type: 'enum',
    values: ['RefObject<Element | null>'],
  },
  isEntering: {
    type: 'boolean',
  },
  isExiting: {
    type: 'boolean',
  },
  placement: {
    type: 'enum',
    values: ['top', 'right', 'bottom', 'left'],
  },
  containerPadding: {
    type: 'number',
    default: '12',
  },
  offset: {
    type: 'number',
    default: '0',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};
