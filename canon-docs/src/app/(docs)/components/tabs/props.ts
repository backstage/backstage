import {
  childrenPropDefs,
  classNamePropDefs,
  stylePropDefs,
} from '../../../../utils/propDefs';
import type { PropDef } from '../../../../utils/propDefs';

export const tabsRootPropDefs: Record<string, PropDef> = {
  defaultValue: {
    type: 'enum',
    values: ['any'],
    default: '0',
  },
  value: {
    type: 'enum',
    values: ['any'],
  },
  onValueChange: {
    type: 'enum',
    values: [`((value) => void)`],
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const tabsListPropDefs: Record<string, PropDef> = {
  activateOnFocus: {
    type: 'boolean',
    default: 'false',
  },
  loop: {
    type: 'boolean',
    default: 'false',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const tabsTabPropDefs: Record<string, PropDef> = {
  value: {
    type: 'string',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const tabsPanelPropDefs: Record<string, PropDef> = {
  value: {
    type: 'string',
  },
  keepMounted: {
    type: 'boolean',
    default: 'false',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};
