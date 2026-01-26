export const snippetUsage = `import { Box } from '@backstage/ui';

<Box />`;

export const defaultSnippet = `<Box
  width="64px"
  height="64px"
  style={{
    background: '#eaf2fd',
    borderRadius: '4px',
    border: '1px solid #2563eb',
  }}
/>`;

export const boxSimpleSnippet = `<Box padding="md" borderRadius="md">Hello World</Box>`;

export const boxResponsiveSnippet = `<Box
  padding={{ xs: 'sm', md: 'md' }}
  borderRadius={{ xs: 'sm', md: 'md' }}>
  Hello World
</Box>`;
