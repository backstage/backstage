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
  ...childrenPropDefs,
  ...classNamePropDefs,
};
