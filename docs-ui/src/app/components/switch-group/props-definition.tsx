import {
  classNamePropDefs,
  childrenPropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';
import { Chip } from '@/components/Chip';

export const switchGroupPropDefs: Record<string, PropDef> = {
  label: {
    type: 'string',
    description: 'The visible label for the switch group.',
  },
  'aria-label': {
    type: 'string',
    description:
      'Accessible label when a visible label is not provided. Either label, aria-label, or aria-labelledby is required.',
  },
  'aria-labelledby': {
    type: 'string',
    description:
      'ID of an element that labels the switch group. Either label, aria-label, or aria-labelledby is required.',
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
    description: 'The axis the switches should align with.',
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
    description: 'Whether all switches in the group are disabled.',
  },
  isReadOnly: {
    type: 'boolean',
    description: 'Whether all switches in the group are read-only.',
  },
  isRequired: {
    type: 'boolean',
    description:
      'Whether at least one selection is required for form submission.',
  },
  isInvalid: {
    type: 'boolean',
    description: 'Whether the switch group is in an invalid state.',
  },
  name: {
    type: 'string',
    description: 'The name used for form submission.',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};
