import type { Breakpoint } from '@backstage/canon/src/types';

const breakpoints = ['initial', 'xs', 'sm', 'md', 'lg', 'xl'] as Breakpoint[];

export type PropDef = {
  type: 'string' | 'enum' | 'enum | string' | 'number' | 'boolean';
  values?: string | string[];
  default?: string;
  required?: boolean;
  responsive?: boolean;
};

export { breakpoints };
export type { Breakpoint };

export const spacingValues = [
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
  '13',
  '14',
];

export const paddingPropDefs = (
  spacingValues: string[],
): Record<string, PropDef> => ({
  p: {
    type: 'enum | string',
    values: spacingValues,
    responsive: true,
  },
  px: {
    type: 'enum | string',
    values: spacingValues,
    responsive: true,
  },
  py: {
    type: 'enum | string',
    values: spacingValues,
    responsive: true,
  },
  pt: {
    type: 'enum | string',
    values: spacingValues,
    responsive: true,
  },
  pr: {
    type: 'enum | string',
    values: spacingValues,
    responsive: true,
  },
  pb: {
    type: 'enum | string',
    values: spacingValues,
    responsive: true,
  },
  pl: {
    type: 'enum | string',
    values: spacingValues,
    responsive: true,
  },
});

export const marginPropDefs = (
  spacingValues: string[],
): Record<string, PropDef> => ({
  m: {
    type: 'enum | string',
    values: spacingValues,
    responsive: true,
  },
  mx: {
    type: 'enum | string',
    values: spacingValues,
    responsive: true,
  },
  my: {
    type: 'enum | string',
    values: spacingValues,
    responsive: true,
  },
  mt: {
    type: 'enum | string',
    values: spacingValues,
    responsive: true,
  },
  mr: {
    type: 'enum | string',
    values: spacingValues,
    responsive: true,
  },
  mb: {
    type: 'enum | string',
    values: spacingValues,
    responsive: true,
  },
  ml: {
    type: 'enum | string',
    values: spacingValues,
    responsive: true,
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
    default: '0',
    responsive: true,
  },
  minWidth: {
    type: 'string',
    default: '0',
    responsive: true,
  },
  maxWidth: {
    type: 'string',
    default: '0',
    responsive: true,
  },
};

export const heightPropDefs: Record<string, PropDef> = {
  height: {
    type: 'string',
    default: '0',
    responsive: true,
  },
  minHeight: {
    type: 'string',
    default: '0',
    responsive: true,
  },
  maxHeight: {
    type: 'string',
    default: '0',
    responsive: true,
  },
};

export const positionPropDefs: Record<string, PropDef> = {
  position: {
    type: 'enum',
    values: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
    default: 'static',
    responsive: true,
  },
};

export const classNamePropDefs: Record<string, PropDef> = {
  className: {
    type: 'string',
    responsive: false,
  },
};

export const stylePropDefs: Record<string, PropDef> = {
  style: {
    type: 'enum',
    values: ['CSSProperties'],
    responsive: false,
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
