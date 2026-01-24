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
import { Flex } from './Flex';
import { Text } from '../Text';
import { Box } from '../Box';

const meta = preview.meta({
  title: 'Backstage UI/Flex',
  component: Flex,
  argTypes: {
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end', 'baseline', 'stretch'],
    },
    justify: {
      control: 'inline-radio',
      options: ['start', 'center', 'end', 'between'],
    },
    direction: {
      control: 'inline-radio',
      options: ['row', 'column', 'row-reverse', 'column-reverse'],
    },
  },
});

const DecorativeBox = ({
  width = '48px',
  height = '48px',
}: {
  width?: string;
  height?: string;
}) => {
  const diagonalStripePattern = (() => {
    const svg = `
      <svg width="6" height="6" viewBox="0 0 6 6" xmlns="http://www.w3.org/2000/svg">
        <g fill="#2563eb" fill-opacity="0.6" fill-rule="evenodd">
          <path d="M5 0h1L0 6V5zM6 5v1H5z"/>
        </g>
      </svg>
    `.trim();
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  })();

  return (
    <Box
      width={width}
      height={height}
      style={{
        background: '#eaf2fd',
        borderRadius: '4px',
        border: '1px solid #2563eb',
        backgroundImage: `url("${diagonalStripePattern}")`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        color: '#2563eb',
      }}
    />
  );
};

export const Default = meta.story({
  args: {
    children: (
      <>
        <DecorativeBox />
        <DecorativeBox />
        <DecorativeBox />
      </>
    ),
  },
});

export const ColumnDirection = meta.story({
  args: {
    ...Default.input.args,
    direction: 'column',
  },
});

export const RowDirection = meta.story({
  args: {
    ...Default.input.args,
    direction: 'row',
  },
});

export const AlignStartInColumn = meta.story({
  args: {
    align: 'start',
    direction: 'column',
  },
  render: args => (
    <Flex {...args}>
      <DecorativeBox height="32px" />
      <DecorativeBox height="24px" />
      <DecorativeBox height="48px" />
    </Flex>
  ),
});

export const AlignStartInRow = meta.story({
  args: {
    align: 'start',
    direction: 'row',
  },
  render: args => (
    <Flex {...args}>
      <DecorativeBox height="32px" />
      <DecorativeBox height="24px" />
      <DecorativeBox height="48px" />
    </Flex>
  ),
});

export const AlignCenterInColumn = meta.story({
  args: {
    align: 'center',
    direction: 'column',
  },
  render: args => (
    <Flex {...args}>
      <DecorativeBox height="32px" />
      <DecorativeBox height="24px" />
      <DecorativeBox height="48px" />
    </Flex>
  ),
});

export const AlignCenterInRow = meta.story({
  args: {
    align: 'center',
    direction: 'row',
  },
  render: args => (
    <Flex {...args}>
      <DecorativeBox height="32px" />
      <DecorativeBox height="24px" />
      <DecorativeBox height="48px" />
    </Flex>
  ),
});

export const AlignEndInColumn = meta.story({
  args: {
    align: 'end',
    direction: 'column',
  },
  render: args => (
    <Flex {...args}>
      <DecorativeBox height="32px" />
      <DecorativeBox height="24px" />
      <DecorativeBox height="48px" />
    </Flex>
  ),
});

export const AlignEndInRow = meta.story({
  args: {
    align: 'end',
    direction: 'row',
  },
  render: args => (
    <Flex {...args}>
      <DecorativeBox height="32px" />
      <DecorativeBox height="24px" />
      <DecorativeBox height="48px" />
    </Flex>
  ),
});

export const ResponsiveAlign = meta.story({
  args: {
    align: { xs: 'start', md: 'center', lg: 'end' },
  },
  render: args => (
    <Flex {...args}>
      <DecorativeBox height="32px" />
      <DecorativeBox height="24px" />
      <DecorativeBox height="48px" />
    </Flex>
  ),
});

export const ResponsiveGap = meta.story({
  args: {
    gap: { xs: '4', md: '8', lg: '12' },
  },
  render: args => (
    <Flex {...args}>
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
    </Flex>
  ),
});

export const LargeGap = meta.story({
  args: {
    gap: '8',
  },
  render: args => (
    <Flex {...args}>
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
    </Flex>
  ),
});

export const WithTextTruncate = meta.story({
  render: () => (
    <Flex direction="row" gap="8">
      <Flex>
        <Text truncate>
          A man looks at a painting in a museum and says, “Brothers and sisters
          I have none, but that man&apos;s father is my father&apos;s son.” Who
          is in the painting?
        </Text>
      </Flex>
      <Flex>
        <Text truncate>
          A man looks at a painting in a museum and says, “Brothers and sisters
          I have none, but that man&apos;s father is my father&apos;s son.” Who
          is in the painting?
        </Text>
      </Flex>
    </Flex>
  ),
});

export const Surfaces = meta.story({
  args: {
    px: '6',
    py: '4',
  },
  render: args => (
    <Flex align="center" style={{ flexWrap: 'wrap' }}>
      <Flex {...args}>Default</Flex>
      <Flex surface="0" {...args}>
        Surface 0
      </Flex>
      <Flex surface="1" {...args}>
        Surface 1
      </Flex>
      <Flex surface="2" {...args}>
        Surface 2
      </Flex>
      <Flex surface="3" {...args}>
        Surface 3
      </Flex>
      <Flex surface={{ initial: '0', sm: '1' }} {...args}>
        Responsive Surface
      </Flex>
      <Flex surface="danger" {...args}>
        Surface Danger
      </Flex>
      <Flex surface="warning" {...args}>
        Surface Warning
      </Flex>
      <Flex surface="success" {...args}>
        Surface Success
      </Flex>
    </Flex>
  ),
});

export const SurfacesAutoIncrement = meta.story({
  args: { px: '6', py: '4', gap: '4' },
  render: args => (
    <Flex direction="column">
      <div style={{ maxWidth: '600px', marginBottom: '16px' }}>
        Using surface="auto" automatically increments from the parent surface.
        This allows components to be reusable without hardcoding surface levels.
      </div>
      <Flex {...args} surface="0" direction="column">
        <div>Surface 0 (explicit)</div>
        <Flex {...args} surface="auto" direction="column">
          <div>Surface auto (becomes 1)</div>
          <Flex {...args} surface="auto" direction="column">
            <div>Surface auto (becomes 2)</div>
            <Flex {...args} surface="auto" direction="column">
              <div>Surface auto (becomes 3)</div>
              <Flex {...args} surface="auto" direction="column">
                <div>Surface auto (stays 3 - capped)</div>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  ),
});
