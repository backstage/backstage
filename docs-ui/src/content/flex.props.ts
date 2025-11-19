import {
  childrenPropDefs,
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const flexPropDefs: Record<string, PropDef> = {
  align: {
    type: 'enum',
    values: ['start', 'center', 'end', 'baseline', 'stretch'],
    responsive: true,
  },
  direction: {
    type: 'enum',
    values: ['row', 'column', 'row-reverse', 'column-reverse'],
    responsive: true,
  },
  justify: {
    type: 'enum',
    values: ['start', 'center', 'end', 'between'],
    responsive: true,
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const flexUsageSnippet = `import { Flex } from '@backstage/ui';

<Flex />`;

export const flexDefaultSnippet = `<Flex>
  <DecorativeBox />
  <DecorativeBox />
  <DecorativeBox />
</Flex>`;

export const flexSimpleSnippet = `<Flex gap="md">
  <Box>Hello World</Box>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
</Flex>`;

export const flexResponsiveSnippet = `<Flex gap={{ xs: 'xs', md: 'md' }}>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
</Flex>`;

export const flexAlignSnippet = `<Flex align={{ xs: 'start', md: 'center' }}>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
</Flex>`;
