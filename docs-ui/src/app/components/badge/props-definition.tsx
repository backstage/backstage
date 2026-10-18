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
    description: 'Icon displayed before the badge text.',
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
      'Visual status of the badge, which changes its colors. Without a status the badge uses neutral colors.',
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
