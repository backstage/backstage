import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const selectPropDefs: Record<string, PropDef> = {
  label: {
    type: 'string',
    responsive: false,
  },
  description: {
    type: 'string',
    responsive: false,
  },
  name: {
    type: 'string',
    responsive: false,
    required: true,
  },
  options: {
    type: 'enum',
    values: ['Array<{ value: string, label: string }>'],
    required: true,
  },
  selectionMode: {
    type: 'enum',
    values: ['single', 'multiple'],
    default: 'single',
    responsive: false,
  },
  placeholder: {
    type: 'string',
    default: 'Select an item',
    responsive: false,
  },
  icon: {
    type: 'enum',
    values: ['ReactNode'],
    responsive: false,
  },
  value: {
    type: 'enum',
    values: ['string', 'string[]'],
    responsive: false,
    description:
      'Selected value (controlled). String for single selection, array for multiple.',
  },
  defaultValue: {
    type: 'enum',
    values: ['string', 'string[]'],
    responsive: false,
    description:
      'Initial value (uncontrolled). String for single selection, array for multiple.',
  },
  size: {
    type: 'enum',
    values: ['small', 'medium'],
    default: 'small',
    responsive: true,
  },
  isOpen: {
    type: 'boolean',
    responsive: false,
  },
  defaultOpen: {
    type: 'boolean',
    responsive: false,
  },
  disabledKeys: {
    type: 'enum',
    values: ['Iterable<Key>'],
    responsive: false,
  },
  isDisabled: {
    type: 'boolean',
    responsive: false,
  },
  isRequired: {
    type: 'boolean',
    responsive: false,
  },
  isInvalid: {
    type: 'boolean',
    responsive: false,
  },
  onOpenChange: {
    type: 'enum',
    values: ['(isOpen: boolean) => void'],
    responsive: false,
  },
  onSelectionChange: {
    type: 'enum',
    values: ['(key: Key | null) => void', '(keys: Selection) => void'],
    responsive: false,
    description:
      'Handler called when selection changes. Single mode: receives Key | null. Multiple mode: receives Selection.',
  },
  searchable: {
    type: 'boolean',
    default: 'false',
    responsive: false,
  },
  searchPlaceholder: {
    type: 'string',
    default: 'Search...',
    responsive: false,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
