'use client';

import { Link } from '../../../../../packages/ui/src/components/Link/Link';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';
import { DocsRouterProvider } from '@/utils/backstage-router-provider';

export const Default = () => {
  return (
    <DocsRouterProvider>
      <Link href="/" variant="body-large">
        Sign up for Backstage
      </Link>
    </DocsRouterProvider>
  );
};

export const ExternalLink = () => {
  return (
    <DocsRouterProvider>
      <Link href="https://backstage.io" target="_blank" variant="body-large">
        Sign up for Backstage
      </Link>
    </DocsRouterProvider>
  );
};

export const AllVariants = () => {
  return (
    <DocsRouterProvider>
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
    </DocsRouterProvider>
  );
};

export const AllColors = () => {
  return (
    <DocsRouterProvider>
      <Flex gap="2" direction="column">
        <Link href="#" color="primary" variant="body-large">
          Primary
        </Link>
        <Link href="#" color="secondary" variant="body-large">
          Secondary
        </Link>
        <Link href="#" color="danger" variant="body-large">
          Danger
        </Link>
        <Link href="#" color="warning" variant="body-large">
          Warning
        </Link>
        <Link href="#" color="success" variant="body-large">
          Success
        </Link>
        <Link href="#" color="info" variant="body-large">
          Info
        </Link>
      </Flex>
    </DocsRouterProvider>
  );
};

export const Weight = () => {
  return (
    <DocsRouterProvider>
      <Flex gap="4">
        <Link href="#" weight="regular" variant="body-large">
          Regular
        </Link>
        <Link href="#" weight="bold" variant="body-large">
          Bold
        </Link>
      </Flex>
    </DocsRouterProvider>
  );
};

export const Standalone = () => {
  return (
    <DocsRouterProvider>
      <Flex gap="4">
        <Link href="#" variant="body-large">
          Default link
        </Link>
        <Link href="#" variant="body-large" standalone>
          Standalone link
        </Link>
      </Flex>
    </DocsRouterProvider>
  );
};
