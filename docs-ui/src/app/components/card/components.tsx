'use client';

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from '../../../../../packages/ui/src/components/Card/Card';
import { Text } from '../../../../../packages/ui/src/components/Text/Text';

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
