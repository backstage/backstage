import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';
import { Chip } from '@/components/Chip';

export const selectPropDefs: Record<string, PropDef> = {
  options: {
    type: 'complex',
    description: 'Array of options to display in the dropdown.',
    complexType: {
      name: 'SelectOption[]',
      properties: {
        value: {
          type: 'string',
          required: true,
          description: 'Unique value for the option.',
        },
        label: {
          type: 'string',
          required: true,
          description: 'Display text for the option.',
        },
        disabled: {
          type: 'boolean',
          required: false,
          description: 'Whether the option is disabled.',
        },
      },
    },
  },
  selectionMode: {
    type: 'enum',
    values: ['single', 'multiple'],
    default: 'single',
    description: 'Single or multiple selection mode.',
  },
  value: {
    type: 'enum',
    values: ['string', 'string[]'],
    description:
      'Controlled selected value. String for single, array for multiple.',
  },
  defaultValue: {
    type: 'enum',
    values: ['string', 'string[]'],
    description:
      'Initial value for uncontrolled usage. String for single, array for multiple.',
  },
  onSelectionChange: {
    type: 'enum',
    values: ['(key: Key | null) => void', '(keys: Selection) => void'],
    description: 'Called when selection changes.',
  },
  label: {
    type: 'string',
    description: 'Visible label above the select.',
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
    default: 'Select an option',
    description: 'Text shown when no option is selected.',
  },
  size: {
    type: 'enum',
    values: ['small', 'medium'],
    default: 'small',
    responsive: true,
    description: 'Visual size of the select field.',
  },
  icon: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Icon displayed before the selected value.',
  },
  searchable: {
    type: 'boolean',
    default: false,
    description: 'Enables search/filter functionality in the dropdown.',
  },
  searchPlaceholder: {
    type: 'string',
    default: 'Search...',
    description:
      'Placeholder text for the search input when searchable is true.',
  },
  isOpen: {
    type: 'boolean',
    description: 'Controlled open state. Use with onOpenChange.',
  },
  defaultOpen: {
    type: 'boolean',
    description: 'Initial open state for uncontrolled usage.',
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
    description: 'Displays the select in an error state.',
  },
  name: {
    type: 'string',
    description: 'Form field name for form submission.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
