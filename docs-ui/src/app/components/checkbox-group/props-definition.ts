import {
  classNamePropDefs,
  childrenPropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const checkboxGroupPropDefs: Record<string, PropDef> = {
  label: {
    type: 'string',
    description: 'The visible label for the checkbox group.',
  },
  value: {
    type: 'enum',
    values: ['string[]'],
    description: 'The selected values (controlled).',
  },
  defaultValue: {
    type: 'enum',
    values: ['string[]'],
    description: 'The initial selected values (uncontrolled).',
  },
  onChange: {
    type: 'enum',
    values: ['(value: string[]) => void'],
    description: 'Handler called when the selected values change.',
  },
  isDisabled: {
    type: 'boolean',
    description: 'Whether all checkboxes in the group are disabled.',
  },
  isReadOnly: {
    type: 'boolean',
    description: 'Whether all checkboxes in the group are read-only.',
  },
  isRequired: {
    type: 'boolean',
    description:
      'Whether at least one selection is required for form submission.',
  },
  name: {
    type: 'string',
    description: 'The name used for form submission.',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};
