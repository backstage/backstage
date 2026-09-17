import {
  classNamePropDefs,
  heightPropDefs,
  positionPropDefs,
  stylePropDefs,
  widthPropDefs,
  spacingGroupAll,
  type PropDef,
} from '@/utils/propDefs';
import { Chip } from '@/components/Chip';

export const boxPropDefs: Record<string, PropDef> = {
  as: {
    type: 'string',
    default: 'div',
    description:
      'HTML element to render. Accepts any valid HTML tag (div, span, section, etc.).',
  },
  surface: {
    type: 'enum',
    values: ['0', '1', '2', '3', 'danger', 'warning', 'success', 'auto'],
    responsive: true,
    description:
      'Background surface level for visual hierarchy. Higher numbers create elevation.',
  },
  children: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Content to render inside the box.',
  },
  ...widthPropDefs,
  ...heightPropDefs,
  ...positionPropDefs,
  display: {
    type: 'enum',
    values: ['none', 'flex', 'block', 'inline'],
    responsive: true,
    description: (
      <>
        Controls layout behavior. Use <Chip>flex</Chip> for flexbox layouts,{' '}
        <Chip>none</Chip> to hide.
      </>
    ),
  },
  ...classNamePropDefs,
  ...stylePropDefs,
  spacing: spacingGroupAll,
};
