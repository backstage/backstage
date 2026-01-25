import {
  childrenPropDefs,
  classNamePropDefs,
  stylePropDefs,
} from '@/utils/propDefs';
import type { PropDef } from '@/utils/propDefs';

export const dialogTriggerPropDefs: Record<string, PropDef> = {
  isDisabled: {
    type: 'boolean',
  },
  delay: {
    type: 'number',
    default: '0',
  },
  closeDelay: {
    type: 'number',
    default: '0',
  },
  isOpen: {
    type: 'boolean',
  },
  defaultOpen: {
    type: 'boolean',
  },
  ...childrenPropDefs,
};

export const popoverPropDefs: Record<string, PropDef> = {
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
    default: '8',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};
