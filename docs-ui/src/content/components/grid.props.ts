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
  colStart: {
    type: 'enum | string',
    values: [...columnsValues, 'auto'],
    responsive: true,
  },
  colEnd: {
    type: 'enum | string',
    values: [...columnsValues, 'auto'],
    responsive: true,
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const gridUsageSnippet = `import { Grid } from '@backstage/ui';

<Grid.Root />`;

export const gridDefaultSnippet = `<Grid.Root>
  <DecorativeBox />
  <DecorativeBox />
  <DecorativeBox />
</Grid.Root>`;

export const gridSimpleSnippet = `<Grid.Root columns="3" gap="md">
  <Box>Hello World</Box>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
</Grid.Root>`;

export const gridComplexSnippet = `<Grid.Root columns="3" gap="md">
  <Grid.Item colSpan="1">
    Hello World
  </Grid.Item>
  <Grid.Item colSpan="2">
    Hello World
  </Grid.Item>
</Grid.Root>`;

export const gridMixingRowsSnippet = `<Grid.Root columns="3" gap="md">
  <Grid.Item colSpan="1" rowSpan="2">
    Hello World
  </Grid.Item>
  <Grid.Item colSpan="2">
    Hello World
  </Grid.Item>
  <Grid.Item colSpan="2">
    Hello World
  </Grid.Item>
</Grid.Root>`;

export const gridResponsiveSnippet = `<Grid.Root columns={{ xs: 1, md: 3 }} gap={{ xs: 'xs', md: 'md' }}>
  <Grid.Item colSpan={{ xs: 1, md: 2 }}>
    <Hello World
  </Grid.Item>
  <Grid.Item colSpan={{ xs: 1, md: 1 }}>
    Hello World
  </Grid.Item>
</Grid.Root>`;

export const gridStartEndSnippet = `<Grid.Root columns="3" gap="md">
  <Grid.Item colStart="2" colEnd="4">
    Hello World
  </Grid.Item>
</Grid.Root>`;
