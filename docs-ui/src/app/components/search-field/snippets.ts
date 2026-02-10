export const searchFieldUsageSnippet = `import { SearchField } from '@backstage/ui';

<SearchField />`;

export const withLabelSnippet = `<SearchField label="Search" />`;

export const sizesSnippet = `<Flex direction="row" gap="4">
  <SearchField aria-label="Search" size="small" />
  <SearchField aria-label="Search" size="medium" />
</Flex>`;

export const withDescriptionSnippet = `<SearchField
  label="Search"
  description="Enter a search term to filter results"
/>`;

export const startCollapsedSnippet = `<Flex direction="row" gap="4">
  <SearchField aria-label="Search" size="small" startCollapsed />
  <SearchField aria-label="Search" size="medium" startCollapsed />
</Flex>`;
