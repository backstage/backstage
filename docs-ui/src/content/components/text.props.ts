import {
  childrenPropDefs,
  classNamePropDefs,
  stylePropDefs,
} from '@/utils/propDefs';
import type { PropDef } from '@/utils/propDefs';

export const textPropDefs: Record<string, PropDef> = {
  variant: {
    type: 'enum',
    values: ['display', 'title1', 'title2', 'title3', 'title4', 'title5'],
    responsive: true,
  },
  weight: {
    type: 'enum',
    values: ['regular', 'bold'],
    responsive: true,
  },
  truncate: {
    type: 'boolean',
    default: 'false',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const textUsageSnippet = `import { Text } from '@backstage/ui';

<Text />`;

export const textDefaultSnippet = `<Text style={{ maxWidth: '600px' }}>
  A man looks at a painting in a museum and says, "Brothers and sisters I
  have none, but that man&apos;s father is my father&apos;s son." Who is
  in the painting?
</Text>`;

export const textVariantsSnippet = `<Flex direction="column" gap="4">
  <Text variant="subtitle" style={{ maxWidth: '600px' }}>
    A man looks at a painting in a museum and says, "Brothers and sisters I
    have none, but that man&apos;s father is my father&apos;s son." Who is
    in the painting?
  </Text>
  <Text variant="body" style={{ maxWidth: '600px' }}>
    A man looks at a painting in a museum and says, "Brothers and sisters I
    have none, but that man&apos;s father is my father&apos;s son." Who is
    in the painting?
  </Text>
  <Text variant="caption" style={{ maxWidth: '600px' }}>
    A man looks at a painting in a museum and says, "Brothers and sisters I
    have none, but that man&apos;s father is my father&apos;s son." Who is
    in the painting?
  </Text>
  <Text variant="label" style={{ maxWidth: '600px' }}>
    A man looks at a painting in a museum and says, "Brothers and sisters I
    have none, but that man&apos;s father is my father&apos;s son." Who is
    in the painting?
  </Text>
</Flex>`;

export const textWeightsSnippet = `<Flex direction="column" gap="4">
  <Text weight="regular" style={{ maxWidth: '600px' }}>
    A man looks at a painting in a museum and says, "Brothers and sisters I
    have none, but that man&apos;s father is my father&apos;s son." Who is
    in the painting?
  </Text>
  <Text weight="bold" style={{ maxWidth: '600px' }}>
    A man looks at a painting in a museum and says, "Brothers and sisters I
    have none, but that man&apos;s father is my father&apos;s son." Who is
    in the painting?
  </Text>
</Flex>`;

export const textTruncateSnippet = `<Text weight="regular" style={{ maxWidth: '600px' }} truncate>
  A man looks at a painting in a museum and says, "Brothers and sisters I
  have none, but that man&apos;s father is my father&apos;s son." Who is
  in the painting?
</Text>`;

export const textResponsiveSnippet = `<Text variant={{ initial: 'body', lg: 'subtitle' }}>
  Responsive text
</Text>`;
