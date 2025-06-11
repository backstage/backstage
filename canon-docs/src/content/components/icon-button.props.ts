import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const iconButtonPropDefs: Record<string, PropDef> = {
  variant: {
    type: 'enum',
    values: ['primary', 'secondary'],
    default: 'primary',
    responsive: true,
  },
  size: {
    type: 'enum',
    values: ['small', 'medium'],
    default: 'medium',
    responsive: true,
  },
  icon: { type: 'enum', values: 'icon', responsive: false },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const iconButtonUsageSnippet = `import { IconButton } from '@backstage/canon';

<IconButton />`;

export const iconButtonDefaultSnippet = `<Flex align="center">
  <IconButton icon="cloud" variant="primary" />
  <IconButton icon="cloud" variant="secondary" />
</Flex>`;

export const iconButtonVariantsSnippet = `<Flex align="center">
  <IconButton icon="cloud" variant="primary" />
  <IconButton icon="cloud" variant="secondary" />
</Flex>`;

export const iconButtonSizesSnippet = `<Flex align="center">
  <IconButton icon="cloud" size="small" />
  <IconButton icon="cloud" size="medium" />
</Flex>`;

export const iconButtonDisabledSnippet = `<IconButton icon="cloud" disabled />`;

export const iconButtonResponsiveSnippet = `<IconButton icon="cloud" variant={{ initial: 'primary', lg: 'secondary' }} />`;
