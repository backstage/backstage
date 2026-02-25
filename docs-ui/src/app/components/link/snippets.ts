export const linkUsageSnippet = `import { Link } from '@backstage/ui';

<Link href="/">Sign up for Backstage</Link>`;

export const defaultSnippet = `<Link href="/">Sign up for Backstage</Link>`;

export const externalLinkSnippet = `<Link href="#" target="_blank">
  Sign up for Backstage
</Link>`;

export const allVariantsSnippet = `<Flex gap="4" direction="column">
  <Link href="#" variant="title-large">title-large</Link>
  <Link href="#" variant="title-medium">title-medium</Link>
  <Link href="#" variant="title-small">title-small</Link>
  <Link href="#" variant="title-x-small">title-x-small</Link>
  <Link href="#" variant="body-large">body-large</Link>
  <Link href="#" variant="body-medium">body-medium</Link>
  <Link href="#" variant="body-small">body-small</Link>
  <Link href="#" variant="body-x-small">body-x-small</Link>
</Flex>`;

export const allColorsSnippet = `<Flex gap="4" direction="column">
  <Link href="#" color="primary">Primary</Link>
  <Link href="#" color="secondary">Secondary</Link>
  <Link href="#" color="danger">Danger</Link>
  <Link href="#" color="warning">Warning</Link>
  <Link href="#" color="success">Success</Link>
  <Link href="#" color="info">Info</Link>
</Flex>`;

export const weightSnippet = `<Flex gap="4">
  <Link href="#" weight="regular">Regular</Link>
  <Link href="#" weight="bold">Bold</Link>
</Flex>`;

export const standaloneSnippet = `<Flex gap="4">
  <Link href="#">Default link</Link>
  <Link href="#" standalone>Standalone link</Link>
</Flex>`;
