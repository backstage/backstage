import {
  classNamePropDefs,
  childrenPropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';
import { Chip } from '@/components/Chip';

export const checkboxGroupPropDefs: Record<string, PropDef> = {
  label: {
    type: 'string',
    description: 'The visible label for the checkbox group.',
  },
  'aria-label': {
    type: 'string',
    description:
      'Accessible label when a visible label is not provided. Either label, aria-label, or aria-labelledby is required.',
  },
  'aria-labelledby': {
    type: 'string',
    description:
      'ID of an element that labels the checkbox group. Either label, aria-label, or aria-labelledby is required.',
  },
  secondaryLabel: {
    type: 'string',
    description: (
      <>
        Secondary label text. Defaults to <Chip>Required</Chip> when isRequired
        is true.
      </>
    ),
  },
  description: {
    type: 'string',
    description: 'Helper text displayed below the label.',
  },
  orientation: {
    type: 'enum',
    values: ['horizontal', 'vertical'],
    default: 'vertical',
    description: 'The axis the checkboxes should align with.',
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
  isInvalid: {
    type: 'boolean',
    description: 'Whether the checkbox group is in an invalid state.',
  },
  name: {
    type: 'string',
    description: 'The name used for form submission.',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};
