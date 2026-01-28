export const containerUsageSnippet = `import { Container } from "@backstage/ui";

<Container>Hello World!</Container>`;

export const previewSnippet = `<Container py="4">
  Content is centered with max-width
</Container>`;

export const containerSimpleSnippet = `<Container>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
</Container>`;

export const containerResponsiveSnippet = `<Container py={{ initial: '2', md: '4' }}>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
</Container>`;
