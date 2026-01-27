'use client';

import { Link } from '../../../../../packages/ui/src/components/Link/Link';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';
import { MemoryRouter } from 'react-router-dom';

export const Default = () => {
  return (
    <MemoryRouter>
      <Link href="/">Sign up for Backstage</Link>
    </MemoryRouter>
  );
};

export const ExternalLink = () => {
  return (
    <MemoryRouter>
      <Link href="https://backstage.io" target="_blank">
        Sign up for Backstage
      </Link>
    </MemoryRouter>
  );
};

export const AllVariants = () => {
  return (
    <MemoryRouter>
      <Flex gap="4" direction="column">
        <Link href="#" variant="title-large">
          title-large
        </Link>
        <Link href="#" variant="title-medium">
          title-medium
        </Link>
        <Link href="#" variant="title-small">
          title-small
        </Link>
        <Link href="#" variant="title-x-small">
          title-x-small
        </Link>
        <Link href="#" variant="body-large">
          body-large
        </Link>
        <Link href="#" variant="body-medium">
          body-medium
        </Link>
        <Link href="#" variant="body-small">
          body-small
        </Link>
        <Link href="#" variant="body-x-small">
          body-x-small
        </Link>
      </Flex>
    </MemoryRouter>
  );
};

export const AllColors = () => {
  return (
    <MemoryRouter>
      <Flex gap="4" direction="column">
        <Link href="#" color="primary">
          Primary
        </Link>
        <Link href="#" color="secondary">
          Secondary
        </Link>
        <Link href="#" color="danger">
          Danger
        </Link>
        <Link href="#" color="warning">
          Warning
        </Link>
        <Link href="#" color="success">
          Success
        </Link>
      </Flex>
    </MemoryRouter>
  );
};

export const Weight = () => {
  return (
    <MemoryRouter>
      <Flex gap="4">
        <Link href="#" weight="regular">
          Regular
        </Link>
        <Link href="#" weight="bold">
          Bold
        </Link>
      </Flex>
    </MemoryRouter>
  );
};
