import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';
import { Chip } from '@/components/Chip';

export const dateRangePickerPropDefs: Record<string, PropDef> = {
  size: {
    type: 'enum',
    values: ['small', 'medium'],
    default: 'small',
    responsive: true,
    description: (
      <>
        Visual size of the picker. Use <Chip>small</Chip> for dense layouts,{' '}
        <Chip>medium</Chip> for prominent fields.
      </>
    ),
  },
  label: {
    type: 'string',
    description: 'Visible label displayed above the picker.',
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
    description: 'Help text displayed below the label.',
  },
  value: {
    type: 'enum',
    values: ['RangeValue<DateValue>'],
    description: 'Controlled value of the date range.',
  },
  defaultValue: {
    type: 'enum',
    values: ['RangeValue<DateValue>'],
    description: 'Default value for uncontrolled usage.',
  },
  onChange: {
    type: 'enum',
    values: ['(value: RangeValue<DateValue> | null) => void'],
    description: 'Handler called when the selected range changes.',
  },
  granularity: {
    type: 'enum',
    values: ['day', 'hour', 'minute', 'second'],
    default: 'day',
    description:
      'Smallest unit displayed. Defaults to "day" for dates and "minute" for times.',
  },
  minValue: {
    type: 'enum',
    values: ['DateValue'],
    description: 'Minimum allowed date. Dates before this are disabled.',
  },
  maxValue: {
    type: 'enum',
    values: ['DateValue'],
    description: 'Maximum allowed date. Dates after this are disabled.',
  },
  isDateUnavailable: {
    type: 'enum',
    values: ['(date: DateValue) => boolean'],
    description:
      'Callback invoked for each calendar date. Return true to mark a date as unavailable.',
  },
  allowsNonContiguousRanges: {
    type: 'boolean',
    description:
      'When combined with isDateUnavailable, allows selecting ranges that contain unavailable dates.',
  },
  startName: {
    type: 'string',
    description: 'Form field name for the start date, submitted as ISO 8601.',
  },
  endName: {
    type: 'string',
    description: 'Form field name for the end date, submitted as ISO 8601.',
  },
  isRequired: {
    type: 'boolean',
    description: 'Whether the field is required for form submission.',
  },
  isDisabled: {
    type: 'boolean',
    description: 'Whether the picker is disabled.',
  },
  isReadOnly: {
    type: 'boolean',
    description: 'Whether the picker is read-only.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
