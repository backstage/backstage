'use client';

import { DateRangePicker } from '../../../../../packages/ui/src/components/DateRangePicker/DateRangePicker';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';
import { parseDate } from '@internationalized/date';

export const WithLabel = () => {
  return <DateRangePicker label="Date range" style={{ maxWidth: '280px' }} />;
};

export const Sizes = () => {
  return (
    <Flex
      direction="column"
      gap="4"
      style={{ width: '100%', maxWidth: '360px' }}
    >
      <DateRangePicker label="Small" size="small" />
      <DateRangePicker label="Medium" size="medium" />
    </Flex>
  );
};

export const WithDefaultValue = () => {
  return (
    <DateRangePicker
      label="Booking period"
      defaultValue={{
        start: parseDate('2025-02-03'),
        end: parseDate('2025-02-14'),
      }}
      style={{ maxWidth: '360px' }}
    />
  );
};

export const Disabled = () => {
  return (
    <DateRangePicker
      label="Date range"
      isDisabled
      style={{ maxWidth: '360px' }}
    />
  );
};
