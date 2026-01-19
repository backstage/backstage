import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const accordionPropDefs: Record<string, PropDef> = {
  children: {
    type: 'enum',
    values: ['ReactNode', '(state: { isExpanded: boolean }) => ReactNode'],
  },
  defaultExpanded: {
    type: 'boolean',
    default: 'false',
  },
  isExpanded: {
    type: 'boolean',
  },
  onExpandedChange: {
    type: 'enum',
    values: ['(isExpanded: boolean) => void'],
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const accordionTriggerPropDefs: Record<string, PropDef> = {
  level: {
    type: 'enum',
    values: ['1', '2', '3', '4', '5', '6'],
    default: '3',
  },
  title: {
    type: 'string',
  },
  subtitle: {
    type: 'string',
  },
  children: {
    type: 'enum',
    values: ['ReactNode'],
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const accordionPanelPropDefs: Record<string, PropDef> = {
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const accordionGroupPropDefs: Record<string, PropDef> = {
  allowsMultiple: {
    type: 'boolean',
    default: 'false',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
