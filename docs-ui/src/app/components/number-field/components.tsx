'use client';

import { NumberField } from '../../../../../packages/ui/src/components/NumberField/NumberField';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';
import { RiTimeLine } from '@remixicon/react';

export const WithLabel = () => {
  return (
    <NumberField
      name="quantity"
      placeholder="Enter a number"
      label="Label"
      style={{ maxWidth: '300px' }}
    />
  );
};

export const Sizes = () => {
  return (
    <Flex
      direction="column"
      gap="4"
      style={{ width: '100%', maxWidth: '300px' }}
    >
      <NumberField
        name="quantity"
        placeholder="Enter a number"
        size="small"
        icon={<RiTimeLine />}
      />
      <NumberField
        name="quantity"
        placeholder="Enter a number"
        size="medium"
        icon={<RiTimeLine />}
      />
    </Flex>
  );
};

export const WithDescription = () => {
  return (
    <NumberField
      name="quantity"
      placeholder="Enter a number"
      label="Label"
      description="Description"
      style={{ maxWidth: '300px' }}
    />
  );
};
