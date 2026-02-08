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
import { Grid } from './Grid';
import type { GridItemProps } from './types';
import { Box } from '../Box/Box';
import { Flex } from '../Flex';

const meta = preview.meta({
  title: 'Backstage UI/Grid',
  component: Grid.Root,
  // We will add this story in the manifest when the component is not composed.
  tags: ['!manifest'],
});

const FakeBox = () => (
  <Box
    style={{
      background: '#eaf2fd',
      borderRadius: '4px',
      boxShadow: '0 0 0 1px #2563eb',
      height: '64px',
      backgroundImage:
        'url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.3%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M5%200h1L0%206V5zM6%205v1H5z%22/%3E%3C/g%3E%3C/svg%3E")',
    }}
  />
);

export const Default = meta.story({
  args: {
    children: (
      <>
        <FakeBox />
        <FakeBox />
        <FakeBox />
      </>
    ),
  },
});

export const LargeGap = meta.story({
  args: {
    ...Default.input.args,
    gap: '64px',
  },
});

export const ColumnSizes = meta.story({
  args: {
    columns: '12',
  },
  render: args => (
    <Flex gap="4" direction="column">
      {Array.from({ length: 11 }, (_, i) => (
        <Grid.Root {...args} key={i}>
          <Grid.Item colSpan={String(i + 1) as GridItemProps['colSpan']}>
            <FakeBox />
          </Grid.Item>
          <Grid.Item colSpan={String(11 - i) as GridItemProps['colSpan']}>
            <FakeBox />
          </Grid.Item>
        </Grid.Root>
      ))}
    </Flex>
  ),
});

export const RowAndColumns = meta.story({
  args: {
    columns: '12',
  },
  render: args => (
    <Grid.Root {...args} columns="3">
      <Grid.Item colSpan="1" rowSpan="2">
        <Box
          style={{
            height: '100%',
            background: '#eaf2fd',
            borderRadius: '4px',
            boxShadow: '0 0 0 1px #2563eb',
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.3%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M5%200h1L0%206V5zM6%205v1H5z%22/%3E%3C/g%3E%3C/svg%3E")',
          }}
        />
      </Grid.Item>
      <Grid.Item colSpan="2">
        <FakeBox />
      </Grid.Item>
      <Grid.Item colSpan="2">
        <FakeBox />
      </Grid.Item>
    </Grid.Root>
  ),
});

export const Backgrounds = meta.story({
  args: { px: '6', py: '4' },
  render: args => (
    <Flex direction="column">
      <Flex style={{ flexWrap: 'wrap' }}>
        <Grid.Root {...args} bg="neutral-1">
          Neutral 1
        </Grid.Root>
        <Grid.Root {...args} bg="neutral-2">
          Neutral 2
        </Grid.Root>
        <Grid.Root {...args} bg="neutral-3">
          Neutral 3
        </Grid.Root>
        <Grid.Root {...args} bg="neutral-4">
          Neutral 4
        </Grid.Root>
        <Grid.Root {...args} bg={{ initial: 'neutral-1', sm: 'neutral-2' }}>
          Responsive Bg
        </Grid.Root>
        <Grid.Root {...args} bg="danger">
          Danger
        </Grid.Root>
        <Grid.Root {...args} bg="warning">
          Warning
        </Grid.Root>
        <Grid.Root {...args} bg="success">
          Success
        </Grid.Root>
      </Flex>
      <Flex style={{ flexWrap: 'wrap' }}>
        <Grid.Root {...args}>
          <Grid.Item bg="neutral-1" style={{ padding: '4px' }}>
            Neutral 1
          </Grid.Item>
        </Grid.Root>
        <Grid.Root {...args}>
          <Grid.Item bg="neutral-2" style={{ padding: '4px' }}>
            Neutral 2
          </Grid.Item>
        </Grid.Root>
        <Grid.Root {...args}>
          <Grid.Item bg="neutral-3" style={{ padding: '4px' }}>
            Neutral 3
          </Grid.Item>
        </Grid.Root>
        <Grid.Root {...args}>
          <Grid.Item bg="neutral-4" style={{ padding: '4px' }}>
            Neutral 4
          </Grid.Item>
        </Grid.Root>
        <Grid.Root {...args}>
          <Grid.Item
            bg={{ initial: 'neutral-1', sm: 'neutral-2' }}
            style={{ padding: '4px' }}
          >
            Responsive Bg
          </Grid.Item>
        </Grid.Root>
        <Grid.Root {...args}>
          <Grid.Item bg="danger" style={{ padding: '4px' }}>
            Danger
          </Grid.Item>
        </Grid.Root>
        <Grid.Root {...args}>
          <Grid.Item bg="warning" style={{ padding: '4px' }}>
            Warning
          </Grid.Item>
        </Grid.Root>
        <Grid.Root {...args}>
          <Grid.Item bg="success" style={{ padding: '4px' }}>
            Success
          </Grid.Item>
        </Grid.Root>
      </Flex>
    </Flex>
  ),
});

export const BgAutoIncrement = meta.story({
  args: { px: '6', py: '4', columns: '2', gap: '4' },
  render: args => (
    <Flex direction="column">
      <div style={{ maxWidth: '600px', marginBottom: '16px' }}>
        Nested Grid components automatically increment their neutral background.
        Each nested Grid.Item inherits and increments from its parent's bg.
      </div>
      <Grid.Root {...args} bg="neutral-1">
        <Grid.Item>Neutral 1 (Grid.Root)</Grid.Item>
        <Grid.Item>
          <Grid.Root {...args}>
            <Grid.Item>Nested: Auto (becomes neutral-2)</Grid.Item>
            <Grid.Item>Nested: Auto (becomes neutral-2)</Grid.Item>
          </Grid.Root>
        </Grid.Item>
      </Grid.Root>
    </Flex>
  ),
});
