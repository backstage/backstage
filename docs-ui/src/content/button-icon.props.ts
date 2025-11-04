import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const buttonIconPropDefs: Record<string, PropDef> = {
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
  isDisabled: { type: 'boolean', default: 'false', responsive: false },
  type: {
    type: 'enum',
    values: ['button', 'submit', 'reset'],
    default: 'button',
    responsive: false,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const buttonIconUsageSnippet = `import { ButtonIcon } from '@backstage/ui';

<ButtonIcon />`;

export const buttonIconDefaultSnippet = `<Flex align="center">
  <ButtonIcon icon={<Icon name="cloud" />} variant="primary" />
  <ButtonIcon icon={<Icon name="cloud" />} variant="secondary" />
</Flex>`;

export const buttonIconVariantsSnippet = `<Flex align="center">
  <ButtonIcon icon={<Icon name="cloud" />} variant="primary" />
  <ButtonIcon icon={<Icon name="cloud" />} variant="secondary" />
</Flex>`;

export const buttonIconSizesSnippet = `<Flex align="center">
  <ButtonIcon icon={<Icon name="cloud" />} size="small" />
  <ButtonIcon icon={<Icon name="cloud" />} size="medium" />
</Flex>`;

export const buttonIconDisabledSnippet = `<ButtonIcon icon={<Icon name="cloud" />} isDisabled />`;

export const buttonIconResponsiveSnippet = `<ButtonIcon icon={<Icon name="cloud" />} variant={{ initial: 'primary', lg: 'secondary' }} />`;

export const buttonIconAsLinkSnippet = `import { ButtonLink } from '@backstage/ui';

<ButtonLink href="https://ui.backstage.io" target="_blank">
  Button
</ButtonLink>`;
