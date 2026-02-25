import type { ReactNode } from 'react';
import type { Breakpoint } from '@backstage/ui/src/types';

const breakpoints = ['initial', 'xs', 'sm', 'md', 'lg', 'xl'] as Breakpoint[];

export type ComplexTypeDef = {
  name: string;
  properties: Record<
    string,
    {
      type: string;
      required?: boolean;
      description?: string;
    }
  >;
};

export type SpacingProp = {
  name: string;
  description: ReactNode;
  default?: string;
};

export type SpacingGroupDef = {
  props: SpacingProp[];
  values: string[];
  responsive: boolean;
};

export type PropDef = {
  type:
    | 'string'
    | 'enum'
    | 'enum | string'
    | 'number'
    | 'boolean'
    | 'spacing'
    | 'spacing-group'
    | 'complex';
  values?: string | string[];
  complexType?: ComplexTypeDef;
  spacingGroup?: SpacingGroupDef;
  default?: string;
  required?: boolean;
  responsive?: boolean;
  description?: ReactNode;
};

export { breakpoints };
export type { Breakpoint };

export const spacingValues = [
  '0',
  '0.5',
  '1',
  '1.5',
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
  'auto',
];

export const paddingPropDefs = (
  spacingValues: string[],
): Record<string, PropDef> => ({
  p: {
    type: 'spacing',
    values: spacingValues,
    responsive: true,
    description: 'Padding on all sides.',
  },
  px: {
    type: 'spacing',
    values: spacingValues,
    responsive: true,
    description: 'Horizontal padding (left and right).',
  },
  py: {
    type: 'spacing',
    values: spacingValues,
    responsive: true,
    description: 'Vertical padding (top and bottom).',
  },
  pt: {
    type: 'spacing',
    values: spacingValues,
    responsive: true,
    description: 'Padding on the top.',
  },
  pr: {
    type: 'spacing',
    values: spacingValues,
    responsive: true,
    description: 'Padding on the right.',
  },
  pb: {
    type: 'spacing',
    values: spacingValues,
    responsive: true,
    description: 'Padding on the bottom.',
  },
  pl: {
    type: 'spacing',
    values: spacingValues,
    responsive: true,
    description: 'Padding on the left.',
  },
});

export const marginPropDefs = (
  spacingValues: string[],
): Record<string, PropDef> => ({
  m: {
    type: 'spacing',
    values: spacingValues,
    responsive: true,
    description: 'Margin on all sides.',
  },
  mx: {
    type: 'spacing',
    values: spacingValues,
    responsive: true,
    description: 'Horizontal margin (left and right).',
  },
  my: {
    type: 'spacing',
    values: spacingValues,
    responsive: true,
    description: 'Vertical margin (top and bottom).',
  },
  mt: {
    type: 'spacing',
    values: spacingValues,
    responsive: true,
    description: 'Margin on the top.',
  },
  mr: {
    type: 'spacing',
    values: spacingValues,
    responsive: true,
    description: 'Margin on the right.',
  },
  mb: {
    type: 'spacing',
    values: spacingValues,
    responsive: true,
    description: 'Margin on the bottom.',
  },
  ml: {
    type: 'spacing',
    values: spacingValues,
    responsive: true,
    description: 'Margin on the left.',
  },
});

export const spacingPropDefs = {
  ...paddingPropDefs(spacingValues),
  ...marginPropDefs(spacingValues),
};

// Spacing prop metadata for creating groups
const spacingPropMetadata: Record<string, SpacingProp> = {
  p: { name: 'p', description: 'Padding on all sides.' },
  px: { name: 'px', description: 'Horizontal padding (left and right).' },
  py: { name: 'py', description: 'Vertical padding (top and bottom).' },
  pt: { name: 'pt', description: 'Padding on the top.' },
  pr: { name: 'pr', description: 'Padding on the right.' },
  pb: { name: 'pb', description: 'Padding on the bottom.' },
  pl: { name: 'pl', description: 'Padding on the left.' },
  m: { name: 'm', description: 'Margin on all sides.' },
  mx: { name: 'mx', description: 'Horizontal margin (left and right).' },
  my: { name: 'my', description: 'Vertical margin (top and bottom).' },
  mt: { name: 'mt', description: 'Margin on the top.' },
  mr: { name: 'mr', description: 'Margin on the right.' },
  mb: { name: 'mb', description: 'Margin on the bottom.' },
  ml: { name: 'ml', description: 'Margin on the left.' },
};

