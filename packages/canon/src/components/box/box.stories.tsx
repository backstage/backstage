import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { box } from './box';

const meta = {
  title: 'Box',
  component: box.div,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof box.div>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <box.div padding="medium" background="background">
      Basic Box
    </box.div>
  ),
};

export const Responsive: Story = {
  render: () => (
    <box.div
      display={{ xs: 'block', sm: 'flex' }}
      padding={{ xs: 'small', sm: 'medium', lg: 'large' }}
      background="background"
    >
      Responsive Box
    </box.div>
  ),
};

export const FlexContainer: Story = {
  render: () => (
    <box.div
      display="flex"
      flexDirection="column"
      padding="large"
      background="background"
    >
      <box.div padding="medium" background="background">
        Item 1
      </box.div>
      <box.div padding="medium" background="background">
        Item 2
      </box.div>
      <box.div padding="medium" background="background">
        Item 3
      </box.div>
    </box.div>
  ),
};

export const Nested: Story = {
  render: () => (
    <box.section padding="large" background="background">
      <box.header padding="medium" background="background">
        Header
      </box.header>
      <box.main
        display="flex"
        padding="medium"
        background="background"
        justifyContent="space-between"
      >
        <box.aside padding="small" background="background">
          Sidebar
        </box.aside>
        <box.article padding="small" background="background">
          Main Content
        </box.article>
      </box.main>
      <box.footer padding="medium" background="background">
        Footer
      </box.footer>
    </box.section>
  ),
};

export const Alignment: Story = {
  render: () => (
    <box.div
      display="flex"
      padding="large"
      background="background"
      justifyContent="center"
      alignItems="center"
      style={{ height: '200px' }}
    >
      <box.div padding="medium" background="background">
        Centered Content
      </box.div>
    </box.div>
  ),
};

// Example showing different spacing combinations
export const Spacing: Story = {
  render: () => (
    <box.div display="flex" flexDirection="column" gap="medium">
      <box.div padding="small" background="background">
        Small Padding
      </box.div>
      <box.div padding="medium" background="background">
        Medium Padding
      </box.div>
      <box.div padding="large" background="background">
        Large Padding
      </box.div>
      <box.div paddingX="large" paddingY="small" background="background">
        Mixed Padding
      </box.div>
    </box.div>
  ),
};

// Example showing different display values
export const DisplayVariants: Story = {
  render: () => (
    <box.div display="flex" flexDirection="column" gap="medium">
      <box.div padding="medium" background="background" display="block">
        Display Block
      </box.div>
      <box.div padding="medium" background="background" display="flex">
        Display Flex
      </box.div>
      <box.span padding="medium" background="background" display="inline">
        Display Inline
      </box.span>
    </box.div>
  ),
};

export const Test: Story = {
  render: () => <box.div paddingX="large">Hello World</box.div>,
};
