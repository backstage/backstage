import { classNamePropDefs, stylePropDefs } from '@/utils/propDefs';
import type { PropDef } from '@/utils/propDefs';
import { Chip } from '@/components/Chip';

export const buttonPropDefs: Record<string, PropDef> = {
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
        Button size. Use <Chip>small</Chip> for dense layouts.
      </>
    ),
  },
  iconStart: {
    type: 'enum',
    values: ['ReactElement'],
    description: 'Icon displayed before the button text.',
  },
  iconEnd: {
    type: 'enum',
    values: ['ReactElement'],
    description: 'Icon displayed after the button text.',
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
  children: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Button label text or content.',
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