export const createSpacingGroup = (
  propNames: string[],
  description?: ReactNode,
): PropDef => {
  const props = propNames
    .map(name => spacingPropMetadata[name])
    .filter(Boolean);

  return {
    type: 'spacing-group',
    spacingGroup: {
      props,
      values: spacingValues,
      responsive: true,
    },
    description:
      description || 'Spacing properties for controlling padding and margin.',
    responsive: true,
  };
};

// Pre-built spacing groups
export const spacingGroupAll = createSpacingGroup(
  [
    'p',
    'px',
    'py',
    'pt',
    'pr',
    'pb',
    'pl',
    'm',
    'mx',
    'my',
    'mt',
    'mr',
    'mb',
    'ml',
  ],
  'Padding and margin properties for controlling spacing around the element.',
);

export const spacingGroupPadding = createSpacingGroup(
  ['p', 'px', 'py', 'pt', 'pr', 'pb', 'pl'],
  'Padding properties for controlling internal spacing.',
);

export const spacingGroupMargin = createSpacingGroup(
  ['m', 'mx', 'my', 'mt', 'mr', 'mb', 'ml'],
  'Margin properties for controlling external spacing.',
);

export const displayPropDefs: Record<string, PropDef> = {
  display: {
    type: 'enum',
    values: ['none', 'inline', 'inline-block', 'block'],
    default: 'block',
    responsive: true,
  },
};

export const gapPropDefs: Record<string, PropDef> = {
  gap: {
    type: 'spacing',
    values: spacingValues,
    responsive: true,
    default: '4',
  },
};

export const widthPropDefs: Record<string, PropDef> = {
  width: {
    type: 'string',
    responsive: true,
    description: 'Sets the width of the element. Accepts CSS values.',
  },
  minWidth: {
    type: 'string',
    responsive: true,
    description: 'Sets the minimum width. Element cannot shrink below this.',
  },
  maxWidth: {
    type: 'string',
    responsive: true,
    description: 'Sets the maximum width. Element cannot grow beyond this.',
  },
};

export const heightPropDefs: Record<string, PropDef> = {
  height: {
    type: 'string',
    responsive: true,
    description: 'Sets the height of the element. Accepts CSS values.',
  },
  minHeight: {
    type: 'string',
    responsive: true,
    description: 'Sets the minimum height. Element cannot shrink below this.',
  },
  maxHeight: {
    type: 'string',
    responsive: true,
    description: 'Sets the maximum height. Element cannot grow beyond this.',
  },
};

export const positionPropDefs: Record<string, PropDef> = {
  position: {
    type: 'enum',
    values: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
    responsive: true,
    description: 'CSS positioning scheme for the element.',
  },
};

export const classNamePropDefs: Record<string, PropDef> = {
  className: {
    type: 'string',
    responsive: false,
    description: 'Additional CSS class name for custom styling.',
  },
};

export const stylePropDefs: Record<string, PropDef> = {
  style: {
    type: 'enum',
    values: ['CSSProperties'],
    responsive: false,
    description: 'Inline CSS styles object.',
  },
};

export const childrenPropDefs: Record<string, PropDef> = {
  children: {
    type: 'enum',
    values: ['ReactNode'],
    required: true,
    responsive: false,
  },
};

export const renderPropDefs: Record<string, PropDef> = {
  render: {
    type: 'enum',
    values: ['React.ReactElement', '(props, state) => React.ReactElement'],
    responsive: false,
  },
};
