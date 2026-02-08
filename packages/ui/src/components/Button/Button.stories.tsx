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
import { Button } from './Button';
import { Flex } from '../Flex';
import { Box } from '../Box';
import { Text } from '../Text';
import { RiArrowRightSLine, RiCloudLine } from '@remixicon/react';
import { useState } from 'react';

const meta = preview.meta({
  title: 'Backstage UI/Button',
  component: Button,
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
    },
    destructive: {
      control: 'boolean',
    },
  },
});

export const Default = meta.story({
  args: {
    children: 'Button',
  },
});

export const Variants = meta.story({
  args: {
    children: 'Button',
  },
  parameters: {
    argTypes: {
      variant: {
        control: false,
      },
    },
  },
  render: () => (
    <Flex direction="column" gap="4">
      <Flex direction="column" gap="4">
        <Text>Default</Text>
        <Flex align="center" p="4">
          <Button iconStart={<RiCloudLine />} variant="primary">
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="secondary">
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="tertiary">
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="primary" destructive>
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="secondary" destructive>
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="tertiary" destructive>
            Button
          </Button>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>Neutral 1</Text>
        <Flex align="center" bg="neutral-1" p="4">
          <Button iconStart={<RiCloudLine />} variant="primary">
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="secondary">
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="tertiary">
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="primary" destructive>
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="secondary" destructive>
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="tertiary" destructive>
            Button
          </Button>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>Neutral 2</Text>
        <Flex align="center" bg="neutral-2" p="4">
          <Button iconStart={<RiCloudLine />} variant="primary">
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="secondary">
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="tertiary">
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="primary" destructive>
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="secondary" destructive>
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="tertiary" destructive>
            Button
          </Button>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>Neutral 3</Text>
        <Flex align="center" bg="neutral-3" p="4">
          <Button iconStart={<RiCloudLine />} variant="primary">
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="secondary">
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="tertiary">
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="primary" destructive>
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="secondary" destructive>
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="tertiary" destructive>
            Button
          </Button>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>Neutral 4</Text>
        <Flex align="center" bg="neutral-4" p="4">
          <Button iconStart={<RiCloudLine />} variant="primary">
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="secondary">
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="tertiary">
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="primary" destructive>
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="secondary" destructive>
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="tertiary" destructive>
            Button
          </Button>
        </Flex>
      </Flex>
    </Flex>
  ),
});

export const Destructive = meta.story({
  render: () => (
    <Flex direction="column" gap="4">
      <Flex direction="column" gap="4">
        <Text>Primary Destructive</Text>
        <Flex align="center" p="4" gap="4">
          <Button variant="primary" destructive>
            Delete
          </Button>
          <Button variant="primary" destructive iconStart={<RiCloudLine />}>
            Delete
          </Button>
          <Button variant="primary" destructive isDisabled>
            Disabled
          </Button>
          <Button variant="primary" destructive loading>
            Loading
          </Button>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>Secondary Destructive</Text>
        <Flex align="center" p="4" gap="4">
          <Button variant="secondary" destructive>
            Delete
          </Button>
          <Button variant="secondary" destructive iconStart={<RiCloudLine />}>
            Delete
          </Button>
          <Button variant="secondary" destructive isDisabled>
            Disabled
          </Button>
          <Button variant="secondary" destructive loading>
            Loading
          </Button>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>Tertiary Destructive</Text>
        <Flex align="center" p="4" gap="4">
          <Button variant="tertiary" destructive>
            Delete
          </Button>
          <Button variant="tertiary" destructive iconStart={<RiCloudLine />}>
            Delete
          </Button>
          <Button variant="tertiary" destructive isDisabled>
            Disabled
          </Button>
          <Button variant="tertiary" destructive loading>
            Loading
          </Button>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>On Neutral 1</Text>
        <Flex align="center" bg="neutral-1" p="4" gap="4">
          <Button variant="primary" destructive>
            Primary
          </Button>
          <Button variant="secondary" destructive>
            Secondary
          </Button>
          <Button variant="tertiary" destructive>
            Tertiary
          </Button>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>Sizes</Text>
        <Flex align="center" p="4" gap="4">
          <Button variant="primary" destructive size="small">
            Small
          </Button>
          <Button variant="primary" destructive size="medium">
            Medium
          </Button>
        </Flex>
      </Flex>
    </Flex>
  ),
});

export const Sizes = meta.story({
  args: {
    children: 'Button',
  },
  render: () => (
    <Flex align="center">
      <Button size="small" iconStart={<RiCloudLine />}>
        Small
      </Button>
      <Button size="medium" iconStart={<RiCloudLine />}>
        Medium
      </Button>
    </Flex>
  ),
});

export const WithIcons = meta.story({
  args: {
    children: 'Button',
  },
  render: args => (
    <Flex align="center">
      <Button {...args} iconStart={<RiCloudLine />} />
      <Button {...args} iconEnd={<RiArrowRightSLine />} />
      <Button
        {...args}
        iconStart={<RiCloudLine />}
        iconEnd={<RiArrowRightSLine />}
      />
    </Flex>
  ),
});

