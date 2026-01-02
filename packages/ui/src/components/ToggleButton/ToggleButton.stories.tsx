/*
 * Copyright 2024 The Backstage Authors
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

import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToggleButton } from './ToggleButton';
import { Flex } from '../Flex';
import { RiStarLine } from '@remixicon/react';
import { useState } from 'react';

const meta = {
  title: 'Backstage UI/ToggleButton',
  component: ToggleButton,
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium'],
    },
  },
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Toggle',
  },
  render: args => {
    const [isSelected, setIsSelected] = useState(false);
    return (
      <ToggleButton {...args} isSelected={isSelected} onChange={setIsSelected}>
        {args.children}
      </ToggleButton>
    );
  },
};

export const Sizes: Story = {
  args: {
    children: 'Toggle',
  },
  render: () => {
    const [selected1, setSelected1] = useState(false);
    const [selected2, setSelected2] = useState(false);

    return (
      <Flex align="center">
        <ToggleButton
          size="small"
          iconStart={<RiStarLine />}
          isSelected={selected1}
          onChange={setSelected1}
        >
          Small
        </ToggleButton>
        <ToggleButton
          size="medium"
          iconStart={<RiStarLine />}
          isSelected={selected2}
          onChange={setSelected2}
        >
          Medium
        </ToggleButton>
      </Flex>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <Flex direction="row" gap="4">
      <ToggleButton isDisabled>Disabled</ToggleButton>
      <ToggleButton isSelected isDisabled>
        Selected Disabled
      </ToggleButton>
    </Flex>
  ),
};
