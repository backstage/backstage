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

import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardBody, CardFooter } from './Card';
import { IconNames, Text } from '../..';

export interface ListItem {
  id: string;
  name: string;
  icon?: IconNames;
}

const meta = {
  title: 'Components/Card',
  component: Card,
  subcomponents: { CardHeader, CardBody, CardFooter },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <Card {...args}>
      <CardHeader>Header</CardHeader>
      <CardBody>Body</CardBody>
      <CardFooter>Footer</CardFooter>
    </Card>
  ),
};

export const CustomSize: Story = {
  args: {
    style: {
      width: '300px',
      height: '200px',
    },
  },
  render: Default.render,
};

export const WithLongBody: Story = {
  render: () => (
    <Card style={{ width: '300px', height: '200px' }}>
      <CardHeader>
        <Text>Header</Text>
      </CardHeader>
      <CardBody>
        <Text>
          This is the first paragraph of a long body text that demonstrates how
          the Card component handles extensive content. The card should adjust
          accordingly to display all the text properly while maintaining its
          structure.
        </Text>
        <Text>
          Here's a second paragraph that adds more content to our card body.
          Having multiple paragraphs helps to visualize how spacing works within
          the card component.
        </Text>
        <Text>
          This third paragraph continues to add more text to ensure we have a
          proper demonstration of a card with significant content. This makes it
          easier to test scrolling behavior and overall layout when content
          exceeds the initial view.
        </Text>
      </CardBody>
      <CardFooter>
        <Text>Footer</Text>
      </CardFooter>
    </Card>
  ),
};

const ListRow = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        height: 40,
        width: '100%',
        backgroundColor: 'var(--bui-gray-3)',
        display: 'flex',
        alignItems: 'center',
        paddingInline: 'var(--bui-space-3)',
        borderRadius: 'var(--bui-radius-2)',
        fontSize: 'var(--bui-font-size-3)',
        marginBottom: 'var(--bui-space-1)',
      }}
    >
      {children}
    </div>
  );
};

export const WithListRow: Story = {
  render: () => (
    <Card style={{ width: '300px', height: '200px' }}>
      <CardHeader>
        <Text>Header</Text>
      </CardHeader>
      <CardBody>
        <ListRow>Hello world</ListRow>
        <ListRow>Hello world</ListRow>
        <ListRow>Hello world</ListRow>
        <ListRow>Hello world</ListRow>
        <ListRow>Hello world</ListRow>
        <ListRow>Hello world</ListRow>
        <ListRow>Hello world</ListRow>
        <ListRow>Hello world</ListRow>
        <ListRow>Hello world</ListRow>
        <ListRow>Hello world</ListRow>
        <ListRow>Hello world</ListRow>
        <ListRow>Hello world</ListRow>
        <ListRow>Hello world</ListRow>
        <ListRow>Hello world</ListRow>
        <ListRow>Hello world</ListRow>
        <ListRow>Hello world</ListRow>
      </CardBody>
      <CardFooter>
        <Text>Footer</Text>
      </CardFooter>
    </Card>
  ),
};
