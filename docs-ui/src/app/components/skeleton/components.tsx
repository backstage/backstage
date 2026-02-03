'use client';

import { Skeleton } from '../../../../../packages/ui/src/components/Skeleton/Skeleton';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';
import { Box } from '../../../../../packages/ui/src/components/Box/Box';

export const CardPlaceholder = () => {
  return (
    <Box surface="3" p="4">
      <Flex direction="column" gap="4">
        <Skeleton width={400} height={160} />
        <Skeleton width={400} height={12} />
        <Skeleton width={240} height={12} />
      </Flex>
    </Box>
  );
};

export const AvatarWithText = () => {
  return (
    <Box surface="3" p="4">
      <Flex direction="column" gap="4">
        <Skeleton rounded width={48} height={48} />
        <Flex direction="column" gap="4">
          <Skeleton width={200} height={8} />
          <Skeleton width={200} height={8} />
          <Skeleton width={200} height={8} />
        </Flex>
      </Flex>
    </Box>
  );
};

export const Rounded = () => {
  return (
    <Box surface="3" p="4">
      <Flex direction="column" gap="4">
        <Skeleton rounded width={32} height={32} />
        <Skeleton rounded width={48} height={48} />
        <Skeleton rounded width={64} height={64} />
      </Flex>
    </Box>
  );
};
