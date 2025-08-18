import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const iconPropDefs: Record<string, PropDef> = {
  name: {
    type: 'enum',
    values: 'icon',
    responsive: false,
  },
  size: {
    type: 'number',
    responsive: false,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const iconUsageSnippet = `import { Icon } from '@backstage/ui';

<Icon />`;

export const iconDefaultSnippet = `<Icon name="heart" />`;
