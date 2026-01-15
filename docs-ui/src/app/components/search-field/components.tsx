'use client';

import { SearchField } from '../../../../../packages/ui/src/components/SearchField/SearchField';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';

export const WithLabel = () => {
  return (
    <SearchField
      name="url"
      label="Label"
      aria-label="Search"
      style={{ width: '100%', maxWidth: '300px' }}
    />
  );
};

export const Sizes = () => {
  return (
    <Flex direction="row" gap="4" style={{ width: '100%', maxWidth: '600px' }}>
      <SearchField name="url" aria-label="Search" size="small" />
      <SearchField name="url" aria-label="Search" size="medium" />
    </Flex>
  );
};

export const WithDescription = () => {
  return (
    <SearchField
      name="url"
      label="Label"
      description="Description"
      aria-label="Search"
      style={{ width: '100%', maxWidth: '300px' }}
    />
  );
};

export const StartCollapsed = () => {
  return (
    <Flex direction="column" gap="4">
      <Flex direction="row" gap="4">
        <SearchField
          name="url"
          aria-label="Search"
          size="small"
          startCollapsed
        />
        <SearchField
          name="url"
          aria-label="Search"
          size="medium"
          startCollapsed
        />
      </Flex>
    </Flex>
  );
};
