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
import { Box, BoxProps } from '../Box';
import { Card, CardHeader, CardBody, CardFooter } from '../Card';
import { Grid } from '../Grid';

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
  args: { children: null },
});

const DecorativeBox = ({
  width = '48px',
  height = '48px',
  style,
  ...props
}: Omit<BoxProps, 'children'>) => {
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
      {...props}
      width={width}
      height={height}
      style={{
        ...style,
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
      children={null}
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

export const FlexItems = meta.story({
  args: {
    component: 'Box',
    grow: 1,
    shrink: 0,
    basis: 'auto',
  },
  argTypes: {
    component: {
      control: { type: 'select' },
      options: ['Box', 'Card', 'Grid', 'Flex'],
      mapping: {
        Box: props => <DecorativeBox height="100%" width="256px" {...props} />,
        Card: props => (
          <Card style={{ height: '100%', width: '256px' }} {...props}>
            <CardHeader>
              <Text>Header</Text>
            </CardHeader>
            <CardBody>
              <Text>
                This is the first paragraph of a long body text that
                demonstrates how the Card component handles extensive content.
                The card should adjust accordingly to display all the text
                properly while maintaining its structure.
              </Text>
              <Text>
                Here's a second paragraph that adds more content to our card
                body. Having multiple paragraphs helps to visualize how spacing
                works within the card component.
              </Text>
              <Text>
                This third paragraph continues to add more text to ensure we
                have a proper demonstration of a card with significant content.
                This makes it easier to test scrolling behavior and overall
                layout when content exceeds the initial view.
              </Text>
            </CardBody>
            <CardFooter>
              <Text>Footer</Text>
            </CardFooter>
          </Card>
        ),
        Grid: props => (
          <Grid.Root
            {...props}
            height="128px"
            style={{ width: '256px' }}
            columns="3"
          >
            <Grid.Item colSpan="1" rowSpan="2">
              <DecorativeBox height="100%" width="100%" />
            </Grid.Item>
            <Grid.Item colSpan="2">
              <DecorativeBox height="100%" width="100%" />
            </Grid.Item>
            <Grid.Item colSpan="2">
              <DecorativeBox height="100%" width="100%" />
            </Grid.Item>
          </Grid.Root>
        ),
        Flex: props => (
          <Flex
            {...props}
            height="128px"
            style={{ width: '256px' }}
            justify="between"
          >
            <DecorativeBox height="100%" />
            <DecorativeBox height="100%" />
            <DecorativeBox height="100%" />
          </Flex>
        ),
      },
    },
    grow: {
      control: 'radio',
      options: [undefined, 0, 1, false, true],
    },
    shrink: {
      control: 'radio',
      options: [undefined, 0, 1, false, true],
    },
    basis: {
      control: 'radio',
      options: [undefined, '0%', '25%', '50%', '100%', 100, '250px', 'auto'],
    },
  },
  render: ({ component: Component, ...args }) => {
    return (
      <Flex style={{ width: '100%', height: '256px' }}>
        <div
          style={{
            width: '256px',
            flex: '1 1 auto',
            background:
              'repeating-linear-gradient(-45deg, transparent 0px, transparent 5px, #e8e8e8 5px, #e8e8e8 10px)',
            borderRadius: '12px',
          }}
        />

        <Component {...args} />

        <div
          style={{
            width: '256px',
            flex: '1 1 auto',
            background:
              'repeating-linear-gradient(-45deg, transparent 0px, transparent 5px, #e8e8e8 5px, #e8e8e8 10px)',
            borderRadius: '12px',
          }}
        />
      </Flex>
    );
  },
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

export const Backgrounds = meta.story({
  args: {
    px: '6',
    py: '4',
  },
  render: args => (
    <Flex align="center" style={{ flexWrap: 'wrap' }}>
      <Flex {...args}>Default</Flex>
      <Flex bg="neutral" {...args}>
        Neutral (level 1)
      </Flex>
      <Box bg="neutral">
        <Flex bg="neutral" {...args}>
          Neutral (level 2)
        </Flex>
      </Box>
      <Box bg="neutral">
        <Box bg="neutral">
          <Flex bg="neutral" {...args}>
            Neutral (level 3)
          </Flex>
        </Box>
      </Box>
      <Flex bg="danger" {...args}>
        Danger
      </Flex>
      <Flex bg="warning" {...args}>
        Warning
      </Flex>
      <Flex bg="success" {...args}>
        Success
      </Flex>
    </Flex>
  ),
});

export const BgNeutral = meta.story({
  args: { px: '6', py: '4', gap: '4' },
  render: args => (
    <Flex direction="column">
      <div style={{ maxWidth: '600px', marginBottom: '16px' }}>
        Using bg="neutral" on Flex auto-increments from the parent context. The
        first Flex defaults to neutral-1 (no parent), then each nested Flex
        increments by one, capping at neutral-3.
      </div>
      <Flex {...args} bg="neutral" direction="column">
        <div>Neutral 1 (no parent)</div>
        <Flex {...args} bg="neutral" direction="column">
          <div>Neutral 2 (auto-incremented)</div>
          <Flex {...args} bg="neutral" direction="column">
            <div>Neutral 3 (auto-incremented, capped)</div>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  ),
});
