export const buttonIconUsageSnippet = `import { ButtonIcon } from '@backstage/ui';
import { RiCloseLine } from '@remixicon/react';

<ButtonIcon icon={<RiCloseLine />} aria-label="Close" />`;

export const variantsSnippet = `<Flex align="center" gap="2">
  <ButtonIcon icon={<RiCloudLine />} variant="primary" aria-label="Cloud" />
  <ButtonIcon icon={<RiCloudLine />} variant="secondary" aria-label="Cloud" />
  <ButtonIcon icon={<RiCloudLine />} variant="tertiary" aria-label="Cloud" />
</Flex>`;

export const sizesSnippet = `<Flex align="center" gap="2">
  <ButtonIcon icon={<RiCloudLine />} size="small" aria-label="Cloud" />
  <ButtonIcon icon={<RiCloudLine />} size="medium" aria-label="Cloud" />
</Flex>`;

export const disabledSnippet = `<Flex direction="row" gap="2">
  <ButtonIcon isDisabled icon={<RiCloudLine />} variant="primary" aria-label="Cloud" />
  <ButtonIcon isDisabled icon={<RiCloudLine />} variant="secondary" aria-label="Cloud" />
  <ButtonIcon isDisabled icon={<RiCloudLine />} variant="tertiary" aria-label="Cloud" />
</Flex>`;

export const isPendingSnippet = `<ButtonIcon icon={<RiCloudLine />} variant="primary" isPending aria-label="Cloud" />`;
