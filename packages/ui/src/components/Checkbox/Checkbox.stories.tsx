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
import { useState } from 'react';
import preview from '../../../../../.storybook/preview';
import { Checkbox } from './Checkbox';
import { Flex } from '../Flex';
import { Link } from '../Link';
import { MemoryRouter } from 'react-router-dom';

const meta = preview.meta({
  title: 'Backstage UI/Checkbox',
  component: Checkbox,
});

export const Default = meta.story({
  args: {
    children: 'Accept terms and conditions',
  },
});

export const Selected = Default.extend({
  args: {
    isSelected: true,
  },
});

export const Indeterminate = meta.story({
  args: {
    children: 'Select all',
    isIndeterminate: true,
  },
});

export const SelectAll = meta.story({
  render: () => {
    const options = ['Read', 'Write', 'Delete'];
    const [selected, setSelected] = useState<string[]>(['Read']);

    const allSelected = selected.length === options.length;
    const someSelected = selected.length > 0 && !allSelected;

    return (
      <Flex direction="column" gap="2">
        <Checkbox
          isSelected={allSelected}
          isIndeterminate={someSelected}
          onChange={isSelected => setSelected(isSelected ? options : [])}
        >
          Select all
        </Checkbox>
        <Flex direction="column" gap="2" pl="6">
          {options.map(option => (
            <Checkbox
              key={option}
              isSelected={selected.includes(option)}
              onChange={isSelected =>
                setSelected(current =>
                  isSelected
                    ? [...current, option]
                    : current.filter(o => o !== option),
                )
              }
            >
              {option}
            </Checkbox>
          ))}
        </Flex>
      </Flex>
    );
  },
});

export const WithLongText = Default.extend({
  args: {
    children: (
      <>
        I agree to receive future communication from Spotify. You may
        unsubscribe from these communications at any time. Please review our{' '}
        <Link href="#">Privacy Policy</Link>
      </>
    ),
  },
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
});

export const Invalid = Default.extend({
  args: {
    isInvalid: true,
  },
});

export const AllVariants = meta.story({
  ...Default.input,
  render: () => (
    <Flex direction="column" gap="2">
      <Checkbox>Unchecked</Checkbox>
      <Checkbox isSelected>Checked</Checkbox>
      <Checkbox isIndeterminate>Indeterminate</Checkbox>
      <Checkbox isDisabled>Disabled</Checkbox>
      <Checkbox isSelected isDisabled>
        Checked & Disabled
      </Checkbox>
      <Checkbox isIndeterminate isDisabled>
        Indeterminate & Disabled
      </Checkbox>
      <Checkbox isInvalid>Invalid</Checkbox>
      <Checkbox isInvalid isSelected>
        Invalid & Checked
      </Checkbox>
      <Checkbox isInvalid isIndeterminate>
        Invalid & Indeterminate
      </Checkbox>
    </Flex>
  ),
});
