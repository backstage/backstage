import {
  classNamePropDefs,
  stylePropDefs,
  spacingValues,
  type PropDef,
} from '@/utils/propDefs';

export const containerPropDefs: Record<string, PropDef> = {
  children: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Content to render inside the container.',
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
    description: 'Top margin.',
  },
  mb: {
    type: 'enum | string',
    values: spacingValues,
    responsive: true,
    description: 'Bottom margin.',
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
    description: 'Top padding.',
  },
  pb: {
    type: 'enum | string',
    values: spacingValues,
    responsive: true,
    description: 'Bottom padding.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
