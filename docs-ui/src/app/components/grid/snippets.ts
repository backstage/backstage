export const gridUsageSnippet = `import { Grid } from '@backstage/ui';

<Grid.Root columns="3" gap="4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid.Root>`;

export const defaultSnippet = `<Grid.Root columns="3" gap="4">
  <Box style={{ height: '64px' }} />
  <Box style={{ height: '64px' }} />
  <Box style={{ height: '64px' }} />
  <Box style={{ height: '64px' }} />
  <Box style={{ height: '64px' }} />
  <Box style={{ height: '64px' }} />
</Grid.Root>`;

export const gridResponsiveSnippet = `<Grid.Root columns={{ initial: '2', md: '4' }} gap="4">
  <Box>1</Box>
  <Box>2</Box>
  <Box>3</Box>
  <Box>4</Box>
</Grid.Root>`;

export const gridItemSnippet = `<Grid.Root columns="4" gap="4">
  <Grid.Item colSpan="2">Spans 2 columns</Grid.Item>
  <Grid.Item>1 column</Grid.Item>
  <Grid.Item>1 column</Grid.Item>
</Grid.Root>`;
