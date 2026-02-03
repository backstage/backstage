'use client';

import { ButtonIcon } from '../../../../../packages/ui/src/components/ButtonIcon/ButtonIcon';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';
import { RiCloudLine } from '@remixicon/react';

export const Variants = () => {
  return (
    <Flex align="center" gap="2">
      <ButtonIcon icon={<RiCloudLine />} variant="primary" aria-label="Cloud" />
      <ButtonIcon
        icon={<RiCloudLine />}
        variant="secondary"
        aria-label="Cloud"
      />
      <ButtonIcon
        icon={<RiCloudLine />}
        variant="tertiary"
        aria-label="Cloud"
      />
    </Flex>
  );
};

export const Sizes = () => {
  return (
    <Flex align="center" gap="2">
      <ButtonIcon icon={<RiCloudLine />} size="small" aria-label="Cloud" />
      <ButtonIcon icon={<RiCloudLine />} size="medium" aria-label="Cloud" />
    </Flex>
  );
};

export const Disabled = () => {
  return (
    <Flex direction="row" gap="2">
      <ButtonIcon
        isDisabled
        icon={<RiCloudLine />}
        variant="primary"
        aria-label="Cloud"
      />
      <ButtonIcon
        isDisabled
        icon={<RiCloudLine />}
        variant="secondary"
        aria-label="Cloud"
      />
      <ButtonIcon
        isDisabled
        icon={<RiCloudLine />}
        variant="tertiary"
        aria-label="Cloud"
      />
    </Flex>
  );
};

export const Loading = () => {
  return (
    <ButtonIcon
      icon={<RiCloudLine />}
      variant="primary"
      loading
      aria-label="Cloud"
    />
  );
};
