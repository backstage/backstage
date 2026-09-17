export const dateRangePickerUsageSnippet = `import { DateRangePicker } from '@backstage/ui';

<DateRangePicker label="Date range" />`;

export const withLabelSnippet = `<DateRangePicker
  label="Date range"
  description="Select a start and end date for your event."
/>`;

export const sizesSnippet = `<Flex direction="column" gap="4">
  <DateRangePicker label="Small" size="small" />
  <DateRangePicker label="Medium" size="medium" />
</Flex>`;

export const withDefaultValueSnippet = `import { parseDate } from '@internationalized/date';

<DateRangePicker
  label="Booking period"
  defaultValue={{
    start: parseDate('2025-02-03'),
    end: parseDate('2025-02-14'),
  }}
/>`;

export const disabledSnippet = `<DateRangePicker
  label="Date range"
  isDisabled
/>`;
