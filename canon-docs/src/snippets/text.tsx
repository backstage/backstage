'use client';

import { Stack, Text } from '../../../packages/canon';

export const TextPreview = () => {
  return (
    <Text style={{ maxWidth: '600px' }}>
      A man looks at a painting in a museum and says, “Brothers and sisters I
      have none, but that man&apos;s father is my father&apos;s son.” Who is in
      the painting?
    </Text>
  );
};

export const TextAllVariants = () => {
  return (
    <Stack gap="md">
      <Text variant="subtitle" style={{ maxWidth: '600px' }}>
        A man looks at a painting in a museum and says, “Brothers and sisters I
        have none, but that man&apos;s father is my father&apos;s son.” Who is
        in the painting?
      </Text>
      <Text variant="body" style={{ maxWidth: '600px' }}>
        A man looks at a painting in a museum and says, “Brothers and sisters I
        have none, but that man&apos;s father is my father&apos;s son.” Who is
        in the painting?
      </Text>
      <Text variant="caption" style={{ maxWidth: '600px' }}>
        A man looks at a painting in a museum and says, “Brothers and sisters I
        have none, but that man&apos;s father is my father&apos;s son.” Who is
        in the painting?
      </Text>
      <Text variant="label" style={{ maxWidth: '600px' }}>
        A man looks at a painting in a museum and says, “Brothers and sisters I
        have none, but that man&apos;s father is my father&apos;s son.” Who is
        in the painting?
      </Text>
    </Stack>
  );
};

export const TextAllWeights = () => {
  return (
    <Stack gap="md">
      <Text weight="regular" style={{ maxWidth: '600px' }}>
        A man looks at a painting in a museum and says, “Brothers and sisters I
        have none, but that man&apos;s father is my father&apos;s son.” Who is
        in the painting?
      </Text>
      <Text weight="bold" style={{ maxWidth: '600px' }}>
        A man looks at a painting in a museum and says, “Brothers and sisters I
        have none, but that man&apos;s father is my father&apos;s son.” Who is
        in the painting?
      </Text>
    </Stack>
  );
};

export const TextResponsive = () => {
  return (
    <Text variant={{ initial: 'body', lg: 'subtitle' }}>Responsive text</Text>
  );
};

export const TextPlayground = () => {
  return (
    <Stack>
      <Text>Subtitle</Text>
      <Text variant="subtitle" style={{ maxWidth: '600px' }}>
        A man looks at a painting in a museum and says, “Brothers and sisters I
        have none, but that man&apos;s father is my father&apos;s son.” Who is
        in the painting?
      </Text>
      <Text>Body</Text>
      <Text variant="body" style={{ maxWidth: '600px' }}>
        A man looks at a painting in a museum and says, “Brothers and sisters I
        have none, but that man&apos;s father is my father&apos;s son.” Who is
        in the painting?
      </Text>
      <Text>Caption</Text>
      <Text variant="caption" style={{ maxWidth: '600px' }}>
        A man looks at a painting in a museum and says, “Brothers and sisters I
        have none, but that man&apos;s father is my father&apos;s son.” Who is
        in the painting?
      </Text>
      <Text>Label</Text>
      <Text variant="label" style={{ maxWidth: '600px' }}>
        A man looks at a painting in a museum and says, “Brothers and sisters I
        have none, but that man&apos;s father is my father&apos;s son.” Who is
        in the painting?
      </Text>
    </Stack>
  );
};
