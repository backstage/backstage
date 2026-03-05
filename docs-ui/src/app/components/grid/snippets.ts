export const gridUsageSnippet = `import { Grid } from '@backstage/ui';

<Grid.Root columns="3" gap="4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid.Root>`;

export const defaultSnippet = `<Grid.Root columns="3" gap="4">
  <DecorativeBox />
  <DecorativeBox />
  <DecorativeBox />
  <DecorativeBox />
  <DecorativeBox />
  <DecorativeBox />
</Grid.Root>`;

export const gridResponsiveSnippet = `<Grid.Root columns={{ initial: '2', md: '4' }} gap="4">
  <DecorativeBox>1</DecorativeBox>
  <DecorativeBox>2</DecorativeBox>
  <DecorativeBox>3</DecorativeBox>
  <DecorativeBox>4</DecorativeBox>
</Grid.Root>`;

export const gridItemSnippet = `<Grid.Root columns="4" gap="4">
  <Grid.Item colSpan="2">
    <DecorativeBox>Spans 2 columns</DecorativeBox>
  </Grid.Item>
  <DecorativeBox>1 column</DecorativeBox>
  <DecorativeBox>1 column</DecorativeBox>
</Grid.Root>`;
