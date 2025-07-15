import {
  childrenPropDefs,
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

const columnsValues = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
];

export const gridPropDefs: Record<string, PropDef> = {
  columns: {
    type: 'enum | string',
    values: [...columnsValues, 'auto'],
    responsive: true,
    default: 'auto',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const gridItemPropDefs: Record<string, PropDef> = {
  colSpan: {
    type: 'enum | string',
    values: [...columnsValues, 'full'],
    responsive: true,
  },
  rowSpan: {
    type: 'enum | string',
    values: [...columnsValues, 'full'],
    responsive: true,
  },
  start: {
    type: 'enum | string',
    values: [...columnsValues, 'auto'],
    responsive: true,
  },
  end: {
    type: 'enum | string',
    values: [...columnsValues, 'auto'],
    responsive: true,
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const gridUsageSnippet = `import { Grid } from '@backstage/ui';

<Grid />`;

export const gridDefaultSnippet = `<Grid.Root>
  <DecorativeBox />
  <DecorativeBox />
  <DecorativeBox />
</Grid.Root>`;

export const gridSimpleSnippet = `<Grid columns={3} gap="md">
  <Box>Hello World</Box>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
</Grid>`;

export const gridComplexSnippet = `<Grid columns={3} gap="md">
  <Grid.Item colSpan={1}>
    <Box>Hello World</Box>
  </Grid.Item>
  <Grid.Item colSpan={2}>
    <Box>Hello World</Box>
  </Grid.Item>
</Grid>`;

export const gridMixingRowsSnippet = `<Grid columns={3} gap="md">
  <Grid.Item colSpan={1} rowSpan={2}>
    <Box>Hello World</Box>
  </Grid.Item>
  <Grid.Item colSpan={2}>
    <Box>Hello World</Box>
  </Grid.Item>
  <Grid.Item colSpan={2}>
    <Box>Hello World</Box>
  </Grid.Item>
</Grid>`;

export const gridResponsiveSnippet = `<Grid columns={{ xs: 1, md: 3 }} gap={{ xs: 'xs', md: 'md' }}>
  <Grid.Item colSpan={{ xs: 1, md: 2 }}>
    <Box>Hello World</Box>
  </Grid.Item>
  <Grid.Item colSpan={{ xs: 1, md: 1 }}>
    <Box>Hello World</Box>
  </Grid.Item>
</Grid>`;

export const gridStartEndSnippet = `<Grid columns={3} gap="md">
  <Grid.Item start={2} end={4}>
    <Box>Hello World</Box>
  </Grid.Item>
</Grid>`;
