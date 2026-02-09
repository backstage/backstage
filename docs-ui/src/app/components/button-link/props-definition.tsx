import {
  classNamePropDefs,
  stylePropDefs,
  childrenPropDefs,
  type PropDef,
} from '@/utils/propDefs';
import { Chip } from '@/components/Chip';

export const buttonLinkPropDefs: Record<string, PropDef> = {
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
        Link size. Use <Chip>small</Chip> for inline contexts,{' '}
        <Chip>medium</Chip> for standalone.
      </>
    ),
  },
  iconStart: {
    type: 'enum',
    values: ['ReactElement'],
    description: 'Icon displayed before the link text.',
  },
  iconEnd: {
    type: 'enum',
    values: ['ReactElement'],
    description: 'Icon displayed after the link text.',
  },
  isDisabled: {
    type: 'boolean',
    default: 'false',
    description: 'Prevents interaction and applies disabled styling.',
  },
  href: {
    type: 'string',
    required: true,
    description: 'URL the link navigates to.',
  },
  target: {
    type: 'enum',
    values: ['_self', '_blank', '_parent', '_top'],
    description: (
      <>
        Where to open the linked URL. Use <Chip>_blank</Chip> for external
        links.
      </>
    ),
  },
  onSurface: {
    type: 'enum',
    values: ['0', '1', '2', '3', 'danger', 'warning', 'success', 'auto'],
    responsive: true,
    description: 'Surface context for correct color contrast.',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};
