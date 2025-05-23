import {
  classNamePropDefs,
  stylePropDefs,
  renderPropDefs,
} from '@/utils/propDefs';
import type { PropDef } from '@/utils/propDefs';

export const collapsibleRootPropDefs: Record<string, PropDef> = {
  defaultOpen: {
    type: 'boolean',
    default: 'false',
  },
  open: {
    type: 'boolean',
  },
  onOpenChange: {
    type: 'enum',
    values: ['(open) => void'],
  },
  ...renderPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const collapsibleTriggerPropDefs: Record<string, PropDef> = {
  ...renderPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const collapsiblePanelPropDefs: Record<string, PropDef> = {
  hiddenUntilFound: {
    type: 'boolean',
    default: 'false',
  },
  keepMounted: {
    type: 'boolean',
    default: 'false',
  },
  ...renderPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};
