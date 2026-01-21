export const searchFieldUsageSnippet = `import { SearchField } from '@backstage/ui';

<SearchField />`;

export const withLabelSnippet = `<SearchField name="url" label="Label" aria-label="Search" />`;

export const sizesSnippet = `<Flex direction="row" gap="4">
  <SearchField name="url" aria-label="Search" size="small" />
  <SearchField name="url" aria-label="Search" size="medium" />
</Flex>`;

export const withDescriptionSnippet = `<SearchField
  name="url"
  label="Label"
  description="Description"
  aria-label="Search"
/>`;

export const startCollapsedSnippet = `<Flex direction="column" gap="4">
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
  <SearchField name="url" aria-label="Search" size="small" startCollapsed />
</Flex>`;
