export const datePickerUsageSnippet = `import { DatePicker } from '@backstage/ui';

<DatePicker label="Date" />`;

export const withLabelSnippet = `<DatePicker
  label="Date"
  description="Select the date of your event."
/>`;

export const sizesSnippet = `<Flex direction="column" gap="4">
  <DatePicker label="Small" size="small" />
  <DatePicker label="Medium" size="medium" />
</Flex>`;

export const withDefaultValueSnippet = `import { parseDate } from '@internationalized/date';

<DatePicker
  label="Booking date"
  defaultValue={parseDate('2025-02-03')}
/>`;

export const disabledSnippet = `<DatePicker
  label="Date"
  isDisabled
/>`;
