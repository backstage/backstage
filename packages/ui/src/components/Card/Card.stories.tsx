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
  render: args => <Card {...args}>Hello world</Card>,
});

export const DefaultWithHeader = meta.story({
  render: args => (
    <Card {...args}>
      <CardHeader>Header</CardHeader>
      <CardBody>Body</CardBody>
    </Card>
  ),
});

const content = (
  <>
    <Text>
      This is the first paragraph of a long body text that demonstrates how the
      Card component handles extensive content. The card should adjust
      accordingly to display all the text properly while maintaining its
      structure.
    </Text>
    <Text>
      Here's a second paragraph that adds more content to our card body. Having
      multiple paragraphs helps to visualize how spacing works within the card
      component.
    </Text>
    <Text>
      This third paragraph continues to add more text to ensure we have a proper
      demonstration of a card with significant content. This makes it easier to
      test scrolling behavior and overall layout when content exceeds the
      initial view.
    </Text>
  </>
);

export const LongBody = meta.story({
  render: () => (
    <Card style={{ width: '300px', height: '200px' }}>{content}</Card>
  ),
});

export const LongBodyHeader = meta.story({
  render: () => (
    <Card style={{ width: '300px', height: '200px' }}>
      <CardHeader>
        <Text>Header</Text>
      </CardHeader>
      <CardBody>{content}</CardBody>
    </Card>
  ),
});

export const LongBodyHeaderFooter = meta.story({
  render: () => (
    <Card style={{ width: '300px', height: '200px' }}>
      <CardHeader>
        <Text>Header</Text>
      </CardHeader>
      <CardBody>{content}</CardBody>
      <CardFooter>
        <Text>Footer</Text>
      </CardFooter>
    </Card>
  ),
});

const ListRowComponent = ({ children }: { children: React.ReactNode }) => {
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
      }}
    >
      {children}
    </div>
  );
};

const listRowContent = (
  <Flex direction="column" gap="1">
    <ListRowComponent>Hello world</ListRowComponent>
    <ListRowComponent>Hello world</ListRowComponent>
    <ListRowComponent>Hello world</ListRowComponent>
    <ListRowComponent>Hello world</ListRowComponent>
    <ListRowComponent>Hello world</ListRowComponent>
    <ListRowComponent>Hello world</ListRowComponent>
    <ListRowComponent>Hello world</ListRowComponent>
    <ListRowComponent>Hello world</ListRowComponent>
    <ListRowComponent>Hello world</ListRowComponent>
    <ListRowComponent>Hello world</ListRowComponent>
  </Flex>
);

export const ListRow = meta.story({
  render: () => (
    <Card style={{ width: '300px', height: '200px' }}>
      <CardBody>{listRowContent}</CardBody>
    </Card>
  ),
});

export const ListRowHeader = meta.story({
  render: () => (
    <Card style={{ width: '300px', height: '200px' }}>
      <CardHeader>
        <Text>Header</Text>
      </CardHeader>
      <CardBody>{listRowContent}</CardBody>
    </Card>
  ),
});

export const ListRowFooter = meta.story({
  render: () => (
    <Card style={{ width: '300px', height: '200px' }}>
      <CardBody>{listRowContent}</CardBody>
      <CardFooter>
        <Text>Footer</Text>
      </CardFooter>
    </Card>
  ),
});

export const ListRowHeaderFooter = meta.story({
  render: () => (
    <Card style={{ width: '300px', height: '200px' }}>
      <CardHeader>
        <Text>Header</Text>
      </CardHeader>
      <CardBody>
        <Flex direction="column" gap="1">
          <ListRowComponent>Hello world</ListRowComponent>
          <ListRowComponent>Hello world</ListRowComponent>
          <ListRowComponent>Hello world</ListRowComponent>
          <ListRowComponent>Hello world</ListRowComponent>
          <ListRowComponent>Hello world</ListRowComponent>
          <ListRowComponent>Hello world</ListRowComponent>
          <ListRowComponent>Hello world</ListRowComponent>
          <ListRowComponent>Hello world</ListRowComponent>
          <ListRowComponent>Hello world</ListRowComponent>
          <ListRowComponent>Hello world</ListRowComponent>
          <ListRowComponent>Hello world</ListRowComponent>
          <ListRowComponent>Hello world</ListRowComponent>
          <ListRowComponent>Hello world</ListRowComponent>
          <ListRowComponent>Hello world</ListRowComponent>
          <ListRowComponent>Hello world</ListRowComponent>
          <ListRowComponent>Hello world</ListRowComponent>
        </Flex>
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
        <CardHeader>No parent</CardHeader>
        <CardBody>Defaults to neutral-1</CardBody>
      </Card>
      <Box bg="neutral" p="4" style={{ borderRadius: '8px' }}>
        <Card {...args} style={{ width: '200px' }}>
          <CardHeader>On neutral-1</CardHeader>
          <CardBody>Auto-increments to neutral-2</CardBody>
        </Card>
      </Box>
      <Box bg="neutral">
        <Box bg="neutral" p="4" style={{ borderRadius: '8px' }}>
          <Card {...args} style={{ width: '200px' }}>
            <CardHeader>On neutral-2</CardHeader>
            <CardBody>Auto-increments to neutral-3</CardBody>
          </Card>
        </Box>
      </Box>
      <Box bg="neutral">
        <Box bg="neutral">
          <Box bg="neutral" p="4" style={{ borderRadius: '8px' }}>
            <Card {...args} style={{ width: '200px' }}>
              <CardHeader>On neutral-3</CardHeader>
              <CardBody>Steps up to neutral-4</CardBody>
            </Card>
          </Box>
        </Box>
      </Box>
    </Flex>
  ),
});

