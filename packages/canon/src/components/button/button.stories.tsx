import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta = {
  title: 'Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium'],
    },
  },
  args: {
    size: 'medium',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary button',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary button',
    variant: 'secondary',
  },
};

export const Sizes: Story = {
  args: {
    children: 'Button',
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '10px' }}>
      <Button {...args} size="small" />
      <Button {...args} size="medium" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    children: 'Button',
    disabled: true,
  },
};

export const CustomTheme: Story = {
  args: {
    children: 'Custom Button',
  },
  decorators: [
    (Story) => (
      <div
        style={
          {
            '--button-primary-background-color': 'blue',
            '--button-primary-border-color': 'blue',
            '--button-primary-text-color': 'white',
            '--button-primary-border-radius': '8px',
          } as React.CSSProperties
        }
      >
        <Story />
      </div>
    ),
  ],
};
