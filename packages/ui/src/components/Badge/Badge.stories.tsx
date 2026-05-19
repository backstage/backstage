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
import { Badge } from '.';
import { Flex } from '../../';
import { BUIProvider } from '../../provider';
import { RiBugLine } from '@remixicon/react';

const meta = preview.meta({
  title: 'Backstage UI/Badge',
  component: Badge,
  decorators: [
    Story => (
      <BUIProvider>
        <Story />
      </BUIProvider>
    ),
  ],
});

export const Default = meta.story({
  args: {
    children: 'Banana',
  },
});

export const Sizes = meta.story({
  render: () => (
    <Flex direction="row" gap="2">
      <Badge size="small">Banana</Badge>
      <Badge size="medium">Banana</Badge>
    </Flex>
  ),
});

export const WithIcon = meta.story({
  render: () => (
    <Flex direction="row" gap="2">
      <Badge size="small" icon={<RiBugLine />}>
        Banana
      </Badge>
      <Badge size="medium" icon={<RiBugLine />}>
        Banana
      </Badge>
    </Flex>
  ),
});
