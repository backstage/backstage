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
import { Card, CardHeader, CardBody, CardFooter } from './Card';
import { Text } from '../..';
import { Flex } from '../Flex';
import { Box } from '../Box';
import { Button } from '../Button';

const meta = preview.meta({
  title: 'Backstage UI/Card',
  component: Card,
  subcomponents: { CardHeader, CardBody, CardFooter },
});

export const Default = meta.story({
  render: args => (
    <Card {...args}>
      <CardHeader>Header</CardHeader>
      <CardBody>Body</CardBody>
      <CardFooter>Footer</CardFooter>
    </Card>
  ),
});

export const CustomSize = Default.extend({
  args: {
    style: {
      width: '300px',
      height: '200px',
    },
  },
});

export const WithLongBody = meta.story({
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
});

const ListRow = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        height: 40,
        width: '100%',
        backgroundColor: 'var(--bui-bg-neutral-3)',
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

export const WithListRow = meta.story({
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
});

export const Backgrounds = meta.story({
  render: args => (
    <Flex align="start" style={{ flexWrap: 'wrap' }} gap="4">
      <Card {...args} style={{ width: '200px' }}>
        <CardHeader>Default</CardHeader>
        <CardBody>No bg prop</CardBody>
      </Card>
      <Card {...args} bg="neutral-1" style={{ width: '200px' }}>
        <CardHeader>Neutral 1</CardHeader>
        <CardBody>Explicit neutral-1</CardBody>
      </Card>
      <Card {...args} bg="neutral-2" style={{ width: '200px' }}>
        <CardHeader>Neutral 2</CardHeader>
        <CardBody>Explicit neutral-2</CardBody>
      </Card>
      <Card {...args} bg="neutral-3" style={{ width: '200px' }}>
        <CardHeader>Neutral 3</CardHeader>
        <CardBody>Explicit neutral-3</CardBody>
      </Card>
      <Card {...args} bg="neutral-4" style={{ width: '200px' }}>
        <CardHeader>Neutral 4</CardHeader>
        <CardBody>Explicit neutral-4</CardBody>
      </Card>
      <Card
        {...args}
        bg={{ initial: 'neutral-1', sm: 'neutral-2' }}
        style={{ width: '200px' }}
      >
        <CardHeader>Responsive</CardHeader>
        <CardBody>Neutral 1 → 2</CardBody>
      </Card>
      <Card {...args} bg="danger" style={{ width: '200px' }}>
        <CardHeader>Danger</CardHeader>
        <CardBody>Bg danger</CardBody>
      </Card>
      <Card {...args} bg="warning" style={{ width: '200px' }}>
        <CardHeader>Warning</CardHeader>
        <CardBody>Bg warning</CardBody>
      </Card>
      <Card {...args} bg="success" style={{ width: '200px' }}>
        <CardHeader>Success</CardHeader>
        <CardBody>Bg success</CardBody>
      </Card>
    </Flex>
  ),
});

export const BgNested = meta.story({
  render: args => (
    <Flex direction="column">
      <Box style={{ maxWidth: '600px' }} mb="4">
        In this test, we are nesting cards to ensure that the correct background
        is applied to each element. Buttons automatically inherit the bg context
        and increment their neutral level.
      </Box>
      <Card {...args} bg="neutral-1" style={{ width: '500px' }}>
        <CardHeader>Neutral 1</CardHeader>
        <CardBody>
          <Button variant="secondary">Button</Button>
          <Card {...args} bg="neutral-2" style={{ marginTop: '16px' }}>
            <CardHeader>Neutral 2</CardHeader>
            <CardBody>
              <Button variant="secondary">Button</Button>
              <Card {...args} style={{ marginTop: '16px' }}>
                <CardHeader>Auto-incremented</CardHeader>
                <CardBody>
                  <Button variant="secondary">Button</Button>
                </CardBody>
              </Card>
            </CardBody>
          </Card>
        </CardBody>
      </Card>
    </Flex>
  ),
});

export const BgAutoIncrement = meta.story({
  render: args => (
    <Flex align="start" style={{ flexWrap: 'wrap' }} gap="4">
      <Box bg="neutral-1" p="4" style={{ borderRadius: '8px' }}>
        <Card {...args} style={{ width: '200px' }}>
          <CardHeader>On neutral-1</CardHeader>
          <CardBody>Card auto → neutral-2</CardBody>
        </Card>
      </Box>
      <Box bg="neutral-2" p="4" style={{ borderRadius: '8px' }}>
        <Card {...args} style={{ width: '200px' }}>
          <CardHeader>On neutral-2</CardHeader>
          <CardBody>Card auto → neutral-3</CardBody>
        </Card>
      </Box>
      <Box bg="neutral-3" p="4" style={{ borderRadius: '8px' }}>
        <Card {...args} style={{ width: '200px' }}>
          <CardHeader>On neutral-3</CardHeader>
          <CardBody>Card auto → neutral-4</CardBody>
        </Card>
      </Box>
      <Box bg="neutral-4" p="4" style={{ borderRadius: '8px' }}>
        <Card {...args} style={{ width: '200px' }}>
          <CardHeader>On neutral-4</CardHeader>
          <CardBody>Card auto → neutral-4 (capped)</CardBody>
        </Card>
      </Box>
    </Flex>
  ),
});
