import {
  classNamePropDefs,
  childrenPropDefs,
  type PropDef,
} from '@/utils/propDefs';
import { Chip } from '@/components/Chip';

export const radioGroupPropDefs: Record<string, PropDef> = {
  label: {
    type: 'string',
    description: 'The visible label for the radio group.',
  },
  'aria-label': {
    type: 'string',
    description:
      'Accessible label when a visible label is not provided. Either label, aria-label, or aria-labelledby is required.',
  },
  'aria-labelledby': {
    type: 'string',
    description:
      'ID of an element that labels the radio group. Either label, aria-label, or aria-labelledby is required.',
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
    description: 'The axis the radio buttons should align with.',
  },
  value: {
    type: 'string',
    description: 'The current value (controlled).',
  },
  defaultValue: {
    type: 'string',
    description: 'The default value (uncontrolled).',
  },
  onChange: {
    type: 'enum',
    values: ['(value: string) => void'],
    description: 'Handler called when the value changes.',
  },
  name: {
    type: 'string',
    description: 'The name of the radio group for form submission.',
  },
  isDisabled: {
    type: 'boolean',
    description: 'Whether all radio buttons in the group are disabled.',
  },
  isReadOnly: {
    type: 'boolean',
    description: 'Whether the radio group is read-only.',
  },
  isRequired: {
    type: 'boolean',
    description: 'Whether a selection is required before form submission.',
  },
  isInvalid: {
    type: 'boolean',
    description: 'Whether the radio group is in an invalid state.',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
};

export const radioPropDefs: Record<string, PropDef> = {
  value: {
    type: 'string',
    required: true,
    description: 'The value of the radio button.',
  },
  isDisabled: {
    type: 'boolean',
    description: 'Whether this radio button is disabled.',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
};
