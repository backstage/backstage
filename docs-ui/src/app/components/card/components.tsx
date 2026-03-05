'use client';

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from '../../../../../packages/ui/src/components/Card/Card';
import { Text } from '../../../../../packages/ui/src/components/Text/Text';
import { Button } from '../../../../../packages/ui/src/components/Button/Button';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';

export const Default = () => {
  return (
    <Card style={{ width: '300px', height: '200px' }}>
      <CardHeader>Header</CardHeader>
      <CardBody>Body</CardBody>
      <CardFooter>Footer</CardFooter>
    </Card>
  );
};

export const HeaderAndBody = () => {
  return (
    <Card
      style={{
        width: '300px',
        height: '200px',
      }}
    >
      <CardHeader>Header</CardHeader>
      <CardBody>Body content without a footer</CardBody>
    </Card>
  );
};

export const InteractiveButton = () => {
  return (
    <Card
      style={{ width: '300px' }}
      onPress={() => {}}
      label="View component details"
    >
      <CardHeader>Interactive Card</CardHeader>
      <CardBody>
        Click anywhere on this card to trigger the press handler.
      </CardBody>
      <CardFooter>
        <Text variant="body-small" color="secondary">
          Click to interact
        </Text>
      </CardFooter>
    </Card>
  );
};

export const InteractiveLink = () => {
  return (
    <Card
      style={{ width: '300px' }}
      href="https://backstage.io"
      label="Open Backstage documentation"
    >
      <CardHeader>Link Card</CardHeader>
      <CardBody>This card navigates to a URL when clicked.</CardBody>
      <CardFooter>
        <Text variant="body-small" color="secondary">
          Opens backstage.io
        </Text>
      </CardFooter>
    </Card>
  );
};

export const InteractiveWithNestedButtons = () => {
  return (
    <Card
      style={{ width: '300px' }}
      onPress={() => {}}
      label="View plugin details"
    >
      <CardHeader>Card with Actions</CardHeader>
      <CardBody>
        Clicking the card background triggers the card press handler. The
        buttons below remain independently interactive.
      </CardBody>
      <CardFooter>
        <Flex gap="2">
          <Button size="small" variant="secondary" onPress={() => {}}>
            Primary
          </Button>
          <Button size="small" variant="tertiary" onPress={() => {}}>
            Secondary
          </Button>
        </Flex>
      </CardFooter>
    </Card>
  );
};

export const WithLongBody = () => {
  return (
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
          Here&apos;s a second paragraph that adds more content to our card
          body. Having multiple paragraphs helps to visualize how spacing works
          within the card component.
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
  );
};
