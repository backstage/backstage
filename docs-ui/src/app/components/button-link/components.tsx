'use client';

import { ButtonLink } from '../../../../../packages/ui/src/components/ButtonLink/ButtonLink';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';
import { MemoryRouter } from 'react-router-dom';
import { RiArrowRightSLine, RiCloudLine } from '@remixicon/react';

export const Variants = () => {
  return (
    <MemoryRouter>
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
    </MemoryRouter>
  );
};

export const Sizes = () => {
  return (
    <MemoryRouter>
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
    </MemoryRouter>
  );
};

export const WithIcons = () => {
  return (
    <MemoryRouter>
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
    </MemoryRouter>
  );
};

export const Disabled = () => {
  return (
    <MemoryRouter>
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
    </MemoryRouter>
  );
};
