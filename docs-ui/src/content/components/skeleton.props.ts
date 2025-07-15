import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const skeletonPropDefs: Record<string, PropDef> = {
  width: {
    type: 'number',
    default: '80',
    responsive: false,
  },
  height: {
    type: 'number',
    default: '24',
    responsive: false,
  },
  rounded: {
    type: 'boolean',
    default: 'false',
    responsive: false,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const skeletonUsageSnippet = `import { Flex, Skeleton } from '@backstage/ui';

<Flex direction="column" gap="4">
  <Skeleton width={400} height={160} />
  <Skeleton width={400} height={12} />
  <Skeleton width={240} height={12} />
</Flex>`;

export const skeletonDefaultSnippet = `<Flex direction="column" gap="4">
  <Skeleton width={400} height={160} />
  <Skeleton width={400} height={12} />
  <Skeleton width={240} height={12} />
</Flex>`;

export const skeletonDemo1Snippet = `<Flex gap="4">
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
</Flex>`;

export const skeletonDemo2Snippet = `<Flex direction="column" gap="4">
  <Skeleton width={400} height={160} />
  <Skeleton width={400} height={12} />
  <Skeleton width={240} height={12} />
</Flex>`;
