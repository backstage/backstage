import {
  classNamePropDefs,
  stylePropDefs,
  gapPropDefs,
  spacingGroupAll,
  type PropDef,
} from '@/utils/propDefs';
import { Chip } from '@/components/Chip';

export const flexPropDefs: Record<string, PropDef> = {
  direction: {
    type: 'enum',
    values: ['row', 'column', 'row-reverse', 'column-reverse'],
    responsive: true,
    description: (
      <>
        Main axis direction. Use <Chip>row</Chip> for horizontal,{' '}
        <Chip>column</Chip> for vertical layouts.
      </>
    ),
  },
  align: {
    type: 'enum',
    values: ['start', 'center', 'end', 'baseline', 'stretch'],
    responsive: true,
    description:
      'Cross-axis alignment. Controls how children align perpendicular to the main axis.',
  },
  justify: {
    type: 'enum',
    values: ['start', 'center', 'end', 'between'],
    responsive: true,
    description: (
      <>
        Main-axis distribution. Use <Chip>between</Chip> to space children
        evenly with no edge gaps.
      </>
    ),
  },
  gap: {
    ...gapPropDefs.gap,
    default: '4',
    description:
      'Space between children. Accepts spacing scale values or responsive objects.',
  },
  surface: {
    type: 'enum',
    values: ['0', '1', '2', '3', 'danger', 'warning', 'success', 'auto'],
    responsive: true,
    description: (
      <>
        Surface level for theming. Use <Chip>auto</Chip> to increment from
        parent context.
      </>
    ),
  },
  children: {
    type: 'enum',
    values: ['ReactNode'],
    responsive: false,
    description: 'Content to render inside the flex container.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
  spacing: spacingGroupAll,
};
