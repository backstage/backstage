import { classNamePropDefs, stylePropDefs } from '../../utils/propDefs';
import type { PropDef } from '../../utils/propDefs';

export const buttonLinkPropDefs: Record<string, PropDef> = {
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
  href: { type: 'string', responsive: false },
  hrefLang: { type: 'string', responsive: false },
  target: {
    type: 'enum',
    values: ['HTMLAttributeAnchorTarget'],
    default: '_self',
    responsive: false,
  },
  rel: { type: 'string', responsive: false },
  children: { type: 'enum', values: ['ReactNode'], responsive: false },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const buttonLinkSnippetUsage = `import { ButtonLink } from '@backstage/ui';

<ButtonLink />`;

export const buttonLinkVariantsSnippet = `<Flex align="center">
  <ButtonLink iconStart={<Icon name="cloud" />} variant="primary">
    Button
  </ButtonLink>
  <ButtonLink iconStart={<Icon name="cloud" />} variant="secondary">
    Button
  </ButtonLink>
</Flex>`;

export const buttonLinkSizesSnippet = `<Flex align="center">
  <ButtonLink size="small">Small</ButtonLink>
  <ButtonLink size="medium">Medium</ButtonLink>
</Flex>`;

export const buttonLinkIconsSnippet = `<Flex align="center">
  <ButtonLink iconStart={<Icon name="cloud" />}>Button</ButtonLink>
  <ButtonLink iconEnd={<Icon name="chevronRight" />}>Button</ButtonLink>
  <ButtonLink
    iconStart={<Icon name="cloud" />}
    iconEnd={<Icon name="chevronRight" />}>
    Button
  </ButtonLink>
</Flex>`;

export const buttonLinkDisabledSnippet = `<Flex gap="4">
  <ButtonLink variant="primary" isDisabled>
    Primary
  </ButtonLink>
  <ButtonLink variant="secondary" isDisabled>
    Secondary
  </ButtonLink>
</Flex>`;

export const buttonLinkResponsiveSnippet = `<ButtonLink variant={{ initial: 'primary', lg: 'secondary' }}>
  Responsive Button
</ButtonLink>`;
