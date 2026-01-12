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
  children: {
    type: 'string',
    default: 'undefined',
    responsive: false,
    description:
      'Children elements. When provided, the skeleton will infer its dimensions from the children, preventing layout shift.',
  },
  onSurface: {
    type: 'enum',
    values: ['0', '1', '2', '3', 'danger', 'warning', 'success', 'auto'],
    responsive: true,
    description:
      'Surface the skeleton is placed on. Defaults to "auto" (inherits from container context). Can be omitted for the same behavior.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const skeletonUsageSnippet = `import { Flex, Skeleton, Text } from '@backstage/ui';

// Skeleton inside Text - automatically inherits typography
<Text variant="title-large">
  {/* {loading ? <Skeleton style={{ width: '60%' }} /> : 'Title'} */}
  <Skeleton style={{ width: '60%' }} />
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

export const skeletonInferringSnippet = `<Flex direction="column" gap="4">
  <Skeleton>
    <Text variant="title-large">Loading title...</Text>
  </Skeleton>
  <Skeleton>
    <Text variant="body-medium">Loading paragraph text</Text>
  </Skeleton>
  <Skeleton rounded>
    <div style={{ width: 48, height: 48 }} />
  </Skeleton>
</Flex>`;

export const skeletonRealWorldSnippet = `import { Card, Switch, Text, Skeleton, Flex } from '@backstage/ui';
import { useState } from 'react';

const [loading, setLoading] = useState(true);

return (
  <Card style={{ width: 400, padding: 24 }}>
    <Flex direction="column" gap="4">
      <Flex justify="between" align="center">
        <Text variant="title-medium">Article Preview</Text>
        <Switch
          checked={loading}
          onCheckedChange={setLoading}
          label="Loading"
        />
      </Flex>

      <Text variant="title-large">
        {loading ? <Skeleton style={{ width: '60%' }} /> : 'Async Title'}
      </Text>

      <Text variant="body-medium">
        {loading ? <Skeleton /> : 'Expected one line.'}
      </Text>
      <Text variant="body-medium">
        {loading ? <Skeleton /> : 'Expected another line.'}
      </Text>
      <Text variant="body-medium">
        {loading ? <Skeleton style={{ width: '80%' }} /> : 'Duis aute irure dolor in reprehenderit in voluptate velit.'}
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
