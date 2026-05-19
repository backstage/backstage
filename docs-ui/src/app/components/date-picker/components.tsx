'use client';

import { DatePicker } from '../../../../../packages/ui/src/components/DatePicker/DatePicker';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';
import { parseDate } from '@internationalized/date';

export const WithLabel = () => {
  return <DatePicker label="Date" style={{ maxWidth: '220px' }} />;
};

export const Sizes = () => {
  return (
    <Flex
      direction="column"
      gap="4"
      style={{ width: '100%', maxWidth: '280px' }}
    >
      <DatePicker label="Small" size="small" />
      <DatePicker label="Medium" size="medium" />
    </Flex>
  );
};

export const WithDefaultValue = () => {
  return (
    <DatePicker
      label="Booking date"
      defaultValue={parseDate('2025-02-03')}
      style={{ maxWidth: '280px' }}
    />
  );
};

export const Disabled = () => {
  return <DatePicker label="Date" isDisabled style={{ maxWidth: '280px' }} />;
};
