import { classNamePropDefs, stylePropDefs } from '../../utils/propDefs';
import type { PropDef } from '../../utils/propDefs';

export const buttonPropDefs: Record<string, PropDef> = {
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
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const buttonSnippetUsage = `import { Button } from '@backstage/canon';

<Button />`;

export const buttonVariantsSnippet = `<Flex align="center">
  <Button iconStart="cloud" variant="primary">
    Button
  </Button>
  <Button iconStart="cloud" variant="secondary">
    Button
  </Button>
  <Button iconStart="cloud" variant="tertiary">
    Button
  </Button>
</Flex>`;

export const buttonSizesSnippet = `<Flex align="center">
  <Button size="small">Small</Button>
  <Button size="medium">Medium</Button>
</Flex>`;

export const buttonIconsSnippet = `<Flex align="center">
  <Button iconStart="cloud">Button</Button>
  <Button iconEnd="chevronRight">Button</Button>
  <Button iconStart="cloud" iconEnd="chevronRight">Button</Button>
</Flex>`;

export const buttonFullWidthSnippet = `<Flex direction="column" gap="4" style={{ width: '300px' }}>
  <Button fullWidth>Full width</Button>
</Flex>`;

export const buttonDisabledSnippet = `<Flex gap="4">
  <Button variant="primary" disabled>
    Primary
  </Button>
  <Button variant="secondary" disabled>
    Secondary
  </Button>
</Flex>`;

export const buttonResponsiveSnippet = `<Button variant={{ initial: 'primary', lg: 'secondary' }}>
  Responsive Button
</Button>`;
