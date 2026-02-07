export const skeletonUsageSnippet = `import { Flex, Skeleton, Text } from '@backstage/ui';

// Skeleton inside Text - automatically inherits typography
<Text variant="title-large">
  <Skeleton width="60%" />
</Text>

// Or wrap children to infer dimensions
<Skeleton>
  <Text variant="title-large">Loading...</Text>
</Skeleton>`;

export const skeletonDefaultSnippet = `<Flex direction="column" gap="4">
  <Skeleton width={400} height={160} />
  <Skeleton width={400} height={12} />
  <Skeleton width={240} height={12} />
</Flex>`;

export const skeletonDemo1Snippet = `<Flex gap="4">
  <Skeleton rounded width={48} height={48} />
  <Flex direction="column" gap="4">
    <Skeleton width={400} height={160} />
    <Skeleton width={400} height={12} />
    <Skeleton width={240} height={12} />
  </Flex>
</Flex>`;

export const cardPlaceholderSnippet = `<Box surface="3" p="4">
  <Flex direction="column" gap="4">
    <Skeleton width={400} height={160} />
    <Skeleton width={400} height={12} />
    <Skeleton width={240} height={12} />
  </Flex>
</Box>`;

export const avatarWithTextSnippet = `<Box surface="3" p="4">
  <Flex direction="column" gap="4">
    <Skeleton rounded width={48} height={48} />
    <Flex direction="column" gap="4">
      <Skeleton width={200} height={8} />
      <Skeleton width={200} height={8} />
      <Skeleton width={200} height={8} />
    </Flex>
  </Flex>
</Box>`;

export const roundedSnippet = `<Box surface="3" p="4">
  <Flex direction="column" gap="4">
    <Skeleton rounded width={32} height={32} />
    <Skeleton rounded width={48} height={48} />
    <Skeleton rounded width={64} height={64} />
  </Flex>
</Box>`;

export const skeletonCardPlaceholderSnippet = `<Flex direction="column" gap="4">
  <Skeleton width={400} height={160} />
  <Skeleton width={400} height={12} />
  <Skeleton width={240} height={12} />
</Flex>`;

export const skeletonInheritingSnippet = `<Flex direction="column" gap="4">
  <Text variant="title-large">
    <Skeleton />
  </Text>
  <Text variant="body-medium">
    <Skeleton />
  </Text>
  <Text variant="body-small">
    <Skeleton />
  </Text>
</Flex>`;

export const skeletonInferringSnippet = `import { Avatar, Box, Flex, Skeleton, Text } from '@backstage/ui';

<Flex direction="column" gap="4">
  <div>
    <Text variant="body-small" color="secondary">
      Skeleton wrapping Text component
    </Text>
    <Skeleton>
      <Text variant="title-large">Loading title text...</Text>
    </Skeleton>
  </div>
  <div>
    <Text variant="body-small" color="secondary">
      Skeleton wrapping a box with multiple lines of content
    </Text>
    <Skeleton>
      <Box>
        <Flex direction="column" gap="2">
          <Text variant="body-medium">This is a loading paragraph</Text>
          <Text variant="body-medium">
            With multiple lines of content that will load
          </Text>
        </Flex>
      </Box>
    </Skeleton>
  </div>
  <div>
    <Text variant="body-small" color="secondary">
      Skeleton wrapping an avatar (rounded)
    </Text>
    <Skeleton rounded>
      <Avatar
        name="Jean Durand"
        src="https://avatars.githubusercontent.com/u/1116720?v=4"
      ></Avatar>
    </Skeleton>
  </div>
</Flex>`;

export const skeletonRealWorldSnippet = `import { Card, ToggleButton, Text, Skeleton, Flex } from '@backstage/ui';
import { useState } from 'react';

const [loading, setLoading] = useState(true);

return (
  <Card style={{ width: 400, padding: 24 }}>
    <Flex direction="column" gap="4">
      <Flex justify="between" align="center">
        <Text variant="title-medium">Article Preview</Text>
        <ToggleButton isSelected={loading} onChange={setLoading}>
          {({ isSelected }) => (isSelected ? 'Loading' : 'Loaded')}
        </ToggleButton>
      </Flex>

      <Text variant="title-large">
        {loading ? <Skeleton width="60%" /> : 'Async Title'}
      </Text>

      {/* Multi-line paragraphs using multiple single-line skeletons */}
      <Text variant="body-medium">
        {loading ? <Skeleton /> : 'Expected one line.'}
      </Text>
      <Text variant="body-medium">
        {loading ? <Skeleton /> : 'Expected another line.'}
      </Text>
      <Text variant="body-medium">
        {loading ? (
          <Skeleton width="80%" />
        ) : (
          'Duis aute irure dolor in reprehenderit in voluptate velit.'
        )}
      </Text>
    </Flex>
  </Card>
);`;

export const skeletonOnSurfaceSnippet = `import { Box, Skeleton, Flex, Text } from '@backstage/ui';

// Skeleton automatically inherits surface from container (default behavior)
// No need to specify onSurface - it's the same as onSurface="auto"
<Box surface="1" p="4">
  <Flex direction="column" gap="2">
    <Skeleton width={200} height={8} />
    <Skeleton width={200} height={8} />
  </Flex>
</Box>

// Or explicitly override the surface when needed
<Skeleton width={200} height={8} onSurface="2" />`;
