import { Text } from '@backstage/canon';
import { Stack } from '@backstage/canon';

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
