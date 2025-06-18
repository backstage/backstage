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
  icon: { type: 'enum', values: ['ReactNode'], responsive: false },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const iconButtonUsageSnippet = `import { IconButton } from '@backstage/canon';

<IconButton />`;

export const iconButtonDefaultSnippet = `<Flex align="center">
  <IconButton icon={<Icon name="cloud" />} variant="primary" />
  <IconButton icon={<Icon name="cloud" />} variant="secondary" />
</Flex>`;

export const iconButtonVariantsSnippet = `<Flex align="center">
  <IconButton icon={<Icon name="cloud" />} variant="primary" />
  <IconButton icon={<Icon name="cloud" />} variant="secondary" />
</Flex>`;

export const iconButtonSizesSnippet = `<Flex align="center">
  <IconButton icon={<Icon name="cloud" />} size="small" />
  <IconButton icon={<Icon name="cloud" />} size="medium" />
</Flex>`;

export const iconButtonDisabledSnippet = `<IconButton icon={<Icon name="cloud" />} disabled />`;

export const iconButtonResponsiveSnippet = `<IconButton icon={<Icon name="cloud" />} variant={{ initial: 'primary', lg: 'secondary' }} />`;

export const iconButtonAsLinkSnippet = `// Using the \`as\` prop
<IconButton
  as="a"
  href="https://canon.backstage.io"
  target="_blank"
  icon={<Icon name="cloud" />}
/>

// Using a custom component
<IconButton as={Link} to="/" icon={<Icon name="cloud" />} />`;
