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
      options: ['primary', 'secondary'],
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
        <Text>On Surface 0</Text>
        <Flex align="center" surface="0" p="4">
          <Button iconStart={<RiCloudLine />} variant="primary">
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="secondary">
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="tertiary">
            Button
          </Button>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>On Surface 1</Text>
        <Flex align="center" surface="1" p="4">
          <Button iconStart={<RiCloudLine />} variant="primary">
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="secondary">
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="tertiary">
            Button
          </Button>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>On Surface 2</Text>
        <Flex align="center" surface="2" p="4">
          <Button iconStart={<RiCloudLine />} variant="primary">
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="secondary">
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="tertiary">
            Button
          </Button>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>On Surface 3</Text>
        <Flex align="center" surface="3" p="4">
          <Button iconStart={<RiCloudLine />} variant="primary">
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="secondary">
            Button
          </Button>
          <Button iconStart={<RiCloudLine />} variant="tertiary">
            Button
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

const variants = ['primary', 'secondary'] as const;
const sizes = ['small', 'medium'] as const;

export const Playground = meta.story({
  args: {
    children: 'Button',
  },
  render: () => (
    <Flex direction="column">
      {variants.map(variant => (
        <Flex direction="column" key={variant}>
          <Text>{variant}</Text>
          {sizes.map(size => (
            <Flex align="center" key={size}>
              <Button variant={variant} size={size}>
                Button
              </Button>
              <Button iconStart={<RiCloudLine />} variant={variant} size={size}>
                Button
              </Button>
              <Button
                iconEnd={<RiArrowRightSLine />}
                variant={variant}
                size={size}
              >
                Button
              </Button>
              <Button
                iconStart={<RiCloudLine />}
                iconEnd={<RiArrowRightSLine />}
                style={{ width: '200px' }}
                variant={variant}
                size={size}
              >
                Button
              </Button>
              <Button variant={variant} size={size} isDisabled>
                Button
              </Button>
              <Button
                iconStart={<RiCloudLine />}
                variant={variant}
                size={size}
                isDisabled
              >
                Button
              </Button>
              <Button
                iconEnd={<RiArrowRightSLine />}
                variant={variant}
                size={size}
                isDisabled
              >
                Button
              </Button>
            </Flex>
          ))}
        </Flex>
      ))}
    </Flex>
  ),
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
