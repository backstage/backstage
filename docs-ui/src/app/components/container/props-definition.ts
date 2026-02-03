import {
  classNamePropDefs,
  stylePropDefs,
  createSpacingGroup,
  type PropDef,
} from '@/utils/propDefs';

export const containerPropDefs: Record<string, PropDef> = {
  children: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Content to render inside the container.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
  spacing: createSpacingGroup(
    ['my', 'mt', 'mb', 'py', 'pt', 'pb'],
    'Vertical spacing properties for controlling margin and padding.',
  ),
};
