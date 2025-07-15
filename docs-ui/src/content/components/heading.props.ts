import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const headingPropDefs: Record<string, PropDef> = {
  variant: {
    type: 'enum',
    values: ['display', 'title1', 'title2', 'title3', 'title4', 'title5'],
    responsive: true,
  },
  children: {
    type: 'enum',
    values: ['ReactNode'],
    responsive: false,
  },
  truncate: {
    type: 'boolean',
    default: 'false',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const headingUsageSnippet = `import { Heading } from '@backstage/ui';

<Heading />`;

export const headingDefaultSnippet = `<Heading variant="title1">Hello World!</Heading>`;

export const headingVariantsSnippet = `<Flex direction="column" gap="4">
  <Heading variant="display">Display</Heading>
  <Heading variant="title1">Title 1</Heading>
  <Heading variant="title2">Title 2</Heading>
  <Heading variant="title3">Title 3</Heading>
  <Heading variant="title4">Title 4</Heading>
</Flex>`;

export const headingTruncateSnippet = `<Heading style={{ maxWidth: '400px' }} truncate>
  A man looks at a painting in a museum and says, "Brothers and sisters I
  have none, but that man's father is my father's son." Who is
  in the painting?
</Heading>`;

export const headingResponsiveSnippet = `<Heading variant={{ initial: 'title2', lg: 'title1' }}>
  Responsive heading
</Heading>`;
