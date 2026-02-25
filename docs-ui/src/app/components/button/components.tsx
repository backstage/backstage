'use client';

import { Button } from '../../../../../packages/ui/src/components/Button/Button';
import { ButtonLink } from '../../../../../packages/ui/src/components/ButtonLink/ButtonLink';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';
import { RiArrowRightSLine, RiCloudLine } from '@remixicon/react';
import { MemoryRouter } from 'react-router-dom';

export const Variants = () => {
  return (
    <Flex>
      <Button variant="primary" iconStart={<RiCloudLine />}>
        Button
      </Button>
      <Button variant="secondary" iconStart={<RiCloudLine />}>
        Button
      </Button>
      <Button variant="tertiary" iconStart={<RiCloudLine />}>
        Button
      </Button>
    </Flex>
  );
};

export const Sizes = () => {
  return (
    <Flex align="center">
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
    </Flex>
  );
};

export const WithIcons = () => {
  return (
    <Flex align="center">
      <Button iconStart={<RiCloudLine />}>Button</Button>
      <Button iconEnd={<RiArrowRightSLine />}>Button</Button>
      <Button iconStart={<RiCloudLine />} iconEnd={<RiArrowRightSLine />}>
        Button
      </Button>
    </Flex>
  );
};

export const Disabled = () => {
  return (
    <Flex gap="4">
      <Button variant="primary" isDisabled>
        Primary
      </Button>
      <Button variant="secondary" isDisabled>
        Secondary
      </Button>
      <Button variant="tertiary" isDisabled>
        Tertiary
      </Button>
    </Flex>
  );
};

export const Destructive = () => {
  return (
    <Flex gap="4">
      <Button variant="primary" destructive>
        Primary
      </Button>
      <Button variant="secondary" destructive>
        Secondary
      </Button>
      <Button variant="tertiary" destructive>
        Tertiary
      </Button>
    </Flex>
  );
};

export const Loading = () => {
  return (
    <Button variant="primary" loading={true}>
      Load more items
    </Button>
  );
};

export const AsLink = () => {
  return (
    <MemoryRouter>
      <ButtonLink href="https://ui.backstage.io" target="_blank">
        Button
      </ButtonLink>
    </MemoryRouter>
  );
};
