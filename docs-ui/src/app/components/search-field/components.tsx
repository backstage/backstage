'use client';

import { SearchField } from '../../../../../packages/ui/src/components/SearchField/SearchField';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';

export const WithLabel = () => {
  return (
    <SearchField label="Search" style={{ width: '100%', maxWidth: '300px' }} />
  );
};

export const Sizes = () => {
  return (
    <Flex direction="row" gap="4" style={{ width: '100%', maxWidth: '600px' }}>
      <SearchField aria-label="Search" size="small" />
      <SearchField aria-label="Search" size="medium" />
    </Flex>
  );
};

export const WithDescription = () => {
  return (
    <SearchField
      label="Search"
      description="Enter a search term to filter results"
      style={{ width: '100%', maxWidth: '300px' }}
    />
  );
};

export const StartCollapsed = () => {
  return (
    <Flex direction="row" gap="4">
      <SearchField aria-label="Search" size="small" startCollapsed />
      <SearchField aria-label="Search" size="medium" startCollapsed />
    </Flex>
  );
};
