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
import { ButtonIcon } from './ButtonIcon';
import { Flex } from '../Flex';
import { Text } from '../Text';
import { RiCloudLine } from '@remixicon/react';
import { useState } from 'react';

const meta = preview.meta({
  title: 'Backstage UI/ButtonIcon',
  component: ButtonIcon,
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
  render: () => <ButtonIcon icon={<RiCloudLine />} />,
});

export const Variants = meta.story({
  render: () => (
    <Flex align="center" gap="2">
      <ButtonIcon icon={<RiCloudLine />} variant="primary" />
      <ButtonIcon icon={<RiCloudLine />} variant="secondary" />
      <ButtonIcon icon={<RiCloudLine />} variant="tertiary" />
    </Flex>
  ),
});

export const Sizes = meta.story({
  render: () => (
    <Flex align="center" gap="2">
      <ButtonIcon icon={<RiCloudLine />} size="small" />
      <ButtonIcon icon={<RiCloudLine />} size="medium" />
    </Flex>
  ),
});

export const Disabled = meta.story({
  render: () => (
    <Flex direction="row" gap="2">
      <ButtonIcon isDisabled icon={<RiCloudLine />} variant="primary" />
      <ButtonIcon isDisabled icon={<RiCloudLine />} variant="secondary" />
      <ButtonIcon isDisabled icon={<RiCloudLine />} variant="tertiary" />
    </Flex>
  ),
});

export const Responsive = meta.story({
  args: {
    variant: {
      initial: 'primary',
      sm: 'secondary',
    },
    size: {
      xs: 'small',
      sm: 'medium',
    },
  },
  render: args => <ButtonIcon {...args} icon={<RiCloudLine />} />,
});

export const Pending = meta.story({
  render: () => {
    const [isPending, setIsPending] = useState(false);

    const handleClick = () => {
      setIsPending(true);
      setTimeout(() => {
        setIsPending(false);
      }, 3000);
    };

    return (
      <ButtonIcon
        variant="primary"
        icon={<RiCloudLine />}
        isPending={isPending}
        onPress={handleClick}
      />
    );
  },
});

export const PendingVariants = meta.story({
  render: () => (
    <Flex direction="column" gap="4">
      <Text>Primary</Text>
      <Flex align="center" gap="4">
        <ButtonIcon
          variant="primary"
          size="small"
          icon={<RiCloudLine />}
          isPending
        />
        <ButtonIcon
          variant="primary"
          size="medium"
          icon={<RiCloudLine />}
          isPending
        />
      </Flex>

      <Text>Secondary</Text>
      <Flex align="center" gap="4">
        <ButtonIcon
          variant="secondary"
          size="small"
          icon={<RiCloudLine />}
          isPending
        />
        <ButtonIcon
          variant="secondary"
          size="medium"
          icon={<RiCloudLine />}
          isPending
        />
      </Flex>

      <Text>Tertiary</Text>
      <Flex align="center" gap="4">
        <ButtonIcon
          variant="tertiary"
          size="small"
          icon={<RiCloudLine />}
          isPending
        />
        <ButtonIcon
          variant="tertiary"
          size="medium"
          icon={<RiCloudLine />}
          isPending
        />
      </Flex>

      <Text>Pending vs Disabled</Text>
      <Flex align="center" gap="4">
        <ButtonIcon variant="primary" icon={<RiCloudLine />} isPending />
        <ButtonIcon variant="primary" icon={<RiCloudLine />} isDisabled />
        <ButtonIcon
          variant="primary"
          icon={<RiCloudLine />}
          isPending
          isDisabled
        />
      </Flex>
    </Flex>
  ),
});
