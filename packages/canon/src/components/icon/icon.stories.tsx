import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Icon } from './icon';
import { IconProvider } from './context';
import * as LucideIcons from 'lucide-react';

const meta = {
  title: 'Components/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: Object.keys(LucideIcons),
    },
  },
  args: {
    name: 'ArrowDown',
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    name: 'ArrowDown',
  },
};

export const CustomIcon: Story = {
  args: {
    name: 'CustomIcon',
  },
};

export const WithCustomIcon: Story = {
  args: {
    name: 'ArrowDown',
  },
  decorators: [
    Story => (
      <IconProvider overrides={{ ArrowDown: () => <div>Custom Icon</div> }}>
        <Story />
      </IconProvider>
    ),
  ],
};

export const WithCustomIconOverride: Story = {
  args: {
    name: 'CustomIcon',
  },
  decorators: [
    Story => (
      <IconProvider
        overrides={{ CustomIcon: () => <div>Custom Super Icon</div> }}
      >
        <Story />
      </IconProvider>
    ),
  ],
};
