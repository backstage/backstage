import { classNamePropDefs, stylePropDefs } from '@/utils/propDefs';
import type { PropDef } from '@/utils/propDefs';

export const rangeSliderPropDefs: Record<string, PropDef> = {
  label: {
    type: 'string',
    description: 'The label text for the range slider.',
  },
  description: {
    type: 'string',
    description: 'Additional description text displayed below the label.',
  },
  secondaryLabel: {
    type: 'string',
    description:
      'Optional secondary label displayed next to the main label (e.g., "Optional").',
  },
  isRequired: {
    type: 'boolean',
    description:
      'Whether the field is required. Displays "Required" in the label if true.',
  },
  minValue: {
    type: 'number',
    description: 'The minimum value of the slider range.',
    default: '0',
  },
  maxValue: {
    type: 'number',
    description: 'The maximum value of the slider range.',
    default: '100',
  },
  step: {
    type: 'number',
    description: 'The step increment for slider values.',
    default: '1',
  },
  value: {
    type: 'enum',
    values: ['[number, number]'],
    description:
      'Controlled value as an array [min, max]. Use with onChange for controlled behavior.',
  },
  defaultValue: {
    type: 'enum',
    values: ['[number, number]'],
    description: 'Initial value as an array [min, max] for uncontrolled usage.',
    default: '[0, 100]',
  },
  onChange: {
    type: 'enum',
    values: ['(value: [number, number]) => void'],
    description: 'Called when the slider range changes.',
  },
  onChangeEnd: {
    type: 'enum',
    values: ['(value: [number, number]) => void'],
    description:
      'Called when the user stops dragging, useful for triggering actions only on final values.',
  },
  showValueLabel: {
    type: 'boolean',
    description:
      'Whether to display the current range values above the slider.',
    default: 'false',
  },
  formatValue: {
    type: 'enum',
    values: ['(value: number) => string'],
    description:
      'Custom formatter function for displaying values (e.g., adding currency symbols).',
  },
  isDisabled: {
    type: 'boolean',
    description: 'Prevents user interaction when true.',
  },
  orientation: {
    type: 'enum',
    values: ['horizontal', 'vertical'],
    description: 'The orientation of the slider.',
    default: 'horizontal',
  },
  name: {
    type: 'string',
    description: 'Form field name for form submission.',
  },
  'aria-label': {
    type: 'string',
    description:
      'Accessible label for screen readers when no visible label is provided.',
  },
  'aria-labelledby': {
    type: 'string',
    description: 'ID of an element that labels the slider for accessibility.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
