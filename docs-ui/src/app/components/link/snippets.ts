export const linkUsageSnippet = `import { Link } from '@backstage/ui';

<Link href="/">Sign up for Backstage</Link>`;

export const defaultSnippet = `<Link href="/">Sign up for Backstage</Link>`;

export const externalLinkSnippet = `<Link href="https://backstage.io" target="_blank">
  Sign up for Backstage
</Link>`;

export const allVariantsSnippet = `<Flex gap="4" direction="column">
  <Link href="https://ui.backstage.io" variant="title-large">
    Sign up for Backstage
  </Link>
  <Link href="https://ui.backstage.io" variant="title-medium">
    Sign up for Backstage
  </Link>
  <Link href="https://ui.backstage.io" variant="title-small">
    Sign up for Backstage
  </Link>
  <Link href="https://ui.backstage.io" variant="body-large">
    Sign up for Backstage
  </Link>
  <Link href="https://ui.backstage.io" variant="body-medium">
    Sign up for Backstage
  </Link>
</Flex>`;

export const allColorsSnippet = `<Flex gap="4" direction="column">
  <Link href="https://ui.backstage.io" variant="title-small" color="primary">
    I am primary
  </Link>
  <Link href="https://ui.backstage.io" variant="title-small" color="secondary">
    I am secondary
  </Link>
  <Link href="https://ui.backstage.io" variant="title-small" color="tertiary">
    I am tertiary
  </Link>
  <Link href="https://ui.backstage.io" variant="title-small" color="inherit">
    I am inherit
  </Link>
</Flex>`;

export const underlineSnippet = `<Flex gap="4" direction="column">
  <Link href="https://ui.backstage.io" underline="always">
    Always underlined
  </Link>
  <Link href="https://ui.backstage.io" underline="hover">
    Underlined on hover
  </Link>
  <Link href="https://ui.backstage.io" underline="none">
    Never underlined
  </Link>
</Flex>`;
