import {
  classNamePropDefs,
  stylePropDefs,
  gapPropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const containerPropDefs: Record<string, PropDef> = {
  ...gapPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const containerUsageSnippet = `import { Container } from "@backstage/ui";

<Container>Hello World!</Container>`;

export const containerDefaultSnippet = `<Container>
  <DecorativeBox />
</Container>`;

export const containerSimpleSnippet = `<Container>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
</Container>`;

export const containerResponsiveSnippet = `<Container paddingY={{ xs: 'sm', md: 'md' }}>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
</Container>`;
