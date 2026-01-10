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
import { Flex } from '../Flex';
import { Text } from '../Text';
import { useState } from 'react';
import {
  RiCheckLine,
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
  },
});

export const Default = meta.story({
  args: {
    children: 'Toggle',
  },
});

export const Surfaces = meta.story({
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
    <Flex direction="column" gap="4">
      <Flex direction="column" gap="4">
        <Text>Default</Text>
        <Flex align="center" p="4">
          <ToggleButton>Toggle</ToggleButton>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>On Surface 0</Text>
        <Flex align="center" surface="0" p="4">
          <ToggleButton>Toggle</ToggleButton>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>On Surface 1</Text>
        <Flex align="center" surface="1" p="4">
          <ToggleButton>Toggle</ToggleButton>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>On Surface 2</Text>
        <Flex align="center" surface="2" p="4">
          <ToggleButton>Toggle</ToggleButton>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>On Surface 3</Text>
        <Flex align="center" surface="3" p="4">
          <ToggleButton>Toggle</ToggleButton>
        </Flex>
      </Flex>
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

export const Disabled = meta.story({
  render: () => (
    <Flex align="center">
      <ToggleButton isDisabled>Disabled</ToggleButton>
      <ToggleButton defaultSelected isDisabled>
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

export const FunctionChildren = meta.story({
  render: () => {
    const [disabled, setDisabled] = useState(false);
    return (
      <Flex direction="column" gap="3">
        <Flex align="center" gap="2">
          <ToggleButton isDisabled={disabled}>
            {({ isDisabled, isSelected }) =>
              isDisabled
                ? `Disabled ${isSelected ? '(Selected)' : '(Unselected)'}`
                : `Enabled ${isSelected ? '(Selected)' : '(Unselected)'}`
            }
          </ToggleButton>
          <ToggleButton
            aria-label="Toggle disabled state"
            onChange={() => setDisabled(!disabled)}
          >
            {disabled ? 'Enable' : 'Disable'}
          </ToggleButton>
        </Flex>
        <Text>
          Toggle the button to change the disabled state and see text update
        </Text>
      </Flex>
    );
  },
});

export const DynamicContent = meta.story({
  render: () => {
    return (
      <Flex direction="column" gap="4">
        <Flex direction="column" gap="2">
          <Text weight="bold">Example 1: Selection State</Text>
          <Flex align="center" gap="2">
            <ToggleButton defaultSelected>
              {({ isSelected }) => (isSelected ? '✓ Selected' : 'Not Selected')}
            </ToggleButton>
            <ToggleButton>
              {({ isSelected }) => (isSelected ? '✓ Selected' : 'Not Selected')}
            </ToggleButton>
          </Flex>
        </Flex>

        <Flex direction="column" gap="2">
          <Text weight="bold">Example 2: Multiple States</Text>
          <Flex align="center" gap="2">
            <ToggleButton defaultSelected>
              {({ isSelected, isHovered }) => {
                const states = [];
                if (isSelected) states.push('on');
                else states.push('off');
                if (isHovered) states.push('hovered');
                return `Email (${states.join(', ')})`;
              }}
            </ToggleButton>
            <ToggleButton>
              {({ isSelected, isHovered }) => {
                const states = [];
                if (isSelected) states.push('on');
                else states.push('off');
                if (isHovered) states.push('hovered');
                return `Push (${states.join(', ')})`;
              }}
            </ToggleButton>
          </Flex>
        </Flex>

        <Flex direction="column" gap="2">
          <Text weight="bold">Example 3: Conditional Icons</Text>
          <Flex align="center" gap="2">
            <ToggleButton>
              {({ isSelected }) => (
                <>
                  {isSelected ? <RiStarFill /> : <RiStarLine />}
                  <span>{isSelected ? 'Starred' : 'Star'}</span>
                </>
              )}
            </ToggleButton>
          </Flex>
        </Flex>

        <Flex direction="column" gap="2">
          <Text weight="bold">Example 4: Status Indicators</Text>
          <Flex align="center" gap="2">
            <ToggleButton defaultSelected>
              {({ isSelected }) => (
                <Flex align="center" gap="2">
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: isSelected
                        ? 'var(--bui-fg-success)'
                        : 'var(--bui-fg-secondary)',
                    }}
                  />
                  <span>Active</span>
                </Flex>
              )}
            </ToggleButton>
            <ToggleButton>
              {({ isSelected }) => (
                <Flex align="center" gap="2">
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: isSelected
                        ? 'var(--bui-fg-danger)'
                        : 'var(--bui-fg-secondary)',
                    }}
                  />
                  <span>Inactive</span>
                </Flex>
              )}
            </ToggleButton>
          </Flex>
        </Flex>
      </Flex>
    );
  },
});
