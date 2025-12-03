import {
  childrenPropDefs,
  classNamePropDefs,
  stylePropDefs,
} from '@/utils/propDefs';
import type { PropDef } from '@/utils/propDefs';

export const textPropDefs: Record<string, PropDef> = {
  as: {
    type: 'enum',
    values: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'span',
      'label',
      'div',
      'strong',
      'em',
      'small',
    ],
    default: 'span',
    responsive: true,
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
    responsive: true,
  },
  weight: {
    type: 'enum',
    values: ['regular', 'bold'],
    responsive: true,
  },
  color: {
    type: 'enum',
    values: ['primary', 'secondary', 'danger', 'warning', 'success'],
    default: 'primary',
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
  <Text variant="title-large">...</Text>
  <Text variant="title-medium">...</Text>
  <Text variant="title-small">...</Text>
  <Text variant="title-x-small">...</Text>
  <Text variant="body-large">...</Text>
  <Text variant="body-medium">...</Text>
  <Text variant="body-small">...</Text>
  <Text variant="body-x-small">...</Text>
</Flex>`;

export const textWeightsSnippet = `<Flex direction="column" gap="4">
  <Flex>
    <Text variant="title-large" weight="regular">A fox</Text>
    <Text variant="title-large" weight="bold">A turtle</Text>
  </Flex>
  <Flex>
    <Text variant="title-medium" weight="regular">A fox</Text>
    <Text variant="title-medium" weight="bold">A turtle</Text>
  </Flex>
  <Flex>
    <Text variant="title-small" weight="regular">A fox</Text>
    <Text variant="title-small" weight="bold">A turtle</Text>
  </Flex>
  <Flex>
    <Text variant="title-x-small" weight="regular">A fox</Text>
    <Text variant="title-x-small" weight="bold">A turtle</Text>
  </Flex>
  <Flex>
    <Text variant="body-large" weight="regular">A fox</Text>
    <Text variant="body-large" weight="bold">A turtle</Text>
  </Flex>
  <Flex>
    <Text variant="body-medium" weight="regular">A fox</Text>
    <Text variant="body-medium" weight="bold">A turtle</Text>
  </Flex>
  <Flex>
    <Text variant="body-small" weight="regular">A fox</Text>
    <Text variant="body-small" weight="bold">A turtle</Text>
  </Flex>
  <Flex>
    <Text variant="body-x-small" weight="regular">A fox</Text>
    <Text variant="body-x-small" weight="bold">A turtle</Text>
  </Flex>
</Flex>`;

export const textColorsSnippet = `<Flex direction="column" gap="4">
  <Text color="primary">I am primary</Text>
  <Text color="secondary">I am secondary</Text>
  <Text color="danger">I am danger</Text>
  <Text color="warning">I am warning</Text>
  <Text color="success">I am success</Text>
</Flex>`;

export const textTruncateSnippet = `<Text as="p" truncate>...</Text>`;

export const textResponsiveSnippet = `<Text variant={{ initial: 'body', lg: 'subtitle' }}>
  Responsive text
</Text>`;
