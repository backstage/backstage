import {
  classNamePropDefs,
  childrenPropDefs,
  type PropDef,
} from '@/utils/propDefs';
import { Chip } from '@/components/Chip';

export const badgePropDefs: Record<string, PropDef> = {
  icon: {
    type: 'enum',
    values: ['ReactNode'],
    description: (
      <>
        Icon displayed before the badge text. When omitted and a{' '}
        <Chip>status</Chip> is set, the badge shows the icon of that status.
        Pass <Chip>false</Chip> to show no icon.
      </>
    ),
  },
  size: {
    type: 'enum',
    values: ['small', 'medium'],
    default: 'small',
    description: (
      <>
        Visual size of the badge. Use <Chip>small</Chip> for inline or dense
        layouts, <Chip>medium</Chip> for standalone badges.
      </>
    ),
  },
  status: {
    type: 'enum',
    values: ['info', 'success', 'warning', 'danger'],
    description:
      'Visual status of the badge, which changes its colors and selects the default icon. Without a status the badge uses neutral colors and has no icon.',
  },
  isPending: {
    type: 'boolean',
    default: 'false',
    description:
      'Shows a spinning loading indicator before the badge text to indicate a pending operation. The indicator replaces the icon while pending.',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
};
