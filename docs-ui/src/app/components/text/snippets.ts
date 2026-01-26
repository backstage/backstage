export const textUsageSnippet = `import { Text } from '@backstage/ui';

<Text>This is a text component</Text>`;

export const defaultSnippet = `<Text>This is a text component</Text>`;

export const variantsSnippet = `<Flex direction="column" gap="2">
  <Text variant="title-large">Title Large</Text>
  <Text variant="title-medium">Title Medium</Text>
  <Text variant="title-small">Title Small</Text>
  <Text variant="title-x-small">Title X-Small</Text>
  <Text variant="body-large">Body Large</Text>
  <Text variant="body-medium">Body Medium</Text>
  <Text variant="body-small">Body Small</Text>
  <Text variant="body-x-small">Body X-Small</Text>
</Flex>`;

export const colorsSnippet = `<Flex direction="column" gap="2">
  <Text color="primary">Primary color</Text>
  <Text color="secondary">Secondary color</Text>
  <Text color="tertiary">Tertiary color</Text>
  <Text color="danger">Danger color</Text>
  <Text color="warning">Warning color</Text>
  <Text color="success">Success color</Text>
</Flex>`;

export const weightsSnippet = `<Flex direction="column" gap="2">
  <Text weight="regular">Regular weight</Text>
  <Text weight="bold">Bold weight</Text>
</Flex>`;

export const asElementSnippet = `<Flex direction="column" gap="2">
  <Text as="p">Paragraph element</Text>
  <Text as="span">Span element</Text>
  <Text as="div">Div element</Text>
</Flex>`;

export const truncateSnippet = `<div style={{ width: '200px' }}>
  <Text truncate>
    This is a very long text that will be truncated when it exceeds the
    container width
  </Text>
</div>`;
