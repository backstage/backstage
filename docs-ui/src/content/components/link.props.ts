import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const linkPropDefs: Record<string, PropDef> = {
  to: {
    type: 'string',
  },
  variant: {
    type: 'enum',
    values: ['subtitle', 'body', 'caption', 'label'],
    default: 'body',
    responsive: true,
  },
  weight: {
    type: 'enum',
    values: ['regular', 'bold'],
    default: 'regular',
    responsive: true,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const linkUsageSnippet = `import { Link } from '@backstage/canon';

<Link href="https://backstage.io">Sign up for Backstage</Link>`;

export const linkDefaultSnippet = `<Link href="https://backstage.io">Sign up for Backstage</Link>`;

export const linkVariantsSnippet = `<Flex gap="4" direction="column">
  <Link href="https://canon.backstage.io" variant="subtitle" />
  <Link href="https://canon.backstage.io" variant="body" />
  <Link href="https://canon.backstage.io" variant="caption" />
  <Link href="https://canon.backstage.io" variant="label" />
</Flex>`;

export const linkWeightsSnippet = `<Flex gap="4" direction="column">
  <Link href="https://canon.backstage.io" weight="regular" />
  <Link href="https://canon.backstage.io" weight="bold" />
</Flex>`;
