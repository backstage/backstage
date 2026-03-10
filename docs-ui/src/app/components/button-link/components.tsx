'use client';

import { ButtonLink } from '../../../../../packages/ui/src/components/ButtonLink/ButtonLink';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';
import { DocsRouterProvider } from '@/utils/backstage-router-provider';
import { RiArrowRightSLine, RiCloudLine } from '@remixicon/react';

export const Variants = () => {
  return (
    <DocsRouterProvider>
      <Flex align="center">
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
      </Flex>
    </DocsRouterProvider>
  );
};

export const Sizes = () => {
  return (
    <DocsRouterProvider>
      <Flex align="center">
        <ButtonLink size="small" href="https://ui.backstage.io" target="_blank">
          Small
        </ButtonLink>
        <ButtonLink
          size="medium"
          href="https://ui.backstage.io"
          target="_blank"
        >
          Medium
        </ButtonLink>
      </Flex>
    </DocsRouterProvider>
  );
};

export const WithIcons = () => {
  return (
    <DocsRouterProvider>
      <Flex align="center">
        <ButtonLink
          iconStart={<RiCloudLine />}
          href="https://ui.backstage.io"
          target="_blank"
        >
          Button
        </ButtonLink>
        <ButtonLink
          iconEnd={<RiArrowRightSLine />}
          href="https://ui.backstage.io"
          target="_blank"
        >
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
      </Flex>
    </DocsRouterProvider>
  );
};

export const Disabled = () => {
  return (
    <DocsRouterProvider>
      <Flex gap="4">
        <ButtonLink
          variant="primary"
          isDisabled
          href="https://ui.backstage.io"
          target="_blank"
        >
          Primary
        </ButtonLink>
        <ButtonLink
          variant="secondary"
          isDisabled
          href="https://ui.backstage.io"
          target="_blank"
        >
          Secondary
        </ButtonLink>
        <ButtonLink
          variant="tertiary"
          isDisabled
          href="https://ui.backstage.io"
          target="_blank"
        >
          Tertiary
        </ButtonLink>
      </Flex>
    </DocsRouterProvider>
  );
};
