import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const linkPropDefs: Record<string, PropDef> = {
  href: {
    type: 'string',
  },
  variant: {
    type: 'enum',
    values: [
      'title-large',
      'title-medium',
      'title-small',
      'title-x-small',
      'body-large',
      'body-medium',
      'body-small',
      'body-x-small',
    ],
    default: 'body-medium',
    responsive: true,
  },
  weight: {
    type: 'enum',
    values: ['regular', 'bold'],
    default: 'regular',
    responsive: true,
  },
  color: {
    type: 'enum',
    values: ['primary', 'secondary', 'danger', 'warning', 'success'],
    default: 'primary',
    responsive: true,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const linkUsageSnippet = `import { Link } from '@backstage/ui';

<Link href="/sign-up">Sign up for Backstage</Link>`;

export const linkDefaultSnippet = `<Link href="/">Sign up for Backstage</Link>`;

export const linkVariantsSnippet = `<Flex gap="4" direction="column">
  <Link href="/" variant="title-large">...</Link>
  <Link href="/" variant="title-medium">...</Link>
  <Link href="/" variant="title-small">...</Link>
  <Link href="/" variant="title-x-small">...</Link>
  <Link href="/" variant="body-large">...</Link>
  <Link href="/" variant="body-medium">...</Link>
  <Link href="/" variant="body-small">...</Link>
  <Link href="/" variant="body-x-small">...</Link>
</Flex>`;

export const linkWeightsSnippet = `<Flex gap="4" direction="column">
  <Link href="/" weight="regular" />
  <Link href="/" weight="bold" />
</Flex>`;

export const linkColorsSnippet = `<Flex gap="4" direction="column">
  <Link href="/" color="primary">I am primary</Link>
  <Link href="/" color="secondary">I am secondary</Link>
  <Link href="/" color="danger">I am danger</Link>
  <Link href="/" color="warning">I am warning</Link>
  <Link href="/" color="success">I am success</Link>
</Flex>`;

export const linkRouterSnippet = `import { Link } from '@backstage/ui';

// Internal route
<Link href="/home">Home</Link>

// External URL
<Link href="https://backstage.io">Backstage</Link>
`;

export const linkTruncateSnippet = `<Link href="/" truncate>...</Link>`;
