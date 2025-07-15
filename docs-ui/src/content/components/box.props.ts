import {
  classNamePropDefs,
  displayPropDefs,
  heightPropDefs,
  positionPropDefs,
  stylePropDefs,
  widthPropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const boxPropDefs: Record<string, PropDef> = {
  as: {
    type: 'enum',
    values: ['div', 'span'],
    default: 'div',
    responsive: true,
  },
  ...widthPropDefs,
  ...heightPropDefs,
  ...positionPropDefs,
  ...displayPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const snippetUsage = `import { Box } from '@backstage/ui';

<Box />`;

export const boxPreviewSnippet = `<Box>
  <DecorativeBox />
</Box>`;

export const boxSimpleSnippet = `<Box padding="md" borderRadius="md">Hello World</Box>`;

export const boxResponsiveSnippet = `<Box
  padding={{ xs: 'sm', md: 'md' }}
  borderRadius={{ xs: 'sm', md: 'md' }}>
  Hello World
</Box>`;
