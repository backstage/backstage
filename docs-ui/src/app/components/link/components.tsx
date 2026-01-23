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
        <Link href="https://ui.backstage.io" variant="title-large">
          Sign up for Backstage
        </Link>
        <Link href="https://ui.backstage.io" variant="title-medium">
          Sign up for Backstage
        </Link>
        <Link href="https://ui.backstage.io" variant="title-small">
          Sign up for Backstage
        </Link>
        <Link href="https://ui.backstage.io" variant="title-x-small">
          Sign up for Backstage
        </Link>
        <Link href="https://ui.backstage.io" variant="body-large">
          Sign up for Backstage
        </Link>
        <Link href="https://ui.backstage.io" variant="body-medium">
          Sign up for Backstage
        </Link>
        <Link href="https://ui.backstage.io" variant="body-small">
          Sign up for Backstage
        </Link>
        <Link href="https://ui.backstage.io" variant="body-x-small">
          Sign up for Backstage
        </Link>
      </Flex>
    </MemoryRouter>
  );
};

export const AllColors = () => {
  return (
    <MemoryRouter>
      <Flex gap="4" direction="column">
        <Link
          href="https://ui.backstage.io"
          variant="title-small"
          color="primary"
        >
          I am primary
        </Link>
        <Link
          href="https://ui.backstage.io"
          variant="title-small"
          color="secondary"
        >
          I am secondary
        </Link>
        <Link
          href="https://ui.backstage.io"
          variant="title-small"
          color="tertiary"
        >
          I am tertiary
        </Link>
        <Link
          href="https://ui.backstage.io"
          variant="title-small"
          color="inherit"
        >
          I am inherit
        </Link>
      </Flex>
    </MemoryRouter>
  );
};

export const Underline = () => {
  return (
    <MemoryRouter>
      <Flex gap="4" direction="column">
        <Link href="https://ui.backstage.io" underline="always">
          Always underlined
        </Link>
        <Link href="https://ui.backstage.io" underline="hover">
          Underlined on hover
        </Link>
        <Link href="https://ui.backstage.io" underline="none">
          Never underlined
        </Link>
      </Flex>
    </MemoryRouter>
  );
};
