import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';
import { Chip } from '@/components/Chip';

export const buttonIconPropDefs: Record<string, PropDef> = {
  variant: {
    type: 'enum',
    values: ['primary', 'secondary', 'tertiary'],
    default: 'primary',
    responsive: true,
    description: (
      <>
        Visual style. Use <Chip>primary</Chip> for main actions,{' '}
        <Chip>secondary</Chip> for alternatives, <Chip>tertiary</Chip> for
        low-emphasis.
      </>
    ),
  },
  size: {
    type: 'enum',
    values: ['small', 'medium'],
    default: 'small',
    responsive: true,
    description: (
      <>
        Button size. Use <Chip>small</Chip> for toolbars, <Chip>medium</Chip>{' '}
        for standalone actions.
      </>
    ),
  },
  icon: {
    type: 'enum',
    values: ['ReactElement'],
    description:
      'Icon element to display. Required for accessibility via aria-label.',
  },
  isDisabled: {
    type: 'boolean',
    default: 'false',
    description: 'Prevents interaction and applies disabled styling.',
  },
  loading: {
    type: 'boolean',
    default: 'false',
    description: 'Shows a spinner and disables the button.',
  },
  type: {
    type: 'enum',
    values: ['button', 'submit', 'reset'],
    default: 'button',
    description: 'HTML button type attribute.',
  },
  onSurface: {
    type: 'enum',
    values: ['0', '1', '2', '3', 'danger', 'warning', 'success', 'auto'],
    responsive: true,
    description: 'Surface context for correct color contrast.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
