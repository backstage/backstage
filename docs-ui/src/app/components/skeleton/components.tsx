'use client';

import { Skeleton } from '../../../../../packages/ui/src/components/Skeleton/Skeleton';
import { Text } from '../../../../../packages/ui/src/components/Text/Text';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';
import { Box } from '../../../../../packages/ui/src/components/Box/Box';
import { Avatar } from '../../../../../packages/ui/src/components/Avatar/Avatar';
import { ToggleButton } from '../../../../../packages/ui/src/components/ToggleButton/ToggleButton';
import { useState } from 'react';

export const Demo1 = () => (
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
/**
 * Skeleton automatically inherits typography from its parent context.
 * When placed inside a Text component, it matches the exact font-size
 * and line-height, preventing layout shift. No explicit sizing needed!
 *
 * Best for single-line text where you expect content to fit on one line.
 */
export const InheritingTypography = () => (
  <Flex direction="column" gap="6">
    <div>
      <Text variant="body-small" color="secondary">
        title-large
      </Text>
      <Text variant="title-large">
        <Skeleton />
      </Text>
    </div>
    <div>
      <Text variant="body-small" color="secondary">
        title-medium
      </Text>
      <Text variant="title-medium">
        <Skeleton />
      </Text>
    </div>
    <div>
      <Text variant="body-small" color="secondary">
        title-small
      </Text>
      <Text variant="title-small">
        <Skeleton />
      </Text>
    </div>
    <div>
      <Text variant="body-small" color="secondary">
        title-x-small
      </Text>
      <Text variant="title-x-small">
        <Skeleton />
      </Text>
    </div>
    <div>
      <Text variant="body-small" color="secondary">
        body-large
      </Text>
      <Text variant="body-large">
        <Skeleton />
      </Text>
    </div>
    <div>
      <Text variant="body-small" color="secondary">
        body-medium (default)
      </Text>
      <Text variant="body-medium">
        <Skeleton />
      </Text>
    </div>
    <div>
      <Text variant="body-small" color="secondary">
        body-small
      </Text>
      <Text variant="body-small">
        <Skeleton />
      </Text>
    </div>
    <div>
      <Text variant="body-small" color="secondary">
        body-x-small
      </Text>
      <Text variant="body-x-small">
        <Skeleton />
      </Text>
    </div>
  </Flex>
);

/**
 * When you wrap children in a Skeleton, it will automatically
 * infer the correct dimensions from the children, preventing layout shift.
 * The children are hidden but maintain their layout space.
 *
 * Best for multi-line text or complex layouts where you want exact dimension matching.
 */
export const InferringDimensions = () => (
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
  </Flex>
);

/**
 * Example showing how to use Skeleton with Text components to prevent layout shift.
 * The Skeleton inherits typography from the Text wrapper, matching the exact
 * dimensions of the loaded content without explicit sizing. The fixed-width card
 * demonstrates that there's no layout shift when toggling between loading and loaded states.
 */
export const RealWorldExample = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div
      style={{
        width: 400,
        padding: 24,
        border: '1px solid var(--bui-border-1)',
        borderRadius: 'var(--bui-radius-2)',
        background: 'var(--bui-bg-neutral-1)',
      }}
    >
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <Text variant="title-medium">Article Preview</Text>
          <ToggleButton isSelected={loading} onChange={setLoading}>
            {({ isSelected }) => (isSelected ? 'Loading' : 'Loaded')}
          </ToggleButton>
        </Flex>

        {/* Single-line title - perfect for inheriting typography */}
        <Text variant="title-large">
          {loading ? <Skeleton width="60%" /> : 'Async Title'}
        </Text>

        {/* Multi-line paragraphs - using multiple single-line skeletons */}
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
    </div>
  );
};

/**
 * Demonstrates that explicit width/height override children dimensions,
 * following MUI's behavior. This allows for flexible sizing control.
 */
export const OverrideChildrenDimensions = () => (
  <Flex direction="column" gap="4">
    <div>
      <Text variant="body-small" color="secondary">
        Children without explicit dimensions (fits content)
      </Text>
      <Skeleton>
        <Text variant="title-large">
          This is a long title that would normally be wide
        </Text>
      </Skeleton>
    </div>

    <div>
      <Text variant="body-small" color="secondary">
        Same children with explicit width (overrides)
      </Text>
      <Skeleton width={200}>
        <Text variant="title-large">
          This is a long title that would normally be wide
        </Text>
      </Skeleton>
    </div>

    <div>
      <Text variant="body-small" color="secondary">
        Explicit height overrides children height
      </Text>
      <Skeleton height={20}>
        <Text variant="title-large">Tall text</Text>
      </Skeleton>
    </div>
  </Flex>
);

export const OnSurface = () => (
  <Flex direction="column" gap="4">
    <Box surface="0" p="4">
      <Text>Surface 0 container</Text>
      <Flex direction="column" gap="2" mt="2">
        <Skeleton width={200} height={8} />
        <Skeleton width={200} height={8} />
        <Skeleton width={150} height={8} />
      </Flex>
    </Box>
    <Box surface="1" p="4">
      <Text>Surface 1 container</Text>
      <Flex direction="column" gap="2" mt="2">
        <Skeleton width={200} height={8} />
        <Skeleton width={200} height={8} />
        <Skeleton width={150} height={8} />
      </Flex>
    </Box>
    <Box surface="2" p="4">
      <Text>Surface 2 container</Text>
      <Flex direction="column" gap="2" mt="2">
        <Skeleton width={200} height={8} />
        <Skeleton width={200} height={8} />
        <Skeleton width={150} height={8} />
      </Flex>
    </Box>
    <Box surface="3" p="4">
      <Text>Surface 3 container</Text>
      <Flex direction="column" gap="2" mt="2">
        <Skeleton width={200} height={8} />
        <Skeleton width={200} height={8} />
        <Skeleton width={150} height={8} />
      </Flex>
    </Box>
    <Box p="4">
      <Text>Default container (no surface)</Text>
      <Flex direction="column" gap="2" mt="2">
        <Skeleton width={200} height={8} onSurface="auto" />
        <Skeleton width={200} height={8} onSurface="1" />
        <Skeleton width={200} height={8} onSurface="2" />
      </Flex>
    </Box>
  </Flex>
);
