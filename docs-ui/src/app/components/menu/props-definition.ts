import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const menuTriggerPropDefs: Record<string, PropDef> = {
  isOpen: {
    type: 'boolean',
  },
  defaultOpen: {
    type: 'boolean',
  },
  onOpenChange: {
    type: 'enum',
    values: ['(isOpen: boolean) => void'],
  },
};

export const submenuTriggerPropDefs: Record<string, PropDef> = {
  delay: {
    type: 'number',
    default: '200',
  },
};

export const menuPropDefs: Record<string, PropDef> = {
  disabledKeys: {
    type: 'enum',
    values: ['Iterable<Key>'],
  },
  selectionMode: {
    type: 'enum',
    values: ['none', 'single', 'multiple'],
  },
  selectedKeys: {
    type: 'enum',
    values: ['all', 'Iterable<Key>'],
  },
  defaultSelectedKeys: {
    type: 'enum',
    values: ['all', 'Iterable<Key>'],
  },
  placement: {
    type: 'enum',
    values: [
      'top',
      'bottom',
      'left',
      'right',
      'top start',
      'top end',
      'bottom start',
      'bottom end',
      'left start',
      'left end',
      'right start',
      'right end',
    ],
  },
  virtualized: {
    type: 'boolean',
    default: 'false',
  },
  maxWidth: {
    type: 'number',
  },
  maxHeight: {
    type: 'number',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const menuListBoxPropDefs: Record<string, PropDef> = {
  disabledKeys: {
    type: 'enum',
    values: ['Iterable<Key>'],
  },
  selectionMode: {
    type: 'enum',
    values: ['none', 'single', 'multiple'],
  },
  selectedKeys: {
    type: 'enum',
    values: ['all', 'Iterable<Key>'],
  },
  defaultSelectedKeys: {
    type: 'enum',
    values: ['all', 'Iterable<Key>'],
  },
  placement: {
    type: 'enum',
    values: [
      'top',
      'bottom',
      'left',
      'right',
      'top start',
      'top end',
      'bottom start',
      'bottom end',
      'left start',
      'left end',
      'right start',
      'right end',
    ],
  },
  virtualized: {
    type: 'boolean',
    default: 'false',
  },
  maxWidth: {
    type: 'number',
  },
  maxHeight: {
    type: 'number',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const menuAutocompletePropDefs: Record<string, PropDef> = {
  placement: {
    type: 'enum',
    values: [
      'top',
      'bottom',
      'left',
      'right',
      'top start',
      'top end',
      'bottom start',
      'bottom end',
      'left start',
      'left end',
      'right start',
      'right end',
    ],
  },
  virtualized: {
    type: 'boolean',
    default: 'false',
  },
  maxWidth: {
    type: 'number',
  },
  maxHeight: {
    type: 'number',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const menuAutocompleteListboxPropDefs: Record<string, PropDef> = {
  placement: {
    type: 'enum',
    values: [
      'top',
      'bottom',
      'left',
      'right',
      'top start',
      'top end',
      'bottom start',
      'bottom end',
      'left start',
      'left end',
      'right start',
      'right end',
    ],
  },
  virtualized: {
    type: 'boolean',
    default: 'false',
  },
  maxWidth: {
    type: 'number',
  },
  maxHeight: {
    type: 'number',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const menuItemPropDefs: Record<string, PropDef> = {
  id: {
    type: 'enum',
    values: ['Key'],
  },
  value: {
    type: 'string',
  },
  textValue: {
    type: 'string',
  },
  isDisabled: {
    type: 'boolean',
  },
  href: {
    type: 'string',
  },
  onAction: {
    type: 'enum',
    values: ['(event) => void'],
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const menuListBoxItemPropDefs: Record<string, PropDef> = {
  id: {
    type: 'enum',
    values: ['Key'],
  },
  value: {
    type: 'string',
  },
  textValue: {
    type: 'string',
  },
  isDisabled: {
    type: 'boolean',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const menuSectionPropDefs: Record<string, PropDef> = {
  title: {
    type: 'string',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const menuSeparatorPropDefs: Record<string, PropDef> = {
  ...classNamePropDefs,
  ...stylePropDefs,
};
