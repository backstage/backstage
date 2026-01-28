export const flexUsageSnippet = `import { Flex } from '@backstage/ui';

<Flex gap="4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Flex>`;

export const defaultSnippet = `<Flex gap="4">
  <Box style={{ width: '64px', height: '64px' }} />
  <Box style={{ width: '64px', height: '64px' }} />
  <Box style={{ width: '64px', height: '64px' }} />
</Flex>`;

export const flexDirectionSnippet = `<Flex direction="column" gap="2">
  <Box>First</Box>
  <Box>Second</Box>
  <Box>Third</Box>
</Flex>`;

export const flexResponsiveSnippet = `<Flex gap={{ initial: '2', md: '4' }}>
  <Box>Item 1</Box>
  <Box>Item 2</Box>
  <Box>Item 3</Box>
</Flex>`;

export const flexAlignSnippet = `<Flex align="center" justify="between" gap="4">
  <Box>Start</Box>
  <Box>Middle</Box>
  <Box>End</Box>
</Flex>`;
