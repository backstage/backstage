import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';
import { Chip } from '@/components/Chip';

export const comboboxPropDefs: Record<string, PropDef> = {
  options: {
    type: 'enum',
    values: ['(Option | OptionSection)[]'],
    description: (
      <>
        Options to display in the dropdown. Pass <Chip>Option</Chip> objects
        directly, or <Chip>OptionSection</Chip> objects to render grouped
        options under section headings.
      </>
    ),
  },
  allowsCustomValue: {
    type: 'boolean',
    default: 'false',
    description:
      'When true, the typed text is accepted as the value on blur or Enter even if it does not match any option.',
  },
  value: {
    type: 'string',
    description: 'Controlled selected value.',
  },
  defaultValue: {
    type: 'string',
    description: 'Initial value for uncontrolled usage.',
  },
  onChange: {
    type: 'enum',
    values: ['(value: Key | null) => void'],
    description: 'Called when the selected option changes.',
  },
  inputValue: {
    type: 'string',
    description: 'Controlled input text.',
  },
  defaultInputValue: {
    type: 'string',
    description: 'Initial input text for uncontrolled usage.',
  },
  onInputChange: {
    type: 'enum',
    values: ['(value: string) => void'],
    description: 'Called when the input text changes.',
  },
  label: {
    type: 'string',
    description: 'Visible label above the combobox.',
  },
  secondaryLabel: {
    type: 'string',
    description: (
      <>
        Secondary text shown next to the label. If not provided and isRequired
        is true, displays <Chip>Required</Chip>.
      </>
    ),
  },
  description: {
    type: 'string',
    description: 'Helper text displayed below the label.',
  },
  placeholder: {
    type: 'string',
    description: 'Text shown when the input is empty.',
  },
  size: {
    type: 'enum',
    values: ['small', 'medium'],
    default: 'small',
    responsive: true,
    description: 'Visual size of the combobox field.',
  },
  icon: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Icon displayed before the input.',
  },
  onOpenChange: {
    type: 'enum',
    values: ['(isOpen: boolean) => void'],
    description: 'Called when the dropdown opens or closes.',
  },
  isDisabled: {
    type: 'boolean',
    description: 'Prevents user interaction when true.',
  },
  disabledKeys: {
    type: 'enum',
    values: ['Iterable<Key>'],
    description: 'Keys of options that should be disabled.',
  },
  isRequired: {
    type: 'boolean',
    description: 'Marks the field as required for form validation.',
  },
  isInvalid: {
    type: 'boolean',
    description: 'Displays the combobox in an error state.',
  },
  name: {
    type: 'string',
    description: 'Form field name for form submission.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
