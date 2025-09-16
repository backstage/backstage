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
import { Checkbox } from './Checkbox';
import { Flex } from '../Flex';
import { Text } from '../Text';

const meta = preview.meta({
  title: 'Backstage UI/Checkbox',
  component: Checkbox,
});

export const Default = meta.story({
  args: {
    label: 'Accept terms and conditions',
  },
});

export const AllVariants = meta.story({
  render: () => (
    <Flex align="center">
      <Checkbox />
      <Checkbox checked />
      <Checkbox label="Checkbox" />
      <Checkbox label="Checkbox" checked />
    </Flex>
  ),
});

export const Playground = meta.story({
  render: () => (
    <Flex>
      <Text>All variants</Text>
      <Flex align="center">
        <Checkbox />
        <Checkbox checked />
        <Checkbox label="Checkbox" />
        <Checkbox label="Checkbox" checked />
      </Flex>
    </Flex>
  ),
});
