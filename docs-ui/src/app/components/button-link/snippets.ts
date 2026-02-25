export const buttonLinkUsageSnippet = `import { ButtonLink } from '@backstage/ui';

<ButtonLink href="https://ui.backstage.io">Button</ButtonLink>`;

export const variantsSnippet = `<Flex align="center">
  <ButtonLink
    iconStart={<RiCloudLine />}
    variant="primary"
    href="https://ui.backstage.io"
    target="_blank"
  >
    Button
  </ButtonLink>
  <ButtonLink
    iconStart={<RiCloudLine />}
    variant="secondary"
    href="https://ui.backstage.io"
    target="_blank"
  >
    Button
  </ButtonLink>
  <ButtonLink
    iconStart={<RiCloudLine />}
    variant="tertiary"
    href="https://ui.backstage.io"
    target="_blank"
  >
    Button
  </ButtonLink>
</Flex>`;

export const sizesSnippet = `<Flex align="center">
  <ButtonLink size="small" href="https://ui.backstage.io" target="_blank">
    Small
  </ButtonLink>
  <ButtonLink size="medium" href="https://ui.backstage.io" target="_blank">
    Medium
  </ButtonLink>
</Flex>`;

export const withIconsSnippet = `<Flex align="center">
  <ButtonLink iconStart={<RiCloudLine />} href="https://ui.backstage.io" target="_blank">
    Button
  </ButtonLink>
  <ButtonLink iconEnd={<RiArrowRightSLine />} href="https://ui.backstage.io" target="_blank">
    Button
  </ButtonLink>
  <ButtonLink
    iconStart={<RiCloudLine />}
    iconEnd={<RiArrowRightSLine />}
    href="https://ui.backstage.io"
    target="_blank"
  >
    Button
  </ButtonLink>
</Flex>`;

export const disabledSnippet = `<Flex gap="4">
  <ButtonLink variant="primary" isDisabled href="https://ui.backstage.io" target="_blank">
    Primary
  </ButtonLink>
  <ButtonLink variant="secondary" isDisabled href="https://ui.backstage.io" target="_blank">
    Secondary
  </ButtonLink>
  <ButtonLink variant="tertiary" isDisabled href="https://ui.backstage.io" target="_blank">
    Tertiary
  </ButtonLink>
</Flex>`;
