/*
 * Copyright 2025 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import preview from '../../../../../.storybook/preview';
import { Skeleton } from './Skeleton';
import { Flex } from '../Flex';
import { Text } from '../Text';
import { Box } from '../Box';
import { useState } from 'react';
import { Avatar } from '../Avatar';
import { ToggleButton } from '../ToggleButton';

const meta = preview.meta({
  title: 'Backstage UI/Skeleton',
  component: Skeleton,
  argTypes: {
    rounded: {
      control: 'boolean',
    },
    width: {
      control: 'number',
    },
    height: {
      control: 'number',
    },
  },
  args: {
    width: 80,
    height: 24,
    rounded: false,
  },
});

export const Default = meta.story({
  args: {},
});

export const Rounded = meta.story({
  args: {
    rounded: true,
    width: 48,
    height: 48,
  },
});

export const Demo1 = meta.story({
  render: () => (
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
  ),
});

export const CardPlaceholder = meta.story({
  render: () => (
    <Flex direction="column" gap="4">
      <Skeleton width={400} height={160} />
      <Skeleton width={400} height={12} />
      <Skeleton width={240} height={12} />
    </Flex>
  ),
});

/**
 * Skeleton automatically inherits typography from its parent context.
 * When placed inside a Text component, it matches the exact font-size
 * and line-height, preventing layout shift. No explicit sizing needed!
 *
 * Best for single-line text where you expect content to fit on one line.
 */
export const InheritingTypography = meta.story({
  render: () => (
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
  ),
});

/**
 * When you wrap children in a Skeleton, it will automatically
 * infer the correct dimensions from the children, preventing layout shift.
 * The children are hidden but maintain their layout space.
 *
 * Best for multi-line text or complex layouts where you want exact dimension matching.
 */
export const InferringDimensions = meta.story({
  render: () => (
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
  ),
});

/**
 * Example showing how to use Skeleton with Text components to prevent layout shift.
 * The Skeleton inherits typography from the Text wrapper, matching the exact
 * dimensions of the loaded content without explicit sizing. The fixed-width card
 * demonstrates that there's no layout shift when toggling between loading and loaded states.
 */
export const RealWorldExample = meta.story({
  render: () => {
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
  },
});

/**
 * Demonstrates that explicit width/height override children dimensions,
 * following MUI's behavior. This allows for flexible sizing control.
 */
export const OverrideChildrenDimensions = meta.story({
  render: () => (
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
  ),
});

export const OnSurface = meta.story({
  render: () => (
    <Flex direction="column" gap="4">
      <div style={{ maxWidth: '600px' }}>
        By default, skeletons automatically inherit their container's surface
        level (equivalent to onSurface="auto"). This makes them reusable across
        different surfaces without explicit configuration. To override, use
        explicit surface values like onSurface="0" or onSurface="2".
      </div>
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
  ),
});
