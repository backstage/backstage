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
  iconStart: { type: 'enum', values: ['ReactNode'], responsive: false },
  iconEnd: { type: 'enum', values: ['ReactNode'], responsive: false },
  isDisabled: { type: 'boolean', default: 'false', responsive: false },
  children: { type: 'enum', values: ['ReactNode'], responsive: false },
  type: {
    type: 'enum',
    values: ['button', 'submit', 'reset'],
    default: 'button',
    responsive: false,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const buttonSnippetUsage = `import { Button } from '@backstage/ui';

<Button />`;

export const buttonVariantsSnippet = `<Flex align="center">
  <Button iconStart="cloud" variant="primary">
    Button
  </Button>
  <Button iconStart="cloud" variant="secondary">
    Button
  </Button>
</Flex>`;

export const buttonSizesSnippet = `<Flex align="center">
  <Button size="small">Small</Button>
  <Button size="medium">Medium</Button>
</Flex>`;

export const buttonIconsSnippet = `<Flex align="center">
  <Button iconStart={<Icon name="cloud" />}>Button</Button>
  <Button iconEnd={<Icon name="chevronRight" />}>Button</Button>
  <Button iconStart={<Icon name="cloud" />} iconEnd={<Icon name="chevronRight" />}>Button</Button>
</Flex>`;

export const buttonDisabledSnippet = `<Flex gap="4">
  <Button variant="primary" isDisabled>
    Primary
  </Button>
  <Button variant="secondary" isDisabled>
    Secondary
  </Button>
</Flex>`;

export const buttonResponsiveSnippet = `<Button variant={{ initial: 'primary', lg: 'secondary' }}>
  Responsive Button
</Button>`;

export const buttonAsLinkSnippet = `import { ButtonLink } from '@backstage/ui';

<ButtonLink href="https://ui.backstage.io" target="_blank">
  Button
</ButtonLink>`;