export const BgNested = meta.story({
  render: args => (
    <Flex direction="column">
      <Box style={{ maxWidth: '600px' }} mb="4">
        Nested cards auto-increment their neutral level. Buttons inherit the
        parent card's bg via data-on-bg.
      </Box>
      <Card {...args} style={{ width: '500px' }}>
        <CardHeader>Card (visual: neutral-1, provides: neutral-1)</CardHeader>
        <CardBody>
          <Button variant="secondary">Button (on neutral-1)</Button>
          <Card {...args} style={{ marginTop: '16px' }}>
            <CardHeader>
              Card (visual: neutral-2, provides: neutral-2)
            </CardHeader>
            <CardBody>
              <Button variant="secondary">Button (on neutral-2)</Button>
              <Card {...args} style={{ marginTop: '16px' }}>
                <CardHeader>
                  Card (visual: neutral-4, provides: neutral-3)
                </CardHeader>
                <CardBody>
                  <Button variant="secondary">Button (on neutral-3)</Button>
                </CardBody>
              </Card>
            </CardBody>
          </Card>
        </CardBody>
      </Card>
    </Flex>
  ),
});

export const BgOnProviders = meta.story({
  render: args => (
    <Flex align="start" style={{ flexWrap: 'wrap' }} gap="4">
      <Card {...args} style={{ width: '200px' }}>
        <CardHeader>No provider</CardHeader>
        <CardBody>Card defaults to neutral-1</CardBody>
      </Card>
      <Box bg="neutral" p="4" style={{ borderRadius: '8px' }}>
        <Card {...args} style={{ width: '200px' }}>
          <CardHeader>On neutral-1</CardHeader>
          <CardBody>Card auto-increments to neutral-2</CardBody>
        </Card>
      </Box>
      <Box bg="neutral">
        <Box bg="neutral" p="4" style={{ borderRadius: '8px' }}>
          <Card {...args} style={{ width: '200px' }}>
            <CardHeader>On neutral-2</CardHeader>
            <CardBody>Card auto-increments to neutral-3</CardBody>
          </Card>
        </Box>
      </Box>
      <Box bg="neutral">
        <Box bg="neutral">
          <Box bg="neutral" p="4" style={{ borderRadius: '8px' }}>
            <Card {...args} style={{ width: '200px' }}>
              <CardHeader>On neutral-3</CardHeader>
              <CardBody>Card visually at neutral-4</CardBody>
            </Card>
          </Box>
        </Box>
      </Box>
    </Flex>
  ),
});

export const Interactive = meta.story({
  render: () => (
    <Card
      style={{ width: '300px' }}
      onPress={() => alert('Card pressed')}
      label="View component details"
    >
      <CardHeader>
        <Text weight="bold">Interactive Card</Text>
      </CardHeader>
      <CardBody>
        <Text>
          Click anywhere on this card to trigger the press handler. The entire
          card surface is interactive.
        </Text>
      </CardBody>
      <CardFooter>
        <Text variant="body-small" color="secondary">
          Click to interact
        </Text>
      </CardFooter>
    </Card>
  ),
});

export const InteractiveAsLink = meta.story({
  render: () => (
    <Card
      style={{ width: '300px' }}
      href="https://backstage.io"
      target="_blank"
      rel="noopener noreferrer"
      title="Open Backstage documentation"
      label="Open Backstage documentation"
    >
      <CardHeader>Link Card</CardHeader>
      <CardBody>
        <Text>
          This card navigates to a URL when clicked. The entire card surface
          acts as a link.
        </Text>
      </CardBody>
      <CardFooter>Opens backstage.io</CardFooter>
    </Card>
  ),
});

export const InteractiveWithNestedButtons = meta.story({
  render: () => (
    <Card
      style={{ width: '300px' }}
      onPress={() => alert('Card pressed')}
      label="View plugin details"
    >
      <CardHeader>
        <Text weight="bold">Card with Actions</Text>
      </CardHeader>
      <CardBody>
        <Text>
          Clicking the card background triggers the card press handler. The
          buttons below remain independently interactive.
        </Text>
      </CardBody>
      <CardFooter>
        <Flex gap="2">
          <Button
            size="small"
            variant="secondary"
            onPress={() => alert('Primary action')}
          >
            Primary
          </Button>
          <Button
            size="small"
            variant="tertiary"
            onPress={() => alert('Secondary action')}
          >
            Secondary
          </Button>
        </Flex>
      </CardFooter>
    </Card>
  ),
});

export const InteractiveScrollable = meta.story({
  render: () => (
    <Card
      style={{ width: '300px', height: '200px' }}
      onPress={() => alert('Card pressed')}
      label="View card details"
    >
      <CardHeader>
        <Text weight="bold">Scrollable Interactive Card</Text>
      </CardHeader>
      <CardBody>{content}</CardBody>
      <CardFooter>
        <Text variant="body-small" color="secondary">
          Card body scrolls while card remains clickable
        </Text>
      </CardFooter>
    </Card>
  ),
});

export const CustomCardWithBox = meta.story({
  render: () => (
    <Flex direction="column" gap="4">
      <Box style={{ maxWidth: '600px' }}>
        A custom card built with Box. Use Box with an explicit bg prop to create
        a card-like container that participates in the bg system as a provider.
      </Box>
      <Box bg="neutral" p="4" style={{ borderRadius: '8px', width: '300px' }}>
        <Button variant="secondary">Button (on neutral-1)</Button>
      </Box>
      <Card style={{ width: '300px' }}>
        <CardHeader>Header</CardHeader>
        <CardBody>Body</CardBody>
        <CardFooter>Footer</CardFooter>
      </Card>
    </Flex>
  ),
});
