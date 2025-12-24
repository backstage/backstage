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
import { ToggleButton } from './ToggleButton';
import { ToggleButtonGroup } from '../ToggleButtonGroup/ToggleButtonGroup';
import { Flex } from '../Flex';
import { Text } from '../Text';
import { useState } from 'react';
import {
  RiCheckLine,
  RiHeartLine,
  RiStarFill,
  RiStarLine,
  RiCloudLine,
  RiArrowRightSLine,
} from '@remixicon/react';

const meta = preview.meta({
  title: 'Backstage UI/ToggleButton',
  component: ToggleButton,
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
    children: 'Toggle',
  },
});

export const Variants = meta.story({
  args: {
    children: 'Toggle',
  },
  parameters: {
    argTypes: {
      variant: {
        control: false,
      },
    },
  },
  render: () => (
    <Flex align="center">
      <ToggleButton variant="primary">Primary</ToggleButton>
      <ToggleButton variant="secondary">Secondary</ToggleButton>
    </Flex>
  ),
});

export const Sizes = meta.story({
  args: {
    children: 'Toggle',
  },
  parameters: {
    argTypes: {
      size: {
        control: false,
      },
    },
  },
  render: () => (
    <Flex align="center">
      <ToggleButton size="small">Small</ToggleButton>
      <ToggleButton size="medium">Medium</ToggleButton>
    </Flex>
  ),
});

export const WithIcons = meta.story({
  args: {
    children: 'Favorite',
  },
  render: args => (
    <Flex align="center">
      <ToggleButton {...args} iconStart={<RiStarLine />} />
      <ToggleButton {...args} iconStart={<RiStarFill />} defaultSelected />
      <ToggleButton {...args} iconEnd={<RiCheckLine />} />
      <ToggleButton iconEnd={<RiCheckLine />} />
    </Flex>
  ),
});

export const IconsOnly = meta.story({
  render: () => (
    <Flex align="center">
      <ToggleButton aria-label="Cloud" iconStart={<RiCloudLine />} />
      <ToggleButton
        aria-label="Starred"
        defaultSelected
        iconStart={<RiStarFill />}
      />
      <ToggleButton aria-label="Next" iconStart={<RiArrowRightSLine />} />
    </Flex>
  ),
});

export const IconsAndText = meta.story({
  render: () => (
    <Flex align="center">
      <ToggleButton iconStart={<RiCloudLine />}>Cloud</ToggleButton>
      <ToggleButton iconStart={<RiStarLine />}>Star</ToggleButton>
      <ToggleButton iconEnd={<RiArrowRightSLine />}>Next</ToggleButton>
    </Flex>
  ),
});

export const MixedIcons = meta.story({
  render: () => (
    <ToggleButtonGroup selectionMode="multiple" defaultSelectedKeys={['cloud']}>
      <ToggleButton id="cloud" iconStart={<RiCloudLine />}>
        Cloud
      </ToggleButton>
      <ToggleButton id="star" iconStart={<RiStarLine />} />
      <ToggleButton id="arrow" iconEnd={<RiArrowRightSLine />}>
        Next
      </ToggleButton>
    </ToggleButtonGroup>
  ),
});

export const Disabled = meta.story({
  render: () => (
    <Flex align="center">
      <ToggleButton variant="primary" isDisabled>
        Primary
      </ToggleButton>
      <ToggleButton variant="secondary" isDisabled>
        Secondary
      </ToggleButton>
      <ToggleButton variant="primary" defaultSelected isDisabled>
        Selected
      </ToggleButton>
    </Flex>
  ),
});

export const Controlled = meta.story({
  render: () => {
    const [selected, setSelected] = useState(false);
    return (
      <Flex direction="column" gap="3">
        <ToggleButton
          aria-label="Star"
          isSelected={selected}
          onChange={setSelected}
          iconStart={selected ? <RiStarFill /> : <RiStarLine />}
        >
          {selected ? 'Starred' : 'Not starred'}
        </ToggleButton>
        <Text>State: {selected ? 'selected' : 'unselected'}</Text>
      </Flex>
    );
  },
});

export const GroupSingle = meta.story({
  render: () => (
    <ToggleButtonGroup selectionMode="single" defaultSelectedKeys={['apples']}>
      <ToggleButton id="apples">Apples</ToggleButton>
      <ToggleButton id="oranges">Oranges</ToggleButton>
      <ToggleButton id="bananas">Bananas</ToggleButton>
    </ToggleButtonGroup>
  ),
});

export const GroupMultiple = meta.story({
  render: () => (
    <ToggleButtonGroup selectionMode="multiple" defaultSelectedKeys={['dogs']}>
      <ToggleButton id="dogs">Dogs</ToggleButton>
      <ToggleButton id="cats">Cats</ToggleButton>
      <ToggleButton id="rabbits">Rabbits</ToggleButton>
    </ToggleButtonGroup>
  ),
});

export const GroupWithIcons = meta.story({
  render: () => (
    <ToggleButtonGroup
      selectionMode="multiple"
      defaultSelectedKeys={['chill']}
      orientation="horizontal"
    >
      <ToggleButton id="chill" iconStart={<RiHeartLine />}>
        Chill
      </ToggleButton>
      <ToggleButton id="focus" iconStart={<RiCheckLine />}>
        Focus
      </ToggleButton>
      <ToggleButton id="party" iconStart={<RiStarLine />}>
        Party
      </ToggleButton>
    </ToggleButtonGroup>
  ),
});

export const VerticalGroup = meta.story({
  render: () => (
    <ToggleButtonGroup selectionMode="single" orientation="vertical">
      <ToggleButton id="low">Low</ToggleButton>
      <ToggleButton id="medium">Medium</ToggleButton>
      <ToggleButton id="high">High</ToggleButton>
    </ToggleButtonGroup>
  ),
});