export const FullWidth = meta.story({
  args: {
    children: 'Button',
  },
  render: args => (
    <Flex direction="column" gap="4" style={{ width: '300px' }}>
      <Button {...args} iconStart={<RiCloudLine />} />
      <Button {...args} iconEnd={<RiArrowRightSLine />} />
      <Button
        {...args}
        iconStart={<RiCloudLine />}
        iconEnd={<RiArrowRightSLine />}
      />
    </Flex>
  ),
});

export const Disabled = meta.story({
  render: () => (
    <Flex direction="column" gap="4">
      <Flex direction="row" gap="4">
        <Button variant="primary" isDisabled>
          Primary
        </Button>
        <Button variant="secondary" isDisabled>
          Secondary
        </Button>
        <Button variant="tertiary" isDisabled>
          Tertiary
        </Button>
      </Flex>
      <Flex direction="row" gap="4">
        <Button variant="primary" destructive isDisabled>
          Primary Destructive
        </Button>
        <Button variant="secondary" destructive isDisabled>
          Secondary Destructive
        </Button>
        <Button variant="tertiary" destructive isDisabled>
          Tertiary Destructive
        </Button>
      </Flex>
    </Flex>
  ),
});

export const Responsive = meta.story({
  args: {
    children: 'Button',
    variant: {
      initial: 'primary',
      sm: 'secondary',
    },
    size: {
      xs: 'small',
      sm: 'medium',
    },
  },
});

export const Loading = meta.story({
  render: () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    };

    return (
      <Button variant="primary" loading={isLoading} onPress={handleClick}>
        Load more items
      </Button>
    );
  },
});

export const LoadingVariants = meta.story({
  render: () => (
    <Flex direction="column" gap="4">
      <Text>Primary</Text>
      <Flex align="center" gap="4">
        <Button variant="primary" size="small" loading>
          Small Loading
        </Button>
        <Button variant="primary" size="medium" loading>
          Medium Loading
        </Button>
        <Button variant="primary" loading iconStart={<RiCloudLine />}>
          With Icon
        </Button>
      </Flex>

      <Text>Secondary</Text>
      <Flex align="center" gap="4">
        <Button variant="secondary" size="small" loading>
          Small Loading
        </Button>
        <Button variant="secondary" size="medium" loading>
          Medium Loading
        </Button>
        <Button variant="secondary" loading iconStart={<RiCloudLine />}>
          With Icon
        </Button>
      </Flex>

      <Text>Tertiary</Text>
      <Flex align="center" gap="4">
        <Button variant="tertiary" size="small" loading>
          Small Loading
        </Button>
        <Button variant="tertiary" size="medium" loading>
          Medium Loading
        </Button>
        <Button variant="tertiary" loading iconStart={<RiCloudLine />}>
          With Icon
        </Button>
      </Flex>

      <Text>Primary Destructive</Text>
      <Flex align="center" gap="4">
        <Button variant="primary" destructive size="small" loading>
          Small Loading
        </Button>
        <Button variant="primary" destructive size="medium" loading>
          Medium Loading
        </Button>
        <Button
          variant="primary"
          destructive
          loading
          iconStart={<RiCloudLine />}
        >
          With Icon
        </Button>
      </Flex>

      <Text>Loading vs Disabled</Text>
      <Flex align="center" gap="4">
        <Button variant="primary" loading>
          Loading
        </Button>
        <Button variant="primary" isDisabled>
          Disabled
        </Button>
        <Button variant="primary" loading isDisabled>
          Both (Disabled Wins)
        </Button>
      </Flex>
    </Flex>
  ),
});

export const AutoBg = meta.story({
  render: () => (
    <Flex direction="column" gap="4">
      <div style={{ maxWidth: '600px' }}>
        Buttons automatically detect their parent bg context and increment the
        neutral level by 1. No prop is needed on the button -- it's fully
        automatic.
      </div>
      <Box bg="neutral-1" p="4">
        <Text>Neutral 1 container</Text>
        <Flex gap="2" mt="2">
          <Button variant="secondary">Auto (neutral-2)</Button>
          <Button variant="tertiary">Auto (neutral-2)</Button>
        </Flex>
      </Box>
      <Box bg="neutral-2" p="4">
        <Text>Neutral 2 container</Text>
        <Flex gap="2" mt="2">
          <Button variant="secondary">Auto (neutral-3)</Button>
          <Button variant="tertiary">Auto (neutral-3)</Button>
        </Flex>
      </Box>
      <Box bg="neutral-3" p="4">
        <Text>Neutral 3 container</Text>
        <Flex gap="2" mt="2">
          <Button variant="secondary">Auto (neutral-4)</Button>
          <Button variant="tertiary">Auto (neutral-4)</Button>
        </Flex>
      </Box>
    </Flex>
  ),
});
