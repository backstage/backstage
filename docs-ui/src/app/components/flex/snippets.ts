export const flexUsageSnippet = `import { Flex } from '@backstage/ui';

<Flex />`;

export const defaultSnippet = `<Flex gap="4">
  <Box style={{ width: '64px', height: '64px' }} />
  <Box style={{ width: '64px', height: '64px' }} />
  <Box style={{ width: '64px', height: '64px' }} />
</Flex>`;

export const flexSimpleSnippet = `<Flex gap="4">
  <Box>Hello World</Box>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
</Flex>`;

export const flexResponsiveSnippet = `<Flex gap={{ initial: '2', md: '4' }}>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
</Flex>`;

export const flexAlignSnippet = `<Flex align={{ initial: 'start', md: 'center' }}>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
</Flex>`;
