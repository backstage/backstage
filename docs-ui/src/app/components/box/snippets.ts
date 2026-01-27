export const snippetUsage = `import { Box } from '@backstage/ui';

<Box p="4" surface="1">
  Content with padding and background
</Box>`;

export const defaultSnippet = `<Box p="4" surface="1">
  Hello World
</Box>`;

export const boxSurfaceSnippet = `<Flex direction="column" gap="4">
  <Box p="4" surface="0">Surface 0</Box>
  <Box p="4" surface="1">Surface 1</Box>
  <Box p="4" surface="2">Surface 2</Box>
  <Box p="4" surface="3">Surface 3</Box>
</Flex>`;

export const boxResponsiveSnippet = `<Box
  p={{ initial: '2', md: '4' }}
  display={{ initial: 'block', md: 'flex' }}
>
  Hello World
</Box>`;
