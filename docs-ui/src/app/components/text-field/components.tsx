'use client';

import { TextField } from '../../../../../packages/ui/src/components/TextField/TextField';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';
import { RiSparklingLine } from '@remixicon/react';

export const WithLabel = () => {
  return (
    <TextField
      name="url"
      placeholder="Enter a URL"
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
      <TextField
        name="url"
        placeholder="Enter a URL"
        size="small"
        icon={<RiSparklingLine />}
      />
      <TextField
        name="url"
        placeholder="Enter a URL"
        size="medium"
        icon={<RiSparklingLine />}
      />
    </Flex>
  );
};

export const WithDescription = () => {
  return (
    <TextField
      name="url"
      placeholder="Enter a URL"
      label="Label"
      description="Description"
      style={{ maxWidth: '300px' }}
    />
  );
};
