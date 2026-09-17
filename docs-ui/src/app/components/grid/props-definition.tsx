import {
  childrenPropDefs,
  classNamePropDefs,
  gapPropDefs,
  stylePropDefs,
  spacingGroupAll,
  type PropDef,
} from '@/utils/propDefs';
import { Chip } from '@/components/Chip';

const columnValues = [
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
  'auto',
];

const surfaceValues = [
  '0',
  '1',
  '2',
  '3',
  'danger',
  'warning',
  'success',
  'auto',
];

export const gridPropDefs: Record<string, PropDef> = {
  columns: {
    type: 'enum',
    values: columnValues,
    default: 'auto',
    responsive: true,
    description: (
      <>
        Number of columns. Use 1-12 for fixed layouts, <Chip>auto</Chip> to fit
        content.
      </>
    ),
  },
  gap: {
    ...gapPropDefs.gap,
    default: '4',
    description:
      'Space between items. Use higher values for separated layouts, lower for compact.',
  },
  surface: {
    type: 'enum',
    values: surfaceValues,
    responsive: true,
    description: (
      <>
        Surface level for theming. Use <Chip>auto</Chip> to increment from
        parent context.
      </>
    ),
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
  spacing: spacingGroupAll,
};

export const gridItemPropDefs: Record<string, PropDef> = {
  colSpan: {
    type: 'enum',
    values: columnValues,
    responsive: true,
    description: 'Number of columns the item spans across.',
  },
  colStart: {
    type: 'enum',
    values: columnValues,
    responsive: true,
    description:
      'Starting column position. Use with colEnd for explicit placement.',
  },
  colEnd: {
    type: 'enum',
    values: columnValues,
    responsive: true,
    description:
      'Ending column position. Use with colStart for explicit placement.',
  },
  rowSpan: {
    type: 'enum',
    values: columnValues,
    responsive: true,
    description: 'Number of rows the item spans. Useful for tall content.',
  },
  surface: {
    type: 'enum',
    values: surfaceValues,
    responsive: true,
    description: (
      <>
        Surface level for theming. Use <Chip>auto</Chip> to increment from
        parent context.
      </>
    ),
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};
