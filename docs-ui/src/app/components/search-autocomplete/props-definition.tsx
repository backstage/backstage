import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';
import { Chip } from '@/components/Chip';

export const searchAutocompletePropDefs: Record<string, PropDef> = {
  'aria-label': {
    type: 'string',
    description: 'Accessible label for the search input.',
  },
  'aria-labelledby': {
    type: 'string',
    description: 'ID of the element that labels the search input.',
  },
  inputValue: {
    type: 'string',
    description: 'The current input value (controlled).',
  },
  onInputChange: {
    type: 'enum',
    values: ['(value: string) => void'],
    description: 'Handler called when the input value changes.',
  },
  placeholder: {
    type: 'string',
    default: 'Search',
    description:
      'Placeholder text shown when the input is empty. Also used as the accessible label when neither aria-label nor aria-labelledby is provided.',
  },
  size: {
    type: 'enum',
    values: ['small', 'medium'],
    default: 'small',
    responsive: true,
    description: (
      <>
        Visual size of the input. Use <Chip>small</Chip> for inline or dense
        layouts, <Chip>medium</Chip> for standalone fields.
      </>
    ),
  },
  isLoading: {
    type: 'boolean',
    default: 'false',
    description:
      'Whether results are currently loading. Dims existing results and announces loading state to screen readers.',
  },
  popoverWidth: {
    type: 'string',
    description:
      'Width of the results popover. Accepts any CSS width value. Matches the input width when not set.',
  },
  popoverPlacement: {
    type: 'enum',
    values: ['bottom start', 'bottom end', 'top start', 'top end'],
    default: 'bottom start',
    description: 'Placement of the results popover relative to the input.',
  },
  defaultOpen: {
    type: 'boolean',
    default: 'false',
    description: 'Whether the results popover is open by default.',
  },
  children: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'The result items to render inside the autocomplete.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const searchAutocompleteItemPropDefs: Record<string, PropDef> = {
  id: {
    type: 'string',
    description: 'Unique identifier for the item.',
  },
  textValue: {
    type: 'string',
    description:
      'Plain text value used for keyboard navigation and accessibility.',
  },
  onAction: {
    type: 'enum',
    values: ['() => void'],
    description: 'Handler called when the item is selected.',
  },
  children: {
    type: 'enum',
    values: ['ReactNode'],
    required: true,
    description: 'Content to render inside the item.',
  },
  ...classNamePropDefs,
};
