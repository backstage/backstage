import { classNamePropDefs, stylePropDefs } from '@/utils/propDefs';
import type { PropDef } from '@/utils/propDefs';

export const sliderPropDefs: Record<string, PropDef> = {
  label: {
    type: 'string',
    description: 'The label text for the slider.',
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
    description: 'The minimum value of the slider.',
    default: '0',
  },
  maxValue: {
    type: 'number',
    description: 'The maximum value of the slider.',
    default: '100',
  },
  step: {
    type: 'number',
    description: 'The step increment for slider values.',
    default: '1',
  },
  value: {
    type: 'enum',
    values: ['number', '[number, number]'],
    description:
      'Controlled value. Use a single number for a single-thumb slider, or an array [min, max] for a range slider. Use with onChange for controlled behavior.',
  },
  defaultValue: {
    type: 'enum',
    values: ['number', '[number, number]'],
    description:
      'Initial value for uncontrolled usage. Use a single number for a single-thumb slider, or an array [min, max] for a range slider.',
    default: 'minValue or [minValue, maxValue]',
  },
  onChange: {
    type: 'enum',
    values: ['(value: number | [number, number]) => void'],
    description: 'Called when the slider value changes.',
  },
  onChangeEnd: {
    type: 'enum',
    values: ['(value: number | [number, number]) => void'],
    description:
      'Called when the user stops dragging, useful for triggering actions only on final values.',
  },
  formatOptions: {
    type: 'object',
    description:
      'Intl.NumberFormat options for formatting the displayed value (e.g., { style: "currency", currency: "USD" }).',
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
