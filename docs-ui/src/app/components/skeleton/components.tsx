'use client';

import { Skeleton } from '../../../../../packages/ui/src/components/Skeleton/Skeleton';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';

export const Demo1 = () => {
  return (
    <Flex gap="4">
      <Skeleton rounded width={48} height={48} />
      <Flex direction="column" gap="4">
        <Skeleton width={200} height={8} />
        <Skeleton width={200} height={8} />
        <Skeleton width={200} height={8} />
        <Flex gap="4">
          <Skeleton width="100%" height={8} />
          <Skeleton width="100%" height={8} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export const Demo2 = () => {
  return (
    <Flex direction="column" gap="4">
      <Skeleton width={400} height={160} />
      <Skeleton width={400} height={12} />
      <Skeleton width={240} height={12} />
    </Flex>
  );
};
