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

export const Surfaces = meta.story({
  render: args => (
    <Flex align="start" style={{ flexWrap: 'wrap' }} gap="4">
      <Card {...args} style={{ width: '200px' }}>
        <CardHeader>Default</CardHeader>
        <CardBody>No surface prop</CardBody>
      </Card>
      <Card {...args} surface="0" style={{ width: '200px' }}>
        <CardHeader>Surface 0</CardHeader>
        <CardBody>Explicit surface 0</CardBody>
      </Card>
      <Card {...args} surface="1" style={{ width: '200px' }}>
        <CardHeader>Surface 1</CardHeader>
        <CardBody>Explicit surface 1</CardBody>
      </Card>
      <Card {...args} surface="2" style={{ width: '200px' }}>
        <CardHeader>Surface 2</CardHeader>
        <CardBody>Explicit surface 2</CardBody>
      </Card>
      <Card {...args} surface="3" style={{ width: '200px' }}>
        <CardHeader>Surface 3</CardHeader>
        <CardBody>Explicit surface 3</CardBody>
      </Card>
      <Card
        {...args}
        surface={{ initial: '0', sm: '1' }}
        style={{ width: '200px' }}
      >
        <CardHeader>Responsive</CardHeader>
        <CardBody>Surface 0 → 1</CardBody>
      </Card>
      <Card {...args} surface="danger" style={{ width: '200px' }}>
        <CardHeader>Danger</CardHeader>
        <CardBody>Surface danger</CardBody>
      </Card>
      <Card {...args} surface="warning" style={{ width: '200px' }}>
        <CardHeader>Warning</CardHeader>
        <CardBody>Surface warning</CardBody>
      </Card>
      <Card {...args} surface="success" style={{ width: '200px' }}>
        <CardHeader>Success</CardHeader>
        <CardBody>Surface success</CardBody>
      </Card>
    </Flex>
  ),
});

export const SurfacesNested = meta.story({
  render: args => (
    <Flex direction="column">
      <Box style={{ maxWidth: '600px' }} mb="4">
        In this test, we are nesting cards on different surfaces to ensure that
        the correct surface is applied to each element. If a Button is placed on
        a surface that doesn't have the surface prop set, it will inherit the
        surface from the parent.
      </Box>
      <Card {...args} surface="1" style={{ width: '500px' }}>
        <CardHeader>Surface 1</CardHeader>
        <CardBody>
          <Button variant="secondary">Button</Button>
          <Card {...args} surface="2" style={{ marginTop: '16px' }}>
            <CardHeader>Surface 2</CardHeader>
            <CardBody>
              <Button variant="secondary">Button</Button>
              <Card {...args} style={{ marginTop: '16px' }}>
                <CardHeader>Inherited</CardHeader>
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

export const SurfacesAutoIncrement = meta.story({
  render: args => (
    <Flex align="start" style={{ flexWrap: 'wrap' }} gap="4">
      <Box surface="0" p="4" style={{ borderRadius: '8px' }}>
        <Card {...args} surface="auto" style={{ width: '200px' }}>
          <CardHeader>On surface 0</CardHeader>
          <CardBody>Card auto → 1</CardBody>
        </Card>
      </Box>
      <Box surface="1" p="4" style={{ borderRadius: '8px' }}>
        <Card {...args} surface="auto" style={{ width: '200px' }}>
          <CardHeader>On surface 1</CardHeader>
          <CardBody>Card auto → 2</CardBody>
        </Card>
      </Box>
      <Box surface="2" p="4" style={{ borderRadius: '8px' }}>
        <Card {...args} surface="auto" style={{ width: '200px' }}>
          <CardHeader>On surface 2</CardHeader>
          <CardBody>Card auto → 3</CardBody>
        </Card>
      </Box>
      <Box surface="3" p="4" style={{ borderRadius: '8px' }}>
        <Card {...args} surface="auto" style={{ width: '200px' }}>
          <CardHeader>On surface 3</CardHeader>
          <CardBody>Card auto → 3 (capped)</CardBody>
        </Card>
      </Box>
    </Flex>
  ),
});
