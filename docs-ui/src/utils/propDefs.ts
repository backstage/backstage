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

export type PropDef = {
  type:
    | 'string'
    | 'enum'
    | 'enum | string'
    | 'number'
    | 'boolean'
    | 'spacing'
    | 'complex';
  values?: string | string[];
  complexType?: ComplexTypeDef;
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
    type: 'enum | string',
    values: spacingValues,
    responsive: true,
    description: 'Padding on all sides.',
  },
  px: {
    type: 'enum | string',
    values: spacingValues,
    responsive: true,
    description: 'Horizontal padding (left and right).',
  },
  py: {
    type: 'enum | string',
    values: spacingValues,
    responsive: true,
    description: 'Vertical padding (top and bottom).',
  },
  pt: {
    type: 'enum | string',
    values: spacingValues,
    responsive: true,
    description: 'Padding on the top.',
  },
  pr: {
    type: 'enum | string',
    values: spacingValues,
    responsive: true,
    description: 'Padding on the right.',
  },
  pb: {
    type: 'enum | string',
    values: spacingValues,
    responsive: true,
    description: 'Padding on the bottom.',
  },
  pl: {
    type: 'enum | string',
    values: spacingValues,
    responsive: true,
    description: 'Padding on the left.',
  },
});

export const marginPropDefs = (
  spacingValues: string[],
): Record<string, PropDef> => ({
  m: {
    type: 'enum | string',
    values: spacingValues,
    responsive: true,
    description: 'Margin on all sides.',
  },
  mx: {
    type: 'enum | string',
    values: spacingValues,
    responsive: true,
    description: 'Horizontal margin (left and right).',
  },
  my: {
    type: 'enum | string',
    values: spacingValues,
    responsive: true,
    description: 'Vertical margin (top and bottom).',
  },
  mt: {
    type: 'enum | string',
    values: spacingValues,
    responsive: true,
    description: 'Margin on the top.',
  },
  mr: {
    type: 'enum | string',
    values: spacingValues,
    responsive: true,
    description: 'Margin on the right.',
  },
  mb: {
    type: 'enum | string',
    values: spacingValues,
    responsive: true,
    description: 'Margin on the bottom.',
  },
  ml: {
    type: 'enum | string',
    values: spacingValues,
    responsive: true,
    description: 'Margin on the left.',
  },
});

export const spacingPropDefs = {
  ...paddingPropDefs(spacingValues),
  ...marginPropDefs(spacingValues),
};

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
    type: 'enum | string',
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
