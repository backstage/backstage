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
import { ToggleButtonGroup } from './ToggleButtonGroup';
import { ToggleButton } from '../ToggleButton/ToggleButton';
import { Flex } from '../Flex';
import { Text } from '../Text';
import { useState } from 'react';
import type { Selection } from 'react-aria-components';
import {
  RiCloudLine,
  RiStarLine,
  RiStarFill,
  RiArrowRightSLine,
} from '@remixicon/react';

const meta = preview.meta({
  title: 'Backstage UI/ToggleButtonGroup',
  component: ToggleButtonGroup,
  argTypes: {
    selectionMode: {
      control: 'select',
      options: ['single', 'multiple'],
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
});

export const SingleSelection = meta.story({
  args: {
    selectionMode: 'single',
    defaultSelectedKeys: ['dogs'],
  },
  render: args => (
    <ToggleButtonGroup {...args}>
      <ToggleButton id="dogs">Dogs</ToggleButton>
      <ToggleButton id="cats">Cats</ToggleButton>
      <ToggleButton id="birds">Birds</ToggleButton>
    </ToggleButtonGroup>
  ),
});

export const MultipleSelection = meta.story({
  args: {
    selectionMode: 'multiple',
    defaultSelectedKeys: ['frontend'],
  },
  render: args => (
    <ToggleButtonGroup {...args}>
      <ToggleButton id="frontend">Frontend</ToggleButton>
      <ToggleButton id="backend">Backend</ToggleButton>
      <ToggleButton id="platform">Platform</ToggleButton>
    </ToggleButtonGroup>
  ),
});

export const Backgrounds = meta.story({
  args: {
    selectionMode: 'single',
    defaultSelectedKeys: ['option1'],
  },
  parameters: {
    argTypes: {
      selectionMode: {
        control: false,
      },
    },
  },
  render: () => (
    <Flex direction="column" gap="4">
      <Flex direction="column" gap="4">
        <Text>Default</Text>
        <Flex align="center" p="4" gap="4">
          <ToggleButtonGroup
            selectionMode="single"
            defaultSelectedKeys={['option1']}
          >
            <ToggleButton id="option1">Option 1</ToggleButton>
            <ToggleButton id="option2">Option 2</ToggleButton>
            <ToggleButton id="option3">Option 3</ToggleButton>
          </ToggleButtonGroup>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>On Neutral 1</Text>
        <Flex align="center" bg="neutral-1" p="4" gap="4">
          <ToggleButtonGroup
            selectionMode="single"
            defaultSelectedKeys={['option1']}
          >
            <ToggleButton id="option1">Option 1</ToggleButton>
            <ToggleButton id="option2">Option 2</ToggleButton>
            <ToggleButton id="option3">Option 3</ToggleButton>
          </ToggleButtonGroup>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>On Neutral 2</Text>
        <Flex align="center" bg="neutral-2" p="4" gap="4">
          <ToggleButtonGroup
            selectionMode="single"
            defaultSelectedKeys={['option1']}
          >
            <ToggleButton id="option1">Option 1</ToggleButton>
            <ToggleButton id="option2">Option 2</ToggleButton>
            <ToggleButton id="option3">Option 3</ToggleButton>
          </ToggleButtonGroup>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>On Neutral 3</Text>
        <Flex align="center" bg="neutral-3" p="4" gap="4">
          <ToggleButtonGroup
            selectionMode="single"
            defaultSelectedKeys={['option1']}
          >
            <ToggleButton id="option1">Option 1</ToggleButton>
            <ToggleButton id="option2">Option 2</ToggleButton>
            <ToggleButton id="option3">Option 3</ToggleButton>
          </ToggleButtonGroup>
        </Flex>
      </Flex>
    </Flex>
  ),
});

export const DisabledGroup = meta.story({
  args: {
    selectionMode: 'single',
    isDisabled: true,
  },
  render: args => (
    <ToggleButtonGroup {...args}>
      <ToggleButton id="cat">Cat</ToggleButton>
      <ToggleButton id="dog">Dog</ToggleButton>
      <ToggleButton id="bird">Bird</ToggleButton>
    </ToggleButtonGroup>
  ),
});

export const DisallowEmptySelection = meta.story({
  args: {
    selectionMode: 'single',
    disallowEmptySelection: true,
    defaultSelectedKeys: ['one'],
  },
  render: args => (
    <ToggleButtonGroup {...args}>
      <ToggleButton id="one">One</ToggleButton>
      <ToggleButton id="two">Two</ToggleButton>
      <ToggleButton id="three">Three</ToggleButton>
    </ToggleButtonGroup>
  ),
});

export const MixedDisabled = meta.story({
  render: () => (
    <ToggleButtonGroup selectionMode="single">
      <ToggleButton id="one">One</ToggleButton>
      <ToggleButton id="two" isDisabled>
        Two
      </ToggleButton>
      <ToggleButton id="three">Three</ToggleButton>
    </ToggleButtonGroup>
  ),
});

export const Orientation = meta.story({
  args: {
    orientation: 'vertical',
  },
  render: args => (
    <ToggleButtonGroup {...args} selectionMode="single">
      <ToggleButton id="morning">Morning</ToggleButton>
      <ToggleButton id="afternoon">Afternoon</ToggleButton>
      <ToggleButton id="evening">Evening</ToggleButton>
    </ToggleButtonGroup>
  ),
});

export const ControlledGroup = meta.story({
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(
      new Set(['beta']),
    );

    return (
      <Flex direction="column" gap="3">
        <ToggleButtonGroup
          selectionMode="single"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        >
          <ToggleButton id="alpha">Alpha</ToggleButton>
          <ToggleButton id="beta">Beta</ToggleButton>
          <ToggleButton id="gamma">Gamma</ToggleButton>
        </ToggleButtonGroup>
        <Text>Selected: {[...selectedKeys].join(', ') || 'none'}</Text>
      </Flex>
    );
  },
});

export const WithIcons = meta.story({
  args: {
    selectionMode: 'single',
  },

  render: () => (
    <ToggleButtonGroup selectionMode="multiple" defaultSelectedKeys={['cloud']}>
      <ToggleButton id="cloud" aria-label="Cloud" iconStart={<RiCloudLine />} />
      <ToggleButton
        id="starred"
        aria-label="Starred"
        iconStart={<RiStarFill />}
      />
      <ToggleButton id="star" iconStart={<RiStarLine />}>
        Star
      </ToggleButton>
      <ToggleButton id="next" iconEnd={<RiArrowRightSLine />}>
        Next
      </ToggleButton>
    </ToggleButtonGroup>
  ),
});

export const IconsOnly = meta.story({
  render: () => (
    <ToggleButtonGroup selectionMode="multiple" defaultSelectedKeys={['cloud']}>
      <ToggleButton id="cloud" iconStart={<RiCloudLine />} />
      <ToggleButton id="star" iconStart={<RiStarLine />} />
      <ToggleButton id="next" iconEnd={<RiArrowRightSLine />} />
    </ToggleButtonGroup>
  ),
});
