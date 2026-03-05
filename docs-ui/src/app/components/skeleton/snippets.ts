export const skeletonUsageSnippet = `import { Skeleton } from '@backstage/ui';

<Skeleton width={200} height={24} />`;

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
